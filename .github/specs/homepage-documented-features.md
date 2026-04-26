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
- [ ] If a capability mentioned in the hero is not documented, then the homepage shall not reference that capability.
- [ ] The terminal mock in the hero shall display only commands that exist in the documented CLI surface (e.g. `npx @lousy-agents/cli@latest init`).
- [ ] The hero shall not display a hardcoded version string for the CLI (e.g. `agent_v2.0.1`).
- [ ] When a version label is rendered in the hero, the `HeroSection` shall use a neutral placeholder such as `cli` or `lousy-agents` rather than a hardcoded version string.

### Story 2: Feature cards reflect only documented features

As an **agentic software engineer scanning the homepage features**,
I want **each feature card to describe a real, documented capability with a working "Learn more" link**,
so that I can **drill into the docs to verify each claim before adopting the tool**.

#### Acceptance Criteria

- [ ] While a feature's primary content slug is present in the docs content collection, the `CoreModulesSection` shall render exactly one card for that feature linking to `primaryDocsHref`, drawn from the Documented Feature Inventory table.
- [ ] If a feature's primary content slug is absent from the docs content collection, and that feature's inventory entry has a fallback configured (`fallbackDocsHref` is `/docs/quickstart` and `fallbackContentSlug` is `quickstart`), and the `quickstart` slug is present in the docs content collection, then the `CoreModulesSection` shall render exactly one card linking to `/docs/quickstart`.
- [ ] Each feature card shall use the documented feature's name (e.g. `init`, `lint`, `MCP Server`, `Agent Shell`) rather than invented module names (`CLI Engine`, `Smart Linting`).
- [ ] Each feature card description shall paraphrase language from the corresponding docs page.
- [ ] The homepage shall not introduce in a feature card description any capability not present in that card's corresponding docs page.
- [ ] The MCP Server card shall expand `MCP` as `Model Context Protocol`, not `Multi-Agent Control Protocol`.
- [ ] The Agent Shell card shall describe Agent Shell as an audit-trail wrapper around npm's `script-shell` (matching `src/content/local-docs/readme.md`), not a sandboxed runtime.
- [ ] Each feature card shall include a link to the docs page for that feature.
- [ ] When a visitor navigates to a feature card's docs link, the built site shall return a 200 response.
- [ ] If no resolvable `docsHref` is produced by the `selectAvailableFeatures` selector for a feature, then the `CoreModulesSection` shall omit that feature.
- [ ] Feature cards shall not display fabricated version labels (e.g. `v2.0.1 // system.bin`).

### Story 3: Remove fabricated "Spec-Driven Development" pillars section

As an **agentic software engineer evaluating the project**,
I want **the homepage to stop advertising a three-step Spec-Driven workflow that does not exist in the toolchain**,
so that I can **trust the homepage to reflect the actual product surface**.

#### Acceptance Criteria

- [ ] The current `SpecDrivenSection` ("Define the Spec / Mock the World / Atomic Deploy") shall be removed from the homepage.
- [ ] The `QuickstartFlowSection` shall replace `SpecDrivenSection` and render the documented three-step Quickstart flow (`init` → `lint` in CI → MCP Server) sourced from `src/content/local-docs/quickstart.md`.
- [ ] The `QuickstartFlowSection` shall include a primary CTA linking to `/docs/quickstart`.
- [ ] The homepage shall not reference a built-in "mocking engine", "atomic deploy", or "Protocol" compliance enforcement, because none of these are documented features.

### Story 4: Remove fabricated "Developer Patch" tip

As a **trust-sensitive evaluator**,
I want **the homepage to not invent CLI flags or fictional history**,
so that I am **not misled into searching for features that do not exist**.

#### Acceptance Criteria

- [ ] The current `DeveloperPatch` section referencing the fictional `--break-loop` flag and "'79 simulation" shall be removed from the homepage.
- [ ] Where the callout slot is retained in the page composition, the callout slot shall reference only documented commands.
- [ ] If no documented command is suitable for the callout slot, then the slot shall be replaced with a documented call-to-action (e.g. a link to the Quickstart or the GitHub repository).

### Story 5: All internal homepage links resolve to documented pages

As a **visitor exploring the site**,
I want **every internal CTA and learn-more link on the homepage to resolve to a real, indexed docs page**,
so that I do **not encounter dead ends**.

#### Acceptance Criteria

- [ ] The `HomePage` component shall render an internal link (an `href` starting with `/`) only when its normalized path target — derived by stripping any `#...` fragment, stripping any `?...` query string, and stripping any trailing slash (except for the root path `/`, which is treated as-is), then translating a `/docs/<slug>` pattern (where `<slug>` is a single path segment containing no `/` characters, anchored at end-of-path (`^/docs/([^/]+)$`)) to `<slug>` for slug-existence checks while treating `/docs` itself as a valid static route — corresponds to an entry in the docs content collection or a static page in `src/pages`.
- [ ] If no fallback is configured in the inventory for an inventory-backed feature link, and that feature's primary content slug is absent from the docs collection, then the `HomePage` component shall omit that feature link.
- [ ] If a fallback is configured in the inventory for an inventory-backed feature link, and that feature's primary content slug is absent from the docs collection, then the `HomePage` component shall render the link pointing to `fallbackDocsHref`.
- [ ] If a homepage link's `href` does not start with `/`, then the link-integrity test shall exclude that link from the internal docs-page matching requirement.
- [ ] If an internal homepage `href` is added in code whose normalized path target — derived by stripping any `#...` fragment, stripping any `?...` query string, and stripping any trailing slash (except for the root path `/`, which is treated as-is), then translating a `/docs/<slug>` pattern (where `<slug>` is a single path segment containing no `/` characters, anchored at end-of-path (`^/docs/([^/]+)$`)) to `<slug>` for slug-existence checks while treating `/docs` itself as a valid static route — does not resolve to a valid internal route (a docs-collection slug or a `src/pages` entry), then the link-integrity unit test shall fail with a message identifying the unresolved `href`.

### Story 6: Homepage copy is grounded in documentation, not jargon

As an **agentic software engineer**,
I want **homepage copy to use the same vocabulary as the docs**,
so that I can **search the docs for any term I see on the homepage and find a match**.

#### Acceptance Criteria

- [ ] The homepage shall not introduce coined terms ("cognitive workloads", "operational perimeter", "hallucination loops", "feedback loop", "logic feedback loop") that are not present in the docs content collection.
- [ ] When the homepage names a capability, the homepage shall use the same term as the corresponding docs page heading (e.g. `lint`, not `Smart Linting`).
- [ ] The `CoreModulesSection` shall not render a card title that is absent from every document in the docs content collection.

---

## Design

> Refer to `.github/copilot-instructions.md`, `DESIGN.md`, and `.github/instructions/visual-verification.instructions.md` for technical and visual standards.

### Components Affected

- `src/components/home/HeroSection.tsx` — Replace marketing claims with documented capability summary; remove `agent_v2.0.1` label; ensure terminal mock uses the documented `npx @lousy-agents/cli@latest init` command and accurate output.
- `src/components/home/CoreModulesSection.tsx` — Replace the four invented modules with documented features from the inventory (`init`, `new`, `lint`, `copilot-setup`, `MCP Server`, `Agent Shell`) whenever their primary docs slug or allowed fallback slug is present; add learn-more link per card; remove fictional version-string labels (for example `feature.version` text such as `v2.0.1 // ...`) and, if needed, replace them with neutral documented metadata while retaining styling tokens such as `accentColor` required for the Analog Terminal design.
- `src/components/home/SpecDrivenSection.tsx` — **Delete** (and remove its mount from `HomePage.tsx`) **or** rewrite as a `QuickstartFlowSection` rendering the three documented Quickstart steps with a CTA to `/docs/quickstart`. Decision recorded in Open Questions.
- `src/components/home/DeveloperPatch.tsx` — **Delete** (and remove its mount from `HomePage.tsx`).
- `src/components/home/HomePage.tsx` — Update the section composition to reflect the new component set; preserve `AntDProvider`, `SiteHeader`, `SiteFooter`, `MobileNavDrawer` wiring; preserve the `client:only="react"` mount in `src/pages/index.astro`.
- `src/entities/feature.ts` *(new)* — Defines Zod schemas and types for inventory items (`{ id, title, summary, primaryDocsHref, primaryContentSlug, fallbackDocsHref?, fallbackContentSlug? }`) and selector-resolved features (`{ id, title, summary, docsHref }`).
- `src/use-cases/select-available-features.ts` *(new)* — Pure selector that resolves each inventory item to a renderable feature with a single `docsHref`, using the primary route when available, an explicit fallback when allowed, or omission when no docs route can be resolved.
- `src/lib/documented-features.ts` *(new)* — Single source of truth for the homepage feature list. Exports the seeded inventory array validated with the entity schema.
- `tests/components/home/HeroSection.test.tsx` — Update assertions to match new copy and links.
- `tests/components/home/CoreModulesSection.test.tsx` — Replace assertions to match documented-feature cards; add tests for: link presence per card, MCP expansion, no fabricated version labels, no fictional terms.
- `tests/components/home/SpecDrivenSection.test.tsx` — Delete (or rewrite as `QuickstartFlowSection.test.tsx`).
- `tests/components/home/DeveloperPatch.test.tsx` — Delete.
- `tests/components/home/HomePage.test.tsx` — Update to assert removed sections are not rendered and new section composition is correct.
- `tests/lib/documented-features.test.ts` *(new)* — Validate the inventory shape and assert that every configured primary/fallback docs link is represented by the docs collection or an allowed fallback.
- `tests/e2e/homepage.spec.ts` *(new or extended)* — Smoke test that every internal homepage link (href starting with `/`) resolves (status 200) when running against the built site (`npm run test:e2e:dist`).

### Dependencies

- No new runtime dependencies. Reuses Astro 6, React 19, Ant Design 6, Zod, Vitest, Playwright already in `package.json`.
- Continues to follow the Analog Terminal design system in `DESIGN.md` (surface tiers, ghost borders at 15%, monospace input, ambient shadows at 6%, WCAG 2.1 AA contrast).

### Data Model

A new typed feature entity describes the homepage feature inventory and its docs binding. The source inventory preserves the difference between a preferred per-feature docs route and the only allowed fallback (`/docs/quickstart`) so the implementation can resolve links deterministically:

```ts
// src/entities/feature.ts
import { z } from "zod";

// Base object schema — used as the source for both the inventory and resolved schemas.
// Kept as a plain z.object() so that .omit()/.extend() work correctly (ZodEffects
// returned by .refine() does not support those combinators).
const HomepageFeatureInventoryItemBaseSchema = z.object({
    id: z.string(),                    // 'init' | 'lint' | 'mcp-server' | 'agent-shell' | ...
    title: z.string(),                 // Human label shown on the card
    summary: z.string(),               // 1–2 sentence paraphrase of the docs page
    primaryDocsHref: z.string(),       // preferred dedicated route, e.g. '/docs/lint'
    primaryContentSlug: z.string(),    // slug that must exist for primaryDocsHref
    fallbackDocsHref: z.literal("/docs/quickstart").optional(),
    fallbackContentSlug: z.literal("quickstart").optional(),
});

// Inventory schema — adds cross-field validation that fallback href and slug
// must both be present or both be absent.
export const HomepageFeatureInventoryItemSchema =
    HomepageFeatureInventoryItemBaseSchema.refine(
        (feature) =>
            !(
                (feature.fallbackDocsHref === undefined &&
                    feature.fallbackContentSlug !== undefined) ||
                (feature.fallbackDocsHref !== undefined &&
                    feature.fallbackContentSlug === undefined)
            ),
        { message: "Fallback href and content slug must be configured together" },
    );

// Resolved schema — derived from the base (not the refined) schema so .omit() works.
export const ResolvedHomepageFeatureSchema =
    HomepageFeatureInventoryItemBaseSchema.omit({
        primaryDocsHref: true,
        primaryContentSlug: true,
        fallbackDocsHref: true,
        fallbackContentSlug: true,
    }).extend({ docsHref: z.string() });

export type HomepageFeatureInventoryItem = z.infer<
    typeof HomepageFeatureInventoryItemSchema
>;
export type ResolvedHomepageFeature = z.infer<typeof ResolvedHomepageFeatureSchema>;
```

Selector:

```ts
// src/use-cases/select-available-features.ts
// availableSlugs is a plain array so it can be passed as a JSON-serializable
// Astro island prop. The implementation may convert it to a Set internally for
// O(1) lookups, but the public API must not require a Set from callers.
export function selectAvailableFeatures(
    inventory: readonly HomepageFeatureInventoryItem[],
    availableSlugs: readonly string[],
): ResolvedHomepageFeature[];
```

Used by `CoreModulesSection` and (if retained) `QuickstartFlowSection` so a feature renders only with a resolved docs link:

1. If `primaryContentSlug` is present in `availableSlugs`, resolve `docsHref` to `primaryDocsHref`.
2. If `primaryContentSlug` is missing from `availableSlugs`, `fallbackDocsHref` is `/docs/quickstart`, and `fallbackContentSlug` (`quickstart`) is present in `availableSlugs`, resolve `docsHref` to `fallbackDocsHref`.
3. If neither the primary slug nor the allowed fallback slug is present, omit the feature.

`docsHref` is therefore an output-only field. Source inventory entries must keep `primaryDocsHref`, `primaryContentSlug`, `fallbackDocsHref`, and `fallbackContentSlug` separate so route existence and fallback behavior are implementable and testable.

### Data Flow Diagram

```
       ┌──────────────────────────────┐    ┌──────────────────────────────┐
       │ src/content/local-docs/*.md  │    │ upstream docs fetched from   │
       │ (quickstart.md, readme.md — │    │ zpratt/lousy-agents          │
       │  project overview)           │    │ (docs/*.md + packages/       │
       │                              │    │  agent-shell/README.md)      │
       └──────────────┬───────────────┘    └──────────────┬───────────────┘
                      │                                   │
                      └──────────────┬────────────────────┘
                                     ▼
                   ┌───────────────────────────────────────┐
                   │ scripts/fetch-docs.sh                 │
                   │ copies/merges local + fetched docs    │
                   │ → writes src/content/docs/*.md        │
                   └────────────────┬──────────────────────┘
                                    │
                                    ▼
                   ┌───────────────────────────────────────┐
                   │ src/content/docs/*.md                 │
                   └────────────────┬──────────────────────┘
                                    │ getCollection('docs') at build time
                                    ▼
       ┌──────────────────────────────────────────────────────────┐
       │ index.astro (build-time Astro page)                      │
       │ - reads docs collection                                  │
       │ - passes availableSlugs (string[]) as prop into <HomePage/>│
       └────────────────┬─────────────────────────────────────────┘
                        │ availableSlugs: string[]
                        ▼
       ┌──────────────────────────────────────────────────────────┐
       │ HomePage.tsx (client:only react island)                  │
       │ - composes Hero, CoreModules, (Quickstart?), Footer      │
       └─┬───────────────────┬───────────────────┬────────────────┘
         │                   │                   │
         ▼                   ▼                   ▼
   ┌───────────┐    ┌───────────────────┐   ┌─────────────────────┐
   │ HeroSect. │    │ CoreModulesSection│   │ QuickstartFlowSect. │
   │ static    │    │ uses selector to  │   │ uses 3 quickstart   │
   │ copy +    │    │ resolve docsHref  │   │ steps, links to     │
   │ doc links │    │ from available    │   │ /docs/quickstart    │
   │           │    │ slugs + fallback  │   │                     │
   └───────────┘    └─────────┬─────────┘   └─────────────────────┘
                              │
                              ▼
                  ┌────────────────────────┐
                  │ src/lib/documented-    │
                  │ features.ts inventory  │
                  │ src/use-cases/select-  │
                  │ available-features.ts  │
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
   │                  │                      │◀── Resolved[] ───────│                       │
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

If a card's dedicated docs slug is not present in the collection, the selector either resolves the card to an explicitly allowed fallback link or excludes it — guaranteeing the click flow above never resolves to a 404.

### Open Questions

- [x] **OQ-1 (product):** ~~Should we keep a "workflow narrative" section after deleting `SpecDrivenSection`, or is the documented Quickstart flow already represented well enough by the feature cards alone?~~ **Resolved** — keep `QuickstartFlowSection`. It should tease the documented Quickstart experience in a way that inspires curiosity for visitors interested in tightening their quality checks, iterating with more confidence, and improving the production quality of their agents, with a clear CTA to `/docs/quickstart`.
- [x] **OQ-2 (product):** ~~Do we want to retain the mascot "Developer Patch" callout card visually but with documented content (e.g. a "Pro tip: run `lint` in CI" pointing to `/docs/quickstart#2-enforce-quality-in-ci-lint`), or remove that visual element entirely?~~ **Resolved** — remove for now; reintroduce only if/when there is a documented tip with a stable anchor.
- [x] **OQ-3 (engineering):** ~~Should the inventory live in `src/lib/` (used by Astro build) or `src/entities/` (per Clean Architecture rules in `.github/copilot-instructions.md` and `.github/instructions/software-architecture.instructions.md`)?~~ **Resolved** — place schema + types in `src/entities/feature.ts`, place the selector in `src/use-cases/select-available-features.ts`, and keep the seeded inventory data in `src/lib/documented-features.ts`.
- [x] **OQ-4 (content):** ~~When upstream `docs/init.md`, `docs/lint.md`, `docs/mcp-server.md`, `docs/copilot-setup.md`, and `docs/new.md` are fetched into `src/content/docs/`, should each card's `docsHref` switch from `/docs/quickstart` to the per-command page automatically?~~ **Resolved** — the inventory now stores `primaryDocsHref`/`primaryContentSlug` and optional `fallbackDocsHref`/`fallbackContentSlug` separately, and the selector resolves the final `docsHref` based on content availability.

---

## Tasks

> Each task is sized for a single coding-agent session and includes verification steps.
> Tasks are sequenced; complete in order unless `Depends on` specifies otherwise.
> Mark `[x]` in this file as each task verification step passes.

### Task 1: Author the documented-features inventory and selector (TDD)

**Objective**: Create the typed inventory module and `selectAvailableFeatures` use case, with Zod validation and full unit-test coverage, so downstream homepage components can render only documented features.

**Context**: Extracts homepage feature copy from JSX into a single, testable, validated source. Implements the "documented, fallback, or omitted" rule.

**Affected files**:
- `src/entities/feature.ts` *(new — inventory-item schema/type plus resolved-feature schema/type)*
- `src/use-cases/select-available-features.ts` *(new — pure selector)*
- `src/lib/documented-features.ts` *(new — seeded inventory data)*
- `tests/use-cases/select-available-features.test.ts` *(new)*
- `tests/lib/documented-features.test.ts` *(new — schema and inventory shape)*

**Requirements**:
- Implements Story 2 (cards reflect documented features) and Story 5 (no broken links).
- Schema validates each inventory item has `id`, `title`, `summary`, `primaryDocsHref`, `primaryContentSlug`, optional `fallbackDocsHref`, and optional `fallbackContentSlug`.
- Selector returns resolved features with a single `docsHref`, preserving inventory order.
- Selector links to `primaryDocsHref` when the dedicated docs slug is present, falls back only to `/docs/quickstart` when both `fallbackDocsHref` and `fallbackContentSlug` are configured and the `quickstart` slug is present, and omits features with no resolvable docs route.
- Inventory seeds entries for all six documented features: `init`, `new`, `lint`, `copilot-setup`, `mcp-server`, and `agent-shell`.
- Tests follow the AAA pattern, use Chance.js for fixtures, and never mock fetch directly (no HTTP in this module).

**Verification**:
- [ ] `npm test tests/use-cases/select-available-features.test.ts` passes
- [ ] `npm test tests/lib/documented-features.test.ts` passes
- [ ] `npx biome check src/entities/feature.ts src/use-cases/select-available-features.ts src/lib/documented-features.ts tests/use-cases/select-available-features.test.ts tests/lib/documented-features.test.ts` passes

**Done when**:
- [ ] All verification steps pass
- [ ] Selector covers happy path, empty inventory, empty slug set, fallback resolution, omitted features without a fallback, and unknown slugs
- [ ] Inventory includes `init`, `new`, `lint`, `copilot-setup`, `mcp-server`, and `agent-shell` entries

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
- Each card renders title, summary, and a "Learn more →" link to the selector-resolved `docsHref`.
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
- [ ] Cards render: `init`, `new`, `lint`, `copilot-setup`, `MCP Server`, and `Agent Shell` when those docs slugs are present in the `docs` content collection
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
- [ ] Test asserts every internal CTA `href` (starting with `/`), after normalizing the target by stripping any `#...` fragment, stripping any `?...` query string, stripping any trailing slash (except for the root path `/`, which is treated as-is), and translating a `/docs/<slug>` pattern (where `<slug>` is a single path segment containing no `/` characters, anchored at end-of-path (`^/docs/([^/]+)$`)) to `<slug>`, resolves to a slug in the docs collection or a static page in `src/pages`; external CTAs (e.g. the GitHub repository URL) are excluded from this assertion
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

**Objective**: Prevent regressions where homepage code references an internal docs page that does not exist; add e2e coverage that every internal homepage link resolves at runtime.

**Affected files**:
- `tests/components/home/homepage-link-integrity.test.tsx` *(new — unit test that walks `HomePage` rendered output and asserts each internal anchor `href` (starting with `/`) corresponds to either a slug in a fixture content collection or a static page after normalizing the link target by stripping any `#...` fragment, stripping any `?...` query string, and stripping any trailing slash (except for the root path `/`, which is treated as-is); when the normalized target matches `/docs/<slug>` (where `<slug>` is a single path segment containing no `/` characters, anchored at end-of-path (`^/docs/([^/]+)$`)), translate it to `<slug>` before checking the fixture content collection, while still allowing static routes such as `/docs`; external links are excluded from the check)*
- `tests/e2e/homepage.spec.ts` *(new or extended — Playwright walks each internal homepage link (href starting with `/`), normalizes the target by stripping any `#...` fragment, stripping any `?...` query string, and stripping any trailing slash (except for the root path `/`, which is treated as-is) before issuing the request, then asserts the underlying internal page returns 200; `/docs/<slug>` (where `<slug>` is a single path segment containing no `/` characters, anchored at end-of-path (`^/docs/([^/]+)$`)) remains a routable URL in e2e; external links are excluded)*

**Requirements**:
- Implements Story 5 and Story 6.
- Unit test fails with a message naming the missing slug if an internal card or CTA `href` (starting with `/`) points to an unmapped internal route.
- Unit test also asserts that each card title rendered by `CoreModulesSection` appears verbatim in at least one document in the content collection (vocabulary check for Story 6 AC3).
- Normalize internal homepage link targets before validation by stripping `#...` fragments, stripping `?...` query strings, and stripping trailing slashes (except for the root path `/`, which is treated as-is) before matching slugs/routes and before issuing e2e requests; when the normalized target matches `/docs/<slug>` (where `<slug>` is a single path segment containing no `/` characters, anchored at end-of-path (`^/docs/([^/]+)$`)), translate it to `<slug>` for the slug-existence check.
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
- [ ] Manual check: every internal `href` (starting with `/`) on `/` opens a 200 page; external links are excluded from this check

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

- All per-command docs pages (`init`, `new`, `lint`, `copilot-setup`, `mcp-server`) are fetched by `scripts/fetch-docs.sh` and are already present in `src/content/docs/` after a successful build. The inventory stores direct per-command links as `primaryDocsHref`/`primaryContentSlug` and `/docs/quickstart` fallbacks as `fallbackDocsHref`/`fallbackContentSlug` where allowed, so no further `docsHref` promotion work is needed.
- Consider promoting `agent-shell` from a feature card to its own narrative section once `/docs/agent-shell` is improved and stabilized as a long-term reference page.
- Consider a `/about` (manifesto) page if the secondary hero CTA is reinstated.
- Add a CI step that regenerates a "documented features" snapshot from `src/content/docs/` and fails the build if the homepage inventory drifts from it.
