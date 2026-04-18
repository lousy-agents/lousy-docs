import { Button } from "antd";
import { useCallback, useRef } from "react";
import { TerminalWindow } from "@/components/playground/TerminalWindow";
import type { PlaygroundLintTarget } from "@/use-cases/lint-skill-content";

const PLACEHOLDERS: Record<PlaygroundLintTarget, string> = {
    skill: `> paste your SKILL.md here...\n>\n> Example:\n> ---\n> name: my-skill\n> description: A description of the skill\n> allowed-tools: grep\n> ---`,
    agent: `> paste your agent.md file here...\n>\n> Example:\n> ---\n> name: my-agent\n> description: A description of the agent\n> ---`,
    instruction: `> paste your copilot-instructions.md or CLAUDE.md here...`,
};

const TARGET_LABELS: Record<PlaygroundLintTarget, string> = {
    skill: "SKILL.md",
    agent: "agent.md",
    instruction: "copilot-instructions.md / CLAUDE.md",
};

const ARIA_LABELS: Record<PlaygroundLintTarget, string> = {
    skill: "Skill Markdown",
    agent: "Agent Markdown",
    instruction: "Instruction Markdown",
};

const LINE_COUNT = 12;

const EDITOR_FONT_SIZE_REM = 0.8125;
const EDITOR_LINE_HEIGHT = 1.7;

// Computed from EDITOR_FONT_SIZE_REM and EDITOR_LINE_HEIGHT (assuming 16 px root
// font size) so DOM_DELTA_LINE normalization stays in sync if the editor
// typography changes.
const LINE_HEIGHT_PX = Math.round(
    EDITOR_FONT_SIZE_REM * 16 * EDITOR_LINE_HEIGHT,
);

const editorWrapperStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
};

const fileInfoBarStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 16px",
    height: "28px",
    borderBottom: "1px solid rgba(70, 72, 62, 0.15)",
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "9px",
    color: "rgba(118, 118, 108, 0.8)",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    flexShrink: 0,
};

const editorBodyStyle: React.CSSProperties = {
    display: "flex",
    flex: 1,
    overflow: "hidden",
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: `${EDITOR_FONT_SIZE_REM}rem`,
    lineHeight: EDITOR_LINE_HEIGHT,
};

const lineNumbersStyle: React.CSSProperties = {
    width: "40px",
    padding: "16px 8px 16px 0",
    textAlign: "right",
    color: "rgba(230, 234, 216, 0.4)",
    userSelect: "none",
    backgroundColor: "#1a1c18",
    flexShrink: 0,
    lineHeight: EDITOR_LINE_HEIGHT,
    fontSize: `${EDITOR_FONT_SIZE_REM}rem`,
    fontFamily: "'Courier New', Courier, monospace",
    marginLeft: "8px",
    overflow: "hidden",
    minHeight: 0,
};

const textareaStyle: React.CSSProperties = {
    flex: 1,
    backgroundColor: "transparent",
    color: "#e6ead8",
    border: "none",
    padding: "16px",
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: `${EDITOR_FONT_SIZE_REM}rem`,
    lineHeight: EDITOR_LINE_HEIGHT,
    resize: "none",
    display: "block",
    minHeight: 0,
    caretColor: "#bdce89",
};

const tabBarStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    height: "48px",
    borderBottom: "1px solid rgba(70, 72, 62, 0.15)",
    flexShrink: 0,
};

const tabButtonBaseStyle: React.CSSProperties = {
    padding: "4px 12px",
    minHeight: "44px",
    fontFamily: "'Space Grotesk', monospace",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    cursor: "pointer",
    border: "1px solid rgba(70, 72, 62, 0.3)",
    backgroundColor: "transparent",
    color: "rgba(230, 234, 216, 0.6)",
    borderRadius: 6,
};

const tabButtonActiveStyle: React.CSSProperties = {
    ...tabButtonBaseStyle,
    cursor: "default",
    border: "1px solid rgba(189, 206, 137, 0.5)",
    backgroundColor: "#bdce89",
    color: "#121410",
};

const runButtonStyle: React.CSSProperties = {
    border: "none",
    background: "linear-gradient(135deg, #bdce89, #5f6e34)",
    color: "#121410",
    fontFamily: "'Space Grotesk', monospace",
    fontWeight: 700,
    fontSize: "10px",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    minHeight: "44px",
    padding: "0 16px",
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    gap: "6px",
};

const exampleLinksStyle: React.CSSProperties = {
    display: "flex",
    gap: "16px",
    padding: "0 16px",
    height: "32px",
    alignItems: "center",
    borderTop: "1px solid rgba(70, 72, 62, 0.15)",
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "9px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontWeight: 700,
    flexShrink: 0,
};

const exampleLinkActiveStyle: React.CSSProperties = {
    color: "#bdce89",
    cursor: "default",
    textDecoration: "none",
    background: "none",
    border: "none",
    padding: 0,
    font: "inherit",
    letterSpacing: "inherit",
    textTransform: "inherit",
    fontWeight: "inherit",
};

const exampleLinkStyle: React.CSSProperties = {
    ...exampleLinkActiveStyle,
    color: "rgba(118, 118, 108, 0.6)",
};

interface SkillEditorProps {
    value: string;
    onChange: (value: string) => void;
    onRun: () => void;
    activeTarget: PlaygroundLintTarget;
    onTargetChange: (target: PlaygroundLintTarget) => void;
}

const TARGET_TABS: { key: PlaygroundLintTarget; label: string }[] = [
    { key: "skill", label: "SKILLS" },
    { key: "agent", label: "AGENTS" },
    { key: "instruction", label: "INSTRUCTIONS" },
];

export function SkillEditor({
    value,
    onChange,
    onRun,
    activeTarget,
    onTargetChange,
}: SkillEditorProps) {
    const lineNumbersRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const tablistRef = useRef<HTMLDivElement>(null);

    const handleEditorScroll = useCallback(
        (e: React.UIEvent<HTMLTextAreaElement>) => {
            if (lineNumbersRef.current) {
                lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
            }
        },
        [],
    );

    const handleGutterWheel = useCallback(
        (e: React.WheelEvent<HTMLDivElement>) => {
            // Let the browser handle zoom gestures (ctrl+wheel / pinch-to-zoom).
            if (e.ctrlKey || !textareaRef.current) {
                return;
            }

            // Normalize deltaY/deltaX to pixels.
            // deltaMode 0 = DOM_DELTA_PIXEL (most browsers)
            // deltaMode 1 = DOM_DELTA_LINE (some mice on Linux/Firefox)
            // deltaMode 2 = DOM_DELTA_PAGE
            let deltaY = e.deltaY;
            let deltaX = e.deltaX;
            if (e.deltaMode === 1) {
                // Prefer the browser's computed line height so normalization
                // stays accurate when the user's root font size differs from
                // 16px (e.g. accessibility/browser zoom settings).
                const rawLineHeight = window.getComputedStyle(
                    textareaRef.current,
                ).lineHeight;
                const lineHeightPx = rawLineHeight.endsWith("px")
                    ? Number.parseFloat(rawLineHeight)
                    : LINE_HEIGHT_PX;
                deltaY *= lineHeightPx;
                deltaX *= lineHeightPx;
            } else if (e.deltaMode === 2) {
                deltaY *= textareaRef.current.clientHeight;
                deltaX *= textareaRef.current.clientWidth;
            }

            e.preventDefault();
            textareaRef.current.scrollTop += deltaY;
            textareaRef.current.scrollLeft += deltaX;
        },
        [],
    );
    const lines = value ? value.split("\n").length : LINE_COUNT;
    const lineNumbers = Array.from(
        { length: Math.max(lines, LINE_COUNT) },
        (_, i) => i + 1,
    );

    const handleTabKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            const currentIndex = TARGET_TABS.findIndex(
                (tab) => tab.key === activeTarget,
            );
            let nextIndex: number | null = null;

            if (e.key === "ArrowRight") {
                nextIndex = (currentIndex + 1) % TARGET_TABS.length;
            } else if (e.key === "ArrowLeft") {
                nextIndex =
                    (currentIndex - 1 + TARGET_TABS.length) %
                    TARGET_TABS.length;
            } else if (e.key === "Home") {
                nextIndex = 0;
            } else if (e.key === "End") {
                nextIndex = TARGET_TABS.length - 1;
            }

            if (nextIndex !== null && nextIndex !== currentIndex) {
                e.preventDefault();
                const nextTab = TARGET_TABS[nextIndex];
                if (nextTab) {
                    onTargetChange(nextTab.key);
                    const buttons =
                        tablistRef.current?.querySelectorAll<HTMLButtonElement>(
                            '[role="tab"]',
                        );
                    buttons?.[nextIndex]?.focus();
                }
            }
        },
        [activeTarget, onTargetChange],
    );

    return (
        <TerminalWindow title="INPUT_TARGET // MODULE_01">
            <div style={editorWrapperStyle}>
                <div style={tabBarStyle}>
                    <div
                        style={{ display: "flex", gap: "4px" }}
                        role="tablist"
                        aria-label="Lint target type"
                        ref={tablistRef}
                        onKeyDown={handleTabKeyDown}
                    >
                        {TARGET_TABS.map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                role="tab"
                                className="playground-tab"
                                style={
                                    activeTarget === tab.key
                                        ? tabButtonActiveStyle
                                        : tabButtonBaseStyle
                                }
                                onClick={() => {
                                    if (tab.key !== activeTarget) {
                                        onTargetChange(tab.key);
                                    }
                                }}
                                aria-selected={activeTarget === tab.key}
                                id={`tab-${tab.key}`}
                                tabIndex={activeTarget === tab.key ? 0 : -1}
                                aria-controls="editor-tabpanel"
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <Button
                        className="playground-btn"
                        style={runButtonStyle}
                        onClick={onRun}
                    >
                        ▶ RUN_LINT
                    </Button>
                </div>
                <div
                    id="editor-tabpanel"
                    role="tabpanel"
                    aria-labelledby={`tab-${activeTarget}`}
                    // biome-ignore lint/a11y/noNoninteractiveTabindex: WAI-ARIA tabpanel role requires tabIndex="0" for keyboard focusability per APG tabs pattern
                    tabIndex={0}
                >
                    <div style={fileInfoBarStyle}>
                        <span>SOURCE_FILE: {TARGET_LABELS[activeTarget]}</span>
                        <span>UTF-8 | LF | MD</span>
                    </div>
                    <div style={editorBodyStyle}>
                        <div
                            ref={lineNumbersRef}
                            data-testid="line-numbers"
                            style={lineNumbersStyle}
                            aria-hidden="true"
                            onWheel={handleGutterWheel}
                        >
                            {lineNumbers.map((n) => (
                                <div key={n}>{n}</div>
                            ))}
                        </div>
                        <textarea
                            ref={textareaRef}
                            id="skill-editor"
                            className="playground-editor"
                            aria-label={ARIA_LABELS[activeTarget]}
                            style={textareaStyle}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            onScroll={handleEditorScroll}
                            placeholder={PLACEHOLDERS[activeTarget]}
                            spellCheck={false}
                        />
                    </div>
                </div>
                <div style={exampleLinksStyle}>
                    <button
                        type="button"
                        style={
                            activeTarget === "instruction"
                                ? exampleLinkActiveStyle
                                : exampleLinkStyle
                        }
                        disabled
                        aria-disabled="true"
                    >
                        LOAD_EXAMPLE: INSTRUCTIONS
                    </button>
                    <button
                        type="button"
                        style={
                            activeTarget === "skill"
                                ? exampleLinkActiveStyle
                                : exampleLinkStyle
                        }
                        disabled
                        aria-disabled="true"
                    >
                        LOAD_EXAMPLE: SKILL
                    </button>
                    <button
                        type="button"
                        style={
                            activeTarget === "agent"
                                ? exampleLinkActiveStyle
                                : exampleLinkStyle
                        }
                        disabled
                        aria-disabled="true"
                    >
                        LOAD_EXAMPLE: AGENT
                    </button>
                </div>
            </div>
        </TerminalWindow>
    );
}
