# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

`.github/copilot-instructions.md` states the same standards for GitHub Copilot. The two are maintained in parallel and neither loads the other, so a normative rule changed here shall be changed there in the same commit; they currently restate about eight rules independently and will drift apart silently otherwise.

## Project Overview

lousy-docs is a static documentation site for the lousy-agents ecosystem, built with Astro and React islands using the "Analog Terminal" design system. It is fully static with no server-side API routes, which is why gateways call external APIs from the browser and why there is no place to hide a secret at runtime.

The documentation content is not authored here. `npm run dev` and `npm run build` both run `scripts/fetch-docs.sh` first, which clones docs from the `zpratt/lousy-agents` repository into `src/content/docs`. That directory is generated, so edits to it are discarded on the next build. Set `DOCS_GITHUB_TOKEN` for authenticated fetches and `DOCS_REF=<tag|branch>` to pin a reproducible revision; without a network path to that repository, dev and build both fail at the prebuild step rather than at compile time.

## Commands

Run `nvm use` before any npm command, because the toolchain is pinned by `.nvmrc` and a mismatched Node version produces failures that look like dependency bugs.

```bash
# Development
npm run dev              # Fetches docs, then Astro dev server on http://localhost:4321
npm run build            # Fetches docs, Astro build -> dist/, then minifies the Pagefind index
npm run preview          # Preview the built site locally

# Testing
npm test                 # Vitest unit tests
npm test path/to/file.test.ts  # Single test file
npm run test:e2e         # Playwright e2e tests
npm run test:e2e:dist    # e2e tests against the production build (what CI runs)
npm run test:e2e:ui      # Playwright UI mode (interactive dev)

# Linting
npx biome check          # Lint + format check
npx biome check --write  # Auto-fix lint/format (alias: npm run lint:fix)
npx biome check path/to/file.ts  # Single file
npm run lint:workflows   # Validate GitHub Actions (actionlint)
npm run lint:yaml        # Validate YAML (yamllint)

# Validation suite (run before commits)
npx biome check && npm test && npm run build
```

Prefer the file-scoped forms while iterating; they are the same checks against a smaller surface, so they fail faster and keep the feedback loop tight.

## Workflow: TDD Required

All code changes shall follow this sequence. The ordering exists so that a test failure proves the test can fail, which is the only evidence that it tests anything:

1. **Research**: Search the codebase for existing patterns. Use the Context7 MCP server for library and API documentation rather than recalling APIs, because the pinned versions here move faster than model knowledge.
2. **Write failing test** -> **Verify failure** with `npm test`
3. **Implement minimal code** -> **Verify pass** with `npm test`
4. **Refactor** -> **Validate**: `npx biome check && npm test && npm run build`

**For UI-layer changes** (components, layouts, styles, pages), the Visual Debugging Protocol adds mandatory steps between 3 and 4. See `.github/instructions/visual-verification.instructions.md` for the full protocol. In short: capture baseline screenshot → implement → screenshot again → analyze visual delta → verify interactive states → check responsive breakpoints → loop until correct. Self-verify via Playwright MCP before returning control, because unit tests do not render CSS and a build that succeeds proves nothing about what the page looks like.

A task is not complete until validation passes, both code and visual.

## Tech Stack

Exact versions live in `package.json`; what matters here is the constraint each choice imposes.

- **Framework**: Astro (`output: "static"`) with React islands via `@astrojs/react`
- **Component Library**: Ant Design, themed to the "Analog Terminal" dark theme (see `DESIGN.md`)
- **Language**: TypeScript (strict mode via `astro/tsconfigs/strict`), path alias `@/*` -> `./src/*`
- **Search**: Pagefind via `astro-pagefind`, indexed at build time
- **Validation**: Zod for all external data. Never use a type assertion (`as Type`) on an API response: an assertion silences the compiler without checking anything, so malformed data reaches the UI as a runtime crash instead of a caught validation error.
- **Testing**: Vitest + happy-dom, MSW for HTTP mocking, Chance.js for fixtures, Testing Library React
- **Linting**: Biome, which covers both lint and format. Do not add ESLint or Prettier separately; two formatters with different opinions fight on every save.
- **Logging**: Pino with JSON format and child loggers

## Architecture: Clean Architecture (Static Site)

Dependencies point inward only: Entities -> Use Cases -> Adapters -> Infrastructure. `.github/instructions/software-architecture.instructions.md` carries the worked examples and the full import matrix; this table is the summary.

| Layer | Location | Rules |
|-------|----------|-------|
| **Entities** | `src/entities/` | Pure TypeScript only. No framework imports, and no non-deterministic APIs (`Date.now()`, `Math.random()`, `crypto.randomUUID()`) so that entity behavior is reproducible in a test without stubbing globals. |
| **Use Cases** | `src/use-cases/` | Import only from entities and ports (interfaces). Define input/output DTOs. |
| **Adapters** | `src/gateways/`, `src/hooks/`, `src/components/`, `src/lib/` | Implement ports. Gateways validate all external data with Zod. Hooks wire use cases to React. Components use Ant Design primitives and receive data as props. |
| **Infrastructure** | `src/pages/`, `src/layouts/` | Composition root. Mount React islands. Layouts are the HTML shell only, with no React or Ant Design. |

`src/components/` is organized by feature area (`docs/`, `home/`, `layout/`, `playground/`, `providers/`). `src/content/` holds fetched documentation and is generated, not authored.

### Key Patterns

- **Dependency injection**: Factory functions (preferred) or constructor injection. Never module-level mutable state, because it leaks between tests in the same file and makes failures order-dependent.
- **Gateways**: Factory functions accepting config and returning port implementations. Taking the base URL as a parameter rather than hardcoding it is what makes a gateway testable against MSW.
- **React islands**: Default to `client:only="react"` for any component using Ant Design. Ant Design's CSS-in-JS emits styles at render time, so a server-rendered island hydrates against markup whose styles do not yet exist and flashes unstyled content.
- **Never use `'use client'`**: it is a Next.js directive with no meaning in Astro. Hydration is controlled by the `client:*` directive on the mount point in the `.astro` page, so a `'use client'` line is silently inert and misleads the next reader into thinking the island is configured.
- **AntDProvider**: All React trees using Ant Design shall be wrapped in the `AntDProvider` at `src/components/providers/AntDProvider.tsx`, which supplies the theme tokens. An unwrapped tree renders with Ant Design defaults instead of the Analog Terminal palette.

## Testing Conventions

`.github/instructions/test.instructions.md` carries the full conventions and worked examples. The rules that most often get missed:

- Tests live in `tests/` mirroring the `src/` structure.
- Describe behavior, not implementation, and name `it` blocks as complete sentences, so a failure report reads as a statement of what broke.
- Generate fixtures with Chance.js rather than hardcoding values, and extract each generated value to a variable so it is never duplicated across arrange and assert.
- Mock HTTP with MSW only. Mocking `fetch` directly asserts on the call rather than the contract, so it keeps passing after the request shape changes.
- Reset MSW handlers between tests, because a handler left registered makes the next test pass for the wrong reason.
- Never export a function solely for testing. Inject the dependency through a parameter instead; a test-only export becomes part of the public API and outlives the test that needed it.
- Event listeners added in tests shall be removed in `try/finally` or `afterEach`. Cleanup placed after the assertions is skipped when an assertion fails, and the listener then leaks into every later test.
- Interactive UI (dialogs, overlays, drawers, keyboard shortcuts) shall have e2e tests covering open, close by every dismiss method, focus management, and keyboard navigation. Unit tests verify event dispatch; only a real browser shows whether focus actually moved.

## MCP Servers

Configured in `.vscode/mcp.json`:

- **context7** — library and API documentation. Use it for anything version-specific rather than recalling an API.
- **playwright** — the browser tools the Visual Debugging Protocol depends on (`browser_navigate`, `browser_take_screenshot`, `browser_snapshot`, `browser_resize`).
- **sequential-thinking** — structured decomposition for multi-step problems.
- **lousy-agents** — the ecosystem's own tooling.

For UI mockups and design work, reference the "Analog Terminal" design system in `DESIGN.md` for colors, typography, elevation, and component specifications.

## UI Implementation Checklist

Before writing CSS or implementing an interactive UI component, cross-reference `DESIGN.md`. This applies when creating components with custom styles or interactive behavior; it does not apply to business logic, data-fetching, or test changes.

1. **Surface tier**: Identify the component type (base, sectioning, card, floating) and use the matching surface token from §2. Depth in this system comes from tonal layering, not shadows.
2. **Floating panels**: Use `surface-container-highest` with `backdrop-filter: blur(8px–12px)` per the Glass & Gradient Rule (§2).
3. **Borders**: Use ghost borders — `outline-variant` at 15% opacity for card and panel edges (§4), widening to 20–30% for dividers and table headers where a tonal shift alone is insufficient (§2). What is prohibited is a high-contrast or full-opacity border for layout sectioning, not the 1px stroke itself.
4. **Shadows**: Ambient shadows use `on-background` at 6% opacity with a 40px blur (§4), and are reserved for elements that genuinely float.
5. **Inputs**: Use the monospace stack per §5 "Terminal Input". This applies to every input that accepts user text and is a non-negotiable brand signal, not a code-only convention.
6. **Contrast**: Text and placeholder colors shall meet WCAG 2.1 AA 4.5:1. On `surface` (`#121410`), `rgba(230, 234, 216, 0.58)` is the tested placeholder minimum after compositing.
7. **Focus rings**: `:focus-visible` outlines use `primary` (`#bdce89`) at 2px minimum, not `outline-variant`, which reaches only ~1.3–2.0:1 on dark surfaces and fails the 3:1 non-text contrast minimum.
8. **Visual verification**: Verify every item above via Playwright MCP screenshot, not code review. A `:focus-visible` rule that exists in the stylesheet but never renders — lost to specificity or an override — is visible only by triggering the state. See `.github/instructions/visual-verification.instructions.md`.

### Accessibility Requirements for Interactive UI

Any component that overlays or traps user attention (dialogs, modals, drawers, search overlays) shall implement all of the following. Each item is what stops a keyboard or screen-reader user from being stranded inside the overlay:

- `role="dialog"` with `aria-modal="true"` and an accessible name (`aria-label`, or `aria-labelledby` referencing a visible heading)
- A visible, focusable close button with an accessible name; use `aria-label` when the button is icon-only
- A tab focus trap within the dialog
- Active element saved on open and focus restored on close
- `inert` on background content while open, so assistive technology does not read through the overlay
- `:focus-visible` outlines meeting `DESIGN.md` §2 WCAG Compliance (3:1 against adjacent colors)
- Keyboard dismiss, Escape at minimum

## Dependencies

Pin all dependencies to exact versions, with no `^` or `~`. Renovate (`renovate.json`) proposes upgrades as reviewable pull requests, and a range defeats that by letting the installed tree drift without a diff. Search npm for the latest stable version before adding one, and run `npm audit` after any dependency change.

## CI Pipeline

`.github/workflows/ci.yml` runs six jobs. `lint` and `test` run first; `test-e2e` and `build` each wait on both; `status` aggregates all four into the single required check; `deploy` publishes to Cloudflare Workers, and is gated on `status` plus a push to `main` in this repository. `test-e2e` runs `npm run test:e2e:dist`, so e2e failures reflect the production build rather than the dev server. All third-party actions are pinned to exact commit SHAs and the Node version is read from `.nvmrc`.

## Spec-Driven Development

Feature specs live in `.github/specs/`, one markdown file per feature. The workflow:

1. Create an issue using the "Copilot Feature To Spec" template, which applies the `copilot-ready` label
2. A spec is generated with problem statement, personas, EARS acceptance criteria, and sequenced tasks
3. Implement tasks in order per spec

See `.github/instructions/spec.instructions.md` for the EARS syntax and the full spec structure.

## Boundaries

**Ask first:** adding a dependency, changing project structure, or modifying a GitHub Actions workflow. Each of these changes something the whole team inherits without review of the reasoning.

**Never:** skip the TDD workflow; use Jest (Vitest is the configured runner and Jest globals will not resolve); mock `fetch` directly; use a type assertion on external data; add a dependency without an exact version; use `'use client'`; write an empty `catch` block that swallows an error silently — always log or rethrow, because a silently swallowed failure surfaces later as corrupted state with no trace of its origin; or declare a UI task complete without visual verification via Playwright MCP screenshots.
