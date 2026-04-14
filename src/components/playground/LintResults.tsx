import { Flex, Typography } from "antd";
import { TerminalWindow } from "@/components/playground/TerminalWindow";
import type { SkillLintOutput, SkillLintSeverity } from "@/entities/skill-lint";

const { Text } = Typography;

const panelStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    flex: 1,
};

const outputContentStyle: React.CSSProperties = {
    padding: "1rem 1.25rem",
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "0.875rem",
    lineHeight: 1.7,
    flex: 1,
    overflow: "auto",
    minHeight: 0,
};

const emptyStateContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    padding: "2rem",
};

const emptyStateBoxStyle: React.CSSProperties = {
    border: "1px dashed rgba(70, 72, 62, 0.15)",
    borderRadius: "6px",
    padding: "3rem 2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "1.25rem",
    maxWidth: "400px",
    width: "100%",
};

const awaitingHeadingStyle: React.CSSProperties = {
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "1.125rem",
    fontWeight: 700,
    letterSpacing: "0.3em",
    color: "rgba(230, 234, 216, 0.7)",
};

const emptyInstructionStyle: React.CSSProperties = {
    fontFamily: "'Manrope', sans-serif",
    fontSize: "0.875rem",
    color: "rgba(230, 234, 216, 0.5)",
};

const supportedFilesStyle: React.CSSProperties = {
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "0.875rem",
    color: "rgba(230, 234, 216, 0.4)",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    lineHeight: 2,
};

const metricsBarStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 16px",
    height: "28px",
    borderTop: "1px solid rgba(70, 72, 62, 0.15)",
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "9px",
    color: "rgba(118, 118, 108, 0.6)",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    flexShrink: 0,
};

const statusDotStyle: React.CSSProperties = {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    display: "inline-block",
};

const summaryStyle: React.CSSProperties = {
    padding: "0.625rem 0.875rem",
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

function getSeverityColor(severity: SkillLintSeverity): string {
    return severity === "error" ? "#ffb4ab" : "#eebd8e";
}

function getSeverityLabel(severity: SkillLintSeverity): string {
    return severity === "error" ? "ERR" : "WARN";
}

function getDiagnosticBorderColor(severity: SkillLintSeverity): string {
    return severity === "error"
        ? "rgba(255, 180, 171, 0.4)"
        : "rgba(238, 189, 142, 0.3)";
}

function getSeverityBadgeBackground(severity: SkillLintSeverity): string {
    return severity === "error"
        ? "rgba(255, 180, 171, 0.2)"
        : "rgba(238, 189, 142, 0.2)";
}

function SystemMetrics({ hasResult }: { hasResult: boolean }) {
    return (
        <div style={metricsBarStyle}>
            <span>{hasResult ? "LINT_COMPLETE" : "NO_RESULTS"}</span>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span
                    style={{
                        ...statusDotStyle,
                        backgroundColor: hasResult ? "#bdce89" : "#9ba08a",
                    }}
                    aria-hidden="true"
                />
                {hasResult ? "READY" : "IDLE"}
            </div>
        </div>
    );
}

export function LintResults({ result }: LintResultsProps) {
    if (!result) {
        return (
            <TerminalWindow title="DIAGNOSTIC_LOG // STREAM">
                <div style={panelStyle} aria-live="polite" role="status">
                    <div style={emptyStateContainerStyle}>
                        <div style={emptyStateBoxStyle}>
                            <div style={awaitingHeadingStyle}>
                                AWAITING_INPUT
                            </div>
                            <div style={emptyInstructionStyle}>
                                Paste a file on the left and execute RUN_LINT
                            </div>
                            <div style={supportedFilesStyle}>
                                <div>· copilot-instructions.md</div>
                                <div>· CLAUDE.md / AGENTS.md</div>
                                <div>· .github/skills/*/SKILL.md</div>
                                <div>· .github/agents/*.md</div>
                            </div>
                        </div>
                    </div>
                    <SystemMetrics hasResult={false} />
                </div>
            </TerminalWindow>
        );
    }

    return (
        <TerminalWindow title="DIAGNOSTIC_LOG // STREAM">
            <div style={panelStyle} aria-live="polite" role="status">
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
                                    fontFamily:
                                        "'Courier New', Courier, monospace",
                                    fontWeight: 700,
                                }}
                            >
                                {getSummaryText(result)}
                            </Text>
                        </div>
                        {result.diagnostics.map((diagnostic, index) => {
                            const key = `${diagnostic.ruleId}-${diagnostic.line}-${index}`;
                            return (
                                <div
                                    key={key}
                                    style={{
                                        ...diagnosticStyle,
                                        borderLeftColor:
                                            getDiagnosticBorderColor(
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
                                                backgroundColor:
                                                    getSeverityBadgeBackground(
                                                        diagnostic.severity,
                                                    ),
                                                borderRadius: "4px",
                                                padding: "1px 6px",
                                            }}
                                        >
                                            [
                                            {getSeverityLabel(
                                                diagnostic.severity,
                                            )}
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
                                                    "'Manrope', sans-serif",
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
                <SystemMetrics hasResult={true} />
            </div>
        </TerminalWindow>
    );
}
