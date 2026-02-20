# ResumeIQ — Tech Stack & Tools

> Detailed breakdown of every technology, library, and tool used in the project, with version numbers, purpose, and reasoning.

---

## Core Framework

### React 18.3.1

- **Role**: UI library for building component-based interfaces
- **Why React**: Component model, virtual DOM diffing, massive ecosystem, industry standard
- **Key APIs Used**:
  - `useState` — local component state (step routing, form inputs, upload state)
  - `useEffect` — side effects (timer in Analyzing.tsx)
  - `useRef` — DOM references (hidden file input in UploadResume)
  - `React.FC<Props>` — typed functional components
- **Rendering**: `createRoot` (React 18 concurrent mode API)
- **Listed as**: `peerDependencies` (provided by host environment)

### React DOM 18.3.1

- **Role**: DOM renderer for React
- **Key API**: `createRoot(document.getElementById('root')!).render(<App />)`

---

## Build Tooling

### Vite 6.3.5

- **Role**: Development server + production bundler
- **Why Vite**: Instant HMR via native ESM, fast cold starts, built-in TypeScript support
- **Config** (`vite.config.ts`):
  ```ts
  plugins: [react(), tailwindcss()]
  resolve: { alias: { '@': path.resolve(__dirname, './src') } }
  ```
- **Path Alias**: `@` maps to `./src` for clean imports
- **Dev Server**: `npm run dev` — serves on localhost with full HMR
- **Build**: `npm run build` — ESBuild + Rollup for production bundle

### @vitejs/plugin-react 4.7.0

- **Role**: React Fast Refresh + JSX transform for Vite
- **Why**: Enables HMR for React components without losing state

### TypeScript (via Vite)

- **Role**: Static type checking
- **Key Patterns Used**:
  - Interface props definitions (`interface LandingProps { onStart: () => void }`)
  - Generic useState (`useState<string>('landing')`)
  - Type narrowing (`as const` for Motion ease values)
  - MIME type string literals for file validation
- **Config**: Strict mode enabled

---

## Styling

### Tailwind CSS 4.1.12

- **Role**: Utility-first CSS framework
- **Why Tailwind**: Rapid UI development, consistent design, JIT compilation, no CSS context-switching
- **v4 Features Used**:
  - `@import 'tailwindcss' source(none)` — explicit source control
  - `@source '../**/*.{js,ts,jsx,tsx}'` — file scanning directive
  - `@theme inline` — CSS custom property registration
  - `@custom-variant dark` — dark mode variant
- **Integration**: `@tailwindcss/vite` plugin (no PostCSS needed for compilation)

### tw-animate-css 1.3.8

- **Role**: Pre-built Tailwind CSS animation utilities
- **Usage**: Imported via `@import 'tw-animate-css'` in tailwind.css

### tailwind-merge 3.2.0

- **Role**: Intelligently merges conflicting Tailwind classes
- **Usage**: Used in `cn()` utility function (`src/app/components/ui/utils.ts`)
  ```ts
  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
  }
  ```

### clsx 2.1.1

- **Role**: Conditional class name construction
- **Usage**: Combined with `tailwind-merge` in `cn()` for conditional + mergeable classes

### class-variance-authority (CVA) 0.7.1

- **Role**: Type-safe component variant management
- **Usage**: Defines button variants, sizes, and compound variants in shadcn/ui components
  ```ts
  const buttonVariants = cva("base-classes", {
    variants: { variant: { default: "...", outline: "..." }, size: { sm: "...", lg: "..." } }
  });
  ```

---

## Animation

### Motion (Framer Motion) 12.23.24

- **Role**: Production-grade animation library for React
- **Package**: `motion` (rebranded from `framer-motion` in v12)
- **Why Motion**: Declarative API, GPU-accelerated, exit animations, SVG animation
- **Key APIs Used**:

| API | Usage |
|-----|-------|
| `motion.div` | Animatable div elements |
| `motion.circle` | SVG circle animation (score ring) |
| `motion.path` | SVG path drawing (checkmark) |
| `AnimatePresence` | Page transition exit animations |
| `initial` | Starting animation state |
| `animate` | Target animation state |
| `exit` | Unmount animation state |
| `whileInView` | Scroll-triggered animations |
| `variants` | Shared animation definitions |
| `staggerChildren` | Sequential child entrance |
| `transition` | Duration, ease, delay, repeat |

- **Animation Patterns**:
  ```tsx
  // Page enter/exit
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}

  // Infinite loop
  animate={{ rotate: 360 }}
  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}

  // Staggered children
  const container = { show: { transition: { staggerChildren: 0.12 } } };
  ```

---

## UI Components

### shadcn/ui (40+ components)

- **Role**: Copy-paste component library built on Radix UI
- **Why shadcn**: Full ownership of code, no dependency lock-in, highly customizable
- **Location**: `src/app/components/ui/`
- **Components Available**: accordion, alert-dialog, avatar, badge, breadcrumb, button, calendar, card, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, form, hover-card, input, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, switch, table, tabs, textarea, toggle, tooltip
- **Actively Used**: `button`, `card` (others available for expansion)

### Radix UI Primitives

| Package | Version | Purpose |
|---------|---------|---------|
| `@radix-ui/react-accordion` | 1.2.3 | Collapsible content sections |
| `@radix-ui/react-alert-dialog` | 1.1.6 | Accessible alert modals |
| `@radix-ui/react-dialog` | 1.1.6 | Accessible modal dialogs |
| `@radix-ui/react-dropdown-menu` | 2.1.6 | Accessible dropdown menus |
| `@radix-ui/react-label` | 2.1.2 | Accessible form labels |
| `@radix-ui/react-popover` | 1.1.6 | Accessible popovers |
| `@radix-ui/react-progress` | 1.1.2 | Accessible progress bars |
| `@radix-ui/react-scroll-area` | 1.2.3 | Custom scrollbars |
| `@radix-ui/react-select` | 2.1.6 | Accessible select menus |
| `@radix-ui/react-separator` | 1.1.2 | Visual separators |
| `@radix-ui/react-slot` | 1.1.2 | Polymorphic component API |
| `@radix-ui/react-switch` | 1.1.3 | Toggle switches |
| `@radix-ui/react-tabs` | 1.1.3 | Tabbed interfaces |
| `@radix-ui/react-toggle` | 1.1.2 | Toggle buttons |
| `@radix-ui/react-tooltip` | 1.1.8 | Accessible tooltips |
| *(+ 10 more)* | | |

- **Why Radix**: Fully accessible (WAI-ARIA), unstyled/headless, composable, no opinion on styling

---

## Icons

### Lucide React 0.487.0

- **Role**: Icon library
- **Why Lucide**: Tree-shakeable (only used icons are bundled), consistent design, actively maintained
- **Icons Used**:
  ```
  Upload, FileText, Zap, Target, Brain, BarChart3, Users, Shield, Sparkles,
  X, Check, File, Info, Trash2, Wand2, Briefcase, MapPin, ExternalLink,
  Heart, Menu, User, Bell, TriangleAlert, ChevronDown, Lock, GraduationCap
  ```
- **Import Pattern**: Individual named imports for tree-shaking
  ```tsx
  import { Upload, FileText, Zap } from 'lucide-react';
  ```

---

## Notifications

### Sonner 2.0.3

- **Role**: Toast notification system
- **Why Sonner**: Minimal, beautiful defaults, dark theme support, no configuration needed
- **Setup**:
  ```tsx
  // In App.tsx
  <Toaster position="top-center" richColors theme="dark" />

  // In components
  import { toast } from 'sonner';
  toast.error('Invalid file type. Please upload PDF or DOCX.');
  ```
- **Usage**: File upload validation errors in UploadResume.tsx

---

## Fonts

### Google Fonts (CSS import)

| Font | Weight | Role | CSS Variable |
|------|--------|------|--------------|
| **DM Sans** | 100-1000 (variable) | Body text, UI elements | `FONTS.body` |
| **Playfair Display** | 400-900 (variable) | Headings, titles | `FONTS.heading` |

- **Loading**: `@import url('https://fonts.googleapis.com/css2?...')` in `fonts.css`
- **Strategy**: `display=swap` for FOUT over FOIT (faster perceived load)

---

## Additional Dependencies (Installed but Not Actively Used)

These packages are in `package.json` but not referenced in the current codebase. They were likely installed for future features or came with the initial scaffolding:

| Package | Version | Purpose |
|---------|---------|---------|
| `@emotion/react` | 11.14.0 | CSS-in-JS for MUI |
| `@emotion/styled` | 11.14.1 | Styled components for MUI |
| `@mui/material` | 7.3.5 | Material UI components |
| `@mui/icons-material` | 7.3.5 | Material UI icons |
| `@popperjs/core` | 2.11.8 | Tooltip/popover positioning |
| `cmdk` | 1.1.1 | Command palette (⌘K) |
| `date-fns` | 3.6.0 | Date utility library |
| `embla-carousel-react` | 8.6.0 | Carousel/slider |
| `input-otp` | 1.4.2 | OTP input fields |
| `next-themes` | 0.4.6 | Theme switching |
| `react-day-picker` | 8.10.1 | Date picker component |
| `react-dnd` | 16.0.1 | Drag and drop |
| `react-dnd-html5-backend` | 16.0.1 | HTML5 DnD backend |
| `react-hook-form` | 7.55.0 | Form management |
| `react-popper` | 2.3.0 | Popper positioning |
| `react-resizable-panels` | 2.1.7 | Resizable panel layouts |
| `react-responsive-masonry` | 2.7.1 | Masonry grid layout |
| `react-router` | 7.13.0 | Client-side routing |
| `react-slick` | 0.31.0 | Carousel/slider |
| `recharts` | 2.15.2 | Charting library |
| `vaul` | 1.1.2 | Drawer component |

> **Interview Tip**: Be prepared to explain why these are present but unused (e.g., "They were part of the UI component library scaffolding and would be used as the product expands").

---

## Design Tokens

### Color Palette (`theme.ts`)

| Token | Hex | Usage |
|-------|-----|-------|
| `background` | `#0E0F13` | Page background, dark base |
| `surface` | `#151821` | Card backgrounds, elevated surfaces |
| `surfaceHighlight` | `#1E222F` | Hover states, icon containers |
| `accent` | `#C6FF00` | Primary neon green accent |
| `accentSecondary` | `#F4EBDD` | Warm secondary accent |
| `text` | `#F5F2E8` | Primary text color (warm white) |
| `textMuted` | `#9E9C96` | Secondary/muted text |
| `border` | `#2A2E3B` | Borders, dividers |
| `success` | `#C6FF00` | Positive states (= accent) |
| `warning` | `#FFD700` | Warning/medium priority (gold) |
| `error` | `#FF4D4D` | Error/high priority (red) |

### CSS Custom Properties (`theme.css`)

- Defines light + dark mode variables using `oklch()` color space
- Mapped to Tailwind via `@theme inline` block
- Includes: colors, border-radius (`--radius: 0.625rem`), sidebar tokens, chart tokens
- Base layer sets default typography for `h1-h4`, `label`, `button`, `input`

---

## Dev Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build (ESBuild + Rollup) |
