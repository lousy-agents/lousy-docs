import { Flex, Typography } from "antd";
import { TerminalWindow } from "@/components/playground/TerminalWindow";
import type { SkillLintOutput } from "@/entities/skill-lint";

const { Text } = Typography;

const outputContentStyle: React.CSSProperties = {
    padding: "1rem 1.25rem",
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "0.875rem",
    lineHeight: 1.7,
    minHeight: "160px",
};

const placeholderStyle: React.CSSProperties = {
    color: "rgba(230, 234, 216, 0.3)",
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "0.875rem",
};

const awaitingStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "2px 8px",
    backgroundColor: "rgba(189, 206, 137, 0.1)",
    color: "rgba(189, 206, 137, 0.5)",
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "0.75rem",
    letterSpacing: "0.05em",
    marginTop: "0.5rem",
};

const summaryStyle: React.CSSProperties = {
    padding: "0.625rem 0.875rem",
    borderRadius: "4px",
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "0.8125rem",
};

const diagnosticStyle: React.CSSProperties = {
    padding: "0.5rem 0.75rem",
    borderLeft: "2px solid transparent",
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
    return severity === "error" ? "ERR" : "WARN";
}

function getDiagnosticBorderColor(severity: string): string {
    return severity === "error"
        ? "rgba(255, 180, 171, 0.4)"
        : "rgba(238, 189, 142, 0.3)";
}

export function LintResults({ result }: LintResultsProps) {
    if (!result) {
        return (
            <TerminalWindow title="diagnostics — output_v1.0">
                <div style={outputContentStyle}>
                    <Text style={placeholderStyle}>
                        Paste a SKILL.md and click RUN_LINT to see diagnostics.
                    </Text>
                    <div>
                        <span style={awaitingStyle}>AWAITING_INPUT...</span>
                    </div>
                </div>
            </TerminalWindow>
        );
    }

    return (
        <TerminalWindow title="diagnostics — output_v1.0">
            <div style={outputContentStyle}>
                <Flex vertical gap={10}>
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
                            <div
                                key={key}
                                style={{
                                    ...diagnosticStyle,
                                    borderLeftColor: getDiagnosticBorderColor(
                                        diagnostic.severity,
                                    ),
                                }}
                            >
                                <Flex gap={10} align="baseline">
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
                                        [{getSeverityLabel(diagnostic.severity)}
                                        ]
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
                                        L{diagnostic.line}
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
        </TerminalWindow>
    );
}
