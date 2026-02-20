# ResumeIQ — State & User Flow

> Complete documentation of the application's state machine, data flow, component lifecycle, and user journey.

---

## Application State Machine

The entire app is driven by a single `step` state in `App.tsx`:

```
                          ┌────────────────┐
                          │    landing     │ (initial)
                          └───────┬────────┘
                                  │ onStart()
                                  ▼
                          ┌────────────────┐
                          │    upload      │
                          └───────┬────────┘
                                  │ onNext()
                                  ▼
                          ┌────────────────┐
                     ┌────│   job-input    │
                     │    └───────┬────────┘
              onBack()│           │ onAnalyze()
                     │            ▼
                     │    ┌────────────────┐
                     └───►│   analyzing    │
                          └───────┬────────┘
                                  │ onComplete() [auto, 3s]
                                  ▼
                          ┌────────────────┐
                          │    results     │ (terminal)
                          └────────────────┘
```

### State Transitions

| Current State | Trigger | Next State | Mechanism |
|---------------|---------|------------|-----------|
| `landing` | Click "Upload Resume" | `upload` | `onStart()` callback |
| `upload` | Click "Continue" (file uploaded) | `job-input` | `onNext()` callback |
| `job-input` | Click "Analyze Resume" (50+ chars) | `analyzing` | `onAnalyze()` callback |
| `job-input` | Click "Back" | `upload` | `onBack()` callback |
| `analyzing` | 3-second timer | `results` | `useEffect` + `setTimeout` |
| Any step | Click Header logo | `landing` | `onNavigate('landing')` |
| Any step | Click Header nav links | Various | `onNavigate(target)` |

### Key Observations

1. **Linear flow** — no branching except `job-input` → back → `upload`
2. **No forward skipping** — can't jump from `landing` to `results` via step controls (only Header nav allows this)
3. **No data persistence** — navigating back doesn't preserve previous inputs
4. **results is terminal** — no explicit flow to go forward; Header nav = only way out

---

## Detailed User Journey

### Step 1: Landing Page

```
User arrives at root URL
  └── App renders with step='landing'
       └── <Landing onStart={setStep('upload')} />
            ├── Hero section fades in (stagger animation, 120ms between items)
            ├── Right column: AI scanning simulation plays immediately
            │    ├── Scanning beam: loops 4s (top ↔ bottom)
            │    ├── Skills detected: appear at 1.2s, 1.7s, 2.2s, 2.7s
            │    ├── Processing dots: pulse infinitely
            │    └── Match progress bar: fills to 84% over 3s
            ├── "How It Works" section: animates on scroll (whileInView)
            └── Footer renders statically

User clicks "Upload Resume" button
  └── onStart() → setStep('upload')
       └── AnimatePresence: Landing exits (opacity→0, y→-20) → UploadResume enters
```

### Step 2: Upload Resume

```
UploadResume mounts (opacity: 0→1, y: 20→0)
  └── Renders empty drop zone

Option A: Drag and drop
  User drags file over zone
    └── onDragOver: isDragging = true (border turns green)
  User drops file
    └── onDrop: validate MIME type
         ├── Valid (PDF/DOCX): simulateUpload() starts
         │    └── setInterval: uploadProgress 0→10→20→...→100 (1 second)
         │         └── At 100%: setFile(file) → re-render as file preview
         └── Invalid: toast.error('Invalid file type...')

Option B: Click to upload
  User clicks zone
    └── inputRef.current.click() → native file picker opens
         └── onChange: same validation flow

User clicks "Continue" (disabled until file !== null)
  └── onNext() → setStep('job-input')
```

**Upload State Machine:**

```
┌──────────────┐     drop/select     ┌──────────────┐      100%      ┌──────────────┐
│   Empty      │ ─────────────────►  │  Uploading   │ ────────────►  │  Preview     │
│  (drop zone) │                     │  (progress)  │                │  (file info) │
└──────────────┘                     └──────────────┘                └──────┬───────┘
       ▲                                                                    │
       │                          removeFile()                              │
       └────────────────────────────────────────────────────────────────────┘
```

### Step 3: Job Description Input

```
JobInput mounts (opacity: 0→1)
  └── Two-column layout renders
       ├── Left: Empty textarea
       └── Right: AI Tips + disabled "Analyze Resume" button

User types in textarea
  └── onChange: setText(e.target.value)
       └── Character count updates in real-time
       └── Button enables when text.length >= 50

User clicks "Analyze Resume"
  └── onAnalyze() → setStep('analyzing')

User clicks "Back"
  └── onBack() → setStep('upload')
       └── Note: Previous file upload state is LOST (component unmounted)
```

### Step 4: AI Analysis Loading

```
Analyzing mounts
  └── useEffect fires:
       └── setTimeout(onComplete, 3000)

Simultaneous animations play:
  ├── Outer ring rotates clockwise (8s loop)
  ├── Inner ring rotates counter-clockwise (12s loop)  
  ├── Center dot pulses (2s loop)
  ├── Title fades in at 0.5s
  ├── Status text fades in at 1s
  └── Progress bar: 0%→100% over 3s

At 3 seconds:
  └── onComplete() → setStep('results')
       └── Analyzing unmounts, Results mounts
```

### Step 5: Results Dashboard

```
Results mounts (opacity: 0→1)
  └── Grid renders 4 sub-components:

  MatchScore (score=94):
    ├── Score ring animates from 0→94% (1.5s, 0.4s delay)
    ├── Score number scales in (0.7s delay)
    ├── Skill bars animate sequentially:
    │    ├── React & TypeScript: 95% (0.6s delay)
    │    ├── System Design: 72% (0.8s delay)
    │    └── Leadership: 60% (1.0s delay)
    ├── Missing skill tags render immediately
    └── Scan overlay line loops continuously

  MissingSkills:
    ├── GraphQL slides in (0ms delay)
    ├── System Design slides in (100ms delay)
    └── Mentorship slides in (200ms delay)

  Suggestions:
    └── 2 suggestion cards render
         └── "Apply Suggestion" → handleApply(id) → button becomes "✓ Applied"

  JobRecommendations:
    ├── Filter tabs render (All selected)
    └── 3 job cards animate in (100ms stagger)
         ├── Card 1: "TOP MATCH" badge (94% > 90)
         └── Heart / Apply buttons are interactive but have no backend
```

---

## Component Lifecycle Map

```
App.tsx ──────── ALWAYS MOUNTED ──────────────────────────────
  │
  ├── Header ─── ALWAYS MOUNTED (fixed z-50) ─────────────────
  │
  ├── Toaster ── ALWAYS MOUNTED (notification container) ─────
  │
  └── AnimatePresence ── ONE child at a time (mode="wait") ───
       │
       ├── Landing ──── mount ─── animate ─── exit ─── unmount
       │
       ├── UploadResume ─ mount ─ animate ─ exit ─── unmount
       │                    │
       │                    └── State LOST on unmount:
       │                         file, isDragging, uploadProgress
       │
       ├── JobInput ──── mount ─── animate ─── exit ─── unmount
       │                    │
       │                    └── State LOST on unmount:
       │                         text (job description)
       │
       ├── Analyzing ─── mount ─── 3s timer ─── exit ─── unmount
       │
       └── Results ───── mount ─── stays mounted ──────────────
             │
             ├── MatchScore ──── mount + animate ────────────
             ├── MissingSkills ── mount + animate ───────────
             ├── Suggestions ──── mount (owns `applied` state)
             └── JobRecommendations ── mount (owns `filter` state)
```

---

## Data Flow Diagram

```
                         App.tsx
                    ┌──────┴──────┐
                    │   step      │ ← useState('landing')
                    │   (string)  │
                    └──────┬──────┘
                           │
            ┌──────┬───────┼────────┬──────────┐
            │      │       │        │          │
            ▼      ▼       ▼        ▼          ▼
         Landing Upload  JobInput Analyzing  Results
            │      │       │        │          │
            │      │       │        │    ┌─────┼──────────┐──────────┐
            │      │       │        │    │     │          │          │
            │      │       │        │    ▼     ▼          ▼          ▼
            │      │       │        │  Match  Missing  Suggest.  Job Recs
            │      │       │        │  Score  Skills              
            │      │       │        │    │                │          │
            │      │       │        │  score   (none)   applied   filter
            │      │       │        │  (prop)           (local)   (local)
            │      │       │        │
            │    file     text    timer
            │  isDragging         (3s)
            │  progress
            │  (local)   (local)
         (none)

─── Props flow DOWN ───
─── Callbacks flow UP (onStart, onNext, onAnalyze, onBack, onComplete) ───
─── Local state is component-scoped (lost on unmount) ───
```

---

## Animation Timeline

### Page Enter/Exit

```
Exit animation: 300ms (default Motion duration)
  └── opacity: 1 → 0
  └── y: 0 → -20

Wait for exit to complete (mode="wait")

Enter animation: 300ms
  └── opacity: 0 → 1
  └── y: 20 → 0
```

### Landing Page Sequence

```
T=0ms     Badge fades in (item variant)
T=120ms   H1 heading fades in
T=240ms   Description paragraph fades in
T=360ms   CTA buttons fade in
T=480ms   Trust stats fade in
T=300ms   Right column scales in (independent, 0.3s delay)
T=1200ms  First skill "React" appears
T=1700ms  "TypeScript" appears
T=2200ms  "System Design" appears
T=2700ms  "CI/CD" appears
T=1000ms  Match progress bar starts filling (reaches 84% at T=4000ms)
```

### Results Page Sequence

```
T=0ms     Page container fades in
T=400ms   Score ring starts drawing (1.5s duration)
T=600ms   First skill bar starts (React & TypeScript, 1.2s duration)
T=700ms   Score number "94%" scales in
T=800ms   Second skill bar starts (System Design)
T=1000ms  Third skill bar starts (Leadership)
T=0ms     Missing skills slide in (100ms stagger each)
T=0ms     Job cards slide in (100ms stagger each)
```

---

## Global Event Handling

### Header Navigation

```
Header receives: currentStep, onNavigate

Logo click → onNavigate('landing')
"Dashboard" → onNavigate('results')
"Upload Resume" → onNavigate('upload')
"History" → onNavigate('results')  // placeholder
```

**Note:** Header navigation bypasses the normal flow. Clicking "Dashboard" from `landing` jumps directly to `results` without uploading a resume or entering job description. This is intentional for demo/prototype purposes.

### Text Selection Styling

Defined at root level in App.tsx:
```tsx
className="selection:bg-[#C6FF00] selection:text-[#0E0F13]"
```
All selected text across the app appears as dark text on neon green highlight.

---

## State Persistence (or lack thereof)

| Data | Persisted? | Lost When |
|------|-----------|-----------|
| Current step | In memory only | Page refresh |
| Uploaded file | No | Navigating away from UploadResume |
| Job description text | No | Navigating away from JobInput |
| Applied suggestions | No | Page refresh (component stays mounted in results) |
| Job filter selection | No | Page refresh (component stays mounted in results) |

**For production**, you would:
1. Lift `file` and `text` state to `App.tsx` so they persist across navigation
2. Use `sessionStorage` or `localStorage` for page-refresh persistence
3. Use backend storage for cross-session persistence
4. Consider URL hash/params for shareable results
