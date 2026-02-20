# ResumeIQ — Project Architecture

## Overview

**ResumeIQ** is a single-page AI-powered resume analysis web application. Users upload a resume, paste a job description, and receive an AI-generated match score, missing skills analysis, improvement suggestions, and curated job recommendations.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Browser (SPA)                    │
│                                                     │
│  ┌───────────┐   ┌────────────────────────────────┐ │
│  │  Header    │   │         Main Content           │ │
│  │ (fixed)    │   │                                │ │
│  └───────────┘   │  Landing → Upload → JobInput   │ │
│                   │  → Analyzing → Results          │ │
│  ┌───────────┐   └────────────────────────────────┘ │
│  │  Footer    │                                     │
│  └───────────┘                                     │
└─────────────────────────────────────────────────────┘
         │
         ▼
   Vite Dev Server (HMR)
   Tailwind CSS v4 (JIT)
   React 18 + TypeScript
```

---

## Directory Structure

```
frontend/
├── index.html                  # Entry HTML (Vite root)
├── package.json                # Dependencies & scripts
├── vite.config.ts              # Vite + Tailwind + path aliases
├── postcss.config.mjs          # PostCSS config
├── docs/                       # 📂 Documentation (you are here)
├── guidelines/                 # Design guidelines
│   └── Guidelines.md
└── src/
    ├── main.tsx                # ReactDOM entry point
    ├── styles/
    │   ├── index.css           # Global styles import
    │   ├── tailwind.css        # Tailwind directives
    │   ├── theme.css           # CSS custom properties
    │   └── fonts.css           # Font imports
    └── app/
        ├── App.tsx             # Root component + step router
        ├── constants/
        │   └── theme.ts        # Color palette + font tokens
        └── components/
            ├── Landing.tsx         # Landing page (hero + 3-step)
            ├── UploadResume.tsx    # Resume upload (drag & drop)
            ├── JobInput.tsx        # Job description textarea
            ├── Analyzing.tsx       # Fake AI loading screen
            ├── Results.tsx         # Results dashboard layout
            ├── brand/
            │   └── ResumeIQLogo.tsx # SVG wordmark logo
            ├── layout/
            │   ├── Header.tsx      # Fixed top navbar
            │   └── Footer.tsx      # Site footer
            ├── results/
            │   ├── MatchScore.tsx       # Circular score + skill bars
            │   ├── MissingSkills.tsx    # Missing skills list
            │   ├── Suggestions.tsx      # AI rewrite suggestions
            │   └── JobRecommendations.tsx # Job cards with filters
            ├── figma/
            │   └── ImageWithFallback.tsx
            └── ui/                 # shadcn/ui primitives (40+ files)
                ├── button.tsx
                ├── card.tsx
                ├── dialog.tsx
                ├── ... (Radix-based components)
                └── utils.ts        # cn() utility
```

---

## Rendering Pipeline

```
index.html
  └── <div id="root">
        └── main.tsx
              └── createRoot().render(<App />)
                    ├── <Header />           (fixed, always visible)
                    ├── <Toaster />          (sonner notifications)
                    └── <AnimatePresence>
                          └── {step} → renders one of:
                                ├── <Landing />
                                ├── <UploadResume />
                                ├── <JobInput />
                                ├── <Analyzing />
                                └── <Results />
                                      ├── <MatchScore />
                                      ├── <MissingSkills />
                                      ├── <Suggestions />
                                      └── <JobRecommendations />
```

---

## Key Design Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| **Routing** | State-based (`useState`) | Simple linear flow, no URL routing needed |
| **Animations** | Motion (Framer Motion v12) | Production-grade enter/exit transitions |
| **UI Primitives** | shadcn/ui + Radix | Accessible, composable, unstyled headless components |
| **Styling** | Tailwind CSS v4 | Utility-first, JIT compilation, dark theme support |
| **Build Tool** | Vite 6 | Fast HMR, ESBuild bundling, native TS support |
| **State Mgmt** | Local `useState` | No global state needed for this flow |
| **Notifications** | Sonner | Minimal toast library with dark theme |
| **Icons** | Lucide React | Tree-shakeable, consistent icon set |

---

## Data Flow

This is a **frontend-only prototype** — no backend API calls. All data is mocked:

- **Resume upload**: Simulated with `setTimeout` + progress state
- **AI analysis**: 3-second timer in `Analyzing.tsx`
- **Match score**: Hardcoded `94%` passed as prop
- **Missing skills**: Static array in component
- **Suggestions**: Static array with local "applied" state
- **Job recommendations**: Static array with client-side filtering

---

## Performance Considerations

- **Code splitting**: Vite auto-splits vendor chunks
- **Tree shaking**: Lucide icons are individually imported
- **Animation**: GPU-accelerated transforms via Motion
- **Lazy rendering**: `AnimatePresence mode="wait"` renders one step at a time
- **Font loading**: DM Sans + Playfair Display loaded via CSS
