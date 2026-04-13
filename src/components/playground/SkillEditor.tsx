import { Button } from "antd";
import { TerminalWindow } from "@/components/playground/TerminalWindow";

const PLACEHOLDER = `---
name: my-skill
description: Brief description of what this skill does
allowed-tools: grep, find
---

# my-skill

Instructions for the skill...`;

const textareaStyle: React.CSSProperties = {
    width: "100%",
    minHeight: "320px",
    backgroundColor: "transparent",
    color: "#e6ead8",
    border: "none",
    padding: "1rem 1.25rem",
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "0.875rem",
    lineHeight: 1.7,
    resize: "vertical",
    outline: "none",
    display: "block",
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
    borderRadius: "4px",
    height: "32px",
    padding: "0 1rem",
};

interface SkillEditorProps {
    value: string;
    onChange: (value: string) => void;
    onRun: () => void;
}

export function SkillEditor({ value, onChange, onRun }: SkillEditorProps) {
    const runButton = (
        <Button style={runButtonStyle} onClick={onRun}>
            RUN_LINT
        </Button>
    );

    return (
        <TerminalWindow title="skill.md — editor_v1.0" rightAction={runButton}>
            <textarea
                id="skill-editor"
                aria-label="Skill Markdown"
                style={textareaStyle}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={PLACEHOLDER}
                spellCheck={false}
            />
        </TerminalWindow>
    );
}
