import { describe, expect, it } from "vitest";
import type { SkillLintDiagnostic } from "@/entities/skill-lint";

describe("SkillLintDiagnostic", () => {
    it("should represent a diagnostic with all required fields", () => {
        const diagnostic: SkillLintDiagnostic = {
            line: 2,
            severity: "error",
            message: "Name is required",
            ruleId: "skill/missing-name",
        };

        expect(diagnostic.line).toBe(2);
        expect(diagnostic.severity).toBe("error");
        expect(diagnostic.message).toBe("Name is required");
        expect(diagnostic.ruleId).toBe("skill/missing-name");
    });

    it("should optionally include a field name", () => {
        const diagnostic: SkillLintDiagnostic = {
            line: 2,
            severity: "warning",
            message: "Recommended field 'allowed-tools' is missing",
            field: "allowed-tools",
            ruleId: "skill/missing-allowed-tools",
        };

        expect(diagnostic.field).toBe("allowed-tools");
    });
});
