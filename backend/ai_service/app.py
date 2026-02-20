"""
ResumeIQ — Local AI Analysis Service
=====================================
FastAPI microservice that uses sentence-transformers (all-MiniLM-L6-v2)
to compare resume text against a job description.

Features:
- Cosine similarity-based match scoring
- Keyword extraction via KeyBERT (uses same MiniLM backbone)
- Skill matching & gap analysis
- Actionable suggestions generation
- Runs entirely on CPU — no GPU required

Start:  uvicorn app:app --host 0.0.0.0 --port 8000
"""

import re
import time
import logging
from typing import List

import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from sentence_transformers import SentenceTransformer, util
from keybert import KeyBERT

# ──────────────────────────────────────────────
# Logging
# ──────────────────────────────────────────────
logging.basicConfig(level=logging.INFO, format="%(asctime)s  %(levelname)s  %(message)s")
logger = logging.getLogger("resumeiq-ai")

# ──────────────────────────────────────────────
# Load model ONCE at startup (≈ 80 MB download first time)
# ──────────────────────────────────────────────
MODEL_NAME = "all-MiniLM-L6-v2"

logger.info("Loading sentence-transformers model: %s …", MODEL_NAME)
_start = time.time()
embedding_model = SentenceTransformer(MODEL_NAME)
logger.info("Model loaded in %.2f s", time.time() - _start)

# KeyBERT re-uses the same model — zero extra memory
kw_model = KeyBERT(model=embedding_model)

# ──────────────────────────────────────────────
# FastAPI app
# ──────────────────────────────────────────────
app = FastAPI(
    title="ResumeIQ AI Service",
    description="Local embedding-based resume analysis",
    version="1.0.0",
)


# ──────────────────────────────────────────────
# Request / Response schemas
# ──────────────────────────────────────────────
class AnalysisRequest(BaseModel):
    resume_text: str = Field(..., min_length=20, description="Plain text from the resume PDF")
    job_description: str = Field(..., min_length=20, description="Job description text")


class AnalysisResponse(BaseModel):
    matchScore: int = Field(..., ge=0, le=100)
    matchedSkills: List[str]
    missingSkills: List[str]
    suggestions: List[str]


# ──────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────

# Common tech / business keywords for skill-level matching
_SKILL_STOP_WORDS = {
    "experience", "years", "team", "work", "working", "ability", "strong",
    "knowledge", "understanding", "excellent", "good", "proficient",
    "responsibilities", "requirements", "qualifications", "preferred",
    "including", "using", "etc", "environment", "role", "position",
    "company", "looking", "candidate", "opportunity", "description",
    "job", "must", "required", "skills", "apply", "resume",
}


def _extract_keywords(text: str, top_n: int = 30) -> List[str]:
    """Extract meaningful keywords / keyphrases using KeyBERT."""
    raw = kw_model.extract_keywords(
        text,
        keyphrase_ngram_range=(1, 2),
        stop_words="english",
        top_n=top_n,
        use_mmr=True,          # Maximal Marginal Relevance for diversity
        diversity=0.4,
    )
    keywords = []
    for kw, _score in raw:
        kw_clean = kw.strip().lower()
        tokens = kw_clean.split()
        # Skip if the keyword is just a stop word or too short
        if all(t in _SKILL_STOP_WORDS or len(t) < 2 for t in tokens):
            continue
        keywords.append(kw_clean)
    return keywords


def _normalise(kw: str) -> str:
    """Lowercase, collapse whitespace, strip punctuation for comparison."""
    return re.sub(r"[^a-z0-9+ #./]", "", kw.lower()).strip()


def _match_skills(resume_keywords: List[str], jd_keywords: List[str]):
    """
    Compare resume and JD keywords via embedding similarity.
    A JD keyword is 'matched' if its cosine similarity to at least one
    resume keyword exceeds a threshold.
    """
    if not jd_keywords or not resume_keywords:
        return [], jd_keywords or []

    # Encode all keywords in batch
    jd_embeddings = embedding_model.encode(jd_keywords, convert_to_tensor=True, show_progress_bar=False)
    resume_embeddings = embedding_model.encode(resume_keywords, convert_to_tensor=True, show_progress_bar=False)

    # Cosine similarity matrix: (jd_count x resume_count)
    sim_matrix = util.cos_sim(jd_embeddings, resume_embeddings)  # tensor

    THRESHOLD = 0.55  # tuned for MiniLM on skill phrases

    matched, missing = [], []
    for idx, jd_kw in enumerate(jd_keywords):
        max_sim = float(sim_matrix[idx].max())
        if max_sim >= THRESHOLD:
            matched.append(jd_kw)
        else:
            missing.append(jd_kw)

    return matched, missing


def _generate_suggestions(matched: List[str], missing: List[str], score: int) -> List[str]:
    """Rule-based actionable suggestions."""
    suggestions = []

    if missing:
        top_missing = missing[:5]
        suggestions.append(
            f"Add these missing skills to your resume: {', '.join(top_missing)}."
        )

    if score < 50:
        suggestions.append(
            "Your resume has low alignment with this job. Consider tailoring your summary and experience sections to mirror the job description's language."
        )
    elif score < 75:
        suggestions.append(
            "Moderate match — try quantifying your achievements (e.g., 'Increased performance by 30%') and including more domain-specific terminology."
        )
    else:
        suggestions.append(
            "Strong match! Fine-tune by mirroring exact phrases from the job description and ensuring your most relevant experience is near the top."
        )

    if len(missing) > 5:
        suggestions.append(
            "Consider gaining certifications or completing projects in the top missing skill areas to strengthen your profile."
        )

    if matched:
        suggestions.append(
            f"Highlight and expand on your strongest matched skills: {', '.join(matched[:4])}."
        )

    suggestions.append(
        "Use action verbs and quantifiable metrics to describe accomplishments for maximum impact."
    )

    return suggestions[:5]


# ──────────────────────────────────────────────
# Routes
# ──────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "model": MODEL_NAME}


@app.post("/analyze", response_model=AnalysisResponse)
def analyze(req: AnalysisRequest):
    """
    Core analysis endpoint.
    1. Compute overall cosine similarity between resume & JD embeddings.
    2. Extract keywords from both texts.
    3. Semantically match JD keywords against resume keywords.
    4. Generate suggestions.
    """
    try:
        t0 = time.time()

        # ── Step 1: Overall document similarity ─────────────
        resume_emb = embedding_model.encode(req.resume_text, convert_to_tensor=True, show_progress_bar=False)
        jd_emb = embedding_model.encode(req.job_description, convert_to_tensor=True, show_progress_bar=False)
        raw_similarity = float(util.cos_sim(resume_emb, jd_emb)[0][0])

        # ── Step 2: Extract keywords ────────────────────────
        resume_keywords = _extract_keywords(req.resume_text, top_n=30)
        jd_keywords = _extract_keywords(req.job_description, top_n=25)

        # ── Step 3: Semantic skill matching ─────────────────
        matched, missing = _match_skills(resume_keywords, jd_keywords)

        # ── Step 4: Compute composite score ─────────────────
        # Blend overall similarity with keyword coverage for a robust score
        keyword_coverage = len(matched) / max(len(jd_keywords), 1)
        composite = 0.5 * raw_similarity + 0.5 * keyword_coverage
        match_score = int(min(max(round(composite * 100), 0), 100))

        # ── Step 5: Suggestions ─────────────────────────────
        suggestions = _generate_suggestions(matched, missing, match_score)

        elapsed = time.time() - t0
        logger.info("Analysis done in %.2f s — score=%d, matched=%d, missing=%d",
                     elapsed, match_score, len(matched), len(missing))

        return AnalysisResponse(
            matchScore=match_score,
            matchedSkills=[kw.title() for kw in matched],
            missingSkills=[kw.title() for kw in missing],
            suggestions=suggestions,
        )

    except Exception as e:
        logger.exception("Analysis failed")
        raise HTTPException(status_code=500, detail=str(e))
