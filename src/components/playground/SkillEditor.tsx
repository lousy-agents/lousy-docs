import { Button } from "antd";
import { TerminalWindow } from "@/components/playground/TerminalWindow";

const PLACEHOLDER = `> paste your copilot-instructions.md or SKILL.md here...`;

const LINE_COUNT = 12;

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
    overflow: "auto",
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "0.8125rem",
    lineHeight: "1.7",
};

const lineNumbersStyle: React.CSSProperties = {
    width: "40px",
    padding: "16px 8px 16px 0",
    textAlign: "right",
    color: "rgba(230, 234, 216, 0.4)",
    userSelect: "none",
    backgroundColor: "#1a1c18",
    flexShrink: 0,
    lineHeight: "1.7",
    fontSize: "0.8125rem",
    fontFamily: "'Courier New', Courier, monospace",
    marginLeft: "8px",
};

const textareaStyle: React.CSSProperties = {
    flex: 1,
    backgroundColor: "transparent",
    color: "#e6ead8",
    border: "none",
    padding: "16px",
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "0.8125rem",
    lineHeight: "1.7",
    resize: "none",
    display: "block",
    minHeight: 0,
};

const tabBarStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    height: "40px",
    borderBottom: "1px solid rgba(70, 72, 62, 0.15)",
    flexShrink: 0,
};

const tabButtonBaseStyle: React.CSSProperties = {
    padding: "4px 12px",
    fontFamily: "'Space Grotesk', monospace",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    cursor: "pointer",
    border: "1px solid rgba(70, 72, 62, 0.3)",
    backgroundColor: "#333531",
    color: "#9ba08a",
};

const tabButtonActiveStyle: React.CSSProperties = {
    ...tabButtonBaseStyle,
    border: "1px solid #bdce89",
    backgroundColor: "#5f6e34",
    color: "#e6ead8",
};

const runButtonStyle: React.CSSProperties = {
    border: "1px solid #9ba08a",
    background: "transparent",
    color: "#9ba08a",
    fontFamily: "'Space Grotesk', monospace",
    fontWeight: 700,
    fontSize: "10px",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    height: "36px",
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
    cursor: "pointer",
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
}

export function SkillEditor({ value, onChange, onRun }: SkillEditorProps) {
    const lines = value ? value.split("\n").length : LINE_COUNT;
    const lineNumbers = Array.from(
        { length: Math.max(lines, LINE_COUNT) },
        (_, i) => i + 1,
    );

    return (
        <TerminalWindow title="INPUT_TARGET // MODULE_01">
            <div style={editorWrapperStyle}>
                <div style={tabBarStyle}>
                    <div style={{ display: "flex", gap: "4px" }}>
                        <button
                            type="button"
                            style={tabButtonBaseStyle}
                            disabled
                            aria-disabled="true"
                        >
                            SKILLS
                        </button>
                        <button
                            type="button"
                            style={tabButtonBaseStyle}
                            disabled
                            aria-disabled="true"
                        >
                            AGENTS
                        </button>
                        <button type="button" style={tabButtonActiveStyle}>
                            INSTRUCTIONS
                        </button>
                    </div>
                    <Button
                        className="playground-btn"
                        style={runButtonStyle}
                        onClick={onRun}
                    >
                        ▶ RUN_LINT
                    </Button>
                </div>
                <div style={fileInfoBarStyle}>
                    <span>SOURCE_FILE: copilot-instructions.md</span>
                    <span>UTF-8 | LF | MD</span>
                </div>
                <div style={editorBodyStyle}>
                    <div style={lineNumbersStyle} aria-hidden="true">
                        {lineNumbers.map((n) => (
                            <div key={n}>{n}</div>
                        ))}
                    </div>
                    <textarea
                        id="skill-editor"
                        className="playground-editor"
                        aria-label="Skill Markdown"
                        style={textareaStyle}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={PLACEHOLDER}
                        spellCheck={false}
                    />
                </div>
                <div style={exampleLinksStyle}>
                    <button
                        type="button"
                        style={exampleLinkActiveStyle}
                        disabled
                        aria-disabled="true"
                    >
                        LOAD_EXAMPLE: INSTRUCTIONS
                    </button>
                    <button
                        type="button"
                        style={exampleLinkStyle}
                        disabled
                        aria-disabled="true"
                    >
                        LOAD_EXAMPLE: SKILL
                    </button>
                    <button
                        type="button"
                        style={exampleLinkStyle}
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
