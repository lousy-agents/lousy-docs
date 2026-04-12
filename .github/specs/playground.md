# Feature: Lint Playground

## Problem Statement

Developers exploring the Lousy Agents ecosystem have no interactive way to test skill linting without installing the CLI locally. A browser-based lint playground would let users paste skill markdown, run the linter, and see diagnostics instantly — lowering the barrier to understanding how skill frontmatter validation works and accelerating adoption.

## Personas

| Persona | Impact | Notes |
| --- | --- | --- |
| New User | Positive | Can try skill linting without installing the CLI |
| Developer with AI experience | Positive | Quick feedback loop for iterating on skill definitions |

## Value Assessment

- **Primary value**: Customer — reduces time-to-understanding for skill authoring conventions
- **Secondary value**: Market — interactive playground differentiates from static documentation

## User Stories

### Story 1: Playground navigation link

As a **developer**,
I want **to see a "Playground" link in the site navigation**,
so that I can **discover and access the interactive lint playground**.

#### Acceptance Criteria

- [x] When a user views the site header, the navigation shall display a "Playground" link.
- [x] When a user clicks the "Playground" link, the system shall navigate to `/playground`.
- [x] While a user is on `/playground`, the navigation shall mark the "Playground" link as active.
- [x] When a user opens the mobile navigation drawer, the drawer shall include a "Playground" link.

### Story 2: Lint playground empty state

As a **developer**,
I want **to see an empty playground with a skill markdown editor and clear instructions**,
so that I can **understand how to use the lint feature before pasting content**.

#### Acceptance Criteria

- [x] When a user navigates to `/playground`, the system shall display a text editor area for skill markdown input.
- [x] While the editor is empty, the system shall display placeholder text explaining the expected input format.
- [x] When a user views the playground, the system shall display a "Run Lint" button.
- [x] While no lint has been run, the system shall display an empty results area.

### Story 3: Running skill lint and viewing diagnostics

As a **developer**,
I want **to paste skill markdown and run the linter to see diagnostic results**,
so that I can **validate my skill frontmatter without installing the CLI**.

#### Acceptance Criteria

- [x] When a user pastes skill markdown and clicks "Run Lint", the system shall parse the frontmatter and display lint diagnostics.
- [x] When lint produces errors, the system shall display each error with severity, message, and line number.
- [x] When lint produces warnings, the system shall display each warning with severity, message, and line number.
- [x] When lint produces no diagnostics, the system shall display a success message.
- [x] When lint encounters invalid YAML frontmatter, the system shall display an appropriate error diagnostic.
- [x] The lint results shall display a summary with total files, errors, and warnings counts.

---

## Design

### Components Affected

- `src/components/layout/SiteHeader.tsx` — Add "Playground" to navLinks
- `src/components/layout/MobileNavDrawer.tsx` — Add "Playground" to navLinks
- `src/entities/skill-lint.ts` — Browser-compatible skill lint entities (frontmatter schema, validation)
- `src/use-cases/lint-skill-content.ts` — Use case for linting skill markdown content from text
- `src/gateways/skill-content-lint-gateway.ts` — Browser-compatible gateway for parsing frontmatter from text
- `src/components/playground/PlaygroundPage.tsx` — Main playground page component
- `src/components/playground/SkillEditor.tsx` — Textarea/editor component for skill markdown
- `src/components/playground/LintResults.tsx` — Diagnostic results display component
- `src/pages/playground.astro` — Astro page mounting the playground island

### Dependencies

- `zod` — Already in project, used for frontmatter schema validation
- `yaml` — Needed for YAML frontmatter parsing in browser (new dependency)

### Data Flow

```
User pastes skill markdown into editor
        │
        ▼
User clicks "Run Lint"
        │
        ▼
PlaygroundPage passes content to lint use case
        │
        ▼
Gateway parses YAML frontmatter from text
        │
        ▼
Use case validates frontmatter against Zod schema
        │
        ▼
Diagnostics returned to PlaygroundPage
        │
        ▼
LintResults renders diagnostics with severity icons
```

### Sequence Diagram

```
┌──────────┐     ┌─────────────┐     ┌──────────────────┐     ┌──────────────┐
│   User   │     │ Playground  │     │ LintSkillContent │     │   Gateway    │
│          │     │   Page      │     │    UseCase       │     │  (browser)   │
└────┬─────┘     └──────┬──────┘     └────────┬─────────┘     └──────┬───────┘
     │   paste markdown  │                     │                      │
     │──────────────────>│                     │                      │
     │                   │                     │                      │
     │   click Run Lint  │                     │                      │
     │──────────────────>│                     │                      │
     │                   │   execute(content)  │                      │
     │                   │────────────────────>│                      │
     │                   │                     │  parseFrontmatter()  │
     │                   │                     │─────────────────────>│
     │                   │                     │   ParsedFrontmatter  │
     │                   │                     │<─────────────────────│
     │                   │                     │                      │
     │                   │                     │  validate w/ Zod     │
     │                   │                     │──────┐               │
     │                   │                     │      │               │
     │                   │                     │<─────┘               │
     │                   │   LintOutput        │                      │
     │                   │<────────────────────│                      │
     │  render results   │                     │                      │
     │<──────────────────│                     │                      │
     │                   │                     │                      │
```

### Open Questions

- None — all required lint logic can be extracted from `@lousy-agents/core` entities and use cases.

---

## Tasks

> Each task should be completable in a single coding agent session.
> Tasks are sequenced by dependency. Complete in order unless noted.

### Task 1: Add Playground navigation link

**Objective**: Add "Playground" to the site header and mobile drawer navigation.

**Context**: The nav links are defined as arrays in SiteHeader.tsx and MobileNavDrawer.tsx.

**Affected files**:
- `src/components/layout/SiteHeader.tsx`
- `src/components/layout/MobileNavDrawer.tsx`
- `tests/components/layout/SiteHeader.test.tsx`
- `tests/components/layout/MobileNavDrawer.test.tsx`

**Requirements**:
- When a user views the site header, the navigation shall display a "Playground" link.
- When a user clicks the "Playground" link, the system shall navigate to `/playground`.
- While a user is on `/playground`, the navigation shall mark the "Playground" link as active.
- When a user opens the mobile navigation drawer, the drawer shall include a "Playground" link.

**Verification**:
- [x] `npm test` passes
- [x] `npx biome check` passes
- [x] Playground link appears in both desktop and mobile navigation

**Done when**:
- [x] All verification steps pass
- [x] No new errors in affected files

---

### Task 2: Create browser-compatible skill lint entities and use case

**Objective**: Create entity types and a use case for linting skill markdown content in the browser.

**Context**: The `@lousy-agents/core` package uses Node.js filesystem APIs. We need browser-compatible equivalents that work with text content directly.

**Affected files**:
- `src/entities/skill-lint.ts`
- `src/use-cases/lint-skill-content.ts`
- `src/gateways/skill-content-lint-gateway.ts`
- `tests/entities/skill-lint.test.ts`
- `tests/use-cases/lint-skill-content.test.ts`
- `tests/gateways/skill-content-lint-gateway.test.ts`

**Requirements**:
- When lint produces errors, the system shall display each error with severity, message, and line number.
- When lint produces warnings, the system shall display each warning with severity, message, and line number.
- When lint encounters invalid YAML frontmatter, the system shall display an appropriate error diagnostic.

**Verification**:
- [x] `npm test` passes
- [x] `npx biome check` passes
- [x] Unit tests cover valid frontmatter, missing fields, invalid YAML, and edge cases

**Done when**:
- [x] All verification steps pass
- [x] No new errors in affected files

---

### Task 3: Create PlaygroundPage component with editor and results

**Objective**: Build the interactive playground page with a skill markdown editor, Run Lint button, and diagnostic results.

**Context**: The page follows the same pattern as HomePage — a React island mounted via Astro.

**Affected files**:
- `src/components/playground/PlaygroundPage.tsx`
- `src/components/playground/SkillEditor.tsx`
- `src/components/playground/LintResults.tsx`
- `src/pages/playground.astro`
- `tests/components/playground/PlaygroundPage.test.tsx`
- `tests/components/playground/SkillEditor.test.tsx`
- `tests/components/playground/LintResults.test.tsx`

**Requirements**:
- When a user navigates to `/playground`, the system shall display a text editor area.
- While the editor is empty, the system shall display placeholder text.
- When a user pastes skill markdown and clicks "Run Lint", the system shall display diagnostics.
- When lint produces no diagnostics, the system shall display a success message.
- The lint results shall display a summary with total files, errors, and warnings counts.

**Verification**:
- [x] `npm test` passes
- [x] `npx biome check` passes
- [x] `npm run build` succeeds
- [x] Visual verification of empty state and results state

**Done when**:
- [x] All verification steps pass
- [x] No new errors in affected files

---

## Out of Scope

- Agent, hook, and instruction linting (only skill linting for this phase)
- File upload support (paste-only for this phase)
- Syntax highlighting in the editor
- Persisting editor content across page loads

## Future Considerations

- Add agent frontmatter linting
- Add instruction quality analysis
- Add file upload for linting
- Add syntax-highlighted editor (CodeMirror or Monaco)
- Add shareable playground URLs with encoded content
