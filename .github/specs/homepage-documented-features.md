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
| MCP Server (Model Context Protocol) | `@lousy-agents/mcp` | `zpratt/lousy-agents/docs/mcp-server.md` | `/docs/mcp-server` (fallback: `/docs/quickstart`) |
| Agent Shell audit trail | `@lousy-agents/agent-shell` | `packages/agent-shell/README.md` (copied by `scripts/fetch-docs.sh`) | `/docs/agent-shell` |

Anything not in the table above is out of scope for the homepage until it has a published docs page.

## User Stories

### Story 1: Hero accurately summarizes the documented value proposition

As an **agentic software engineer landing on the homepage**,
I want **the hero headline and subhead to describe what Lousy Agents actually does**,
so that I can **decide in under 10 seconds whether to read further**.

#### Acceptance Criteria

- [ ] The `HeroSection` shall describe Lousy Agents as a CLI that scaffolds, validates, and connects AI agent configurations through documented commands.
- [ ] The `HeroSection` subhead shall describe scaffolding (`init`), CI validation (`lint`), and editor integration via the MCP server using vocabulary drawn from `src/content/local-docs/quickstart.md`.

> Note: Vocabulary alignment is confirmed by editorial review during PR code review. Any PR that modifies `HeroSection` copy must be reviewed against `src/content/local-docs/quickstart.md`.
- [ ] If a capability mentioned in the `HeroSection` is not documented, then the `HeroSection` shall not reference that capability.
- [ ] The `HeroSection` terminal mock shall display only commands that exist in the documented CLI surface (e.g. `npx @lousy-agents/cli@latest init`).
- [ ] The `HeroSection` shall render a primary CTA whose `href` is `/docs/quickstart`.
- [ ] The `HeroSection` shall render a secondary CTA whose `href` is `https://github.com/zpratt/lousy-agents`.
- [ ] The `HeroSection` shall not render any anchor whose `href` is `/about`.
- [ ] The `HeroSection` shall not display a hardcoded version string matching `/v\d+\.\d+\.\d+/` (e.g. `agent_v2.0.1`).
- [ ] If a window-title or label is rendered in the `HeroSection`, then its text content shall match one of the enumerated neutral placeholders: `cli`, `lousy-agents`, or `shell — lousy-agents`.

### Story 2: Feature cards reflect only documented features

As an **agentic software engineer scanning the homepage features**,
I want **each feature card to describe a real, documented capability with a working "Learn more" link**,
so that I can **drill into the docs to verify each claim before adopting the tool**.

#### Acceptance Criteria

- [ ] When `selectAvailableFeatures` is called with an `availableSlugs` array that contains a feature's `primaryContentSlug`, the selector shall resolve that feature's `docsHref` to `primaryDocsHref`.
- [ ] While `resolvedFeatures` contains an entry for a feature, the `CoreModulesSection` shall render exactly one card for that feature using the supplied `docsHref`.
- [ ] When `selectAvailableFeatures` is called with an `availableSlugs` array where a feature's `primaryContentSlug` is absent, and that feature's inventory entry has a fallback configured (both `fallbackDocsHref` and `fallbackContentSlug` are set), and the configured fallback content slug is present in `availableSlugs`, the selector shall resolve that feature's `docsHref` to `fallbackDocsHref`.
- [ ] The `CoreModulesSection` shall render each card with the documented feature name (e.g. `init`, `lint`, `MCP Server`, `Agent Shell`) rather than invented module names (`CLI Engine`, `Smart Linting`).
- [ ] The `CoreModulesSection` shall not render any card description containing a coined term ("cognitive workloads", "operational perimeter", "hallucination loops", "feedback loop", "logic feedback loop").

> Note: The constraint that card descriptions must not introduce undocumented capabilities is verified by editorial review during PR code review, not by an automated check. Any PR that modifies feature card summaries must be reviewed against the corresponding docs page.
- [ ] The `CoreModulesSection` shall render the MCP Server card with `MCP` expanded as `Model Context Protocol`, not `Multi-Agent Control Protocol`.
- [ ] The `CoreModulesSection` shall render the Agent Shell card describing Agent Shell as an audit-trail wrapper around npm's `script-shell` (matching `src/content/local-docs/readme.md`), not a sandboxed runtime.
- [ ] The `CoreModulesSection` shall render a link to the docs page for each feature card.
- [ ] When a visitor navigates to a feature card's docs link, the built site shall return a 200 response.
- [ ] If no resolvable `docsHref` is produced by the `selectAvailableFeatures` selector for a feature, then the `CoreModulesSection` shall omit that feature's card entirely.
- [ ] The `CoreModulesSection` shall not render fabricated version labels (e.g. `v2.0.1 // system.bin`).
- [ ] The `CoreModulesSection` shall render each card with a visually distinct, non-empty accent color per feature ID.

> Note (implementation constraint): Accent colors shall be sourced from a hardcoded `feature.id`-keyed map within `CoreModulesSection.tsx`; `ResolvedHomepageFeature` shall carry no color data. This constraint is documented in the Design §Components Affected entry.

### Story 3: Remove fabricated "Spec-Driven Development" pillars section

As an **agentic software engineer evaluating the project**,
I want **the homepage to stop advertising a three-step Spec-Driven workflow that does not exist in the toolchain**,
so that I can **trust the homepage to reflect the actual product surface**.

#### Acceptance Criteria

- [ ] The current `SpecDrivenSection` ("Define the Spec / Mock the World / Atomic Deploy") shall be removed from the homepage.
- [ ] The `QuickstartFlowSection` shall render exactly three steps with labels `init`, `lint` (in CI), and `MCP Server`.

> Note: `QuickstartFlowSection` copy shall be paraphrased from `src/content/local-docs/quickstart.md` and shall not render any text that describes behavior absent from that document. This is verified by editorial review during PR code review. Any PR that modifies `QuickstartFlowSection` copy must be reviewed against `src/content/local-docs/quickstart.md`.
- [ ] The `QuickstartFlowSection` step labels and links shall be statically embedded in the component (not fetched or computed at runtime).
- [ ] The `QuickstartFlowSection` shall render each of the three steps as a link pointing to `/docs/quickstart`.
- [ ] The `QuickstartFlowSection` shall include a primary CTA linking to `/docs/quickstart`.
- [ ] Each `QuickstartFlowSection` step link shall carry an `aria-label` that is unique across all three step links.
- [ ] Each `QuickstartFlowSection` step link's `aria-label` shall include the step's full label (e.g. `aria-label="Learn about init"`, `aria-label="Learn about lint (in CI)"`, `aria-label="Learn about MCP Server"`).
- [ ] The homepage shall not reference a built-in "mocking engine".
- [ ] The homepage shall not reference "atomic deploy".
- [ ] The homepage shall not reference "Protocol" compliance enforcement.

### Story 4: Remove fabricated "Developer Patch" tip

As a **trust-sensitive evaluator**,
I want **the homepage to not invent CLI flags or fictional history**,
so that I am **not misled into searching for features that do not exist**.

#### Acceptance Criteria

- [ ] The homepage shall not render the `DeveloperPatch` section, the `--break-loop` text, or the `'79 simulation` text.

> Note: The callout slot is not retained. See OQ-2 resolution.

### Story 5: All internal homepage links resolve to documented pages

As a **visitor exploring the site**,
I want **every internal CTA and learn-more link on the homepage to resolve to a real, indexed docs page**,
so that I do **not encounter dead ends**.

#### Definitions

> **Inventory-backed feature link**: any anchor `href` rendered by `CoreModulesSection` whose target is drawn from the Documented Feature Inventory table above.
>
> **Standard link-normalization algorithm**: given an internal `href` (starting with `/`), produce a canonical path by:
> 0. Lowercase the entire path.
> 1. Strip any `#...` fragment (everything from the first `#` onwards). *(Strip before decode so that percent-encoded delimiters like `%23` in the raw href are not mistaken for structural `#` characters; stripping first ensures `%23section` is preserved through step 3 and does not prematurely truncate the path.)*
> 2. Strip any `?...` query string (everything from the first `?` onwards). *(Same rationale as step 1 for `%3F`.)*
> 3. Decode any percent-encoded characters (e.g. `%2D` → `-`) using `decodeURIComponent`.
> 4. Collapse any consecutive `/` separators to a single `/`.
> 5. Strip any trailing slash — except the root path `/`, which is kept as-is.
> 6. If the result matches `/docs/<slug>` (where `<slug>` is a single path segment, no `/` characters, anchored by `^/docs/([^/]+)$`), translate it to `<slug>` for slug-existence checks; `/docs` itself is treated as a valid static route without translation.

#### Acceptance Criteria

- [ ] If an internal homepage link's normalized path target — computed using the standard link-normalization algorithm — does not correspond to an entry in the docs content collection or a static page in `src/pages/`, then the rendered homepage shall not include that link.
- [ ] If no fallback is configured in the inventory for an inventory-backed feature link, and that feature's primary content slug is absent from the docs collection, then the `selectAvailableFeatures` selector shall not emit that feature in its output.
- [ ] If a fallback is configured in the inventory for an inventory-backed feature link, and that feature's primary content slug is absent from the docs collection, and the configured fallback content slug is present in the docs collection, then the `selectAvailableFeatures` selector shall resolve that feature's `docsHref` to `fallbackDocsHref`.
- [ ] The homepage shall not require an internal docs route to exist for external links (any anchor whose `href` does not start with `/`).

### Story 6: Homepage copy is grounded in documentation, not jargon

As an **agentic software engineer**,
I want **homepage copy to use the same vocabulary as the docs**,
so that I can **search the docs for any term I see on the homepage and find a match**.

#### Acceptance Criteria

- [ ] The homepage shall not introduce coined terms ("cognitive workloads", "operational perimeter", "hallucination loops", "feedback loop", "logic feedback loop") that are not present in the docs content collection.
- [ ] The `CoreModulesSection` shall use the same term as the `h1` heading of each feature's corresponding docs page as that feature's card title (e.g. `lint`, not `Smart Linting`).

> Note: Card titles map to the following `h1` headings in the docs: `init`, `new`, `lint`, `copilot-setup`, `MCP Server`, `Agent Shell`. These are verified by the Task 2 test assertions for card titles (Story 2 AC4) and by editorial review during PR code review.

> Note: Verifying that card titles appear in the docs collection is confirmed by editorial review during PR code review. Any PR that modifies card titles must be reviewed against the docs collection.

> Note: Verifying that card description feature names appear in the docs collection is confirmed by editorial review during PR code review. Any PR that modifies card descriptions must be reviewed against the docs collection.

---

## Design

> Refer to `.github/copilot-instructions.md`, `DESIGN.md`, and `.github/instructions/visual-verification.instructions.md` for technical and visual standards.

### Components Affected

- `src/components/home/HeroSection.tsx` — Replace marketing claims with documented capability summary; remove `agent_v2.0.1` label; ensure terminal mock uses the documented `npx @lousy-agents/cli@latest init` command and accurate output.
- `src/components/home/CoreModulesSection.tsx` — Replace the four invented modules with documented features; receives `resolvedFeatures: ResolvedHomepageFeature[]` as a prop (does not call the selector or import inventory directly); add learn-more link per card; remove fictional version-string labels (for example `feature.version` text such as `v2.0.1 // ...`); accent colors for each card shall be sourced from a hardcoded per-feature map keyed on `feature.id` within `CoreModulesSection.tsx` (not passed through `resolvedFeatures`) to preserve Analog Terminal design tokens.
- `src/components/home/SpecDrivenSection.tsx` — **Delete** (and remove its mount from `HomePage.tsx`).
- `src/components/home/QuickstartFlowSection.tsx` *(new)* — Renders the three documented Quickstart steps (`init`, `lint` in CI, `MCP Server`) with a primary CTA linking to `/docs/quickstart`. Copy paraphrased from `src/content/local-docs/quickstart.md`; introduces no undocumented behavior.
- `src/components/home/DeveloperPatch.tsx` — **Delete** (and remove its mount from `HomePage.tsx`).
- `src/components/home/HomePage.tsx` — Update the section composition to reflect the new component set; receives `resolvedFeatures: ResolvedHomepageFeature[]` as a prop from `index.astro` and passes it to `CoreModulesSection`; preserve `AntDProvider`, `SiteHeader`, `SiteFooter`, `MobileNavDrawer` wiring.
- `src/pages/index.astro` — At build time, calls `selectAvailableFeatures(inventory, availableSlugs)` and passes the returned `resolvedFeatures` array as a typed prop into `<HomePage client:only="react" resolvedFeatures={resolvedFeatures} />`.
- `src/entities/feature.ts` *(new)* — Defines plain TypeScript types only (no Zod): `HomepageFeatureInventoryItem` (`{ id, title, summary, primaryDocsHref, primaryContentSlug, fallbackDocsHref?, fallbackContentSlug? }`).
- `src/use-cases/select-available-features.ts` *(new)* — Pure selector that resolves each inventory item to a `ResolvedHomepageFeature` with a single `docsHref`, using the primary route when available, an explicit fallback when allowed, or omission when no docs route can be resolved.
- `src/lib/documented-features.ts` *(new)* — Exports `DOCUMENTED_FEATURES: HomepageFeatureInventoryItem[]` — the seeded inventory array parsed and validated by `HomepageFeatureInventoryItemSchema` (owned by this file). Imports the entity type from `src/entities/feature.ts` for annotation.
- `tests/components/home/HeroSection.test.tsx` — Update assertions to match new copy and links.
- `tests/components/home/CoreModulesSection.test.tsx` — Replace assertions to match documented-feature cards; add tests for: link presence per card, MCP expansion, no fabricated version labels, no fictional terms.
- `tests/components/home/SpecDrivenSection.test.tsx` — **Delete**.
- `tests/components/home/QuickstartFlowSection.test.tsx` *(new)* — Asserts: (1) exactly three steps are rendered with labels `init`, `lint` (in CI), and `MCP Server`; (2) each step links to `/docs/quickstart`; (3) primary CTA renders and links to `/docs/quickstart`; (4) no text contains `Define the Spec`, `Mock the World`, or `Atomic Deploy`.
- `tests/components/home/DeveloperPatch.test.tsx` — Delete.
- `tests/components/home/HomePage.test.tsx` — Update to assert removed sections are not rendered and new section composition is correct.
- `tests/lib/documented-features.test.ts` *(new)* — Validate the inventory shape and assert that every configured primary/fallback docs link is represented by the docs collection or an allowed fallback.
- `tests/e2e/homepage.spec.ts` *(new or extended)* — Smoke test that every internal homepage link (href starting with `/`) resolves (status 200) when running against the built site (`npm run test:e2e:dist`).

### Dependencies

- No new runtime dependencies. Reuses Astro 6, React 19, Ant Design 6, Zod, Vitest, Playwright already in `package.json`.
- Continues to follow the Analog Terminal design system in `DESIGN.md` (surface tiers, ghost borders at 15%, monospace input, ambient shadows at 6%, WCAG 2.1 AA contrast).

### Test Data Strategy

Unit tests that need to check whether a docs slug exists (Tasks 1 and 6) cannot call `getCollection('docs')` — that is a build-time Astro API not available in Vitest. Instead, the test suite uses a committed fixture file:

- `tests/fixtures/docs-slugs.json` *(new — a JSON array of strings, e.g. `["quickstart", "agent-shell", "readme"]`, representing the `.md` filenames present in `src/content/docs/` with the extension stripped)*

This fixture is regenerated by first running `bash scripts/fetch-docs.sh` in a fresh checkout (which creates `src/content/docs/`), then running `npm run fixture:docs-slugs`. Because this repo is ESM-only (`"type": "module"` in `package.json`), the fixture script must be written as an ES module and must resolve `src/content/docs/` using `fileURLToPath(new URL('../src/content/docs', import.meta.url))` (where `fileURLToPath` is imported from `node:url`) rather than `__dirname` or `new URL(...).pathname` (which is brittle across platforms due to URL encoding). The script then calls `fs.readdirSync` on that resolved filesystem path, filters for `.md` files, strips the extension, and writes the array as JSON to `tests/fixtures/docs-slugs.json`. The script must call `process.exit(1)` with an error message if the resolved directory does not exist. **No Astro build is required, but `bash scripts/fetch-docs.sh` must be run first when `src/content/docs/` has not been created yet.** The fixture is committed to source control so unit tests run offline without triggering any build step.

Unit tests that check slug existence import this fixture directly:

```ts
import docsSlugs from "../../fixtures/docs-slugs.json";
```

**Tasks that must reference this fixture in their Affected files and Verification steps**: Task 1, Task 6.

### Data Model

A new typed feature entity describes the homepage feature inventory and its docs binding. The source inventory preserves the difference between a preferred per-feature docs route and the only allowed fallback (`/docs/quickstart`) so the implementation can resolve links deterministically.

Per Clean Architecture rules, `src/entities/` and `src/use-cases/` must remain framework-free (no Zod imports). `src/entities/feature.ts` defines plain TypeScript types with no imports. `src/lib/documented-features.ts` (adapter layer) owns all Zod schemas and validation, imports the entity type from `src/entities/feature.ts` (adapter importing from entity — valid direction), and annotates the inventory array against that imported type:

```ts
// src/lib/documented-features.ts  (adapter layer — imports Zod here only)
import { z } from "zod";
import type { HomepageFeatureInventoryItem } from "../entities/feature";

// Base inventory schema; cross-field validation is applied via superRefine below.
const HomepageFeatureInventoryItemBaseSchema = z.object({
    id: z.string(),                    // 'init' | 'lint' | 'mcp-server' | 'agent-shell' | ...
    title: z.string(),                 // Human label shown on the card
    summary: z.string(),               // 1–2 sentence paraphrase of the docs page
    primaryDocsHref: z.string().regex(/^\/docs\/[^/]+$/, "primaryDocsHref must match /docs/<slug>"),
    primaryContentSlug: z.string(),    // slug that must exist for primaryDocsHref; must equal the captured segment from primaryDocsHref
    fallbackDocsHref: z.literal("/docs/quickstart").optional(),
    fallbackContentSlug: z.literal("quickstart").optional(),
});

// Inventory schema — adds cross-field validation that:
// - primaryContentSlug matches the slug captured from primaryDocsHref
// - fallback href and slug must both be present or both be absent
export const HomepageFeatureInventoryItemSchema =
    HomepageFeatureInventoryItemBaseSchema.superRefine((feature, ctx) => {
        const capturedSlug = feature.primaryDocsHref.replace("/docs/", "");
        if (feature.primaryContentSlug !== capturedSlug) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["primaryContentSlug"],
                message: "primaryContentSlug must equal the captured segment from primaryDocsHref",
            });
        }

        const hasFallbackHref = feature.fallbackDocsHref !== undefined;
        const hasFallbackSlug = feature.fallbackContentSlug !== undefined;
        if (hasFallbackHref !== hasFallbackSlug) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["fallbackDocsHref"],
                message: "Fallback href and content slug must be configured together",
            });
        }
    });

// Seeded inventory array, validated with a uniqueness check on id values.
// Type annotation uses the entity type (imported from src/entities/feature.ts — valid direction).
export const documentedFeaturesInventorySchema = z.array(HomepageFeatureInventoryItemSchema).refine(
    items => new Set(items.map(i => i.id)).size === items.length,
    { message: "Duplicate inventory IDs detected" }
);

export const DOCUMENTED_FEATURES: HomepageFeatureInventoryItem[] = documentedFeaturesInventorySchema.parse([
    // ... entries for init, new, lint, copilot-setup, mcp-server, agent-shell
]);
```

```ts
// src/entities/feature.ts  (entities layer — plain TypeScript types only, no Zod)
export type HomepageFeatureInventoryItem = {
    id: string;
    title: string;
    summary: string;
    primaryDocsHref: string;
    primaryContentSlug: string;
    fallbackDocsHref?: "/docs/quickstart";
    fallbackContentSlug?: "quickstart";
};
```

`ResolvedHomepageFeature` is a use-case output type and lives in the use-cases layer as a plain TypeScript interface (no Zod):

```ts
// src/use-cases/select-available-features.ts  (use-cases layer — no Zod imports)
import type { HomepageFeatureInventoryItem } from "../entities/feature";

export type ResolvedHomepageFeature = {
    id: string;
    title: string;
    summary: string;
    docsHref: string;  // always matches /^\/docs\/[^/]+$/
};

export function selectAvailableFeatures(
    inventory: readonly HomepageFeatureInventoryItem[],
    availableSlugs: readonly string[],
): ResolvedHomepageFeature[] {
    // ... selector logic
}
```

The full selector signature (still in `src/use-cases/select-available-features.ts`):

```ts
// availableSlugs is a plain array so it can be passed as a JSON-serializable
// Astro island prop. The implementation may convert it to a Set internally for
// O(1) lookups, but the public API must not require a Set from callers.
export function selectAvailableFeatures(
    inventory: readonly HomepageFeatureInventoryItem[],
    availableSlugs: readonly string[],
): ResolvedHomepageFeature[];
```

Called by `index.astro` (Layer 4 composition root) at build time; the result is passed as a prop through `HomePage` → `CoreModulesSection`. `CoreModulesSection` receives only `resolvedFeatures: ResolvedHomepageFeature[]` and renders it — it does not import the selector or the inventory. `QuickstartFlowSection` uses fixed hardcoded steps and does not call the selector:

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
       ┌──────────────────────────────────────────────────────────────────┐
       │ index.astro (Layer 4 — composition root)                         │
       │ - reads docs collection → availableSlugs: string[]              │
       │ - calls selectAvailableFeatures(inventory, availableSlugs)       │
       │   → resolvedFeatures: ResolvedHomepageFeature[]                  │
       │ - mounts <HomePage client:only="react"                           │
       │     resolvedFeatures={resolvedFeatures} />                       │
       └────────────────┬─────────────────────────────────────────────────┘
                        │ resolvedFeatures: ResolvedHomepageFeature[]
                        ▼
       ┌──────────────────────────────────────────────────────────────────┐
       │ HomePage.tsx (client:only react island)                          │
       │ - forwards resolvedFeatures to CoreModulesSection as prop        │
       │ - composes Hero, CoreModulesSection, QuickstartFlowSection, Footer│
       └─┬───────────────────┬───────────────────┬───────────────────────┘
         │                   │                   │
         ▼                   ▼                   ▼
   ┌───────────┐    ┌───────────────────┐   ┌─────────────────────┐
   │ HeroSect. │    │ CoreModulesSection│   │ QuickstartFlowSect. │
   │ static    │    │ receives          │   │ uses 3 quickstart   │
   │ copy +    │    │ resolvedFeatures  │   │ steps, links to     │
   │ doc links │    │ as prop; renders  │   │ /docs/quickstart    │
   │           │    │ cards + doc links │   │                     │
   └───────────┘    └───────────────────┘   └─────────────────────┘
```

The inventory module is the only place where homepage feature copy lives. The selector enforces the invariant that no feature renders without a docs page backing it.

### Sequence Diagram

```
Visitor          Astro build           HomePage (island)        Doc link click
   │                  │                      │                       │
   │── GET / ────────▶│                      │                       │
   │                  │── getCollection ────▶│                       │
   │                  │   ('docs')           │                       │
   │                  │                      │                       │
   │        index.astro calls               │                       │
   │        selectAvailableFeatures(         │                       │
   │          inventory, availableSlugs)     │                       │
   │        → resolvedFeatures[]            │                       │
   │                  │── render island ────▶│                       │
   │                  │   props={            │                       │
   │                  │     resolvedFeatures │                       │
   │                  │   }                  │                       │
   │                  │                      │ render Hero +         │
   │                  │                      │ filtered Core cards   │
   │                  │                      │ + Quickstart flow     │
   │◀── HTML ─────────│                      │                       │
   │                                                                 │
   │── click "Learn more" on lint card ─────────────────────────────▶│
   │                                                 Astro serves    │
   │                                                 /docs/lint      │
   │◀──────────────────────── docs page (200) ────────────────────────│
```

If a card's dedicated docs slug is not present in the collection, the selector either resolves the card to an explicitly allowed fallback link or excludes it — guaranteeing the click flow above never resolves to a 404.

### Open Questions

- [x] **OQ-1 (product):** ~~Should we keep a "workflow narrative" section after deleting `SpecDrivenSection`, or is the documented Quickstart flow already represented well enough by the feature cards alone?~~ **Resolved** — keep `QuickstartFlowSection`. It should tease the documented Quickstart experience in a way that inspires curiosity for visitors interested in tightening their quality checks, iterating with more confidence, and improving the production quality of their agents, with a clear CTA to `/docs/quickstart`.
- [x] **OQ-2 (product):** ~~Do we want to retain the mascot "Developer Patch" callout card visually but with documented content (e.g. a "Pro tip: run `lint` in CI" pointing to `/docs/quickstart#2-enforce-quality-in-ci-lint`), or remove that visual element entirely?~~ **Resolved** — remove for now; reintroduce only if/when there is a documented tip with a stable anchor.
- [x] **OQ-3 (engineering):** ~~Should the inventory live in `src/lib/` (used by Astro build) or `src/entities/` (per Clean Architecture rules in `.github/copilot-instructions.md` and `.github/instructions/software-architecture.instructions.md`)?~~ **Resolved** — keep `src/entities/*` and `src/use-cases/*` framework-free. `src/entities/feature.ts` defines plain TypeScript types with no imports. `src/lib/documented-features.ts` (adapter layer) owns all Zod schemas and runtime validation; it imports the entity type from `src/entities/feature.ts` (adapter→entity is the valid inward direction) and annotates `DOCUMENTED_FEATURES` against that imported type. The use-case selector in `src/use-cases/select-available-features.ts` operates on entity types from `src/entities/feature.ts` with no Zod dependency. This preserves the repository's Clean Architecture rule (entities and use-cases MUST NOT depend on frameworks) while still applying Zod validation at the adapter boundary where external content is loaded.
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
- `src/entities/feature.ts` *(new — plain TypeScript types only, no Zod: `HomepageFeatureInventoryItem`)*
- `src/use-cases/select-available-features.ts` *(new — pure selector function plus `ResolvedHomepageFeature` output type; no Zod imports; operates on entity types imported from `src/entities/feature.ts`)*
- `src/lib/documented-features.ts` *(new — Zod schemas, `HomepageFeatureInventoryItemSchema`, seeded inventory array validated with uniqueness check, and `DOCUMENTED_FEATURES` export)*
- `scripts/generate-docs-slugs.mjs` *(new — ESM fixture generator: resolves `src/content/docs/` using `fileURLToPath(new URL('../src/content/docs', import.meta.url))`, strips `.md` extensions, writes slug array as JSON to `tests/fixtures/docs-slugs.json`, exits with code 1 if directory not found)*
- `package.json` *(add `"fixture:docs-slugs": "node scripts/generate-docs-slugs.mjs"` script — no Astro build required, but `bash scripts/fetch-docs.sh` must be run first in a fresh checkout where `src/content/docs/` has not yet been created)*
- `tests/fixtures/docs-slugs.json` *(new — fixture listing known docs slugs; generated by `npm run fixture:docs-slugs`; see Test Data Strategy in Design)*
- `tests/use-cases/select-available-features.test.ts` *(new)*
- `tests/lib/documented-features.test.ts` *(new — schema and inventory shape; imports `tests/fixtures/docs-slugs.json` to assert all configured slugs are known)*

**Requirements**:
- Implements Story 2 (cards reflect documented features) and Story 5 ACs 2–3 (selector enforces inventory-backed link resolution — AC1 of Story 5 and non-inventory CTAs are enforced by editorial review and the link-integrity test in Task 6).
- `src/entities/feature.ts` exports only the plain TypeScript type `HomepageFeatureInventoryItem` — no Zod imports, preserving Clean Architecture entities-layer rules.
- `src/use-cases/select-available-features.ts` exports the `ResolvedHomepageFeature` output type and the `selectAvailableFeatures` function — no Zod imports; the selector operates on entity types from `src/entities/feature.ts`.
- `src/lib/documented-features.ts` owns all Zod schemas: `HomepageFeatureInventoryItemSchema` (with cross-field superRefine validation), the array schema with uniqueness refine, and the `DOCUMENTED_FEATURES` parsed array.
- Zod schema validates each inventory item has `id`, `title`, `summary`, `primaryDocsHref` (must match `^/docs/[^/]+$`), `primaryContentSlug` (must equal the slug segment captured from `primaryDocsHref`), optional `fallbackDocsHref`, and optional `fallbackContentSlug`; cross-field validation enforces that fallback href/slug are either both present or both absent.
- Selector returns resolved features with a single `docsHref`, preserving inventory order.
- Selector links to `primaryDocsHref` when the dedicated docs slug is present, falls back only to `/docs/quickstart` when both `fallbackDocsHref` and `fallbackContentSlug` are configured and the `quickstart` slug is present, and omits features with no resolvable docs route.
- Inventory seeds entries for all six documented features: `init`, `new`, `lint`, `copilot-setup`, `mcp-server`, and `agent-shell`.
- Tests follow the AAA pattern, use Chance.js for fixtures, and never mock fetch directly (no HTTP in this module).
- `scripts/generate-docs-slugs.mjs` is an ES module that resolves `src/content/docs/` using `fileURLToPath(new URL('../src/content/docs', import.meta.url))` (both imported from `node:url`), strips `.md` extensions, writes the resulting string array as JSON to `tests/fixtures/docs-slugs.json`, and exits with code 1 if the directory does not exist; commit the generated fixture file to source control.

**Verification**:
- [ ] `npm run fixture:docs-slugs` runs without error and writes `tests/fixtures/docs-slugs.json` (run `bash scripts/fetch-docs.sh` first if `src/content/docs/` does not yet exist; no Astro build required)
- [ ] `npm test tests/use-cases/select-available-features.test.ts` passes
- [ ] `npm test tests/lib/documented-features.test.ts` passes
- [ ] `npx biome check src/entities/feature.ts src/use-cases/select-available-features.ts src/lib/documented-features.ts scripts/generate-docs-slugs.mjs tests/use-cases/select-available-features.test.ts tests/lib/documented-features.test.ts` passes

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
- `src/pages/index.astro` *(call `selectAvailableFeatures(inventory, availableSlugs)` at build time; pass `resolvedFeatures` as a typed prop into `<HomePage client:only="react" resolvedFeatures={resolvedFeatures} />`)*
- `src/components/home/HomePage.tsx` *(accept `resolvedFeatures: ResolvedHomepageFeature[]` prop and forward to `CoreModulesSection`)*
- `tests/components/home/CoreModulesSection.test.tsx`

**Requirements**:
- Implements Story 2 and Story 6.
- Removes hardcoded card data; receives `resolvedFeatures: ResolvedHomepageFeature[]` as a prop (the selector is called in `index.astro`, not inside this component).
- Each card renders title, summary, and a "Learn more →" link to the selector-resolved `docsHref`.
- MCP card title is `MCP Server`; summary expands as `Model Context Protocol`.
- Agent Shell summary describes audit-trail wrapper of npm `script-shell` (matches `readme.md`).
- No fabricated version strings (`v2.0.1`, etc.); the version metadata block is removed.
- Accent colors for each card are sourced from a hardcoded per-feature map keyed on `feature.id` defined within `CoreModulesSection.tsx` (not passed through `resolvedFeatures`); the map must include an entry for each of the six known IDs: `init`, `new`, `lint`, `copilot-setup`, `mcp-server`, `agent-shell`.
- Section keeps Analog Terminal styling (surface tier, ghost border, ambient shadow).

**Verification**:
- [ ] `npm test tests/components/home/CoreModulesSection.test.tsx` passes
- [ ] Test asserts MCP expansion text appears in DOM
- [ ] Test asserts no `/^v\d+\.\d+\.\d+/` strings appear in any rendered card
- [ ] Test asserts no card title contains banned terms (`CLI Engine`, `Smart Linting`, `Multi-Agent`)
- [ ] Test asserts Agent Shell card description contains `audit-trail` and does not contain `sandboxed runtime`
- [ ] Test asserts that rendering `CoreModulesSection` with `resolvedFeatures` containing all six feature IDs results in each card having a non-empty, distinct accent color value (via inline `style` prop or CSS class name unique per feature ID)
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
- Primary CTA links to `/docs/quickstart`. Secondary CTA links to the Lousy Agents GitHub repository (`https://github.com/zpratt/lousy-agents`). No `/about` link shall be rendered.
- No invented version labels.

**Verification**:
- [ ] `npm test tests/components/home/HeroSection.test.tsx` passes
- [ ] Test asserts subhead does not contain `Multi-Agent`, `cognitive workloads`, `operational perimeter`, `hallucination loops`, `feedback loop`, or `logic feedback loop`
- [ ] Test asserts subhead text contains `init`, `lint`, and `MCP` (the three documented capabilities from the Task 3 requirements)
- [ ] Test asserts primary CTA `href` equals `/docs/quickstart`; test asserts secondary CTA `href` equals `https://github.com/zpratt/lousy-agents` and no anchor `href` equals `/about`
- [ ] `npx biome check src/components/home/HeroSection.tsx tests/components/home/HeroSection.test.tsx` passes
- [ ] Visual verification screenshot attached (desktop + mobile)

**Done when**:
- [ ] All verification steps pass
- [ ] Hero text and terminal output align with `src/content/local-docs/quickstart.md`

---

### Task 4: Replace `SpecDrivenSection` with `QuickstartFlowSection`

**Depends on**: Tasks 1, 2

**Objective**: Delete the fabricated three-pillar section and replace it with `QuickstartFlowSection` driven by the documented Quickstart steps.

**Affected files**:
- `src/components/home/SpecDrivenSection.tsx` *(delete)*
- `src/components/home/QuickstartFlowSection.tsx` *(new)*
- `src/components/home/HomePage.tsx`
- `tests/components/home/SpecDrivenSection.test.tsx` *(delete)*
- `tests/components/home/QuickstartFlowSection.test.tsx` *(new)*
- `tests/components/home/HomePage.test.tsx`

**Requirements**:
- Implements Story 3.
- `QuickstartFlowSection` renders exactly three steps named `init`, `lint` (in CI), and `MCP Server`, each linking to `/docs/quickstart` (anchor-level linking is out of scope; the base URL is sufficient and fragment validation is excluded by the standard link-normalization algorithm).
- Each step link carries an `aria-label` that is unique across the three steps and includes the step's full label (e.g. `aria-label="Learn about init"`, `aria-label="Learn about lint (in CI)"`, `aria-label="Learn about MCP Server"`), satisfying WCAG 2.1 AA SC 2.4.4 for three adjacent anchors pointing to the same URL.
- Section copy is paraphrased from `src/content/local-docs/quickstart.md` and shall not introduce undocumented behavior.
- Primary CTA at the bottom of the section links to `/docs/quickstart`.

**Verification**:
- [ ] `npm test tests/components/home/QuickstartFlowSection.test.tsx` passes
- [ ] Test asserts each of the three step elements renders an anchor whose `href` equals `/docs/quickstart`
- [ ] Test asserts each step anchor has a distinct `aria-label` that contains the step's full label (`"Learn about init"`, `"Learn about lint (in CI)"`, `"Learn about MCP Server"` respectively)
- [ ] `tests/components/home/SpecDrivenSection.test.tsx` no longer exists
- [ ] `npm test tests/components/home/HomePage.test.tsx` passes — asserts `SpecDrivenSection` is not rendered
- [ ] `npx biome check` passes for all touched files
- [ ] Test asserts rendered `QuickstartFlowSection` contains no text matching `Protocol.*compliance` or `Protocol compliance enforcement`
- [ ] Visual verification screenshot attached

**Done when**:
- [ ] All verification steps pass
- [ ] No reference to `Define the Spec`, `Mock the World`, `Atomic Deploy`, `mocking engine`, or `Protocol compliance` exists in `src/components/home/`

### Task 5: Remove `DeveloperPatch` per OQ-2 resolution

**Depends on**: Tasks 1, 4

**Objective**: Delete the fabricated `--break-loop` callout.

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
- `tests/fixtures/docs-slugs.json` *(must exist — created in Task 1; see Test Data Strategy in Design)*
- `tests/components/home/homepage-link-integrity.test.tsx` *(new — unit test that walks `HomePage` rendered output and asserts each internal anchor `href` (starting with `/`) corresponds to either a slug in `tests/fixtures/docs-slugs.json` or a static page, applying the standard link-normalization algorithm defined in Story 5; external links are excluded from the check)*
- `tests/e2e/homepage.spec.ts` *(new or extended — Playwright walks each internal homepage link (href starting with `/`), applies the standard link-normalization algorithm defined in Story 5 before issuing the request (fragment and query string are stripped; `/docs/<slug>` remains a routable URL in e2e without slug translation), then asserts the underlying internal page returns 200; external links are excluded)*

**Requirements**:
- Implements Story 5 and Story 6.
- Unit test fails with a message naming the missing slug if an internal card or CTA `href` (starting with `/`) points to an unmapped internal route.
- The unit test shall render `HomePage` with `resolvedFeatures` produced by calling `selectAvailableFeatures(inventory, docsSlugs)` where `docsSlugs` is imported from `tests/fixtures/docs-slugs.json`, so that all inventory-backed anchors present in the fixture are exercised.
- Unit test asserts each card title rendered by `CoreModulesSection` matches one of the six expected titles from the inventory: `init`, `new`, `lint`, `copilot-setup`, `MCP Server`, `Agent Shell`. These titles are deterministic (hardcoded in the inventory) and require no docs-content fixture.
- Unit test also asserts that no card description rendered by `CoreModulesSection` contains any banned coined term from Story 6 AC1 ("cognitive workloads", "operational perimeter", "hallucination loops", "feedback loop", "logic feedback loop") (vocabulary check for Story 2 AC5).
- External links (href not starting with `/`) are excluded from the slug-existence check in the unit test.
- In the unit test, apply all steps of the standard link-normalization algorithm (including step 6 slug translation) before checking slug existence in the fixture. In the e2e spec, apply steps 0–5 only (lowercase, strip fragment, strip query string, decode percent-encoding, collapse consecutive slashes, strip trailing slash) before issuing the Playwright request; step 6 (slug translation) is inapplicable in e2e because the test issues a real HTTP request to the full routable path (`/docs/lint`, not `lint`).
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
