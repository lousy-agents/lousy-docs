# Search Implementation Spec

## Problem Statement

Users of the lousy-docs site need a way to search documentation content to quickly find commands, features, and configuration details without manually navigating through pages.

## Personas

- **Developer**: Uses the docs site to look up CLI commands, flags, and configuration options while working
- **New User**: Explores the documentation to understand the lousy-agents ecosystem and find relevant getting-started content

## Recommendation: Pagefind

After reviewing the corpus size (~6,000 words, 6 pages), the Astro + Cloudflare Pages stack, and the goal of accurate results with the best UX, **Pagefind** is the right tool — not vector search.

Key advantages:
- Zero infrastructure — index ships as static files alongside the site
- Exact and partial word matching with relevance ranking
- First-class Astro integration via `astro-pagefind`
- Accessible, responsive UI with keyboard navigation and ARIA support
- $0 cost with no free-tier ceilings

## Acceptance Criteria (EARS Format)

### Integration and Indexing

- [x] **When** the site is built, **the system shall** produce a Pagefind search index at `dist/pagefind/`
- [x] **When** `astro-pagefind` is configured, **the system shall** place the integration last in the Astro integrations array so it runs after all other integrations have emitted HTML
- [x] **When** a docs page is built, **the system shall** mark the main content area with `data-pagefind-body` so only documentation content is indexed
- [x] **When** the search overlay is rendered, **the system shall** mark it with `data-pagefind-ignore` so search UI elements are not indexed

### Search UI

- [x] **When** the user clicks the search button in the header, **the system shall** open a search overlay with a text input field
- [x] **When** the user presses `Ctrl+K` (or `Cmd+K` on macOS), **the system shall** toggle the search overlay open/closed
- [x] **When** the user presses `Escape` while the search overlay is open, **the system shall** close the overlay
- [x] **When** the user clicks outside the search panel (on the backdrop), **the system shall** close the overlay
- [x] **When** the search overlay opens, **the system shall** focus the search input field
- [x] **When** the user types a query, **the system shall** display matching results with highlighted excerpts
- [x] **When** results are displayed, **the system shall** show sub-results grouped by heading sections within each page
- [x] **When** the search overlay is open, **the system shall** prevent background page scrolling

### Responsive Design

- [x] **When** the site is viewed on desktop, **the system shall** render a search button in the header toolbar
- [x] **When** the site is viewed on mobile, **the system shall** render a search button in the mobile header

### Theming

- [x] **When** the search UI is rendered, **the system shall** style it using the Analog Terminal design system colors and typography

### Highlighting

- [x] **When** a user navigates to a page from search results, **the system shall** load the Pagefind highlight script to mark search terms on the destination page

## Tasks

- [x] Install `astro-pagefind` with exact version
- [x] Configure Astro integration in `astro.config.mjs` (last position)
- [x] Add `data-pagefind-body` to docs content area in `[...slug].astro`
- [x] Add `data-pagefind-ignore` to search overlay
- [x] Add search button to SiteHeader (desktop and mobile)
- [x] Create Pagefind search overlay in BaseLayout.astro
- [x] Add keyboard shortcuts (Ctrl/Cmd+K, Escape)
- [x] Add `pagefind-highlight.js` to BaseLayout
- [x] Style Pagefind UI with CSS custom properties matching Analog Terminal theme
- [x] Write tests for search button in SiteHeader
- [x] Verify build produces Pagefind index (10 pages indexed)

## Data Flow

```
Build Time:
  Astro Build → HTML pages → Pagefind Indexer → dist/pagefind/ (static index files)

Runtime:
  User clicks Search / presses Ctrl+K
    → Search overlay opens
    → User types query
    → Pagefind JS loads index chunks on demand
    → Results rendered with highlighted excerpts and sub-results
    → User clicks result
    → Navigates to page with ?highlight= param
    → pagefind-highlight.js marks matching terms on page
```

## Sequence Diagram

```
User          SiteHeader(React)     BaseLayout(Astro)      Pagefind(JS)
 │                │                      │                     │
 │─click search──▶│                      │                     │
 │                │─dispatch             │                     │
 │                │ "open-search"───────▶│                     │
 │                │                      │─show overlay        │
 │                │                      │─focus input         │
 │─type query────▶│                      │────────────────────▶│
 │                │                      │                     │─load index
 │                │                      │                     │─search
 │                │                      │◀─results────────────│
 │◀──────────────render results──────────│                     │
 │─click result──▶│                      │                     │
 │                │─navigate to page─────│                     │
 │                │                      │─highlight.js marks──│
 │◀──────────────highlighted page────────│                     │
```

## When to Reconsider Vector Search

Revisit the Vectorize approach if any of these become true:
- The corpus grows past ~50,000 words and users need conceptual/synonym-based retrieval
- Natural-language Q&A is added where users expect conversational answers
- Telemetry shows keyword search is failing for real queries
