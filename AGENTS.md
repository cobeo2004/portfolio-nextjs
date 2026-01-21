# Agent Guidelines for Portfolio Project

This document provides essential context, commands, and conventions for AI agents (and human developers) working on this Next.js portfolio project.

## 1. Project Overview
- **Stack**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Three.js (@react-three/fiber).
- **Key Features**: 3D Wizard model, Circular Navigation, EmailJS contact form, Responsive design hooks.
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
    - Convention: Prefix types with `T` (e.g., `TBtnList`, `TProjectList`) as seen in `src/types/index.d.ts`.
- **Path Aliases**: Use `@/` to refer to the `src` directory (e.g., `@/components/...`).

### Components (React/Next.js)
- **Naming**: PascalCase for components (e.g., `WizardModel.tsx`, `RenderModel.tsx`).
- **Client Components**: Add `"use client";` at the very top for components using hooks or browser-only features.
- **3D Models**: 
    - Located in `src/components/models/`.
    - Use `dynamic` imports with `{ ssr: false }` for Three.js components to prevent hydration errors.
    - Wrap models in `RenderModel` component.

### CSS / Styling
- **Tailwind**: Primary styling method. Use utility classes.
- **Custom Config**: Theme colors and extensions are in `tailwind.config.ts`.
- **Global Styles**: Defined in `src/app/globals.css` (CSS variables for themes).

### State & Hooks
- **Naming**: camelCase (e.g., `useScreenSize`).
- **Custom Hooks**: Store in `src/hooks/`.

## 4. Architecture & Key Files
- **Routes**: `src/app/` (App Router).
- **Navigation Data**: `src/lib/data.ts` (contains `BtnList`, `projectsData`).
- **Assets**: 
    - Images: `public/assets/`
    - Models: Ensure `.glb`/`.gltf` files are optimized.

## 5. Agent Operational Rules
- **Proactiveness**: If you modify a UI component, consider checking responsiveness (mobile vs desktop).
- **Safety**: Do not edit `.env` or secret files directly.
- **Exploration**: Use `ls` and `grep` to verify file locations before creating duplicates.
- **Refactoring**: When modifying `data.ts`, ensure types in `src/types/index.d.ts` match the changes.

## 6. Cursor / Copilot Rules
*(No specific Cursor or Copilot rules found in .cursor/rules/ or .github/copilot-instructions.md)*
