# Agent Guidelines for Portfolio Project

This document provides essential context, commands, and conventions for AI agents (and human developers) working on this Next.js portfolio project.

## 1. Project Overview
- **Stack**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, GSAP, Lenis, Three.js (@react-three/fiber, wizard mode only).
- **Key Features**: Multi-page portfolio with scroll motion, light/dark themes, Ask my CV (RAG) palette, EmailJS contact form, hidden wizard mode with the 3D wizard and music player.
- **Package Manager**: Bun (preferred) or npm.

## 2. Environment & Commands
### Build & Run
- **Install Dependencies**: `bun install`
- **Dev Server**: `bun dev` (Runs on port 3000)
- **Production Build**: `bun run build`
- **Start Production**: `bun start`

### Quality Checks
- **Lint**: `bun run lint` (ESLint)
- **Type Check**: `bun run build` (Next.js build process includes type checking) or `tsc --noEmit` if configured.
- **Test**: *No automated testing framework is currently configured.* 
    - *Agent Instruction*: If asked to write tests, verify if a framework (like Vitest or Jest) exists. If not, ask the user if they want to install one before generating test files.

## 3. Code Style & Conventions

### General
- **Indentation**: 2 spaces.
- **Quotes**: Double quotes `"` preferred.
- **Semicolons**: Always use semicolons.

### TypeScript
- **Strict Mode**: Enabled.
- **Type Definitions**: 
    - Use `type` alias over `interface` generally.
    - Convention: Prefix types with `T` (e.g., `TProject`, `TProjectList`) as seen in `src/types/index.d.ts`.
- **Path Aliases**: Use `@/` to refer to the `src` directory (e.g., `@/components/...`).

### Components (React/Next.js)
- **Naming**: PascalCase for components (e.g., `WizardModel.tsx`, `RenderModel.tsx`).
- **Client Components**: Add `"use client";` at the very top for components using hooks or browser-only features.
- **3D Models**: 
    - Located in `src/components/models/`.
    - Use `dynamic` imports with `{ ssr: false }` for Three.js components to prevent hydration errors.
    - Wrap models in `RenderModel` component.

### CSS / Styling
- **Design system**: Tokens (CSS variables for light, dark and wizard) and component classes live in `src/app/globals.css`.
- **Tailwind**: Use utility classes for one-off layout, spacing and sizing; tokens are exposed in `tailwind.config.ts` (`bg-paper`, `text-ink-2`, `bg-cobalt`, `font-display`). Avoid inline `style` except for data-driven values.

### Motion
- Register nothing yourself: import GSAP and plugins from `@/lib/gsap`.
- Prefer the declarative data attributes handled by `src/components/motion/PageMotion.tsx` (`data-split`, `data-rise`, `data-row`, `data-reveal`, `data-count`, `data-par`, `data-light`, `data-stack`).
- Component motion: `gsap.context(..., ref)` inside `useLayoutEffect`, revert on cleanup, and skip when `prefersReducedMotion()`.
- Internal links use `TransitionLink`; buttons with `data-cmdk` open Ask my CV.

### State & Hooks
- **Naming**: camelCase (e.g., `useAskCV`).
- **Custom Hooks**: Store in `src/hooks/`.

## 4. Architecture & Key Files
- **Routes**: `src/app/` (App Router).
- **Site content**: `src/lib/data.ts` (`navItems`, `projectsData`, `experienceData`, `suggestedQuestions`, `musicDb`, ...).
- **Site shell**: `src/providers/SiteProvider.tsx` (theme, overlays, page transitions) read through `useSite()`.
- **Assets**: 
    - Images: `public/img/` (screenshots, company logos); `public/assets/` (music, models, CV)
    - Models: Ensure `.glb`/`.gltf` files are optimized.

## 5. Agent Operational Rules
- **Proactiveness**: If you modify a UI component, consider checking responsiveness (mobile vs desktop).
- **Safety**: Do not edit `.env` or secret files directly.
- **Exploration**: Use `ls` and `grep` to verify file locations before creating duplicates.
- **Refactoring**: When modifying `data.ts`, ensure types in `src/types/index.d.ts` match the changes.

## 6. Cursor / Copilot Rules
*(No specific Cursor or Copilot rules found in .cursor/rules/ or .github/copilot-instructions.md)*
