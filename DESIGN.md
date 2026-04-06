# Design System Document

## 1. Overview & Creative North Star: "The Analog Terminal"

This design system is built for the developer who appreciates the friction and soul of vintage hardware. Our Creative North Star is **The Analog Terminal**—an aesthetic that blends the precision of modern dev-tools with the tactile, imperfect warmth of lo-fi tech. 

We break the "template" look by eschewing standard flat grids in favor of **Intentional Asymmetry**. Layouts should feel like a customized terminal dashboard: overlapping elements, "stitched" textures (as seen in our brand character's patches), and a hierarchy driven by tonal depth rather than rigid lines. This is not just a UI; it is an environment that feels lived-in, authoritative, and intentionally unpolished.

---

## 2. Colors

The palette is rooted in earthy, organic tones—oxidized metals and weathered fabrics.

### Tonal Application
*   **Primary (`#bdce89`):** Our "Terminal Glow." Use this for high-priority actions and key status indicators.
*   **Secondary (`#eebd8e`):** The "Cautionary Amber." Used for highlights that need to break the green monochrome.
*   **Background (`#121410`):** The deep, matte base of a powered-down CRT monitor.

### The "No-Line" Rule
**Borders are prohibited for sectioning.** To separate content, you must use background color shifts. A section should transition from `surface` to `surface-container-low` to define its bounds. If you need to separate elements within a container, use the Spacing Scale to create "voids" rather than drawing lines.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical plates. 
1.  **Base:** `surface` (`#121410`)
2.  **Sectioning:** `surface-container-low` (`#1a1c18`)
3.  **Components/Cards:** `surface-container` (`#1e201c`)
4.  **Floating/Active:** `surface-container-highest` (`#333531`)

### The Glass & Gradient Rule
To achieve "lo-fi" depth, use semi-transparent surface colors with a `backdrop-blur` of 8px-12px for floating panels. For primary buttons, use a subtle linear gradient from `primary` (`#bdce89`) to `primary-container` (`#5f6e34`) to mimic the soft glow of a backlit physical button.

### WCAG Compliance
All surface/text combinations must meet WCAG 2.1 AA contrast minimums:
*   **Body text**: 4.5:1 ratio against its background
*   **Placeholder text**: 4.5:1 ratio — do not rely on low-opacity values without verifying contrast
*   **Focus indicators**: `:focus-visible` outlines must achieve 3:1 contrast against adjacent colors per WCAG 2.2 SC 2.4.11; use `primary` (`#bdce89`) at 2px minimum, not `outline-variant` which only achieves ~1.2:1 on dark surfaces

---

## 3. Typography

Our typography is a dialogue between human-centric editorial and cold machine logic.

*   **Display & Headlines (Space Grotesk):** This is our "Editorial Voice." High-contrast, bold, and authoritative. It should feel like a headline in a 1970s tech manual.
*   **Title & Body (Manrope):** The "Human Interface." Clean and legible, used for instructional text and descriptions.
*   **Technical Details (Monospace/Manrope Labels):** Use `label-md` and `label-sm` for CLI commands and data. In this system, monospace is not just for code; it’s a brand signal for "truth" and "data."

---

## 4. Elevation & Depth

We reject traditional drop shadows in favor of **Tonal Layering**.

*   **The Layering Principle:** Place a `surface-container-lowest` element on a `surface-container-low` background to create a "recessed" look. Place a `surface-container-high` element to create a "raised" look.
*   **Ambient Shadows:** If an element must float (e.g., a modal), use a shadow tinted with `on-surface` at 6% opacity with a 40px blur. It should feel like a soft glow, not a shadow.
*   **The "Ghost Border":** For decorative or structural separation (e.g., card edges, panel boundaries), use `outline-variant` (`#46483e`) at 15% opacity. It should be barely felt, appearing only as a change in texture. **This does not apply to interactive focus indicators** — see the WCAG Compliance section in §2 for `:focus-visible` requirements.
*   **Stitch Detail:** Inspired by the "Lousy Agent" character, use 2px dashed "Ghost Borders" in secondary colors to denote "beta" or "experimental" containers, mimicking the patches on the character's coat.

---

## 5. Components

### Buttons
*   **Primary:** Solid `primary` gradient, `on-primary` text. `md` (0.375rem) roundedness.
*   **Secondary:** Ghost-style. No background, `outline` stroke at 20%, `primary` text.
*   **Tertiary:** `surface-container-highest` background, monospace labels.

### Input Fields & Terminal Blocks
*   **The Terminal Input:** Dark `surface-container-lowest` background with a `primary` cursor blink. Text must be monospace (`"Courier New", Courier, monospace`). This applies to all search inputs, form fields, and any input that accepts user text.
*   **Placeholder text:** Must use a color that achieves WCAG 2.1 AA 4.5:1 contrast against the input background. On dark surfaces, `rgba(230, 234, 216, 0.58)` is the tested minimum.
*   **Validation:** Use the `error` (`#ffb4ab`) color only for critical failures. For warnings, use the `secondary` amber.

### Cards & Lists
*   **No Dividers:** Use `1.5` (0.3rem) to `3` (0.6rem) spacing increments to separate items.
*   **Nesting:** A list item should be `surface-container` sitting on a `surface-container-low` parent.

### Special Component: "The Patch"
A custom container used for "Pro-Tips" or "Developer Notes." It uses a subtle `secondary_container` background and a `secondary` dashed border on one side only (Asymmetric), incorporating a small 16x16px version of the brand character in the corner.

---

## 6. Do's and Don'ts

### Do
*   **Do** lean into asymmetry. Offset your headers by `spacing-4` relative to the body text.
*   **Do** use monospace for any string that could be interpreted as data or a command.
*   **Do** use the "stitch" pattern (dashed lines) sparingly to highlight manual or "lo-fi" sections.
*   **Do** ensure high contrast for typography; `on-background` text on `surface` must be crisp.

### Don't
*   **Don't** use 1px solid white or high-contrast borders. It kills the "analog" feel.
*   **Don't** use standard blue for links. Use `primary` or `tertiary`.
*   **Don't** use large, round "pill" buttons. Stick to the `md` (0.375rem) roundedness to maintain a technical, hardware feel.
*   **Don't** use pure black `#000000`. Use the `surface` palette to keep the earthy, organic depth.