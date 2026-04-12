# Feature: Quickstart Section

## Problem Statement

New users visiting the Lousy Agents documentation site have no clear, guided entry point to get started quickly. They must navigate through individual command pages to piece together an initial workflow. A dedicated Quickstart section would reduce onboarding friction by providing a three-step guided path: scaffold a project, set up CI quality checks, and connect an AI assistant.

## Personas

| Persona | Impact | Notes |
| --- | --- | --- |
| New User | Positive | Gets a guided path to start using Lousy Agents immediately |
| Developer with AI experience | Positive | Quickly orients to the Lousy Agents workflow without reading every page |

## Value Assessment

- **Primary value**: Customer — increases retention by reducing the time to first success
- **Secondary value**: Market — attracts new users who expect a clear quickstart experience

## User Stories

### Story 1: Quickstart in sidebar navigation

As a **new user**,
I want **to see a "Quickstart" link in the docs sidebar navigation**,
so that I can **quickly find the guided getting-started content**.

#### Acceptance Criteria

- [x] When a user navigates to `/docs`, the sidebar shall display a "Quickstart" link after the "Overview" entry.
- [x] When a user clicks the "Quickstart" sidebar link, the system shall navigate to `/docs/quickstart`.
- [x] When a user is on the quickstart page, the sidebar shall highlight the "Quickstart" link as the active page.

### Story 2: Quickstart callout card on docs overview

As a **new user**,
I want **to see a brief Quickstart callout card at the top of the docs overview page**,
so that I can **discover the quickstart guide without needing to scan the sidebar**.

#### Acceptance Criteria

- [x] When a user navigates to the docs overview page (`/docs/readme`), the system shall display a callout card above the main content.
- [x] The callout card shall contain a brief description and a link to `/docs/quickstart`.
- [x] When a user clicks the callout card link, the system shall navigate to the quickstart page.

### Story 3: Quickstart page content

As a **new user**,
I want **to read a three-step guide to getting started with Lousy Agents**,
so that I can **scaffold a project, set up CI, and connect my AI assistant**.

#### Acceptance Criteria

- [x] When a user navigates to `/docs/quickstart`, the system shall display the quickstart guide content.
- [x] The quickstart page shall describe three steps: scaffold (init), CI quality (lint), and MCP server setup.
- [x] The quickstart page shall include code snippets for each step.

---

## Design

### Components Affected

- `src/content/local-docs/quickstart.md` — New quickstart content file
- `scripts/fetch-docs.sh` — Copy local docs into content directory
- `src/components/docs/DocsSidebar.tsx` — Add "quickstart" to navOrder
- `src/components/docs/QuickstartCallout.tsx` — New callout card component
- `src/components/docs/DocsLayoutShell.tsx` — Render callout on overview page
- `src/pages/llms-full.txt.ts` — Add "quickstart" to DOC_ORDER

### Data Flow

```
User navigates to /docs
        │
        ▼
/docs redirects to /docs/readme
        │
        ▼
[...slug].astro loads doc content + docEntries
        │
        ▼
DocsLayoutShell renders:
  ├─ DocsSidebar (includes Quickstart link)
  ├─ QuickstartCallout (only on readme page)
  └─ Main content (doc markdown)
```

### Sequence Diagram

```
User          Browser         Astro          DocsLayoutShell    DocsSidebar
 │               │              │                 │                │
 │──GET /docs───▶│              │                 │                │
 │               │──redirect──▶ │                 │                │
 │               │  /docs/readme│                 │                │
 │               │              │──load docs──────▶                │
 │               │              │  collection     │                │
 │               │              │◀─docEntries─────│                │
 │               │◀─HTML────────│                 │                │
 │               │              │                 │──render nav────▶
 │               │              │                 │  with quickstart│
 │               │              │                 │◀─sidebar HTML──│
 │               │              │                 │                │
 │◀──page────────│              │                 │                │
 │  (with callout + sidebar)    │                 │                │
```

### Dependencies

- No new external dependencies required

### Open Questions

- None

---

## Tasks

### Task 1: Create quickstart content and build integration

**Objective**: Create the quickstart markdown file and ensure it is included in the docs content collection at build time.

**Context**: The docs content is fetched from the upstream lousy-agents repo. Local docs need a separate source directory and a build step to merge them.

**Affected files**:
- `src/content/local-docs/quickstart.md`
- `scripts/fetch-docs.sh`

**Requirements**:
- Quickstart content with three steps: init, lint, MCP server
- Frontmatter with title and description
- Build script copies local docs into content directory

**Verification**:
- [x] `scripts/fetch-docs.sh` copies local docs successfully
- [x] `npm run build` succeeds with quickstart page

**Done when**:
- [x] Quickstart page is accessible at `/docs/quickstart`

---

### Task 2: Add quickstart to navigation order

**Depends on**: Task 1

**Objective**: Add "quickstart" to the sidebar navigation order so it appears after "Overview".

**Affected files**:
- `src/components/docs/DocsSidebar.tsx`
- `src/pages/llms-full.txt.ts`

**Requirements**:
- "quickstart" appears second in navOrder (after "readme")
- "quickstart" appears second in DOC_ORDER (after "readme")

**Verification**:
- [x] Unit tests pass for DocsSidebar
- [x] Sidebar shows "Quickstart" link in correct position

**Done when**:
- [x] Quickstart link appears in sidebar after Overview

---

### Task 3: Create QuickstartCallout component

**Depends on**: Task 1

**Objective**: Create a callout card component that appears on the docs overview page linking to the quickstart guide.

**Affected files**:
- `src/components/docs/QuickstartCallout.tsx`
- `src/components/docs/DocsLayoutShell.tsx`
- `tests/components/docs/QuickstartCallout.test.tsx`

**Requirements**:
- Callout renders only on the readme/overview page
- Contains brief description and link to /docs/quickstart
- Styled per Analog Terminal design system

**Verification**:
- [x] Unit tests pass for QuickstartCallout
- [x] Callout visible on /docs/readme page
- [x] Callout not visible on other doc pages

**Done when**:
- [x] QuickstartCallout renders on overview page with link to quickstart

---

### Task 4: Add e2e test and final validation

**Depends on**: Tasks 1, 2, 3

**Objective**: Add e2e test coverage for quickstart navigation and run full validation.

**Affected files**:
- `tests/e2e/docs-navigation.spec.ts`

**Verification**:
- [x] `npx biome check` passes
- [x] `npm test` passes
- [x] `npm run build` succeeds

**Done when**:
- [x] All validation passes
- [x] E2e test verifies quickstart sidebar navigation

---

## Out of Scope

- Interactive tutorials or step-by-step wizards
- Video content
- Changes to upstream lousy-agents docs content

## Future Considerations

- Add a "Getting Started" section grouping in the sidebar for quickstart + related pages
- Add progress tracking for quickstart steps
- Create framework-specific quickstart variants (React, Node, etc.)
