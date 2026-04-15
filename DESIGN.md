# Design System: Lousy Docs — “The Analog Terminal”

## 1. Visual Theme & Atmosphere

This design system is a deliberate rejection of sanitized, template-driven UI. Our Creative North Star is **The Analog Terminal**—a vision of a parallel vintage future where high-performance engineering meets the tactile warmth of a custom-built workshop.

The aesthetic blends the precision of modern dev-tools with the imperfect, lived-in character of lo-fi hardware. We break the rigid digital grid through **Intentional Asymmetry**: layered surfaces, “stitched” patchwork textures inspired by the Lousy Agent brand character, and a visual hierarchy driven by tonal depth rather than hard lines. This is not just a UI; it is an artifact—an engineer’s console that feels hand-assembled, authoritative, and deliberately unpolished.

**Key Characteristics:**

- High-density information designed for power users, not casual browsers
- “Hand-stitched” personality expressed through dashed borders and tonal layering
- Earthy “Lichen & Slate” palette evoking oxidized metals and weathered fabrics
- Terminal-like precision in typography and data presentation
- Spacious yet dense: generous whitespace between sections, compact data within them

-----

## 2. Color Palette & Roles

The palette is rooted in an earthy, organic “Lichen & Slate” foundation—oxidized metals, weathered fabrics, and phosphor glow. Designed to reduce eye strain during long reading sessions while conveying heritage and reliability.

### Core Tokens

- **Primary — “Terminal Glow”** (`#bdce89`): The signature lichen-green. Used for high-priority actions, key status indicators, active states, and link text. This is the system’s visual anchor.
- **Primary Container — “Moss Depth”** (`#5f6e34`): A deeper, muted green. Used for backgrounds of primary-colored containers and the dark end of button gradients.
- **Secondary — “Cautionary Amber”** (`#eebd8e`): A warm, sun-baked tone. Used for highlights that break the green monochrome—warnings, secondary interactive states, and accent elements.
- **Background — “Powered-Down CRT”** (`#121410`): The deep, matte base of the entire canvas. An almost-black with a faint olive undertone that avoids the harshness of pure black.
- **On-Background — “Phosphor White”** (`#e6ead8`): The primary text color. A warm off-white with a subtle greenish cast, evoking phosphor screen text.
- **Outline Variant — “Ghost Seam”** (`#46483e`): The default token for ghost borders and structural hints, applied at low opacity. Typical opacity tiers: 15% for minimal structural hints (table cells, card edges), 20–25% for content dividers, landmarks, and code block frames, 30% for stronger visual boundaries (table headers). Full-strength usage is acceptable for small, non-structural UI affordances such as scrollbar thumbs.
- **Error — “Fault Signal”** (`#ffb4ab`): Reserved for critical failure states and validation errors. A soft coral-red that remains legible without being alarming.
- **Primary Highlight** (`rgba(189, 206, 137, 0.25)`): A translucent primary tint used for search result marks and text highlighting. Defined as a CSS custom property (`--color-primary-highlight`).

### Diagnostic Severity Tokens

These tokens extend the core palette for lint diagnostics, log entries, and system feedback. They are semantic aliases that map to existing palette values—no new colors are introduced.

|Severity|Token               |Maps To                |Usage                                           |
|--------|--------------------|-----------------------|------------------------------------------------|
|Error   |`diagnostic-error`  |`error` (`#ffb4ab`)    |Critical failures, validation errors, ERR badges|
|Warning |`diagnostic-warning`|`secondary` (`#eebd8e`)|Cautionary findings, WARN badges                |
|Info    |`diagnostic-info`   |`primary` (`#bdce89`)  |Informational notes, INFO badges                |
|Pass    |`diagnostic-pass`   |`primary` (`#bdce89`)  |Checkmarks, passing indicators in data tables   |
|Fail    |`diagnostic-fail`   |`error` (`#ffb4ab`)    |X-marks, failing indicators in data tables      |


> **Note:** These tokens do not introduce new hex values. They are semantic aliases that ensure diagnostic UI uses the system palette consistently. A WARN badge uses the same `secondary` amber as any other cautionary accent in the system.

### Surface Hierarchy & Nesting

Treat the UI as a series of physical plates bolted onto the console. Each surface tier creates depth through tonal shift alone—no drop shadows required for static layering.

|Tier         |Token                      |Hex      |Usage                                        |
|-------------|---------------------------|---------|---------------------------------------------|
|1. Base      |`surface`                  |`#121410`|Primary canvas, full-page backgrounds        |
|2. Sectioning|`surface-container-low`    |`#1a1c18`|Sidebars, nav panels, sunken regions         |
|3. Components|`surface-container`        |`#1e201c`|Cards, content containers, inline code blocks|
|4. Raised    |`surface-container-high`   |`#252720`|Active panels, hover states, elevated UI     |
|5. Floating  |`surface-container-highest`|`#333531`|Modals, popovers, floating overlays          |


> **Note:** `surface-container-lowest` is a conceptual tier below `surface`, referenced by “(recessed)” annotations in §4 and §5. It does not have a dedicated CSS custom property—use `surface` (`#121410`) for these recessed contexts.

### The “No-Line” Rule

High-contrast or opaque borders are prohibited for layout sectioning. Containment is achieved through:

1. **Background Shifts (preferred):** Distinguish a sidebar using `surface-container-low` against the main `surface` background. The tonal difference creates the boundary.
1. **Ghost Separators:** When a tonal shift alone is insufficient (e.g., sidebar edges, table-of-contents rails), use 1px solid `outline-variant` at 15% opacity. These low-opacity ghost lines provide structural guidance without visible hardness. The accepted range is 15–30% depending on context (see the opacity tiers in the Outline Variant token description above); never use `outline-variant` at full opacity for layout borders.
1. **Spacing Voids:** Use the spacing scale to create visual separation between grouped elements within a container.
1. **Dashed Patchwork (decorative only):** When a “stitched” seam is needed for brand personality, use 1px or 2px dashed lines with `outline-variant` at 15% opacity. This is a texture, not a structural border.

### The Glass & Gradient Rule

For floating panels (modals, search overlays), use semi-transparent `surface-container-highest` with a `backdrop-filter: blur(8px–12px)` to allow underlying content to bleed through softly. This creates a frosted-glass effect that evokes CRT light diffusion. Overlay backdrops use `rgba(0, 0, 0, 0.6)` for content dimming—this is the sole permitted use of pure black in the system.

For primary buttons, use a subtle linear gradient from `primary` (`#bdce89`) to `primary-container` (`#5f6e34`) to mimic the soft glow of a backlit physical button.

### WCAG Compliance

All surface/text combinations must meet WCAG AA accessibility requirements. Contrast minimums come from WCAG 2.1; touch target guidance draws on 2.2:

- **Body text**: 4.5:1 ratio against its background
- **Placeholder text**: 4.5:1 ratio—do not rely on low-opacity values without verifying contrast against the specific background surface. For inputs on `surface` (`#121410`), `rgba(230, 234, 216, 0.58)` is the tested minimum after compositing.
- **Focus indicators**: `:focus-visible` outlines must achieve 3:1 contrast against adjacent colors per WCAG 2.1 SC 1.4.11 (Non-text Contrast); use `primary` (`#bdce89`) at 2px minimum width, not `outline-variant` which only achieves ~1.3–2.0:1 on dark surfaces (as low as ~1.3:1 on `surface-container-highest`) and fails the 3:1 minimum
- **Interactive targets**: All clickable/tappable elements must meet minimum 44×44px touch target size. This is a stricter project standard that exceeds WCAG 2.2 SC 2.5.8’s 24×24px minimum.

-----

## 3. Typography Rules

Our typography is a dialogue between human-centric editorial warmth and cold machine logic. The system uses a deliberate split between geometric display type and clean body type, with monospace reserved as a brand signal for “truth” and “data.”

### Font Stack

|Role                |Family                             |Character                                                                                                                                                                                            |
|--------------------|-----------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|Display & Headlines |Space Grotesk                      |Geometric, technical, authoritative—like a headline in a 1970s engineering manual. Tight letter-spacing (`-0.02em`) creates editorial density.                                                       |
|Body & Instructional|Manrope                            |Clean, humanist sans-serif. The “Human Interface” voice—legible and warm, used for descriptions, documentation prose, and UI labels. Relaxed line-height (`1.7`) for comfortable long-form reading.  |
|Technical & Code    |`"Courier New", Courier, monospace`|The raw data voice. Used for all code snippets, CLI commands, inline code, terminal blocks, and search inputs. Monospace in this system is not just for code—it signals precision and machine output.|

### Hierarchy & Scale

- **Display (H1):** Space Grotesk, 700 weight, 2rem. Tight letter-spacing (`-0.02em`). Used for page titles and hero sections.
- **Section (H2):** Space Grotesk, 700 weight, 1.5rem. Establishes content zones.
- **Subsection (H3):** Space Grotesk, 600 weight, 1.25rem. Component and feature headers.
- **Detail (H4):** Space Grotesk, 600 weight, 1rem, slightly muted (`rgba(230, 234, 216, 0.85)`). Sub-feature labels.
- **Body:** Manrope, 400 weight, 1rem, line-height 1.7. Primary reading text.
- **Small/Meta:** Manrope, 400 weight, 0.875rem. Metadata, timestamps, secondary labels.

### The Density Principle

Use extreme contrast in scale to create the “dense terminal” aesthetic. A large `display` title should sit adjacent to small `label-sm` metadata. This juxtaposition reinforces the information-dense, power-user character of the system.

-----

## 4. Elevation & Depth

We reject traditional drop shadows in favor of **Tonal Layering** and **Ambient Glows**.

- **The Layering Principle:** Depth is achieved by stacking surface tiers. Place a `surface` (recessed) element on a `surface-container-low` background to create a “sunken” look. Place a `surface-container-high` element to create a “raised” look. No shadow is required—the tonal shift provides the lift.
- **Ambient Shadows:** When an element must truly float (modals, search overlays, popovers), use a shadow tinted with `on-background` (`#e6ead8`) at 6% opacity with a 40px blur radius. It should feel like a soft glow bleeding from a CRT monitor, not a hard drop shadow.
- **The “Ghost Border”:** For decorative or structural separation (card edges, panel boundaries), use `outline-variant` (`#46483e`) at 15% opacity. It should be barely perceptible—a change in texture, not a visible line. **This does not apply to interactive focus indicators**—see the WCAG Compliance section in §2 for `:focus-visible` requirements.
- **Stitch Detail:** Inspired by the Lousy Agent brand character’s patches, use 2px dashed ghost borders in `secondary` or `outline-variant` colors to denote “beta,” “experimental,” or “hand-stitched” containers. This patchwork motif is the system’s signature decorative element.

-----

## 5. Component Stylings

### Buttons

- **Primary:** Solid `primary` gradient (from `#bdce89` to `#5f6e34`), dark text for legibility on the light primary surface (Ant Design’s dark algorithm auto-calculates the contrast color). `md` (0.375rem / 6px) roundedness. Comfortable padding for touch targets.
- **Secondary:** Ghost-style. Transparent background, `primary` text, solid `primary` (`#bdce89`) border at 20% opacity. On hover, background fills with a whisper-soft `primary` tint.
- **Tertiary:** `surface-container-highest` background, monospace labels. Used for technical actions and “terminal command” style affordances.
- **Hover Behavior:** Smooth 150ms transitions. Primary buttons subtly darken; secondary buttons gain a faint background tint.
- **Shape:** Consistent `md` roundedness (6px) across all button variants. Never pill-shaped, never fully squared—a machined, technical feel.

### Border Radius Scale

The system defines three radius tiers:

- **`sm`** (4px): Small controls and compact elements.
- **`md`** (6px): The default. Buttons, cards, inputs, and most interactive components.
- **`lg`** (8px): Larger containers and elevated panels.
- **Exception — inline code:** Inline code in prose uses 3px—between `sm` and the 2px used for search marks—matching the compact scale of inline text elements.
- **Exception — full-panel overlays:** The search modal uses 12px for a softer floating appearance. This is an explicit exception, not a general-purpose radius.

### Input Fields & Terminal Blocks

- **The Terminal Input:** Dark `surface` (recessed) background with a `primary`-colored cursor blink. Text must be monospace (`"Courier New", Courier, monospace`). This applies to all search inputs, form fields, and any input that accepts user text—the monospace font is a non-negotiable brand signal.
- **Placeholder text:** Must achieve WCAG 2.1 AA 4.5:1 contrast against the input background. For inputs on `surface` (`#121410`), `rgba(230, 234, 216, 0.58)` is the tested minimum after compositing. If the input uses a different surface token, re-verify the rendered contrast.
- **Focus State:** Border color shifts to `primary` (`#bdce89`) with 2px outline width. See §2 WCAG Compliance.
- **Validation:** Use `error` (`#ffb4ab`) for critical failures. Use `secondary` amber (`#eebd8e`) for warnings.

### Cards & Containers

- **No Dividers:** Separate items using spacing increments (`1.5` / 0.375rem to `3` / 0.75rem), never horizontal rules or border lines.
- **Nesting:** A card should be `surface-container` sitting on a `surface-container-low` parent. Raised cards use `surface-container-high`.
- **Corner Style:** Consistent `md` roundedness (6px)—subtly softened edges that feel precision-machined, not playful.
- **Terminal Frame (optional):** For signature “terminal window” containers, add a solid 4px top-bar using `primary-container` as the header accent. This mimics a terminal title bar.

### Content Prose Elements

Markdown-rendered content in the docs area has opinionated brand styling:

- **Links:** `primary` text with a `primary` underline at 30% opacity. On hover, the underline strengthens to full `primary`. No standard blue—ever.
- **Inline code:** `secondary` amber text on a `surface-container` background with 3px radius. The amber color signals “data” or “literal value” within body prose.
- **Code blocks (`<pre>`):** `surface-container-low` background with a 1px `outline-variant` border at 20% opacity and `md` (6px) radius. Content text uses `on-background` color.
- **Blockquotes:** 3px solid `primary-container` left border with a 10% `primary-container` tinted background. Text is slightly muted (`on-background` at 80%). This is the “terminal sidebar accent” pattern.
- **Heading underlines (H2):** `outline-variant` at 25% opacity—a content landmark stronger than structural ghost separators but within the accepted opacity range.
- **Table headers:** `surface-container-low` background, `primary` text, uppercase with 0.05em letter-spacing. Border-bottom uses `outline-variant` at 30% opacity—the strongest ghost separator tier. This “terminal column header” treatment reinforces the engineering aesthetic.
- **Table cell borders:** `outline-variant` at 15% opacity—standard ghost separator weight.

### Special Component: “The Patch”

A custom callout container for “Pro-Tips,” “Developer Notes,” or “Experimental” features. Uses a subtle muted amber background with a `secondary` (`#eebd8e`) dashed border on one side only (asymmetric), optionally incorporating a small 16×16px version of the brand character in the corner. This is the system’s signature “hand-stitched” element.

### Content Dividers

Markdown `<hr>` elements are styled as solid 1px `outline-variant` lines at 25% opacity—intentionally stronger than the 15% ghost borders used for structural separation, serving as visible content landmarks.

### The Patchwork Divider (specialized)

For sections requiring extra brand personality (e.g., “Experimental” or “Coming Soon” zones), a dashed variant of the divider may be used: a repeating dashed pattern with `outline-variant` at 25% opacity. This is a decorative flourish, not a replacement for the standard `<hr>` styling.

-----

## 5b. Interactive Tool Components

This section defines patterns for interactive tool pages—browser-based utilities that accept user input and display structured diagnostic output (e.g., a hypothetical lint playground). These components extend the core system rather than replacing it. The patterns below are proposed conventions for future tool pages; implement them when the first interactive tool page is built.

### Split-Panel Layout

Interactive tool pages use a horizontal split-panel layout within the main content area. This is a variant of the standard Sidebar + Content layout (§6), not a replacement.

- **Input Panel:** ~55% width. Uses `surface` (recessed) background for the primary input area, reinforcing that it is an editable zone distinct from the surrounding container surface.
- **Output Panel:** ~45% width. Uses the same surface tier as the parent container. Content flows top-to-bottom: score display → data table → diagnostic log.
- **Panel Boundary:** Achieved through a tonal shift between the input area’s recessed `surface` and the output panel’s `surface-container` background—no opaque border. A ghost separator at 15% opacity may be added between the panels if the tonal shift alone is insufficient.
- **Responsive Behavior:** Below the mobile breakpoint (768px), panels stack vertically—input on top, output below. The input area reduces to a minimum height of 200px with a drag handle to resize.

### Code Input Area

The primary input for tool pages where users paste file contents. This is an extension of “The Terminal Input” pattern from §5.

- **Surface:** `surface` (recessed) background—the deepest tier, reinforcing “editable zone.”
- **Line Numbers:** Monospace text in `on-background` at 40% opacity, displayed in a narrow left gutter on `surface-container-low` background. The gutter boundary uses the tonal shift alone—no border.
- **Header Bar:** A small label bar above the input area using the §5 Content Prose table header pattern: `surface-container-low` background, monospace label text in `on-background` at 70% opacity, uppercase. Displays context like the active file type and encoding metadata (e.g., “UTF-8 | LF | MD”).
- **Placeholder:** Monospace text using the tested minimum opacity for WCAG compliance (see §5 Input Fields). Content should hint at what to paste: `> paste your copilot-instructions.md or SKILL.md here...`
- **Cursor:** `primary`-colored blink, consistent with all terminal inputs in the system.

### Target Selector

A row of selectable options above the input area that controls what type of content is being analyzed.

- **Inactive Tabs:** Transparent background with `outline-variant` border at 30% opacity, muted `on-background` text at 60% opacity, `md` radius. The transparent fill allows the parent surface to show through, visually subordinating inactive options.
- **Active Tab:** Solid `primary` (`#bdce89`) background fill with dark text (`#121410`) for high contrast on the light surface. Border uses `primary` at 50% opacity. The `:focus-visible` ring uses `on-background` (`#e6ead8`) to contrast clearly against the bright primary fill. `md` radius.
- **Spacing:** Compact row with 4px gaps between tabs. The action button (e.g., “RUN_LINT”) sits at the far right of the row, using primary button styling.

### Score Display

A prominent numerical readout for quality scores or summary metrics.

- **Number:** Space Grotesk, 700 weight, 3rem minimum—the largest text element on the page. Uses `on-background` color. The denominator (”/ 100”) uses the same font at 1.25rem in `on-background` at 60% opacity.
- **Section Label:** Monospace, uppercase, `on-background` at 70% opacity (e.g., “QUALITY_SCORE”). Follows the §3 Detail (H4) pattern.
- **Progress Bar:** A segmented horizontal bar beneath the score. Filled segments use `primary` (`#bdce89`); empty segments use `surface-container` (`#1e201c`). The segmented appearance is achieved through individual elements or a repeating pattern with 2px gaps—not a smooth CSS gradient. This reinforces the discrete, data-point character of the system.
- **Score Thresholds (optional):** For scores below 50, the filled segments may use `error` (`#ffb4ab`) instead of `primary`. Between 50–75, `secondary` (`#eebd8e`). Above 75, `primary`. This is an optional enhancement—single-color `primary` is the default.

### Diagnostic Data Table

A compact table for displaying per-item analysis results (e.g., per-command lint scores). Extends the §5 Content Prose table styling with additional conventions for pass/fail indicators.

- **Column Headers:** Follow the existing table header pattern—`surface-container-low` background, `primary` text, uppercase monospace, 0.05em letter-spacing, `outline-variant` bottom border at 30% opacity.
- **Data Cells:** Monospace text in `on-background`. Cell borders use `outline-variant` at 15% opacity.
- **Pass/Fail Indicators:** Use `diagnostic-pass` (`#bdce89`) for checkmarks (✓) and `diagnostic-fail` (`#ffb4ab`) for x-marks (✗). These are the only colored elements within data cells—all other cell text uses `on-background`.
- **Score Column:** Right-aligned numeric values in monospace. Scores below 50.0 use `diagnostic-fail` color; scores above 75.0 use `diagnostic-pass`; scores between use `on-background`.
- **Data Values vs. UI Labels:** Column headers are UPPER_SNAKE_CASE (they are UI labels). Data values within cells use their natural format—lowercase for npm script names (`test`, `build`, `lint`), slash-delimited for rule IDs (`instruction/command-not-in-code-block`). The UPPER_SNAKE_CASE convention applies to the system chrome, not the data it presents.

### Diagnostic Log Entries

A list of individual diagnostic findings, styled as compact log entries.

- **Layout:** Each entry is a self-contained block with two lines. Line 1: severity badge + rule ID + message. Line 2: file path and location in dimmed text. Entries are separated by spacing voids (1rem), not borders.
- **Severity Badges:** Small inline badges using `sm` radius (4px), monospace uppercase text, with background fills:
  - **ERR:** `diagnostic-error` (`#ffb4ab`) background at 20% opacity, `error` text at full strength.
  - **WARN:** `diagnostic-warning` (`#eebd8e`) background at 20% opacity, `secondary` text at full strength.
  - **INFO:** `diagnostic-info` (`#bdce89`) background at 15% opacity, `primary` text at full strength.
- **Rule ID:** Monospace, `on-background` at 70% opacity, displayed in brackets (e.g., `[instruction/command-not-in-code-block]`). Follows the natural format of the rule—not UPPER_SNAKE_CASE.
- **Message:** Manrope body text in `on-background`. Plain language, sentence case (e.g., “build is not documented in a code block”).
- **File Path:** Monospace, `on-background` at 50% opacity, 0.875rem. Follows the pattern `path/to/file.md:L14:C1`.

### CLI Equivalent Block

A command block at the bottom of the output panel that shows the CLI command equivalent of the current analysis. This directly reuses the §5 Terminal Frame and code block patterns.

- **Container:** `surface-container-low` background, 1px `outline-variant` border at 20% opacity, `md` radius.
- **Header Label:** Monospace, uppercase, `on-background` at 70% opacity (e.g., “CLI_EQUIVALENT”).
- **Command Text:** Monospace, `on-background`, preceded by a `$` prompt character in `primary` at 50% opacity.
- **Copy Button:** Small icon button in the top-right corner of the container, using the ghost button pattern (transparent background, `primary` icon at 60% opacity, strengthening to full on hover).

### Empty State

Displayed in the output panel when no input has been provided. Uses the system’s center-alignment exception for empty states (§6).

- **Container:** Centered within the output panel. Ghost border using `outline-variant` at 15% opacity, dashed style (the “stitch” pattern from §4), `md` radius.
- **Heading:** Monospace, uppercase, `on-background` at 70% (e.g., “AWAITING_INPUT”).
- **Description:** Manrope, `on-background` at 50%, 0.875rem.
- **Supported File List:** Monospace, `on-background` at 40%, 0.875rem. Bulleted with the `·` character.

-----

## 6. Layout Principles

### Grid & Structure

- **Max Content Width:** Centered content area with comfortable reading width for documentation prose.
- **Sidebar + Content:** Two-panel layout with a `surface-container-low` sidebar on the left and `surface` main content area. The tonal shift defines the primary boundary, reinforced by a ghost border (`outline-variant` at 15% opacity) on the sidebar's right edge.
- **Left-Aligned by Default:** Text and content blocks are left-aligned, terminal-style. Center alignment is reserved for hero sections and empty states only.

### Collapsible Sidebar (Proposed)

> **Not yet implemented.** The following pattern is a design target for pages requiring maximum horizontal space (interactive tool pages, playground layouts). Implement when the first such page is built.

- **Collapsed State:** Sidebar reduces to icon-width only (~48px). Navigation labels are hidden; only icons are visible. The active page indicator (e.g., `primary-container` background fill on the active item) remains visible on the icon.
- **Toggle:** A small icon button at the top of the sidebar toggles between collapsed and expanded states. Uses the ghost button pattern—transparent background, `on-background` icon at 60% opacity. The toggle should use a chevron (« / ») rather than a hamburger to signal “collapse” vs. “expand.”
- **Default State:** The sidebar defaults to expanded on documentation prose pages and collapsed on interactive tool pages. The user’s preference is preserved via local state for the session.
- **Transition:** 150ms ease-out width transition, consistent with the system’s hover transition timing.

### Spacing & Rhythm

- **Base Unit:** 4px micro-spacing, 8px for component-level gaps.
- **Vertical Rhythm:** Consistent spacing between related text blocks using 1rem–2rem increments.
- **Section Margins:** Generous 2.5rem–3rem between major content sections for clear visual grouping.
- **Reading Line Height:** Body text uses 1.7 line-height for comfortable long-form reading.

### Responsive Behavior

- **Mobile breakpoint:** 768px. Below this, the sidebar collapses into a drawer overlay.
- **Touch targets:** Minimum 44×44px for all interactive elements (project standard, exceeds WCAG 2.2 SC 2.5.8’s 24×24px minimum).
- **Content reflow:** Single-column layout on mobile with full-width cards and reduced heading sizes.
- **Progressive disclosure:** Navigation collapses to a hamburger menu; content density is preserved.
- **Tool page reflow:** Split-panel layouts stack vertically below 768px. The input panel appears first (top), the output panel second (below), maintaining the natural workflow order.

-----

## 7. Do’s and Don’ts

### Do

- **Do** lean into asymmetry. Offset headers, use varied card widths, and break the rigid grid intentionally.
- **Do** use monospace for any string that could be interpreted as data, a command, or machine output.
- **Do** use the “stitch” pattern (dashed lines) sparingly to highlight hand-crafted or “lo-fi” sections.
- **Do** ensure high contrast for all text. `on-background` text on `surface` must be crisp and legible.
- **Do** prioritize information density. Power users prefer seeing more data at a glance—use `body-sm` for secondary metadata.
- **Do** verify WCAG contrast ratios for every new surface/text combination before committing.
- **Do** distinguish between UI labels and data values. Section headers and component labels use UPPER_SNAKE_CASE; data content within tables and diagnostics uses its natural format (lowercase, slash-delimited, etc.).

### Don’t

- **Don’t** use high-contrast or opaque borders for layout sectioning. Use tonal shifts, ghost separators (≤30% opacity), or spacing instead.
- **Don’t** use standard blue for links. Use `primary` for standard links; `secondary` is permitted only for accent links on the base `surface` (`#121410`) background where AA contrast is verified.
- **Don’t** use large, round “pill” buttons. Stick to `md` (6px) roundedness to maintain the machined, hardware feel.
- **Don’t** use pure black (`#000000`) for surfaces or backgrounds. Use the `surface` palette to preserve the earthy, organic depth. (Exception: translucent overlay backdrops use `rgba(0, 0, 0, 0.6)` for content dimming—see §2 Glass & Gradient Rule.)
- **Don’t** use traditional black drop shadows. Use tonal layer shifts or the ambient glow system described in §4.
- **Don’t** center body text or layout content. Left-aligned, terminal-style composition is the default. Center alignment is reserved for hero sections, empty states, and centered modals/overlays (which are centered by convention).
- **Don’t** add decorative metrics or telemetry indicators that don’t reflect real data. Fake CPU loads, latency counters, and uplink indicators erode developer trust. If a metric is displayed, it must be sourced from actual system state.

-----

## 8. Design System Notes for AI Generation

When prompting AI tools (Stitch, Copilot, Claude) to generate new screens or components for this project, use these descriptive references:

### Atmosphere Language

- “Engineer’s console from a parallel vintage future”
- “Dense terminal dashboard with hand-stitched personality”
- “Earthy lichen-and-slate palette on a powered-down CRT canvas”
- “Lo-fi hardware aesthetic—machined edges, not rounded pills”

### Color References (always include hex)

- Primary: “Terminal Glow lichen-green (`#bdce89`)”
- Primary Container: “Moss Depth deep green (`#5f6e34`)”
- Background: “Powered-Down CRT deep slate (`#121410`)”
- Secondary: “Cautionary Amber sun-baked tone (`#eebd8e`)”
- Text: “Phosphor White warm off-white (`#e6ead8`)”
- Outline Variant: “Ghost Seam slate (`#46483e`)” — use at 15–30% opacity
- Error: “Fault Signal coral-red (`#ffb4ab`)”
- Surface tiers: `#121410` → `#1a1c18` → `#1e201c` → `#252720` → `#333531` (see §2 table)

### Component Prompts

- “Create a terminal-style card with a solid 4px primary-container top-bar, ghost border at 15% opacity, and recessed surface background”
- “Design a ghost-style secondary button with subtle solid primary border at 20% opacity that strengthens on hover”
- “Add a monospace search input on dark recessed surface with primary-colored cursor blink and phosphor-white placeholder text”

### Interactive Tool Page Prompts

- “Create a split-panel tool layout: recessed surface input area on the left (55%), output panel on the right (45%), separated by tonal shift only”
- “Design a diagnostic log entry with severity badge (ERR in coral-red, WARN in amber), monospace rule ID in brackets, plain-language message in Manrope, and dimmed file path below”
- “Build a segmented progress bar using primary lichen-green fills with 2px gaps between segments on a surface-container background”
- “Design an empty state with centered monospace heading, dashed ghost border (stitch pattern), and a list of supported file types in dimmed monospace”

### Key Constraints for AI

- Never generate components with pill-shaped buttons or `xl`/`full` border-radius
- Never use pure black (`#000000`) or pure white (`#ffffff`) for opaque surfaces or backgrounds (exception: translucent overlay backdrops per §2 Glass & Gradient Rule)
- Never use high-contrast or opaque borders for layout sectioning—use tonal surface shifts or ghost separators (≤30% opacity) per the No-Line Rule (§2)
- All floating panels must use `backdrop-filter: blur(8px–12px)` per the Glass & Gradient Rule (§2)
- All text must meet WCAG AA 4.5:1 contrast minimum against its background surface
- Monospace font is mandatory for all input fields and code-adjacent UI
- UPPER_SNAKE_CASE is for UI labels and section headers only—data values (command names, rule IDs, file paths) use their natural format
- Never add decorative telemetry or status indicators that don’t reflect real system state
- Headlines use Space Grotesk, body text uses Manrope, code/data uses monospace—never all-monospace
