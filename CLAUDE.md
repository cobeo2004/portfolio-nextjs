# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev          # Start development server (port 3000)
bun run build    # Production build
bun run lint     # Run ESLint
bun start        # Start production server
```

## Architecture

This is a Next.js 16 personal portfolio using the App Router with React 19, TypeScript, Tailwind CSS, GSAP and Lenis. Three.js is only used in the hidden wizard mode.

### Routing Structure

- `src/app/page.tsx` - Home (hero desk, marquee, facts, manifesto, sticky work stack, collective, contact band)
- `src/app/work/page.tsx` - All projects with filters, More projects, live GitHub feed
- `src/app/work/syncnapse/page.tsx` - Case study
- `src/app/about/page.tsx`, `src/app/contact/page.tsx`
- `/projects` redirects to `/work` (`next.config.mjs`)
- Metadata files live in `src/app/`: `icon.svg`, `favicon.ico`, `apple-icon.png`, `opengraph-image.png`, `twitter-image.png`, `sitemap.ts`, `robots.ts`

### Key Patterns

**Site shell**: `src/providers/SiteProvider.tsx` owns theme, wizard mode, the menu and Ask my CV overlays, Lenis smooth scrolling and page transitions. Read it with `useSite()` (`src/hooks/useSite.ts`). The layout renders `Nav`, `Footer`, `CommandPalette` and `WizardMode` once, so they persist across routes.

**Theme**: `src/lib/theme-store.ts` keeps light/dark/wizard outside React (`useSyncExternalStore`) and writes `<html data-theme>`; `themeBootScript` in `<head>` applies the saved theme before the first paint.

**Links**: use `TransitionLink` (`src/components/navigation/TransitionLink.tsx`) for internal links so the stair-column wipe plays. Buttons with a `data-cmdk` attribute open the Ask my CV palette.

**Motion**: GSAP plugins are registered in `src/lib/gsap.ts`. Shared scroll motion is declarative: add `data-split`, `data-rise`, `data-row`, `data-reveal`, `data-count`, `data-par`, `data-light` or `data-stack` to markup and render `<PageMotion />` at the end of the page's `<main>`. Component-specific motion uses `gsap.context` in `useLayoutEffect` and reverts on unmount. Always respect `prefersReducedMotion()`.

**Ask my CV**: `useAskCV` (`src/hooks/useAskCV.ts`) streams answers from `POST /api/chat`; suggested questions in `src/lib/data.ts` carry a prewritten fallback.

**3D Models**: `src/components/models/`, only loaded in wizard mode through `src/components/wizard/WizardScene.tsx` (dynamic import, `ssr: false`, wrapped in an error boundary).

**Contact Form**: EmailJS (`@emailjs/browser`) with react-hook-form via `useFormEmailSubmit`.

**Styling**: design tokens and component classes are in `src/app/globals.css` (light, dark and wizard themes). Tokens are exposed to Tailwind (`bg-paper`, `text-ink-2`, `bg-cobalt`, `font-display`); use Tailwind utilities for one-off spacing and sizing. `@tailwind utilities` sits at the end of the file so utilities win over component rules of equal specificity.

### Data

- All site content: `src/lib/data.ts` (projects, experience, awards, skills, nav items, suggested questions, music list)
- Types: `src/types/index.d.ts` (prefixed with `T`)

### Path Alias

`@/*` maps to `./src/*`
