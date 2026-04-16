import { render, screen } from "@testing-library/react";
import Chance from "chance";
import { describe, expect, it } from "vitest";
import { LintResults } from "@/components/playground/LintResults";
import type { LintOutput } from "@/entities/skill-lint";

const chance = new Chance(42);

function createEmptyOutput(): LintOutput {
    return {
        diagnostics: [],
        target: "skill",
        filesAnalyzed: ["playground-input"],
        summary: {
            totalFiles: 1,
            totalErrors: 0,
            totalWarnings: 0,
            totalInfos: 0,
        },
    };
}

describe("LintResults", () => {
    describe("given no lint has been run", () => {
        it("should display a placeholder message", () => {
            render(<LintResults result={null} />);

            expect(
                screen.getByText(/paste a file.*and execute/i),
            ).toBeInTheDocument();

            expect(screen.getByText(/AWAITING_INPUT/)).toBeInTheDocument();
        });
    });

    describe("given a successful lint result with no diagnostics", () => {
        it("should display a success message", () => {
            const result = createEmptyOutput();

            render(<LintResults result={result} />);

            expect(screen.getByText(/passed/i)).toBeInTheDocument();
        });

        it("should display the summary counts", () => {
            const result = createEmptyOutput();

            render(<LintResults result={result} />);

            expect(screen.getByText(/0 errors/i)).toBeInTheDocument();
            expect(screen.getByText(/0 warnings/i)).toBeInTheDocument();
        });
    });

    describe("given a lint result with errors", () => {
        it("should display each error diagnostic", () => {
            const errorMessage = chance.sentence();
            const result: LintOutput = {
                diagnostics: [
                    {
                        filePath: "playground-input",
                        line: 2,
                        severity: "error",
                        message: errorMessage,
                        ruleId: "skill/missing-name",
                        target: "skill",
                    },
                ],
                target: "skill",
                filesAnalyzed: ["playground-input"],
                summary: {
                    totalFiles: 1,
                    totalErrors: 1,
                    totalWarnings: 0,
                    totalInfos: 0,
                },
            };

            render(<LintResults result={result} />);

            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });

        it("should display the error count in the summary", () => {
            const result: LintOutput = {
                diagnostics: [
                    {
                        filePath: "playground-input",
                        line: 2,
                        severity: "error",
                        message: "Name is required",
                        ruleId: "skill/missing-name",
                        target: "skill",
                    },
                ],
                target: "skill",
                filesAnalyzed: ["playground-input"],
                summary: {
                    totalFiles: 1,
                    totalErrors: 1,
                    totalWarnings: 0,
                    totalInfos: 0,
                },
            };

            render(<LintResults result={result} />);

            expect(screen.getByText(/1 error/i)).toBeInTheDocument();
        });
    });

    describe("given a lint result with warnings", () => {
        it("should display each warning diagnostic", () => {
            const warningMessage = chance.sentence();
            const result: LintOutput = {
                diagnostics: [
                    {
                        filePath: "playground-input",
                        line: 1,
                        severity: "warning",
                        message: warningMessage,
                        ruleId: "skill/missing-allowed-tools",
                        target: "skill",
                    },
                ],
                target: "skill",
                filesAnalyzed: ["playground-input"],
                summary: {
                    totalFiles: 1,
                    totalErrors: 0,
                    totalWarnings: 1,
                    totalInfos: 0,
                },
            };

            render(<LintResults result={result} />);

            expect(screen.getByText(warningMessage)).toBeInTheDocument();
        });

        it("should display the warning count in the summary", () => {
            const result: LintOutput = {
                diagnostics: [
                    {
                        filePath: "playground-input",
                        line: 1,
                        severity: "warning",
                        message: "Recommended field is missing",
                        ruleId: "skill/missing-allowed-tools",
                        target: "skill",
                    },
                ],
                target: "skill",
                filesAnalyzed: ["playground-input"],
                summary: {
                    totalFiles: 1,
                    totalErrors: 0,
                    totalWarnings: 1,
                    totalInfos: 0,
                },
            };

            render(<LintResults result={result} />);

            expect(screen.getByText(/1 warning/i)).toBeInTheDocument();
        });
    });

    describe("given a lint result with info diagnostics", () => {
        it("should display each info diagnostic with INFO badge", () => {
            const infoMessage = chance.sentence();
            const result: LintOutput = {
                diagnostics: [
                    {
                        filePath: "playground-input",
                        line: 1,
                        severity: "info",
                        message: infoMessage,
                        ruleId: "skill/suggestion",
                        target: "skill",
                    },
                ],
                target: "skill",
                filesAnalyzed: ["playground-input"],
                summary: {
                    totalFiles: 1,
                    totalErrors: 0,
                    totalWarnings: 0,
                    totalInfos: 1,
                },
            };

            render(<LintResults result={result} />);

            expect(screen.getByText(infoMessage)).toBeInTheDocument();
            expect(screen.getByText(/INFO/)).toBeInTheDocument();
        });

        it("should include the info count in the summary text", () => {
            const result: LintOutput = {
                diagnostics: [
                    {
                        filePath: "playground-input",
                        line: 1,
                        severity: "info",
                        message: chance.sentence(),
                        ruleId: "skill/suggestion",
                        target: "skill",
                    },
                ],
                target: "skill",
                filesAnalyzed: ["playground-input"],
                summary: {
                    totalFiles: 1,
                    totalErrors: 0,
                    totalWarnings: 0,
                    totalInfos: 1,
                },
            };

            render(<LintResults result={result} />);

            expect(screen.getByText(/1 info/i)).toBeInTheDocument();
        });
    });

    describe("given a lint result with mixed severity (errors and infos)", () => {
        it("should include the info count in the summary text alongside errors", () => {
            const result: LintOutput = {
                diagnostics: [
                    {
                        filePath: "playground-input",
                        line: 1,
                        severity: "error",
                        message: chance.sentence(),
                        ruleId: "skill/missing-name",
                        target: "skill",
                    },
                    {
                        filePath: "playground-input",
                        line: 2,
                        severity: "info",
                        message: chance.sentence(),
                        ruleId: "skill/suggestion",
                        target: "skill",
                    },
                ],
                target: "skill",
                filesAnalyzed: ["playground-input"],
                summary: {
                    totalFiles: 1,
                    totalErrors: 1,
                    totalWarnings: 0,
                    totalInfos: 1,
                },
            };

            render(<LintResults result={result} />);

            expect(screen.getByText(/1 info/i)).toBeInTheDocument();
        });
    });

    describe("given a lint result with mixed severity (warnings and infos)", () => {
        it("should include the info count in the summary text alongside warnings", () => {
            const result: LintOutput = {
                diagnostics: [
                    {
                        filePath: "playground-input",
                        line: 1,
                        severity: "warning",
                        message: chance.sentence(),
                        ruleId: "skill/missing-allowed-tools",
                        target: "skill",
                    },
                    {
                        filePath: "playground-input",
                        line: 2,
                        severity: "info",
                        message: chance.sentence(),
                        ruleId: "skill/suggestion",
                        target: "skill",
                    },
                ],
                target: "skill",
                filesAnalyzed: ["playground-input"],
                summary: {
                    totalFiles: 1,
                    totalErrors: 0,
                    totalWarnings: 1,
                    totalInfos: 1,
                },
            };

            render(<LintResults result={result} />);

            expect(screen.getByText(/1 info/i)).toBeInTheDocument();
        });
    });

    describe("given a lint result with the line number", () => {
        it("should display the line number for each diagnostic", () => {
            const result: LintOutput = {
                diagnostics: [
                    {
                        filePath: "playground-input",
                        line: 3,
                        severity: "error",
                        message: "Name is required",
                        ruleId: "skill/missing-name",
                        target: "skill",
                    },
                ],
                target: "skill",
                filesAnalyzed: ["playground-input"],
                summary: {
                    totalFiles: 1,
                    totalErrors: 1,
                    totalWarnings: 0,
                    totalInfos: 0,
                },
            };

            render(<LintResults result={result} />);

            expect(screen.getByText(/L3/)).toBeInTheDocument();
        });
    });
});
