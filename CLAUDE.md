# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

lousy-docs is a static documentation site for the lousy-agents ecosystem, built with Astro and React islands using the "Analog Terminal" design system. It is a fully static site with no server-side API routes.

## Commands

```bash
# ALWAYS run first
nvm use

# Development
npm run dev              # Astro dev server (http://0.0.0.0:3000)
npm run build            # Production static build -> dist/
npm run preview          # Preview built site locally

# Testing
npm test                 # Vitest run
npm test path/to/file.test.ts  # Single test file

# Linting
npx biome check          # Lint + format check
npx biome check --write  # Auto-fix lint/format
npx biome check path/to/file.ts  # Single file
npm run lint:workflows   # Validate GitHub Actions (actionlint)
npm run lint:yaml        # Validate YAML (yamllint)

# Validation suite (run before commits)
npx biome check && npm test && npm run build
```

## Workflow: TDD Required

All code changes must follow this sequence:

1. **Research**: Search codebase for existing patterns. Use Context7 MCP tools for library/API documentation.
2. **Write failing test** -> **Verify failure** with `npm test`
3. **Implement minimal code** -> **Verify pass** with `npm test`
4. **Refactor** -> **Validate**: `npx biome check && npm test && npm run build`

Task is NOT complete until full validation passes.

## Tech Stack

- **Framework**: Astro 6 (static output) with React 19 islands via `@astrojs/react`
- **Component Library**: Ant Design 6, themed to "Analog Terminal" dark theme (see `DESIGN.md`)
- **Language**: TypeScript (strict mode), path alias `@/*` -> `./src/*`
- **Validation**: Zod for all external data -- never use type assertions (`as Type`) on API responses
- **Testing**: Vitest + happy-dom, MSW for HTTP mocking, Chance.js for fixtures, Testing Library React
- **Linting**: Biome (never ESLint/Prettier separately)
- **Logging**: Pino with JSON format and child loggers

## Architecture: Clean Architecture (Static Site)

Dependencies point inward only: Entities -> Use Cases -> Adapters -> Infrastructure.

| Layer | Location | Rules |
|-------|----------|-------|
| **Entities** | `src/entities/` | Pure TypeScript only. No framework imports, no non-deterministic APIs. |
| **Use Cases** | `src/use-cases/` | Import only from entities and ports (interfaces). Define input/output DTOs. |
| **Adapters** | `src/gateways/`, `src/hooks/`, `src/components/`, `src/lib/` | Implement ports. Gateways validate all external data with Zod. Hooks wire use cases to React. Components use Ant Design primitives, receive data as props. |
| **Infrastructure** | `src/pages/`, `src/layouts/` | Composition root. Mount React islands. Layouts = HTML shell only (no React/Ant Design). |

### Key Patterns

- **Dependency injection**: Factory functions (preferred) or constructor injection. Never module-level mutable state.
- **Gateways**: Factory functions accepting config, returning port implementations. All external API data validated with Zod.
- **React islands**: Default to `client:only="react"` for Ant Design components (avoids CSS-in-JS hydration mismatch). Never use `'use client'` (Next.js directive, not applicable in Astro).
- **AntDProvider**: All React trees using Ant Design MUST be wrapped in the `AntDProvider` at `src/components/providers/AntDProvider.tsx`.
- **No server API routes**: This is fully static. Gateways call external APIs from the browser.

## Testing Conventions

- Tests live in `tests/` mirroring `src/` structure
- Arrange-Act-Assert pattern, spec-style `describe`/`it` blocks
- Describe behavior, not implementation. Name `it` blocks as complete sentences.
- Generate fixtures with Chance.js -- avoid hardcoded test data
- Mock HTTP with MSW only (never mock fetch directly)
- Never export functions solely for testing -- use dependency injection via parameters
- Reset MSW handlers between tests for isolation
- Event listeners added in tests MUST be removed in `try/finally` or `afterEach` -- never rely on cleanup after assertions
- Interactive UI (dialogs, overlays, drawers, keyboard shortcuts) MUST have e2e tests covering open, close (all methods), focus management, and keyboard navigation

## UI Design and Mockups

Use the **Stitch MCP server** for UI mockups and design work. Stitch tools are available for:
- Creating and managing design systems (`create_design_system`, `list_design_systems`)
- Generating screens from text descriptions (`generate_screen_from_text`)
- Editing screens and generating variants (`edit_screens`, `generate_variants`)
- Applying design systems to projects (`apply_design_system`)
- Managing projects and screens (`create_project`, `list_projects`, `list_screens`)

When creating UI mockups, reference the "Analog Terminal" design system documented in `DESIGN.md` for colors, typography, elevation, and component guidelines.

## UI Implementation Checklist

Before writing CSS or implementing any interactive UI component, cross-reference `DESIGN.md`. This checklist applies when creating new components with custom styles or interactive behavior — it does not apply to pure business logic, data-fetching, or test changes.

1. **Surface tier**: Identify the component type (base, sectioning, card, floating) and use the correct surface color from §2
2. **Floating panels**: Must use `surface-container-highest` + `backdrop-filter: blur()` per the Glass & Gradient Rule (§2)
3. **Borders**: Use ghost borders at 15% opacity per §4 -- never solid 1px borders
4. **Shadows**: Ambient shadows use `on-surface` at 6% opacity with 40px blur per §4
5. **Inputs**: Must use monospace font per §5 "Terminal Input"
6. **Contrast**: All text and placeholder colors must meet WCAG 2.1 AA 4.5:1 minimum

### Accessibility Requirements for Interactive UI

Any component that overlays or traps user attention (dialogs, modals, drawers, search overlays) MUST implement:

- `role="dialog"` with `aria-modal="true"` and an accessible name (`aria-label` or `aria-labelledby` referencing a visible heading)
- Visible, focusable close button with accessible name (visible text, `aria-label`, or `aria-labelledby`; use `aria-label` for icon-only buttons)
- Tab focus trap within the dialog
- Save active element on open, restore focus on close
- `inert` attribute on background content when open
- `:focus-visible` outlines meeting WCAG 2.1 SC 1.4.11 Non-text Contrast (3:1 against adjacent colors)
- Keyboard dismiss (Escape key at minimum)

## Dependencies

- Pin ALL dependencies to exact versions (no `^` or `~`)
- Search npm for latest stable version before adding
- Run `npm audit` after any dependency change

## CI Pipeline

CI runs lint -> test -> build (build depends on lint + test passing). All third-party actions are pinned to exact commit SHAs. Node.js version is read from `.nvmrc`.

## Spec-Driven Development

Feature specs live in `.github/specs/`. The workflow:
1. Create issue using "Copilot Feature To Spec" template
2. Spec is generated with problem statement, personas, EARS acceptance criteria, and sequenced tasks
3. Implement tasks in order per spec

See `.github/instructions/spec.instructions.md` for full EARS syntax and spec structure.

## Boundaries

**Ask first:** Adding new dependencies, changing project structure, modifying GitHub Actions workflows.

**Never:** Skip TDD workflow, use Jest (use Vitest), mock fetch directly (use MSW), use type assertions on external data, add dependencies without exact version numbers, use `'use client'` directive, use empty `catch` blocks that swallow errors silently (always log or rethrow).
