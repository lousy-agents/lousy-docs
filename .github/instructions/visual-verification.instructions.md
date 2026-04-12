---
applyTo: "src/{components,layouts,styles,pages}/**/*.{tsx,astro,css}"
---

# Visual Debugging Protocol (Playwright MCP)

Code-level tests verify logic and syntax. This protocol verifies **rendered visual output** — the thing the user actually sees. It uses the Playwright MCP browser tools for autonomous visual QA.

## Trigger Conditions

### Protocol is MANDATORY when the changeset modifies ANY of

- `src/components/**/*.{tsx,css}` — React components or component styles
- `src/layouts/**/*.astro` — Astro layout templates
- `src/styles/**/*.css` — Global stylesheets
- `src/pages/**/*.astro` — Page composition (island mounting, directive changes)
- `src/components/providers/AntDProvider.tsx` — Theme tokens (triggers multi-page spot check)

### Protocol is SKIPPED when changes are limited to

- `src/entities/` — Pure business logic
- `src/use-cases/` — Application logic
- `src/gateways/` — API adapters (non-UI data layer)
- `tests/` — Test files only
- `.github/` — CI/CD configuration

When skipping, state: _"Visual verification skipped — no UI-layer files modified."_

---

## Preconditions

All three preconditions MUST be satisfied before modifying any CSS, layout, or component rendering code.

| # | Precondition | How to verify |
|---|-------------|---------------|
| 1 | **Dev server running** | `npm run dev` (async, detached). Confirm `http://localhost:4321` is responsive. |
| 2 | **Affected page navigable** | `browser_navigate` to the page under change. Content renders without console errors. |
| 3 | **Baseline screenshot captured** | `browser_take_screenshot` of current state BEFORE any code change. This is the regression reference. |

**Do NOT modify rendering code until all three preconditions are satisfied.** The baseline screenshot is the "measure before you cut" gate.

---

## The Visual Verification Loop

Work in small increments. One visual change at a time.

```
LOOP {
  1. BASELINE: browser_take_screenshot (if not already captured for this increment)
  2. CHANGE:   Make ONE code change (single CSS property, single component edit)
  3. RELOAD:   browser_navigate to the same URL (forces page reload + re-hydration)
  4. CAPTURE:  browser_take_screenshot → post-change screenshot
  5. AUDIT:    browser_snapshot → capture accessibility tree for ARIA verification
  6. ANALYZE:
     a. Describe the visual delta between baseline and post-change screenshots
     b. Confirm the rendered result matches DESIGN.md intent
     c. Check for unintended side effects (layout shifts, overlaps, color bleed)
  7. DECIDE:
     IF regression detected OR intent not met → describe the problem, GOTO step 2
     IF change is correct → update mental baseline, proceed to next change or postconditions
}
```

### Mandatory rules

- **Steps 4–6 are never optional.** Writing CSS and assuming it renders correctly is prohibited.
- **The agent must describe the visual delta in words** — not just "looks good" but a specific observation (e.g., "Card border is now visible as a faint edge at ~15% opacity on the dark surface, matching the ghost border spec in DESIGN.md §4").
- **Do not return control to the human until the visual loop confirms correctness.** The agent is its own Visual QA.

---

## Interactive State Verification

Required when the component has `:hover`, `:focus`, `:focus-visible`, or `:active` states. Execute AFTER the visual loop above completes for the default state.

### Hover state

```
1. browser_snapshot → identify target element ref
2. browser_hover on the target element ref
3. browser_take_screenshot → capture :hover state
4. Verify: hover visual matches DESIGN.md specification for the component type
5. IF incorrect → fix CSS, reload, re-verify
```

### Focus-visible state

```
1. browser_click on an element BEFORE the target (establishes focus context)
2. browser_press_key "Tab" → moves focus to the target element
3. browser_take_screenshot → capture :focus-visible state
4. Verify ALL of:
   - Focus outline is VISIBLE in the screenshot (not just present in CSS)
   - Outline meets `DESIGN.md` §2 WCAG Compliance requirements (primary color, minimum width, contrast ratio)
5. IF any check fails → fix CSS, reload, re-verify from step 1
6. To programmatically verify contrast when screenshot analysis is ambiguous:
   ```
   browser_evaluate:
     function: (el) => {
       const style = getComputedStyle(el);
       const parent = getComputedStyle(el.parentElement);
       return { outline: style.outlineColor, bg: parent.backgroundColor };
     }
     ref: <target element ref>
   ```
   Compare returned values against the pre-verified reference: `#bdce89` on `#121410` = ~5.3:1 contrast.
```

### Active/pressed state (if applicable)

```
1. browser_snapshot → identify target element ref
2. browser_take_screenshot while clicking (or immediately after browser_click)
3. Verify: pressed visual matches DESIGN.md button/interactive spec
```

**Do not skip interactive states.** A `:focus-visible` rule that exists in the stylesheet but never actually renders (due to selector specificity, inheritance, or override) is a bug. The only way to catch it is to trigger the state and screenshot.

---

## Responsive Verification

After all changes pass at the default viewport, verify at these breakpoints:

| Viewport | Dimensions | Represents |
|----------|-----------|------------|
| Desktop | 1280 × 720 | Default — verify first |
| Mobile | 390 × 844 | iPhone 14 — REQUIRED |
| Tablet | 768 × 1024 | iPad portrait — recommended for layout-heavy changes |

```
For EACH required breakpoint:
  1. browser_resize to target width × height
  2. browser_take_screenshot
  3. Verify: no layout breakage, horizontal overflow, illegible text, or touch-target violations
  4. IF breakage detected → fix, reload, re-verify at that breakpoint
  5. browser_resize back to 1280 × 720 when done
```

**Minimum requirement:** Desktop + Mobile. Tablet is required when modifying grid layouts, navigation, or multi-column components.

---

## Theme Token Changes (Multi-Page Spot Check)

When modifying `AntDProvider.tsx` theme tokens, `src/styles/global.css` custom properties, or any value that cascades globally:

1. Identify at least 3 visually distinct pages (e.g., homepage, docs page, any page with forms/cards)
2. `browser_navigate` to EACH page
3. `browser_take_screenshot` of each
4. Verify: theme changes render consistently across all pages
5. Watch for: color inconsistencies, contrast violations, broken Ant Design component styling, missing backdrop-blur

---

## Postconditions

The visual protocol is complete when ALL of these are true:

| # | Postcondition | Evidence |
|---|--------------|----------|
| 1 | Visual delta explicitly described for each change | Written analysis comparing baseline to post-change screenshots |
| 2 | No visual regressions from baseline | Post-change screenshots show no unintended differences |
| 3 | DESIGN.md compliance verified visually | Correct surface tier (§2), ghost borders at 15% (§4), ambient shadows at 6%/40px (§4), monospace inputs (§5), WCAG AA contrast (§2) |
| 4 | Interactive states verified via MCP (if applicable) | Screenshots of :hover and :focus-visible states |
| 5 | Responsive breakpoints checked | Desktop + Mobile minimum, Tablet for layout changes |
| 6 | Accessibility tree audited | `browser_snapshot` confirms correct ARIA roles and labels |
| 7 | Standard TDD gate passes | See validation commands below |

**The visual protocol adds to the TDD workflow. It does not replace it.** Both visual and code postconditions must pass before declaring the task complete.

### MANDATORY: Final Validation

After all visual checks pass, run the full validation suite:

```bash
npx biome check && npm test && npm run build
```

If any command fails:
- **Lint failure (`npx biome check`)**: Fix the reported issues, then re-run. Use `npx biome check --write` for auto-fixable issues. Re-verify visually if the fix changed rendered output.
- **Test failure (`npm test`)**: Read the failure message, fix the root cause (never modify tests to pass without understanding why). Re-run `npm test` to confirm the fix. If the fix changed UI code, re-enter the visual verification loop.
- **Build failure (`npm run build`)**: Read the build error. Common causes are TypeScript type errors or missing imports. Fix and re-run. Re-verify visually if the fix changed rendered output.

Do not declare the task complete until all three commands succeed.

---

## DESIGN.md Verification Reference

When analyzing screenshots, cross-reference these specific DESIGN.md rules:

| What to check | DESIGN.md rule | What a violation looks like |
|--------------|---------------|---------------------------|
| Surface tier | §2 Surface Hierarchy — 5 tiers from `#121410` to `#333531` | Component uses wrong background shade (e.g., card on `surface` instead of `surface-container`) |
| Borders | §4 Ghost Border — `outline-variant` at 15% opacity | Solid visible border instead of barely perceptible edge |
| Floating panels | §2 Glass & Gradient — `backdrop-filter: blur(8-12px)` | Modal/overlay looks flat and opaque, no frosted glass effect |
| Shadows | §4 Ambient Shadows — `on-background` at 6%, 40px blur | Sharp drop shadow instead of soft ambient glow |
| Buttons | §5 — Primary uses gradient, Secondary is ghost-style | Flat solid buttons without gradient, or outlined buttons with visible border |
| Inputs | §5 Terminal Input — monospace font, dark background | Sans-serif font in input fields, or input on wrong surface color |
| Text contrast | §2 WCAG — 4.5:1 body, 4.5:1 placeholder | Dim, hard-to-read text or placeholder text that disappears into background |
| Focus rings | `DESIGN.md` §2 WCAG Compliance | No visible focus ring, or ring using `outline-variant` (~1.3–2.0:1 contrast, fails 3:1 minimum) |

---

## Tool Reference

| Playwright MCP Tool | Role in this protocol |
|---------------------|----------------------|
| `browser_navigate` | Load/reload the affected page |
| `browser_take_screenshot` | Capture visual state (baseline and post-change) |
| `browser_snapshot` | Capture accessibility tree for element refs and ARIA audit |
| `browser_hover` | Trigger and verify `:hover` state |
| `browser_click` | Set focus context or verify `:active` state |
| `browser_press_key` | Tab-navigate to verify `:focus-visible` state |
| `browser_resize` | Change viewport for responsive verification |
| `browser_evaluate` | Inspect computed styles when screenshot analysis is ambiguous |
| `browser_console_messages` | Check for runtime CSS/JS errors after changes |

---

## Integration with TDD Workflow

For UI-layer changes, the TDD workflow becomes:

1. **Research**: Search codebase for existing patterns
2. **Write failing test** → Verify failure:
   ```bash
   npm test
   ```
3. ⭐ **Visual baseline**: Capture screenshot of current rendered state
4. **Implement minimal code** → Verify pass:
   ```bash
   npm test
   ```
5. ⭐ **Visual verify**: Screenshot → Analyze delta → Loop if needed
6. ⭐ **Interactive states**: Hover/focus verification via MCP (if applicable)
7. ⭐ **Responsive check**: Desktop + Mobile minimum
8. **Refactor** → Keep tests green, re-verify visually if CSS changed
9. **Validate** (see MANDATORY: Final Validation above):
   ```bash
   npx biome check && npm test && npm run build
   ```

If any test or build failure occurs after a visual change, fix the root cause and re-enter the visual verification loop for any UI code that changed.

Steps marked ⭐ are added by this protocol and are mandatory for UI-layer files.

---

## Anti-Patterns

| Anti-pattern | Why it fails |
|-------------|-------------|
| **Blind CSS** — Writing CSS without rendering the page | Specificity conflicts, inheritance issues, and CSS-in-JS injection order are invisible without rendering |
| **Screenshot-less completion** — Declaring UI task done with zero `browser_take_screenshot` calls | No evidence that rendered output matches intent |
| **Single-viewport assumption** — Only checking at default viewport | Mobile layout breakage is the most common UI regression |
| **Static-only verification** — Verifying default state, skipping `:hover`/`:focus` | Interactive states may have selector mismatches that only appear on interaction |
| **Test-only declaration** — "All tests pass" as sole evidence for UI correctness | Unit tests don't render CSS. Build success doesn't verify visual design. |
| **Premature handoff** — Asking the human to verify before self-verifying | The agent must be its own Visual QA. Return control only after autonomous verification. |
| **Vague analysis** — "Looks correct" without specific observations | Always describe the specific visual property verified (color, spacing, opacity, font) |
