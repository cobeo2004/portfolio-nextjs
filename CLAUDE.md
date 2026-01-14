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

This is a Next.js 16 personal portfolio site using the App Router with React 19, TypeScript, Tailwind CSS, and Three.js for 3D models.

### Routing Structure

- `src/app/page.tsx` - Home page with circular navigation and 3D wizard model
- `src/app/(sub-pages)/` - Route group for About, Projects, Contact pages (shared layout with home button)

### Key Patterns

**3D Models**: Located in `src/components/models/`. Uses `@react-three/fiber` and `@react-three/drei`. Models are dynamically imported with SSR disabled to avoid hydration issues. The `RenderModel` component wraps all 3D content in a Canvas.

**Navigation**: Circular radial layout on desktop (buttons positioned using trigonometry), column layout on mobile. Navigation items defined in `src/lib/data.ts` via `BtnList`.

**Responsive Design**: Uses `useScreenSize` hook (`src/hooks/useScreenSize.tsx`) and `ComponentDidResponsive` for client-side responsive rendering.

**Animations**: Framer Motion for page transitions and UI animations.

**Contact Form**: Uses EmailJS (`@emailjs/browser`) with react-hook-form and Zod validation. EmailJS credentials stored in `.env.local`.

**Styling**: CSS variables defined in `src/app/globals.css` for theme colors (`--background`, `--foreground`, `--muted`, `--accent`). Custom Tailwind config extends these.

### Data

- Projects list: `src/lib/data.ts` (`projectsData`)
- Navigation items: `src/lib/data.ts` (`BtnList`)
- Types: `src/types/index.d.ts`

### Path Alias

`@/*` maps to `./src/*`
