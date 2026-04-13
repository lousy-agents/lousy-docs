import { Button } from "antd";
import { TerminalWindow } from "@/components/playground/TerminalWindow";

const PLACEHOLDER = `---
name: my-skill
description: Brief description of what this skill does
allowed-tools: grep, find
---

# my-skill

Instructions for the skill...`;

const LINE_COUNT = 12;

const editorWrapperStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    flex: 1,
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
    fontSize: "0.875rem",
    lineHeight: "1.7",
};

const lineNumbersStyle: React.CSSProperties = {
    width: "40px",
    padding: "16px 8px 16px 0",
    textAlign: "right",
    color: "rgba(70, 72, 62, 0.6)",
    userSelect: "none",
    borderRight: "1px solid rgba(70, 72, 62, 0.15)",
    flexShrink: 0,
    lineHeight: "1.7",
    fontSize: "0.875rem",
    fontFamily: "'Courier New', Courier, monospace",
};

const textareaStyle: React.CSSProperties = {
    flex: 1,
    backgroundColor: "transparent",
    color: "#e6ead8",
    border: "none",
    padding: "16px",
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "0.875rem",
    lineHeight: "1.7",
    resize: "none",
    outline: "none",
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
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    cursor: "pointer",
    border: "1px solid rgba(70, 72, 62, 0.3)",
    backgroundColor: "transparent",
    color: "rgba(189, 206, 137, 0.5)",
};

const tabButtonActiveStyle: React.CSSProperties = {
    ...tabButtonBaseStyle,
    border: "1px solid #bdce89",
    backgroundColor: "rgba(189, 206, 137, 0.1)",
    color: "#bdce89",
};

const runButtonStyle: React.CSSProperties = {
    background: "linear-gradient(to bottom, #bdce89, #5f6e34)",
    border: "none",
    color: "#283501",
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: "0.75rem",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    height: "28px",
    padding: "0 12px",
    borderRadius: 0,
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

    const runButton = (
        <Button style={runButtonStyle} onClick={onRun}>
            RUN_LINT
        </Button>
    );

    return (
        <TerminalWindow
            title="INPUT_TARGET // MODULE_01"
            rightAction={runButton}
        >
            <div style={editorWrapperStyle}>
                <div style={tabBarStyle}>
                    <div style={{ display: "flex", gap: "4px" }}>
                        <button type="button" style={tabButtonBaseStyle}>
                            SKILLS
                        </button>
                        <button type="button" style={tabButtonBaseStyle}>
                            AGENTS
                        </button>
                        <button type="button" style={tabButtonActiveStyle}>
                            INSTRUCTIONS
                        </button>
                    </div>
                </div>
                <div style={fileInfoBarStyle}>
                    <span>SOURCE_FILE: skill.md</span>
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
                        aria-label="Skill Markdown"
                        style={textareaStyle}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={PLACEHOLDER}
                        spellCheck={false}
                    />
                </div>
            </div>
        </TerminalWindow>
    );
}
