# Feature: Homepage Markets Only Fully Documented Features

## Problem Statement

The current homepage markets capabilities that do not exist in the published Lousy Agents toolchain. It invents a "Multi-Agent Control Protocol" (MCP is actually the Model Context Protocol), describes Agent Shell as a sandboxed runtime (it is an audit-trail wrapper around npm's `script-shell`), and presents a fabricated three-pillar "Spec-Driven Development" workflow (`Define the Spec → Mock the World → Atomic Deploy`) along with a `--break-loop` CLI flag that does not exist. This misleads agentic software engineers evaluating the project, undermines trust, and forces the docs site to advertise jargon it cannot back up with reference documentation. The homepage must be reworked to advertise only features that are fully documented in either the upstream `zpratt/lousy-agents/docs/` or the local `src/content/local-docs/` content.

## Personas

| Persona | Impact | Notes |
| --- | --- | --- |
| Agentic Software Engineer (primary) | Positive | Sees an accurate, scannable list of capabilities they can immediately verify in the docs and adopt in their workflow |
| Team Lead evaluating tooling | Positive | Can trust the marketing claims map 1:1 to documented behavior, reducing risk of recommending the tool internally |
| Documentation Maintainer | Positive | Removes drift between marketing copy and reference docs; future doc additions become the single source of truth for homepage claims |
| Lousy Agents Maintainers | Positive | Reduces support burden caused by users looking for advertised but non-existent features (`--break-loop`, "atomic deploy", etc.) |

## Value Assessment

- **Primary value**: Customer — increases trust and retention by making homepage claims verifiable in the linked documentation, which is critical for an audience of agentic engineers who validate everything they read.
- **Secondary value**: Market — removes jargon that obscures what the project actually does, making it easier for new visitors to understand the value proposition and convert into users.
- **Tertiary value**: Future — establishes a "documented or not on the homepage" rule that prevents future copy drift and reduces ongoing maintenance cost.

## Documented Feature Inventory

The following are the only features the homepage may market. Each must link to an existing docs page that describes it, preferring the dedicated per-feature route and using `/docs/quickstart` only as a fallback when no standalone page exists.

| Feature | npm package / surface | Docs source | Homepage doc link |
| --- | --- | --- | --- |
| Project scaffolding (`init`) | `@lousy-agents/cli` | `zpratt/lousy-agents/docs/init.md` | `/docs/init` (fallback: `/docs/quickstart`) |
| Resource generators (`new --copilot-agent`, `new skill`) | `@lousy-agents/cli` | `zpratt/lousy-agents/docs/new.md` | `/docs/new` |
| Quality validation (`lint`) | `@lousy-agents/cli` | `zpratt/lousy-agents/docs/lint.md` | `/docs/lint` (fallback: `/docs/quickstart`) |
| Copilot environment workflow (`copilot-setup`) | `@lousy-agents/cli` | `zpratt/lousy-agents/docs/copilot-setup.md` | `/docs/copilot-setup` |
| MCP server (Model Context Protocol) | `@lousy-agents/mcp` | `zpratt/lousy-agents/docs/mcp-server.md` | `/docs/mcp-server` (fallback: `/docs/quickstart`) |
| Agent Shell audit trail | `@lousy-agents/agent-shell` | `packages/agent-shell/README.md` (copied by `scripts/fetch-docs.sh`) | `/docs/agent-shell` |

Anything not in the table above is out of scope for the homepage until it has a published docs page.

## User Stories

### Story 1: Hero accurately summarizes the documented value proposition

As an **agentic software engineer landing on the homepage**,
I want **the hero headline and subhead to describe what Lousy Agents actually does**,
so that I can **decide in under 10 seconds whether to read further**.

#### Acceptance Criteria

- [ ] The `HeroSection` shall describe Lousy Agents as a CLI that scaffolds, validates, and connects AI agent configurations through documented commands.
- [ ] When the hero subhead references a capability, the homepage shall link to a docs page that documents that capability.
- [ ] If a capability mentioned in the hero is not documented, then the homepage shall not reference it.
- [ ] The terminal mock in the hero shall display only commands that exist in the documented CLI surface (e.g. `npx @lousy-agents/cli@latest init`).
- [ ] The hero shall not display a hardcoded version string for the CLI (e.g. `agent_v2.0.1`); if a version label is shown it shall use a neutral placeholder such as `cli` or `lousy-agents`.

### Story 2: Feature cards reflect only documented features

As an **agentic software engineer scanning the homepage features**,
I want **each feature card to describe a real, documented capability with a working "Learn more" link**,
so that I can **drill into the docs to verify each claim before adopting the tool**.

#### Acceptance Criteria

- [ ] The features section shall render exactly one card per documented feature listed in the Documented Feature Inventory table.
- [ ] Each feature card shall use the documented feature's name (e.g. `init`, `lint`, `MCP Server`, `Agent Shell`) rather than invented module names (`CLI Engine`, `Smart Linting`).
- [ ] Each feature card description shall paraphrase language from the corresponding docs page and shall not introduce capabilities not described in that page.
- [ ] The MCP Server card shall expand `MCP` as `Model Context Protocol`, not `Multi-Agent Control Protocol`.
- [ ] The Agent Shell card shall describe it as an audit-trail wrapper around npm's `script-shell` (matching `src/content/local-docs/readme.md`), not a sandboxed runtime.
- [ ] Each feature card shall include a link to the docs page for that feature; the link shall resolve to a 200 page in the built site.
- [ ] If a feature's docs page is not yet present in the local content collection, then the feature shall be omitted from the homepage rather than linking to a 404.
- [ ] Feature cards shall not display fabricated version labels (e.g. `v2.0.1 // system.bin`); version metadata, if shown, shall be derived from real package metadata or omitted.

### Story 3: Remove fabricated "Spec-Driven Development" pillars section

As an **agentic software engineer evaluating the project**,
I want **the homepage to stop advertising a three-step Spec-Driven workflow that does not exist in the toolchain**,
so that I can **trust the homepage to reflect the actual product surface**.

#### Acceptance Criteria

- [ ] The current `SpecDrivenSection` ("Define the Spec / Mock the World / Atomic Deploy") shall be removed from the homepage.
- [ ] If a workflow narrative is retained on the homepage, then it shall be replaced with the documented three-step Quickstart flow (`init` → `lint` in CI → MCP Server) sourced from `src/content/local-docs/quickstart.md`.
- [ ] Where a Quickstart narrative is rendered, the system shall include a primary CTA linking to `/docs/quickstart`.
- [ ] The homepage shall not reference a built-in "mocking engine", "atomic deploy", or "Protocol" compliance enforcement, because none of these are documented features.

### Story 4: Remove fabricated "Developer Patch" tip

As a **trust-sensitive evaluator**,
I want **the homepage to not invent CLI flags or fictional history**,
so that I am **not misled into searching for features that do not exist**.

#### Acceptance Criteria

- [ ] The current `DeveloperPatch` section referencing the fictional `--break-loop` flag and "'79 simulation" shall be removed from the homepage.
- [ ] If the homepage retains a tip / callout slot in that position, then it shall reference only documented commands or be replaced with a documented call-to-action (e.g. linking to the Quickstart or the GitHub repository).

### Story 5: All homepage links resolve to documented pages

As a **visitor exploring the site**,
I want **every CTA and learn-more link on the homepage to resolve to a real, indexed docs page**,
so that I do **not encounter dead ends**.

#### Acceptance Criteria

- [ ] The system shall not render any homepage link that points to a route without a corresponding entry in the docs content collection or a static page in `src/pages`.
- [ ] When a referenced docs page is not yet available locally, the system shall either omit the link or point at the closest documented equivalent (e.g. `/docs/quickstart`).
- [ ] If a homepage link is added in code without a matching docs page, then the unit test suite shall fail with a message identifying the missing page.

### Story 6: Homepage copy is grounded in documentation, not jargon

As an **agentic software engineer**,
I want **homepage copy to use the same vocabulary as the docs**,
so that I can **search the docs for any term I see on the homepage and find a match**.

#### Acceptance Criteria

- [ ] The homepage shall not introduce coined terms ("cognitive workloads", "operational perimeter", "hallucination loops", "feedback loop", "logic feedback loop") that are not present in the docs content collection.
- [ ] Where the homepage names a capability, it shall use the same term as the corresponding docs page heading (e.g. `lint`, not `Smart Linting`).
- [ ] Where shipped, the homepage shall pass a documentation-vocabulary check (Task 6) that fails the build if a card title or feature term is not found in the docs content collection.

---

## Design

> Refer to `.github/copilot-instructions.md`, `DESIGN.md`, and `.github/instructions/visual-verification.instructions.md` for technical and visual standards.

### Components Affected

- `src/components/home/HeroSection.tsx` — Replace marketing claims with documented capability summary; remove `agent_v2.0.1` label; ensure terminal mock uses the documented `npx @lousy-agents/cli@latest init` command and accurate output.
- `src/components/home/CoreModulesSection.tsx` — Replace the four invented modules with documented features from the inventory (`init`, `lint`, `MCP Server`, `Agent Shell`, optionally `new` and `copilot-setup`); add learn-more link per card; remove `accentColor` per fictional "version" string label or replace with neutral metadata.
- `src/components/home/SpecDrivenSection.tsx` — **Delete** (and remove its mount from `HomePage.tsx`) **or** rewrite as a `QuickstartFlowSection` rendering the three documented Quickstart steps with a CTA to `/docs/quickstart`. Decision recorded in Open Questions.
- `src/components/home/DeveloperPatch.tsx` — **Delete** (and remove its mount from `HomePage.tsx`).
- `src/components/home/HomePage.tsx` — Update the section composition to reflect the new component set; preserve `AntDProvider`, `SiteHeader`, `SiteFooter`, `MobileNavDrawer` wiring; preserve the `client:only="react"` mount in `src/pages/index.astro`.
- `src/lib/documented-features.ts` *(new)* — Single source of truth for the homepage feature list. Exports a typed array of `{ id, title, description, docsHref, available }` and a `getAvailableFeatures(docs)` selector that filters by content collection presence. Validated with Zod.
- `tests/components/home/HeroSection.test.tsx` — Update assertions to match new copy and links.
- `tests/components/home/CoreModulesSection.test.tsx` — Replace assertions to match documented-feature cards; add tests for: link presence per card, MCP expansion, no fabricated version labels, no fictional terms.
- `tests/components/home/SpecDrivenSection.test.tsx` — Delete (or rewrite as `QuickstartFlowSection.test.tsx`).
- `tests/components/home/DeveloperPatch.test.tsx` — Delete.
- `tests/components/home/HomePage.test.tsx` — Update to assert removed sections are not rendered and new section composition is correct.
- `tests/lib/documented-features.test.ts` *(new)* — Validate the selector against fixture content collections and assert that the inventory matches the docs collection.
- `tests/e2e/homepage.spec.ts` *(new or extended)* — Smoke test that every homepage link resolves (status 200) when running against the built site (`npm run test:e2e:dist`).

### Dependencies

- No new runtime dependencies. Reuses Astro 6, React 19, Ant Design 6, Zod, Vitest, Playwright already in `package.json`.
- Continues to follow the Analog Terminal design system in `DESIGN.md` (surface tiers, ghost borders at 15%, monospace input, ambient shadows at 6%, WCAG 2.1 AA contrast).

### Data Model

A new typed inventory module describes the homepage feature list and its docs binding:

```ts
// src/lib/documented-features.ts
import { z } from 'zod';

export const FeatureSchema = z.object({
    id: z.string(),                    // 'init' | 'lint' | 'mcp-server' | 'agent-shell' | ...
    title: z.string(),                 // Human label shown on the card
    summary: z.string(),               // 1–2 sentence paraphrase of the docs page
    docsHref: z.string(),              // '/docs/quickstart', '/docs/lint', etc.
    requiresContentSlug: z.string(),   // slug that must be present in content collection
});

export type Feature = z.infer<typeof FeatureSchema>;
```

Selector:

```ts
export function selectAvailableFeatures(
    inventory: readonly Feature[],
    availableSlugs: ReadonlySet<string>,
): Feature[];
```

Used by `CoreModulesSection` and (if retained) `QuickstartFlowSection` so a feature only renders when its docs slug is present in the content collection — implementing the "documented or omitted" rule.

### Data Flow Diagram

```
                         ┌───────────────────────────────────┐
                         │ src/content/local-docs/*.md       │
                         │ src/content/docs/*.md (fetched)   │
                         └────────────────┬──────────────────┘
                                          │ getCollection('docs') at build time
                                          ▼
       ┌──────────────────────────────────────────────────────────┐
       │ index.astro (build-time Astro page)                      │
       │ - reads docs collection                                  │
       │ - passes availableSlugs as prop into <HomePage/>         │
       └────────────────┬─────────────────────────────────────────┘
                        │ availableSlugs
                        ▼
       ┌──────────────────────────────────────────────────────────┐
       │ HomePage.tsx (client:only react island)                  │
       │ - composes Hero, CoreModules, (Quickstart?), Footer      │
       └─┬───────────────────┬───────────────────┬────────────────┘
         │                   │                   │
         ▼                   ▼                   ▼
   ┌───────────┐    ┌───────────────────┐   ┌─────────────────────┐
   │ HeroSect. │    │ CoreModulesSection│   │ QuickstartFlowSect. │
   │ static    │    │ uses selector:    │   │ uses 3 quickstart   │
   │ copy +    │    │  inventory ∩      │   │ steps, links to     │
   │ doc links │    │  availableSlugs   │   │ /docs/quickstart    │
   └───────────┘    └─────────┬─────────┘   └─────────────────────┘
                              │
                              ▼
                  ┌────────────────────────┐
                  │ src/lib/documented-    │
                  │ features.ts (Zod)      │
                  │ - FeatureSchema        │
                  │ - selectAvailable…     │
                  └────────────────────────┘
```

The inventory module is the only place where homepage feature copy lives. The selector enforces the invariant that no feature renders without a docs page backing it.

### Sequence Diagram

```
Visitor          Astro build           HomePage (island)        Selector              Doc link click
   │                  │                      │                     │                       │
   │── GET / ────────▶│                      │                     │                       │
   │                  │── getCollection ────▶│                     │                       │
   │                  │   ('docs')           │                     │                       │
   │                  │◀──availableSlugs─────│                     │                       │
   │                  │── render island ────▶│                     │                       │
   │                  │   props={slugs}      │                     │                       │
   │                  │                      │── selectAvailable ─▶│                       │
   │                  │                      │   Features          │                       │
   │                  │                      │◀── Feature[] ───────│                       │
   │                  │                      │                     │                       │
   │                  │                      │ render Hero +       │                       │
   │                  │                      │ filtered Core cards │                       │
   │                  │                      │ + Quickstart flow   │                       │
   │◀── HTML ─────────│                      │                     │                       │
   │                                                                                       │
   │── click "Learn more" on lint card ──────────────────────────────────────────────────▶│
   │                                                                       Astro serves    │
   │                                                                       /docs/lint      │
   │◀──────────────────────── docs page (200) ────────────────────────────────────────────│
```

If a card's docs slug is not present in the collection, the selector returns an inventory subset that excludes it — guaranteeing the click flow above never resolves to a 404.

### Open Questions

- [ ] **OQ-1 (product):** Should we keep a "workflow narrative" section after deleting `SpecDrivenSection`, or is the documented Quickstart flow already represented well enough by the feature cards alone? *Recommendation: keep a `QuickstartFlowSection` rendering the three documented Quickstart steps because it preserves the visual rhythm of the page and gives a strong CTA to `/docs/quickstart`. Confirm before Task 4.*
- [ ] **OQ-2 (product):** Do we want to retain the mascot "Developer Patch" callout card visually but with documented content (e.g. a "Pro tip: run `lint` in CI" pointing to `/docs/quickstart#2-enforce-quality-in-ci-lint`), or remove that visual element entirely? *Recommendation: remove for now; reintroduce only if/when there is a documented tip with a stable anchor.*
- [ ] **OQ-3 (engineering):** Should the inventory live in `src/lib/` (used by Astro build) or `src/entities/` (per Clean Architecture rules in `.github/instructions/software-architecture.instructions.md`)? *Recommendation: place schema + types in `src/entities/feature.ts`, place the selector in `src/use-cases/select-available-features.ts`, and keep the seeded inventory data in `src/lib/documented-features.ts`. Confirm in Task 1.*
- [ ] **OQ-4 (content):** ~~When upstream `docs/init.md`, `docs/lint.md`, `docs/mcp-server.md`, `docs/copilot-setup.md`, and `docs/new.md` are fetched into `src/content/docs/`, should each card's `docsHref` switch from `/docs/quickstart` to the per-command page automatically?~~ **Resolved by the inventory update** — the inventory now links directly to per-command pages (e.g. `/docs/init`, `/docs/lint`, `/docs/mcp-server`) with `/docs/quickstart` as a fallback, eliminating the need for the selector to handle per-command promotion separately.

---

## Tasks

> Each task is sized for a single coding-agent session and includes verification steps.
> Tasks are sequenced; complete in order unless `Depends on` specifies otherwise.
> Mark `[x]` in this file as each task verification step passes.

### Task 1: Author the documented-features inventory and selector (TDD)

**Objective**: Create the typed inventory module and `selectAvailableFeatures` use case, with Zod validation and full unit-test coverage, so downstream homepage components can render only documented features.

**Context**: Extracts homepage feature copy from JSX into a single, testable, validated source. Implements the "documented or omitted" rule.

**Affected files**:
- `src/entities/feature.ts` *(new — `FeatureSchema` and `Feature` type)*
- `src/use-cases/select-available-features.ts` *(new — pure selector)*
- `src/lib/documented-features.ts` *(new — seeded inventory data)*
- `tests/use-cases/select-available-features.test.ts` *(new)*
- `tests/lib/documented-features.test.ts` *(new — schema and inventory shape)*

**Requirements**:
- Implements Story 2 (cards reflect documented features) and Story 5 (no broken links).
- Schema validates each feature has `id`, `title`, `summary`, `docsHref`, `requiresContentSlug`.
- Selector returns features whose `requiresContentSlug` is in the provided slug set, preserving inventory order.
- Inventory seeds entries for `init`, `lint`, `mcp-server`, `agent-shell` at minimum; entries for `new` and `copilot-setup` are added but conditionally selected based on slug availability.
- Tests follow the AAA pattern, use Chance.js for fixtures, and never mock fetch directly (no HTTP in this module).

**Verification**:
- [ ] `npm test tests/use-cases/select-available-features.test.ts` passes
- [ ] `npm test tests/lib/documented-features.test.ts` passes
- [ ] `npx biome check src/entities/feature.ts src/use-cases/select-available-features.ts src/lib/documented-features.ts tests/use-cases/select-available-features.test.ts tests/lib/documented-features.test.ts` passes

**Done when**:
- [ ] All verification steps pass
- [ ] Selector covers happy path, empty inventory, empty slug set, and unknown slugs
- [ ] Inventory includes `init`, `lint`, `mcp-server`, `agent-shell` entries

---

### Task 2: Rewrite `CoreModulesSection` to render the documented inventory

**Depends on**: Task 1

**Objective**: Replace the four invented module cards with cards driven by the inventory selector, each linking to its docs page.

**Context**: This is the highest-impact change for trust — these are the cards visitors scan first. Visual treatment per `DESIGN.md` must be preserved.

**Affected files**:
- `src/components/home/CoreModulesSection.tsx`
- `src/pages/index.astro` *(if needed — pass `availableSlugs` from `getCollection('docs')` into `<HomePage>`)*
- `src/components/home/HomePage.tsx` *(thread `availableSlugs` prop down to `CoreModulesSection`)*
- `tests/components/home/CoreModulesSection.test.tsx`

**Requirements**:
- Implements Story 2 and Story 6.
- Removes hardcoded card data; consumes `selectAvailableFeatures(inventory, availableSlugs)`.
- Each card renders title, summary, and a "Learn more →" link to `docsHref`.
- MCP card title is `MCP Server`; summary expands as `Model Context Protocol`.
- Agent Shell summary describes audit-trail wrapper of npm `script-shell` (matches `readme.md`).
- No fabricated version strings (`v2.0.1`, etc.); the version metadata block is removed.
- Section keeps Analog Terminal styling (surface tier, ghost border, ambient shadow).

**Verification**:
- [ ] `npm test tests/components/home/CoreModulesSection.test.tsx` passes
- [ ] Test asserts MCP expansion text appears in DOM
- [ ] Test asserts no `/^v\d+\.\d+\.\d+/` strings appear in any rendered card
- [ ] Test asserts no card title contains banned terms (`CLI Engine`, `Smart Linting`, `Multi-Agent`)
- [ ] `npx biome check src/components/home/CoreModulesSection.tsx tests/components/home/CoreModulesSection.test.tsx` passes
- [ ] Visual verification per `.github/instructions/visual-verification.instructions.md` (screenshot of cards on desktop and mobile breakpoints attached to PR)

**Done when**:
- [ ] All verification steps pass
- [ ] Cards render: `init`, `lint`, `MCP Server`, `Agent Shell` (and any others whose docs are present)
- [ ] All card links resolve in the built site

---

### Task 3: Rewrite `HeroSection` copy to match documented capabilities

**Depends on**: Task 1

**Objective**: Replace generic marketing copy with a precise, documented-only summary of what Lousy Agents does, and update the terminal mock and CTAs accordingly.

**Affected files**:
- `src/components/home/HeroSection.tsx`
- `tests/components/home/HeroSection.test.tsx`

**Requirements**:
- Implements Story 1 and Story 6.
- Subhead describes scaffolding (`init`), CI validation (`lint`), and editor integration via the MCP server — using docs vocabulary.
- Terminal mock uses `npx @lousy-agents/cli@latest init` and shows realistic, documented output (no invented `[INFO]` lines that imply behavior the CLI does not have).
- Replaces the `agent_v2.0.1` window title with a neutral label (`shell — lousy-agents` or omit).
- Primary CTA links to `/docs/quickstart`. Secondary CTA links to a real destination (e.g. the GitHub repository) — no link to a missing `/about` page; if `/about` exists it remains, otherwise the secondary CTA is updated or removed.
- No invented version labels.

**Verification**:
- [ ] `npm test tests/components/home/HeroSection.test.tsx` passes
- [ ] Test asserts subhead does not contain `Multi-Agent` or `cognitive workloads`
- [ ] Test asserts every CTA `href` resolves to a known route
- [ ] `npx biome check src/components/home/HeroSection.tsx tests/components/home/HeroSection.test.tsx` passes
- [ ] Visual verification screenshot attached (desktop + mobile)

**Done when**:
- [ ] All verification steps pass
- [ ] Hero text and terminal output align with `src/content/local-docs/quickstart.md`

---

### Task 4: Replace `SpecDrivenSection` per OQ-1 resolution

**Depends on**: Task 1, OQ-1 resolved

**Objective**: Delete the fabricated three-pillar section; if OQ-1 resolves to "keep a flow section", create `QuickstartFlowSection` driven by the documented Quickstart steps.

**Affected files**:
- `src/components/home/SpecDrivenSection.tsx` *(delete)*
- `src/components/home/QuickstartFlowSection.tsx` *(new, only if OQ-1 = keep)*
- `src/components/home/HomePage.tsx`
- `tests/components/home/SpecDrivenSection.test.tsx` *(delete)*
- `tests/components/home/QuickstartFlowSection.test.tsx` *(new, only if OQ-1 = keep)*
- `tests/components/home/HomePage.test.tsx`

**Requirements**:
- Implements Story 3.
- If retained, `QuickstartFlowSection` renders exactly three steps named `init`, `lint` (in CI), and `MCP Server`, each linking to the corresponding section anchor in `/docs/quickstart`.
- Section copy is paraphrased from `src/content/local-docs/quickstart.md` and shall not introduce undocumented behavior.
- Primary CTA at the bottom of the section links to `/docs/quickstart`.

**Verification**:
- [ ] `npm test tests/components/home/QuickstartFlowSection.test.tsx` passes (if retained) or `tests/components/home/SpecDrivenSection.test.tsx` no longer exists (if deleted)
- [ ] `npm test tests/components/home/HomePage.test.tsx` passes — asserts `SpecDrivenSection` is not rendered
- [ ] `npx biome check` passes for all touched files
- [ ] Visual verification screenshot attached

**Done when**:
- [ ] All verification steps pass
- [ ] No reference to `Define the Spec`, `Mock the World`, `Atomic Deploy`, or `mocking engine` exists in `src/components/home/`

---

### Task 5: Remove `DeveloperPatch` per OQ-2 resolution

**Depends on**: Task 1, OQ-2 resolved

**Objective**: Delete the fabricated `--break-loop` callout. Reintroduce the visual slot only if a documented replacement is approved.

**Affected files**:
- `src/components/home/DeveloperPatch.tsx` *(delete)*
- `src/components/home/HomePage.tsx`
- `tests/components/home/DeveloperPatch.test.tsx` *(delete)*
- `tests/components/home/HomePage.test.tsx`

**Requirements**:
- Implements Story 4.
- After this task, no source file under `src/components/home/` shall contain the strings `--break-loop`, `'79 simulation`, or `cognitive buffer`.

**Verification**:
- [ ] `git grep -nE "break-loop|cognitive buffer|'79 simulation"` returns no results in `src/`
- [ ] `npm test tests/components/home/HomePage.test.tsx` passes — asserts `DeveloperPatch` is not rendered
- [ ] `npx biome check` passes
- [ ] Visual verification screenshot attached

**Done when**:
- [ ] All verification steps pass

---

### Task 6: Add link-integrity guard and homepage e2e

**Depends on**: Tasks 2–5

**Objective**: Prevent regressions where homepage code references a docs page that does not exist; add e2e coverage that every homepage link resolves at runtime.

**Affected files**:
- `tests/components/home/homepage-link-integrity.test.tsx` *(new — unit test that walks `HomePage` rendered output and asserts each anchor `href` corresponds to a slug in a fixture content collection or a static page)*
- `tests/e2e/homepage.spec.ts` *(new or extended — Playwright walks each homepage link and asserts 200)*

**Requirements**:
- Implements Story 5 and Story 6.
- Unit test fails with a message naming the missing slug if a card or CTA points to an unmapped route.
- E2e test runs against the production build (`npm run test:e2e:dist`) so static-only routes are exercised.

**Verification**:
- [ ] `npm test tests/components/home/homepage-link-integrity.test.tsx` passes
- [ ] `npm run test:e2e:dist -- tests/e2e/homepage.spec.ts` passes locally
- [ ] `npx biome check` passes

**Done when**:
- [ ] All verification steps pass
- [ ] CI runs the new e2e spec as part of the existing `test:e2e:dist` job

---

### Task 7: Final validation and PR polish

**Depends on**: Tasks 1–6

**Objective**: Run the full validation suite and capture before/after screenshots required by the visual verification protocol.

**Affected files**: None (verification only)

**Verification**:
- [ ] `nvm use && npm install`
- [ ] `npx biome check`
- [ ] `npm test`
- [ ] `npm run build`
- [ ] `npm run test:e2e:dist`
- [ ] Before/after screenshots attached to the PR for desktop and a mobile breakpoint, per `.github/instructions/visual-verification.instructions.md`
- [ ] Manual check: every `href` on `/` opens a 200 page

**Done when**:
- [ ] All verification steps pass
- [ ] PR description summarizes which homepage sections were rewritten, deleted, and added, and links to the docs page each remaining feature card maps to

---

## Out of Scope

- Authoring new docs pages for `init`, `new`, `lint`, or `copilot-setup`. This spec only governs which features the homepage may market; expanding doc coverage is tracked separately. Note: `agent-shell` docs are already generated by `scripts/fetch-docs.sh` (which copies `packages/agent-shell/README.md` into `src/content/docs/agent-shell.md`) and are therefore considered present for homepage linking purposes.
- Redesigning the Analog Terminal visual system. Surface tiers, borders, shadows, and typography remain governed by `DESIGN.md`.
- Restructuring the docs sidebar or `/docs` routing.
- Internationalization, light-mode variants, or marketing analytics instrumentation.
- Changes to the upstream `zpratt/lousy-agents` documentation.
- Adding telemetry to track homepage link clicks.

## Future Considerations

- All per-command docs pages (`init`, `new`, `lint`, `copilot-setup`, `mcp-server`) are fetched by `scripts/fetch-docs.sh` and are already present in `src/content/docs/` after a successful build. The inventory links directly to each per-command page so no further `docsHref` promotion work is needed.
- Consider promoting `agent-shell` from a feature card to its own narrative section once `/docs/agent-shell` is improved and stabilized as a long-term reference page.
- Consider a `/about` (manifesto) page if the secondary hero CTA is reinstated.
- Add a CI step that regenerates a "documented features" snapshot from `src/content/docs/` and fails the build if the homepage inventory drifts from it.
