# Design System: Lousy Docs — "The Analog Terminal"

## 1. Visual Theme & Atmosphere

This design system is a deliberate rejection of sanitized, template-driven UI. Our Creative North Star is **The Analog Terminal**—a vision of a parallel vintage future where high-performance engineering meets the tactile warmth of a custom-built workshop.

The aesthetic blends the precision of modern dev-tools with the imperfect, lived-in character of lo-fi hardware. We break the rigid digital grid through **Intentional Asymmetry**: layered surfaces, "stitched" patchwork textures inspired by the Lousy Agent brand character, and a visual hierarchy driven by tonal depth rather than hard lines. This is not just a UI; it is an artifact—an engineer's console that feels hand-assembled, authoritative, and deliberately unpolished.

**Key Characteristics:**
*   High-density information designed for power users, not casual browsers
*   "Hand-stitched" personality expressed through dashed borders and tonal layering
*   Earthy "Lichen & Slate" palette evoking oxidized metals and weathered fabrics
*   Terminal-like precision in typography and data presentation
*   Spacious yet dense: generous whitespace between sections, compact data within them

---

## 2. Color Palette & Roles

The palette is rooted in an earthy, organic "Lichen & Slate" foundation—oxidized metals, weathered fabrics, and phosphor glow. Designed to reduce eye strain during long reading sessions while conveying heritage and reliability.

### Core Tokens
*   **Primary — "Terminal Glow"** (`#bdce89`): The signature lichen-green. Used for high-priority actions, key status indicators, active states, and link text. This is the system's visual anchor.
*   **Primary Container — "Moss Depth"** (`#5f6e34`): A deeper, muted green. Used for backgrounds of primary-colored containers and the dark end of button gradients.
*   **Secondary — "Cautionary Amber"** (`#eebd8e`): A warm, sun-baked tone. Used for highlights that break the green monochrome—warnings, secondary interactive states, and accent elements.
*   **Background — "Powered-Down CRT"** (`#121410`): The deep, matte base of the entire canvas. An almost-black with a faint olive undertone that avoids the harshness of pure black.
*   **On-Background — "Phosphor White"** (`#e6ead8`): The primary text color. A warm off-white with a subtle greenish cast, evoking phosphor screen text.
*   **Outline Variant — "Ghost Seam"** (`#46483e`): The default token for ghost borders and structural hints, applied at low opacity (15–30%). Full-strength usage is acceptable for small, non-structural UI affordances such as scrollbar thumbs.
*   **Error — "Fault Signal"** (`#ffb4ab`): Reserved for critical failure states and validation errors. A soft coral-red that remains legible without being alarming.
*   **Primary Highlight** (`rgba(189, 206, 137, 0.25)`): A translucent primary tint used for search result marks and text highlighting. Defined as a CSS custom property (`--color-primary-highlight`).

### Surface Hierarchy & Nesting
Treat the UI as a series of physical plates bolted onto the console. Each surface tier creates depth through tonal shift alone—no drop shadows required for static layering.

| Tier | Token | Hex | Usage |
|------|-------|-----|-------|
| 1. Base | `surface` | `#121410` | Primary canvas, full-page backgrounds |
| 2. Sectioning | `surface-container-low` | `#1a1c18` | Sidebars, nav panels, sunken regions |
| 3. Components | `surface-container` | `#1e201c` | Cards, content containers, inline code blocks |
| 4. Raised | `surface-container-high` | `#252720` | Active panels, hover states, elevated UI |
| 5. Floating | `surface-container-highest` | `#333531` | Modals, popovers, floating overlays |

> **Note:** `surface-container-lowest` appears in §4 (recessed layering) and §5 (input backgrounds) as a conceptual tier below `surface`. It does not have a dedicated CSS custom property—use `surface` (`#121410`) for these recessed contexts.

### The "No-Line" Rule
High-contrast or opaque borders are prohibited for layout sectioning. Containment is achieved through:
1.  **Background Shifts (preferred):** Distinguish a sidebar using `surface-container-low` against the main `surface` background. The tonal difference creates the boundary.
2.  **Ghost Separators:** When a tonal shift alone is insufficient (e.g., sidebar edges, table-of-contents rails), use 1px solid `outline-variant` at 15% opacity. These low-opacity ghost lines provide structural guidance without visible hardness. The accepted range is 10–30% depending on context; never use `outline-variant` at full opacity for layout borders.
3.  **Spacing Voids:** Use the spacing scale to create visual separation between grouped elements within a container.
4.  **Dashed Patchwork (decorative only):** When a "stitched" seam is needed for brand personality, use 1px or 2px dashed lines with `outline-variant` at 15% opacity. This is a texture, not a structural border.

### The Glass & Gradient Rule
For floating panels (modals, search overlays), use semi-transparent `surface-container-highest` with a `backdrop-filter: blur(8px–12px)` to allow underlying content to bleed through softly. This creates a frosted-glass effect that evokes CRT light diffusion. Overlay backdrops use `rgba(0, 0, 0, 0.6)` for content dimming—this is the sole permitted use of pure black in the system.

For primary buttons, use a subtle linear gradient from `primary` (`#bdce89`) to `primary-container` (`#5f6e34`) to mimic the soft glow of a backlit physical button.

### WCAG Compliance
All surface/text combinations must meet WCAG AA accessibility requirements. Contrast minimums come from WCAG 2.1; focus indicator guidance draws on both 2.1 and 2.2:
*   **Body text**: 4.5:1 ratio against its background
*   **Placeholder text**: 4.5:1 ratio—do not rely on low-opacity values without verifying contrast against the specific background surface. For inputs on `surface` (`#121410`), `rgba(230, 234, 216, 0.58)` is the tested minimum after compositing.
*   **Focus indicators**: `:focus-visible` outlines must achieve 3:1 contrast against adjacent colors per WCAG 2.1 SC 1.4.11 (Non-text Contrast); use `primary` (`#bdce89`) at 2px minimum width, not `outline-variant` which only achieves ~1.2:1 on dark surfaces
*   **Interactive targets**: All clickable/tappable elements must meet minimum 44×44px touch target size (WCAG 2.2 SC 2.5.8)

---

## 3. Typography Rules

Our typography is a dialogue between human-centric editorial warmth and cold machine logic. The system uses a deliberate split between geometric display type and clean body type, with monospace reserved as a brand signal for "truth" and "data."

### Font Stack

| Role | Family | Character |
|------|--------|-----------|
| Display & Headlines | Space Grotesk | Geometric, technical, authoritative—like a headline in a 1970s engineering manual. Tight letter-spacing (`-0.02em`) creates editorial density. |
| Body & Instructional | Manrope | Clean, humanist sans-serif. The "Human Interface" voice—legible and warm, used for descriptions, documentation prose, and UI labels. Relaxed line-height (`1.7`) for comfortable long-form reading. |
| Technical & Code | `"Courier New", Courier, monospace` | The raw data voice. Used for all code snippets, CLI commands, inline code, terminal blocks, and search inputs. Monospace in this system is not just for code—it signals precision and machine output. |

### Hierarchy & Scale
*   **Display (H1):** Space Grotesk, 700 weight, 2rem. Tight letter-spacing (`-0.02em`). Used for page titles and hero sections.
*   **Section (H2):** Space Grotesk, 700 weight, 1.5rem. Establishes content zones.
*   **Subsection (H3):** Space Grotesk, 600 weight, 1.25rem. Component and feature headers.
*   **Detail (H4):** Space Grotesk, 600 weight, 1rem, slightly muted (`rgba(230, 234, 216, 0.85)`). Sub-feature labels.
*   **Body:** Manrope, 400 weight, 1rem, line-height 1.7. Primary reading text.
*   **Small/Meta:** Manrope, 400 weight, 0.875rem. Metadata, timestamps, secondary labels.

### The Density Principle
Use extreme contrast in scale to create the "dense terminal" aesthetic. A large `display` title should sit adjacent to small `label-sm` metadata. This juxtaposition reinforces the information-dense, power-user character of the system.

---

## 4. Elevation & Depth

We reject traditional drop shadows in favor of **Tonal Layering** and **Ambient Glows**.

*   **The Layering Principle:** Depth is achieved by stacking surface tiers. Place a `surface` (recessed) element on a `surface-container-low` background to create a "sunken" look. Place a `surface-container-high` element to create a "raised" look. No shadow is required—the tonal shift provides the lift.
*   **Ambient Shadows:** When an element must truly float (modals, search overlays, popovers), use a shadow tinted with `on-background` (`#e6ead8`) at 6% opacity with a 40px blur radius. It should feel like a soft glow bleeding from a CRT monitor, not a hard drop shadow.
*   **The "Ghost Border":** For decorative or structural separation (card edges, panel boundaries), use `outline-variant` (`#46483e`) at 15% opacity. It should be barely perceptible—a change in texture, not a visible line. **This does not apply to interactive focus indicators**—see the WCAG Compliance section in §2 for `:focus-visible` requirements.
*   **Stitch Detail:** Inspired by the Lousy Agent brand character's patches, use 2px dashed ghost borders in `secondary` or `outline-variant` colors to denote "beta," "experimental," or "hand-stitched" containers. This patchwork motif is the system's signature decorative element.

---

## 5. Component Stylings

### Buttons
*   **Primary:** Solid `primary` gradient (from `#bdce89` to `#5f6e34`), dark text (`#293417`) for legibility on the light primary surface. `md` (0.375rem / 6px) roundedness. Comfortable padding for touch targets.
*   **Secondary:** Ghost-style. Transparent background, `primary` text, solid `primary` (`#bdce89`) border at 20% opacity. On hover, background fills with a whisper-soft `primary` tint.
*   **Tertiary:** `surface-container-highest` background, monospace labels. Used for technical actions and "terminal command" style affordances.
*   **Hover Behavior:** Smooth 150ms transitions. Primary buttons subtly darken; secondary buttons gain a faint background tint.
*   **Shape:** Consistent `md` roundedness (6px) across all button variants. Never pill-shaped, never fully squared—a machined, technical feel.

### Border Radius Scale
The system defines three radius tiers:
*   **`sm`** (4px): Small controls, inline code badges, and compact elements.
*   **`md`** (6px): The default. Buttons, cards, inputs, and most interactive components.
*   **`lg`** (8px): Larger containers and elevated panels.
*   **Exception:** Full-panel overlays (e.g., the search modal) may use 12px for a softer floating appearance. This is an explicit exception, not a general-purpose radius.

### Input Fields & Terminal Blocks
*   **The Terminal Input:** Dark `surface` (recessed) background with a `primary`-colored cursor blink. Text must be monospace (`"Courier New", Courier, monospace`). This applies to all search inputs, form fields, and any input that accepts user text—the monospace font is a non-negotiable brand signal.
*   **Placeholder text:** Must achieve WCAG 2.1 AA 4.5:1 contrast against the input background. For inputs on `surface` (`#121410`), `rgba(230, 234, 216, 0.58)` is the tested minimum after compositing. If the input uses a different surface token, re-verify the rendered contrast.
*   **Focus State:** Border color shifts to `primary` (`#bdce89`) with 2px outline width. See §2 WCAG Compliance.
*   **Validation:** Use `error` (`#ffb4ab`) for critical failures. Use `secondary` amber (`#eebd8e`) for warnings.

### Cards & Containers
*   **No Dividers:** Separate items using spacing increments (`1.5` / 0.375rem to `3` / 0.75rem), never horizontal rules or border lines.
*   **Nesting:** A card should be `surface-container` sitting on a `surface-container-low` parent. Raised cards use `surface-container-high`.
*   **Corner Style:** Consistent `md` roundedness (6px)—subtly softened edges that feel precision-machined, not playful.
*   **Terminal Frame (optional):** For signature "terminal window" containers, add a solid 4px top-bar using `primary-container` as the header accent. This mimics a terminal title bar.

### Content Prose Elements
Markdown-rendered content in the docs area has opinionated brand styling:
*   **Links:** `primary` text with a `primary` underline at 30% opacity. On hover, the underline strengthens to full `primary`. No standard blue—ever.
*   **Inline code:** `secondary` amber text on a `surface-container` background with 3px radius. The amber color signals "data" or "literal value" within body prose.
*   **Code blocks (`<pre>`):** `surface-container-low` background with a 1px `outline-variant` border at 20% opacity and `md` (6px) radius. Content text uses `on-background` color.
*   **Blockquotes:** 3px solid `primary-container` left border with a 10% `primary-container` tinted background. Text is slightly muted (`on-background` at 80%). This is the "terminal sidebar accent" pattern.
*   **Heading underlines (H2):** `outline-variant` at 25% opacity—a content landmark stronger than structural ghost separators but within the accepted opacity range.
*   **Table headers:** `surface-container-low` background, `primary` text, uppercase with 0.05em letter-spacing. This "terminal column header" treatment reinforces the engineering aesthetic.
*   **Table cell borders:** `outline-variant` at 15% opacity—standard ghost separator weight.

### Special Component: "The Patch"
A custom callout container for "Pro-Tips," "Developer Notes," or "Experimental" features. Uses a subtle muted amber background with a `secondary` (`#eebd8e`) dashed border on one side only (asymmetric), optionally incorporating a small 16×16px version of the brand character in the corner. This is the system's signature "hand-stitched" element.

### Content Dividers
Markdown `<hr>` elements are styled as solid 1px `outline-variant` lines at 25% opacity—intentionally stronger than the 15% ghost borders used for structural separation, serving as visible content landmarks.

### The Patchwork Divider (specialized)
For sections requiring extra brand personality (e.g., "Experimental" or "Coming Soon" zones), a dashed variant of the divider may be used: a repeating dashed pattern with `outline-variant` at 25% opacity. This is a decorative flourish, not a replacement for the standard `<hr>` styling.

---

## 6. Layout Principles

### Grid & Structure
*   **Max Content Width:** Centered content area with comfortable reading width for documentation prose.
*   **Sidebar + Content:** Two-panel layout with a `surface-container-low` sidebar on the left and `surface` main content area. The tonal shift defines the boundary—no border needed.
*   **Left-Aligned by Default:** Text and content blocks are left-aligned, terminal-style. Center alignment is reserved for hero sections and empty states only.

### Spacing & Rhythm
*   **Base Unit:** 4px micro-spacing, 8px for component-level gaps.
*   **Vertical Rhythm:** Consistent spacing between related text blocks using 1rem–2rem increments.
*   **Section Margins:** Generous 2.5rem–3rem between major content sections for clear visual grouping.
*   **Reading Line Height:** Body text uses 1.7 line-height for comfortable long-form reading.

### Responsive Behavior
*   **Mobile breakpoint:** 768px. Below this, the sidebar collapses into a drawer overlay.
*   **Touch targets:** Minimum 44×44px for all interactive elements.
*   **Content reflow:** Single-column layout on mobile with full-width cards and reduced heading sizes.
*   **Progressive disclosure:** Navigation collapses to a hamburger menu; content density is preserved.

---

## 7. Do's and Don'ts

### Do
*   **Do** lean into asymmetry. Offset headers, use varied card widths, and break the rigid grid intentionally.
*   **Do** use monospace for any string that could be interpreted as data, a command, or machine output.
*   **Do** use the "stitch" pattern (dashed lines) sparingly to highlight hand-crafted or "lo-fi" sections.
*   **Do** ensure high contrast for all text. `on-background` text on `surface` must be crisp and legible.
*   **Do** prioritize information density. Power users prefer seeing more data at a glance—use `body-sm` for secondary metadata.
*   **Do** verify WCAG contrast ratios for every new surface/text combination before committing.

### Don't
*   **Don't** use high-contrast or opaque borders for layout sectioning. Use tonal shifts, ghost separators (≤30% opacity), or spacing instead.
*   **Don't** use standard blue for links. Use `primary` for standard links; `secondary` is permitted only for accent links on base `surface` backgrounds where AA contrast is verified.
*   **Don't** use large, round "pill" buttons. Stick to `md` (6px) roundedness to maintain the machined, hardware feel.
*   **Don't** use pure black (`#000000`) for surfaces or backgrounds. Use the `surface` palette to preserve the earthy, organic depth. (Exception: translucent overlay backdrops use `rgba(0, 0, 0, 0.6)` for content dimming—see §2 Glass & Gradient Rule.)
*   **Don't** use traditional black drop shadows. Use tonal layer shifts or the ambient glow system described in §4.
*   **Don't** center body text or layout content. Left-aligned, terminal-style composition is the default. Center alignment is reserved for hero sections, empty states, and centered modals/overlays (which are centered by convention).

---

## 8. Design System Notes for AI Generation

When prompting AI tools (Stitch, Copilot, Claude) to generate new screens or components for this project, use these descriptive references:

### Atmosphere Language
*   "Engineer's console from a parallel vintage future"
*   "Dense terminal dashboard with hand-stitched personality"
*   "Earthy lichen-and-slate palette on a powered-down CRT canvas"
*   "Lo-fi hardware aesthetic—machined edges, not rounded pills"

### Color References (always include hex)
*   Primary: "Terminal Glow lichen-green (`#bdce89`)"
*   Primary Container: "Moss Depth deep green (`#5f6e34`)"
*   Background: "Powered-Down CRT deep slate (`#121410`)"
*   Secondary: "Cautionary Amber sun-baked tone (`#eebd8e`)"
*   Text: "Phosphor White warm off-white (`#e6ead8`)"
*   Outline Variant: "Ghost Seam slate (`#46483e`)" — use at 15–30% opacity
*   Error: "Fault Signal coral-red (`#ffb4ab`)"
*   Surface tiers: `#121410` → `#1a1c18` → `#1e201c` → `#252720` → `#333531` (see §2 table)

### Component Prompts
*   "Create a terminal-style card with a solid 4px primary-container top-bar, ghost border at 15% opacity, and recessed surface background"
*   "Design a ghost-style secondary button with subtle solid primary border at 20% opacity that strengthens on hover"
*   "Add a monospace search input on dark recessed surface with primary-colored cursor blink and phosphor-white placeholder text"

### Key Constraints for AI
*   Never generate components with pill-shaped buttons or `xl`/`full` border-radius
*   Never use pure black (`#000000`) or pure white (`#ffffff`) for opaque surfaces or backgrounds (exception: translucent overlay backdrops per §2 Glass Rule)
*   Never use high-contrast or opaque borders for layout sectioning—use tonal surface shifts or ghost separators (≤30% opacity) per the No-Line Rule (§2)
*   All floating panels must use `backdrop-filter: blur(8px–12px)` per the Glass Rule
*   All text must meet WCAG AA 4.5:1 contrast minimum against its background surface
*   Monospace font is mandatory for all input fields and code-adjacent UI
