import { Button, Flex } from "antd";

const PLACEHOLDER = `---
name: my-skill
description: Brief description of what this skill does
allowed-tools: grep, find
---

# my-skill

Instructions for the skill...`;

const textareaStyle: React.CSSProperties = {
    width: "100%",
    minHeight: "300px",
    backgroundColor: "#1a1c18",
    color: "#e6ead8",
    border: "1px solid rgba(70, 72, 62, 0.15)",
    borderRadius: "8px",
    padding: "1rem",
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "0.875rem",
    lineHeight: 1.6,
    resize: "vertical",
    outline: "none",
};

const labelStyle: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: "0.75rem",
    color: "rgba(189, 206, 137, 0.6)",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
};

interface SkillEditorProps {
    value: string;
    onChange: (value: string) => void;
    onRun: () => void;
}

export function SkillEditor({ value, onChange, onRun }: SkillEditorProps) {
    return (
        <Flex vertical gap={12}>
            <Flex justify="space-between" align="center">
                <label htmlFor="skill-editor" style={labelStyle}>
                    Skill Markdown
                </label>
                <Button type="primary" onClick={onRun}>
                    Run Lint
                </Button>
            </Flex>
            <textarea
                id="skill-editor"
                aria-label="Skill Markdown"
                style={textareaStyle}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={PLACEHOLDER}
                spellCheck={false}
            />
        </Flex>
    );
}
