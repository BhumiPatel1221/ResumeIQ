# ResumeIQ — Component Reference

> Complete documentation of every React component, its purpose, props, internal state, and key implementation patterns.

---

## Table of Contents

1. [App (Root)](#app-root)
2. [Landing](#landing)
3. [UploadResume](#uploadresume)
4. [JobInput](#jobinput)
5. [Analyzing](#analyzing)
6. [Results](#results)
7. [MatchScore](#matchscore)
8. [MissingSkills](#missingskills)
9. [Suggestions](#suggestions)
10. [JobRecommendations](#jobrecommendations)
11. [ResumeIQLogo](#resumeiqlogo)
12. [Header](#header)
13. [Footer](#footer)

---

## App (Root)

**File:** `src/app/App.tsx`  
**Type:** Default export, functional component  
**Role:** Root component — manages step-based navigation and renders the active step.

### State

| State | Type | Default | Purpose |
|-------|------|---------|---------|
| `step` | `string` | `'landing'` | Controls which page/step is rendered |

### Props

None (root component).

### Key Logic

```tsx
const handleNext = () => {
  if (step === 'landing') setStep('upload');
  if (step === 'upload') setStep('job-input');
  if (step === 'job-input') setStep('analyzing');
  if (step === 'analyzing') setStep('results');
};
```

- Sequential `if` chain (not `else if`) — only one condition matches at a time.
- `handleNavigate(target: string)` allows free navigation from Header links.
- `AnimatePresence mode="wait"` ensures exit animation completes before the next step mounts.
- Each child receives a unique `key` prop so React and Motion can track mount/unmount.

### Rendered Structure

```
<div>                       // Full-page container, bg from COLORS.background
  <Header />                // Fixed, always visible
  <Toaster />               // Sonner toast notifications
  <main>
    <AnimatePresence>
      {conditionally rendered step component}
    </AnimatePresence>
  </main>
</div>
```

---

## Landing

**File:** `src/app/components/Landing.tsx`  
**Type:** Named export `Landing`  
**Role:** Marketing landing page — Hero section + "How It Works" 3-step process + Footer.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `onStart` | `() => void` | Called when "Upload Resume" CTA is clicked |

### Internal State

None.

### Animation Variants

```tsx
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};
```

- `container` + `item` pattern creates staggered entrance animations.
- `as const` on `"easeOut"` narrows the string type for Motion's `Easing` union.

### Sections

1. **Hero (split layout)**
   - Left: Badge → H1 headline → Description → 2 CTA buttons → Trust stats row
   - Right (desktop only): AI resume scanning simulation with:
     - Wireframe resume card with scanning beam animation
     - "Skills Detected" panel with staggered checkmarks
     - "AI Processing" indicator with pulsing dots
     - "Match Progress" bar animating to 84%
     - Floating sparkle/target accent elements

2. **How It Works**
   - 3 cards (Upload Resume, Paste Job Description, Get AI Analysis)
   - Connecting horizontal line between cards (desktop)
   - `whileInView` triggers entrance animation on scroll

3. **Footer** — imported from `layout/Footer`

### Key Patterns

- **Responsive**: `grid-cols-1 lg:grid-cols-2` for hero, `md:grid-cols-3` for steps
- **Background effects**: Radial gradient blurs for ambient glow
- **SVG checkmark animation**: `motion.path` with `pathLength` for draw effect
- **Infinite animations**: Scanning beam, processing dots, floating elements

---

## UploadResume

**File:** `src/app/components/UploadResume.tsx`  
**Type:** Named export `UploadResume`  
**Role:** Drag-and-drop file upload with progress simulation.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `onNext` | `() => void` | Called when "Continue" is clicked (after upload) |

### Internal State

| State | Type | Default | Purpose |
|-------|------|---------|---------|
| `file` | `File \| null` | `null` | The uploaded file object |
| `isDragging` | `boolean` | `false` | Tracks drag-over visual state |
| `uploadProgress` | `number` | `0` | Simulated upload percentage (0-100) |

### Refs

- `inputRef: useRef<HTMLInputElement>` — hidden file input, triggered via click on drop zone

### Key Logic

```tsx
const validateAndSetFile = (file: File) => {
  const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (validTypes.includes(file.type)) {
    simulateUpload(file);
  } else {
    toast.error('Invalid file type. Please upload PDF or DOCX.');
  }
};
```

- **File validation**: Only PDF and DOCX MIME types accepted
- **Simulated upload**: `setInterval` increments by 10% every 100ms (total 1 second)
- **Three render states**:
  1. Empty drop zone (no file, progress = 0)
  2. Uploading (progress > 0, < 100)
  3. File preview (file set, shows name + size + remove button)
- **Continue button**: Disabled until `file !== null`

### Drag & Drop API

- `onDragOver → preventDefault + setIsDragging(true)`
- `onDragLeave → setIsDragging(false)`
- `onDrop → preventDefault + validate file`
- Visual: border changes from `border-[#2A2E3B]` to `border-[#C6FF00]` when dragging

---

## JobInput

**File:** `src/app/components/JobInput.tsx`  
**Type:** Named export `JobInput`  
**Role:** Full-page textarea for pasting a job description.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `onAnalyze` | `() => void` | Proceeds to analysis step |
| `onBack` | `() => void` | Returns to upload step |

### Internal State

| State | Type | Default | Purpose |
|-------|------|---------|---------|
| `text` | `string` | `''` | Job description content |

### Layout

- **Two-column** layout (responsive):
  - Left: Full-height textarea with character count overlay
  - Right: AI Tips sidebar + action buttons (Analyze / Back)

### Key Logic

- **Minimum length**: "Analyze Resume" button disabled when `text.length < 50`
- **Clear button**: Resets text to empty string
- **Character counter**: Positioned absolute at bottom-right of textarea
- **Tips**: Static list of 3 paste tips

---

## Analyzing

**File:** `src/app/components/Analyzing.tsx`  
**Type:** Named export `Analyzing`  
**Role:** Full-screen loading overlay with rotating rings animation.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `onComplete` | `() => void` | Auto-called after 3-second timer |

### Internal State

None.

### Key Logic

```tsx
useEffect(() => {
  const timer = setTimeout(() => onComplete(), 3000);
  return () => clearTimeout(timer);
}, [onComplete]);
```

- Uses `fixed inset-0 z-50` to cover the entire viewport.
- **Cleanup**: Clears timeout on unmount to prevent memory leaks.

### Visual Elements

1. Radial glow blur background
2. Outer rotating ring (8s, clockwise)
3. Inner rotating ring (12s, counter-clockwise)
4. Pulsing center dot
5. "Analyzing your resume..." heading (delayed fade-in)
6. Status text: "Matching Skills • Comparing Experience • Optimizing Format"
7. Progress bar: 0% → 100% over 3 seconds

---

## Results

**File:** `src/app/components/Results.tsx`  
**Type:** Named export `Results`  
**Role:** Dashboard layout composing the 4 result sub-components.

### Props

None.

### Layout

```
3-column grid (lg breakpoint):
  ┌──────────┬─────────────────────────────┐
  │ col-1    │         col-2 + col-3       │
  │          │                             │
  │ Match    │  Suggestions                │
  │ Score    │                             │
  │          │  Job Recommendations        │
  │ Missing  │                             │
  │ Skills   │                             │
  └──────────┴─────────────────────────────┘
```

- Left column: `MatchScore` (score=94) + `MissingSkills`
- Right column (2-col span): `Suggestions` + `JobRecommendations`

---

## MatchScore

**File:** `src/app/components/results/MatchScore.tsx`  
**Type:** Named export `MatchScore`  
**Role:** Circular SVG score ring with skill breakdown bars.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `score` | `number` | Match percentage (0-100) |

### Sub-components (internal)

- **`SkillBar`** — Animated horizontal progress bar
  - Props: `name`, `pct`, `color`, `delay`
  - Uses `motion.div` for width animation
- **`ResumeScanOverlay`** — Background SVG wireframe + scanning line
  - Purely decorative, `pointer-events-none`, `aria-hidden`

### Static Data

```tsx
const skillBars = [
  { name: 'React & TypeScript', pct: 95, color: COLORS.success },
  { name: 'System Design',      pct: 72, color: COLORS.warning },
  { name: 'Leadership',         pct: 60, color: COLORS.error   },
];
const missingSkillTags = ['GraphQL', 'Mentorship', 'CI/CD'];
```

### Key Implementation

- **SVG Circle math**:
  ```tsx
  const radius = 58;
  const circumference = 2 * Math.PI * radius;  // ≈ 364.42
  const strokeDashoffset = circumference - (score / 100) * circumference;
  ```
- **Color logic**: `score >= 80 → success`, `>= 60 → warning`, `else → error`
- **SVG filter**: `<filter id="scoreGlow">` adds gaussian blur glow to the ring
- **Scan line**: Animates `top: [16, 190, 16]` in a 6s infinite loop

---

## MissingSkills

**File:** `src/app/components/results/MissingSkills.tsx`  
**Type:** Named export `MissingSkills`  
**Role:** Lists skills missing from the resume that the job requires.

### Props

None.

### Static Data

```tsx
const skills = [
  { name: 'GraphQL',        priority: 'High',   desc: 'Required for API integration...' },
  { name: 'System Design',  priority: 'Medium', desc: 'Beneficial for senior level...' },
  { name: 'Mentorship',     priority: 'Medium', desc: 'Job asks for experience leading...' },
];
```

### Key Patterns

- **Priority badges**: Color-coded — High = `#FF4D4D` (red), Medium = `#FFD700` (gold)
- **Hover effect**: Border changes to gold tint, description text brightens
- **Staggered entrance**: Each skill card slides in with 100ms delay

---

## Suggestions

**File:** `src/app/components/results/Suggestions.tsx`  
**Type:** Named export `Suggestions`  
**Role:** AI-powered resume improvement suggestions with before/after comparison.

### Props

None.

### Internal State

| State | Type | Default | Purpose |
|-------|------|---------|---------|
| `applied` | `number[]` | `[]` | IDs of applied suggestions |

### Static Data

Two suggestions:
1. "Quantify your impact" — adds metrics to achievement
2. "Optimize summary for keywords" — matches job description terms

### Key Patterns

- **Old/New comparison**: Side-by-side grid (red = original with strikethrough, green = improved)
- **Apply button**: Toggles to "✓ Applied" after click, tracked by ID in `applied` state
- **Reason field**: Italic "Why:" explanation for each suggestion

---

## JobRecommendations

**File:** `src/app/components/results/JobRecommendations.tsx`  
**Type:** Named export `JobRecommendations`  
**Role:** Grid of job cards with match percentages and filter tabs.

### Props

None.

### Internal State

| State | Type | Default | Purpose |
|-------|------|---------|---------|
| `filter` | `string` | `'All'` | Active filter tab |

### Static Data

Three jobs:
1. Senior Frontend Engineer @ Vercel — 94% (Remote)
2. Product Designer @ Linear — 88% (Hybrid)
3. Software Engineer, UI @ Airbnb — 76% (Onsite)

### Key Patterns

- **Filter tabs**: `['All', 'Remote', 'Hybrid', 'Onsite']` — styled as pill buttons
  - Note: Filtering logic is **not implemented**; all jobs always render (UI-only)
- **"TOP MATCH" badge**: Shown when `job.match > 90` (absolutely positioned)
- **Match score circle**: Border color varies by percentage tier
- **Skill tags**: Rendered as small bordered pills
- **Action row**: Heart (favorite) + Apply button with `ExternalLink` icon
- **Hover effect**: Border turns neon green + box shadow glow

---

## ResumeIQLogo

**File:** `src/app/components/brand/ResumeIQLogo.tsx`  
**Type:** Named export `ResumeIQLogo`  
**Role:** SVG wordmark logo for the ResumeIQ brand.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Controls logo dimensions |
| `className` | `string` | `''` | Additional CSS classes |

### Size Map

| Size | Height | Font Size |
|------|--------|-----------|
| `sm` | 22px | 20px |
| `md` | 28px | 26px |
| `lg` | 40px | 38px |

### SVG Structure

1. `<text>` "Resume" — fill `#F5F2E8` (soft white)
2. `<text>` "I" — fill `#C6FF00` (neon green), positioned at `x = fontSize * 3.72`
3. `<text>` "Q" — fill `#C6FF00` (neon green), positioned at `x = fontSize * 4.02`
4. `<g>` Diagonal arrow (↗) — translated to top-right of Q
   - `<line>` from bottom-left to top-right
   - `<polyline>` arrowhead at endpoint

### Key Design Detail

- Font: `'DM Sans', 'Inter', system-ui, sans-serif'`
- Letter spacing: `-0.02em` for tight wordmark feel
- Arrow position: `translate(fontSize * 5.0, height * 0.18)` — gap calibrated through iteration
- `aria-label="ResumeIQ"` for accessibility

---

## Header

**File:** `src/app/components/layout/Header.tsx`  
**Type:** Named export `Header`  
**Role:** Fixed top navigation bar.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `currentStep` | `string` | Active step for nav highlighting |
| `onNavigate` | `(step: string) => void` | Step navigation callback |

### Key Patterns

- **Fixed positioning**: `fixed top-0 left-0 right-0 z-50`
- **Glass effect**: `backdrop-blur-md` + semi-transparent background (`${COLORS.background}CC`)
- **Logo click**: Navigates to `'landing'`
- **Nav items**: Dashboard, Upload Resume, History (desktop only)
- **Action buttons**: Bell icon, User avatar, mobile Menu button
- **Height**: 80px (`h-20`)

---

## Footer

**File:** `src/app/components/layout/Footer.tsx`  
**Type:** Named export `Footer`  
**Role:** Full-width footer with trust badges, links, and copyright.

### Props

None.

### Sections

1. **Trust Badges Row** (3 cards):
   - AI Transparency (Brain icon)
   - Resume Privacy (Lock icon)
   - Built for Students (GraduationCap icon)

2. **4-Column Link Grid**:
   - Brand + description + SOC2/GDPR badge
   - Product links (Resume Analyzer, Skill Gap Finder, Job Matcher, API)
   - Resources links (Resume Guide, Interview Prep, Blog, Campus Program)
   - Legal links (Privacy Policy, Terms of Service, Data Security, AI Ethics)

3. **Bottom Bar**: Copyright `© 2026 ResumeIQ` + social links (Twitter, LinkedIn, GitHub, Discord)

### Key Patterns

- Uses `<ResumeIQLogo size="md" />` for brand consistency
- All links are static (no routing) — `cursor-pointer` with hover color change
- Border-top separator from main content
