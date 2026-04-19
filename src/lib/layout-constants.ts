/**
 * Height of the fixed site header in pixels.
 * Used for sticky positioning and top-padding across all page layouts.
 */
export const HEADER_HEIGHT_PX = 64;

/**
 * Minimum height for the SkillEditor panel in the mobile stacked layout (px).
 *
 * Breakdown of the SkillEditor TerminalWindow content:
 *   - TerminalWindow header:  40px
 *   - Tab bar:                48px
 *   - File info bar:          28px
 *   - 12-line editor body:   ~296px
 *   - Example links bar:     ~37px  (wraps to 2 rows on a 390px viewport)
 *   - Subtotal:              ~449px
 *
 * 460px gives ~11px of buffer above the measured content height so that the
 * SkillEditor TerminalWindow never overflows its container into the
 * LintResults panel below it.
 */
export const MOBILE_EDITOR_MIN_HEIGHT_PX = 460;
