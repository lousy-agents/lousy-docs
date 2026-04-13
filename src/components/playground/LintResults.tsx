import { Flex, Typography } from "antd";
import type { SkillLintOutput } from "@/entities/skill-lint";

const { Text } = Typography;

const containerStyle: React.CSSProperties = {
    backgroundColor: "#1a1c18",
    borderRadius: "8px",
    border: "1px solid rgba(70, 72, 62, 0.15)",
    padding: "1rem",
    minHeight: "200px",
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "0.875rem",
};

const placeholderStyle: React.CSSProperties = {
    color: "rgba(230, 234, 216, 0.4)",
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "0.875rem",
};

const summaryStyle: React.CSSProperties = {
    padding: "0.75rem 1rem",
    borderRadius: "6px",
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "0.8125rem",
};

const diagnosticStyle: React.CSSProperties = {
    padding: "0.5rem 0.75rem",
    borderRadius: "4px",
    backgroundColor: "rgba(70, 72, 62, 0.1)",
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "0.8125rem",
};

interface LintResultsProps {
    result: SkillLintOutput | null;
}

function getSummaryBackground(result: SkillLintOutput): string {
    if (result.summary.totalErrors > 0) {
        return "rgba(255, 180, 171, 0.1)";
    }
    if (result.summary.totalWarnings > 0) {
        return "rgba(238, 189, 142, 0.1)";
    }
    return "rgba(189, 206, 137, 0.1)";
}

function getSummaryText(result: SkillLintOutput): string {
    if (result.summary.totalErrors > 0) {
        return `Lint failed — ${result.summary.totalErrors} error${result.summary.totalErrors !== 1 ? "s" : ""}, ${result.summary.totalWarnings} warning${result.summary.totalWarnings !== 1 ? "s" : ""}`;
    }
    if (result.summary.totalWarnings > 0) {
        return `Lint passed with ${result.summary.totalWarnings} warning${result.summary.totalWarnings !== 1 ? "s" : ""} — 0 errors, ${result.summary.totalWarnings} warning${result.summary.totalWarnings !== 1 ? "s" : ""}`;
    }
    return "Lint passed — 0 errors, 0 warnings";
}

function getSummaryColor(result: SkillLintOutput): string {
    if (result.summary.totalErrors > 0) {
        return "#ffb4ab";
    }
    if (result.summary.totalWarnings > 0) {
        return "#eebd8e";
    }
    return "#bdce89";
}

function getSeverityColor(severity: string): string {
    return severity === "error" ? "#ffb4ab" : "#eebd8e";
}

function getSeverityLabel(severity: string): string {
    return severity === "error" ? "ERROR" : "WARN";
}

export function LintResults({ result }: LintResultsProps) {
    if (!result) {
        return (
            <div style={containerStyle}>
                <Text style={placeholderStyle}>
                    Paste a skill SKILL.md and click &quot;Run Lint&quot; to see
                    diagnostics.
                </Text>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <Flex vertical gap={12}>
                <div
                    style={{
                        ...summaryStyle,
                        backgroundColor: getSummaryBackground(result),
                    }}
                >
                    <Text
                        style={{
                            color: getSummaryColor(result),
                            fontFamily: "'Courier New', Courier, monospace",
                            fontWeight: 700,
                        }}
                    >
                        {getSummaryText(result)}
                    </Text>
                </div>
                {result.diagnostics.map((diagnostic) => {
                    const key = `${diagnostic.ruleId}-${diagnostic.line}-${diagnostic.message}`;
                    return (
                        <div key={key} style={diagnosticStyle}>
                            <Flex gap={8} align="baseline">
                                <Text
                                    style={{
                                        color: getSeverityColor(
                                            diagnostic.severity,
                                        ),
                                        fontWeight: 700,
                                        fontFamily:
                                            "'Courier New', Courier, monospace",
                                        fontSize: "0.75rem",
                                        flexShrink: 0,
                                    }}
                                >
                                    {getSeverityLabel(diagnostic.severity)}
                                </Text>
                                <Text
                                    style={{
                                        color: "rgba(230, 234, 216, 0.5)",
                                        fontFamily:
                                            "'Courier New', Courier, monospace",
                                        fontSize: "0.75rem",
                                        flexShrink: 0,
                                    }}
                                >
                                    Line {diagnostic.line}
                                </Text>
                                <Text
                                    style={{
                                        color: "#e6ead8",
                                        fontFamily:
                                            "'Courier New', Courier, monospace",
                                        fontSize: "0.8125rem",
                                    }}
                                >
                                    {diagnostic.message}
                                </Text>
                            </Flex>
                        </div>
                    );
                })}
            </Flex>
        </div>
    );
}
