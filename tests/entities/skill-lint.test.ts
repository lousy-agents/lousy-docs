import { describe, expect, it } from "vitest";
import type { LintDiagnostic } from "@/entities/skill-lint";

describe("LintDiagnostic from @lousy-agents/lint", () => {
    it("should represent a diagnostic with all required fields", () => {
        const diagnostic: LintDiagnostic = {
            filePath: "playground-input",
            line: 2,
            severity: "error",
            message: "Name is required",
            ruleId: "skill/missing-name",
            target: "skill",
        };

        expect(diagnostic.filePath).toBe("playground-input");
        expect(diagnostic.line).toBe(2);
        expect(diagnostic.severity).toBe("error");
        expect(diagnostic.message).toBe("Name is required");
        expect(diagnostic.ruleId).toBe("skill/missing-name");
        expect(diagnostic.target).toBe("skill");
    });

    it("should optionally include a field name", () => {
        const diagnostic: LintDiagnostic = {
            filePath: "playground-input",
            line: 2,
            severity: "warning",
            message: "Recommended field 'allowed-tools' is missing",
            field: "allowed-tools",
            ruleId: "skill/missing-allowed-tools",
            target: "skill",
        };

        expect(diagnostic.field).toBe("allowed-tools");
    });
});
