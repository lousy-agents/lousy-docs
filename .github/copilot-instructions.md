---
applyTo: "**"
---

# Astro TDD Application

An Astro TypeScript static site following Test-Driven Development, Clean Architecture, and strict validation workflows.

This file is loaded for every file in the repository, so it carries the standards that apply everywhere. Deeper detail lives in path-scoped files that load when you touch the code they govern: `.github/instructions/software-architecture.instructions.md` for layering, `.github/instructions/test.instructions.md` for test conventions, `.github/instructions/visual-verification.instructions.md` for UI changes, and `.github/instructions/pipeline.instructions.md` for workflows.

## Commands

Run `nvm use` before any npm command, because the toolchain is pinned by `.nvmrc` and a mismatched Node version produces failures that look like dependency bugs. While iterating, use the file-scoped forms for faster feedback; run the full validation suite before commits.

```bash
# ALWAYS run first
nvm use

# Core commands
npm install              # Install deps (updates package-lock.json)
npm test                 # Run unit tests (vitest)
npm run build            # Production build
npx biome check          # Lint check
npx biome check --write  # Auto-fix lint/format (alias: npm run lint:fix)

# E2E tests
npm run test:e2e         # Playwright e2e tests
npm run test:e2e:dist    # E2e tests against production build
npm run test:e2e:ui      # Playwright UI mode (interactive dev)

# File-scoped (faster feedback)
npx biome check path/to/file.ts
npm test path/to/file.test.ts

# Validation suite (run before commits)
npx biome check && npm test && npm run build

# Other
npm audit                # Security check
npm run lint:workflows   # Validate GitHub Actions (actionlint)
npm run lint:yaml        # Validate YAML (yamllint)
```

`npm run dev` and `npm run build` both run `scripts/fetch-docs.sh` first, which clones documentation from the `zpratt/lousy-agents` repository into `src/content/docs`. That directory is generated, so edits to it are discarded on the next build. Set `DOCS_GITHUB_TOKEN` for authenticated fetches and `DOCS_REF=<tag|branch>` to pin a reproducible revision.

## Workflow: TDD Required

Follow this exact sequence for all code changes, working in small increments and validating before proceeding. Steps 2 and 3 are ordered so that a test failure proves the test can fail, which is the only evidence that it tests anything.

1. **Research**: Search codebase for existing patterns, components, utilities. Use Context7 MCP tools for library/API documentation, because pinned versions here move faster than model knowledge.
2. **Write failing test**: Create test describing desired behavior
3. **Verify failure**: Run `npm test` — confirm clear failure message
4. **Implement minimal code**: Write just enough to pass
5. **Verify pass**: Run `npm test` — confirm pass
6. **Refactor**: Clean up, remove duplication, keep tests green
7. **Validate**: `npx biome check && npm test && npm run build`

A task is not complete until all validation passes. For UI-layer changes, `.github/instructions/visual-verification.instructions.md` adds mandatory screenshot steps between 5 and 6.

## Tech Stack

- **Framework**: Astro (with React islands) — follow Astro conventions
- **Language**: TypeScript (strict mode)
- **Validation**: Zod for runtime validation of external data
- **Testing**: Vitest (never Jest — Vitest is the configured runner and Jest globals will not resolve), MSW for HTTP mocking, Chance.js for test fixtures
- **Linting**: Biome, which covers both lint and format. Do not add ESLint or Prettier separately; two formatters with different opinions fight on every save.
- **HTTP**: fetch API only
- **Architecture**: Clean Architecture principles

## Project Structure

Source is layered by Clean Architecture, innermost first: `src/entities/`, `src/use-cases/`, then the adapters (`src/gateways/`, `src/hooks/`, `src/components/`, `src/lib/`), then infrastructure (`src/pages/`, `src/layouts/`). `src/styles/` holds global CSS and `src/content/` holds fetched documentation, which is generated rather than authored. Tests live in `tests/`, mirroring the `src/` structure. `.github/instructions/software-architecture.instructions.md` carries the full directory map and the import matrix.

## Code Style

```typescript
import { z } from 'zod';

// Define schema for runtime validation
const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
});

type User = z.infer<typeof UserSchema>;

// ✅ Good - small, typed, single purpose, descriptive names, runtime validation
async function fetchUserById(userId: string): Promise<User> {
  if (!userId) {
    throw new Error('User ID required');
  }

  const response = await fetch(`/api/users/${userId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`);
  }

  const data: unknown = await response.json();
  return UserSchema.parse(data);
}

// ❌ Bad - untyped, type assertion on external data, no validation, multiple responsibilities, impure (side effects: global state mutation)
async function doStuff(x) {
  console.log('fetching');
  globalState.loading = true;
  const response = await fetch('/api/users/' + x);
  return response.json() as User;
}
```

**Rules:**
- Always use TypeScript type hints
- Use descriptive names for variables, functions, and modules
- Functions must be small and have single responsibility
- Avoid god functions and classes — break into smaller, focused units
- Avoid repetitive code — extract reusable functions
- Extract functions when there are multiple code paths
- Favor immutability and pure functions
- Avoid temporal coupling, so that a caller cannot break the code by reordering two calls that look independent
- Keep cyclomatic complexity low
- Remove all unused imports and variables
- Validate external data at runtime with Zod — never use a type assertion (`as Type`) on an API response, because an assertion silences the compiler without checking anything, so malformed data reaches the UI as a runtime crash instead of a caught validation error
- Always check `response.ok` when using fetch, because `fetch` rejects only on network failure and resolves normally on a 404 or 500
- Never use an empty `catch` block that swallows an error silently — always log or rethrow, because a swallowed failure surfaces later as corrupted state with no trace of its origin
- Run lint and tests after every change

## Testing Standards

Tests are executable documentation. Use the Arrange-Act-Assert pattern, mock HTTP with MSW, and generate fixtures with Chance.js. `.github/instructions/test.instructions.md` carries the worked examples and the full rule set; it loads whenever you edit a test file. The rules that matter everywhere:

- Describe behavior, not implementation. Name `it` blocks as specifications that read as complete sentences, so a failure report states what broke.
- Use Chance.js to generate fixtures and extract each generated value to a variable, so it is never duplicated across arrange and assert.
- Use Vitest, never Jest.
- Mock HTTP with MSW, never `fetch` directly. A direct `fetch` mock asserts on the call rather than the contract, so it keeps passing after the request shape changes.
- Reset MSW handlers between tests, because a handler left registered makes the next test pass for the wrong reason.
- Tests must be deterministic and isolated — same result every run, no shared state.
- Test happy paths, unhappy paths, and edge cases; every conditional path needs a meaningful assertion.
- Never modify a test to make it pass without understanding the root cause. A test changed to match broken behavior removes the signal that something regressed.

## Dependencies

- Use latest LTS Node.js — check with `nvm ls-remote --lts`, update `.nvmrc`
- Pin all dependencies to exact versions, with no `^` or `~`. Renovate (`renovate.json`) proposes upgrades as reviewable pull requests, and a range defeats that by letting the installed tree drift without a diff.
- Search npm for latest stable version before adding
- Run `npm audit` after any dependency change
- Ensure `package-lock.json` is updated correctly

## Secrets and Environment Variables

This is a fully static site with no server at runtime, so anything the browser needs is in the shipped bundle. Astro inlines every `import.meta.env.PUBLIC_*` value at build time: `PUBLIC_CF_BEACON_TOKEN` and `PUBLIC_GOOGLE_SITE_VERIFICATION_TOKEN` are public by design. Never put a credential behind a `PUBLIC_` prefix, and never read a non-public secret from client code. Build-time-only values such as `DOCS_GITHUB_TOKEN` stay out of the bundle because only `scripts/fetch-docs.sh` reads them.

## GitHub Actions

- Validation must be automated via GitHub Actions and runnable locally the same way, so that a green local run predicts a green CI run
- Validate all workflows using actionlint
- Validate all YAML files using yamllint
- Pin all third-party actions to an exact commit SHA with a version comment. A tag is mutable and can be repointed at new code, so a SHA is what makes the build reproducible and resistant to a compromised upstream release.
- Keep all third-party actions updated to latest version

## Boundaries

**Always do:**
- Run `nvm use` before any npm command
- Write tests before implementation (TDD)
- Run lint and tests after every change
- Run full validation before commits
- Use existing patterns from the codebase
- Work in small increments
- Use Context7 MCP tools for code generation and documentation

**Ask first** — each of these changes something the whole team inherits without review of the reasoning:
- Adding new dependencies
- Changing project structure
- Modifying GitHub Actions workflows

**Never do:**
- Skip the TDD workflow
- Store secrets in code, or expose one through a `PUBLIC_` environment variable
- Use Jest (use Vitest)
- Mock fetch directly (use MSW)
- Modify tests to pass without fixing root cause
- Add dependencies without explicit version numbers
- Use type assertions (`as Type`) on external/API data
- Use the `'use client'` directive — it is a Next.js directive with no meaning in Astro, so it is silently inert and misleads the next reader into thinking the island is configured
