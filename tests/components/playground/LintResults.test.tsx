import { render, screen } from "@testing-library/react";
import Chance from "chance";
import { describe, expect, it } from "vitest";
import { LintResults } from "@/components/playground/LintResults";
import type { SkillLintOutput } from "@/entities/skill-lint";

const chance = new Chance();

function createEmptyOutput(): SkillLintOutput {
    return {
        diagnostics: [],
        summary: { totalFiles: 1, totalErrors: 0, totalWarnings: 0 },
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
            const result: SkillLintOutput = {
                diagnostics: [
                    {
                        line: 2,
                        severity: "error",
                        message: errorMessage,
                        ruleId: "skill/missing-name",
                    },
                ],
                summary: { totalFiles: 1, totalErrors: 1, totalWarnings: 0 },
            };

            render(<LintResults result={result} />);

            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });

        it("should display the error count in the summary", () => {
            const result: SkillLintOutput = {
                diagnostics: [
                    {
                        line: 2,
                        severity: "error",
                        message: "Name is required",
                        ruleId: "skill/missing-name",
                    },
                ],
                summary: { totalFiles: 1, totalErrors: 1, totalWarnings: 0 },
            };

            render(<LintResults result={result} />);

            expect(screen.getByText(/1 error/i)).toBeInTheDocument();
        });
    });

    describe("given a lint result with warnings", () => {
        it("should display each warning diagnostic", () => {
            const warningMessage = chance.sentence();
            const result: SkillLintOutput = {
                diagnostics: [
                    {
                        line: 1,
                        severity: "warning",
                        message: warningMessage,
                        ruleId: "skill/missing-allowed-tools",
                    },
                ],
                summary: { totalFiles: 1, totalErrors: 0, totalWarnings: 1 },
            };

            render(<LintResults result={result} />);

            expect(screen.getByText(warningMessage)).toBeInTheDocument();
        });

        it("should display the warning count in the summary", () => {
            const result: SkillLintOutput = {
                diagnostics: [
                    {
                        line: 1,
                        severity: "warning",
                        message: "Recommended field is missing",
                        ruleId: "skill/missing-allowed-tools",
                    },
                ],
                summary: { totalFiles: 1, totalErrors: 0, totalWarnings: 1 },
            };

            render(<LintResults result={result} />);

            expect(screen.getByText(/1 warning/i)).toBeInTheDocument();
        });
    });

    describe("given a lint result with the line number", () => {
        it("should display the line number for each diagnostic", () => {
            const result: SkillLintOutput = {
                diagnostics: [
                    {
                        line: 3,
                        severity: "error",
                        message: "Name is required",
                        ruleId: "skill/missing-name",
                    },
                ],
                summary: { totalFiles: 1, totalErrors: 1, totalWarnings: 0 },
            };

            render(<LintResults result={result} />);

            expect(screen.getByText(/L3/)).toBeInTheDocument();
        });
    });
});
