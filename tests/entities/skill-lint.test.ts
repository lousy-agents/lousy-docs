import Chance from "chance";
import { describe, expect, it } from "vitest";
import type { LintDiagnostic } from "@/entities/skill-lint";

const chance = new Chance(42);

describe("LintDiagnostic from @lousy-agents/lint", () => {
    it("should represent a diagnostic with all required fields", () => {
        const filePath = chance.word();
        const line = chance.natural({ min: 1, max: 100 });
        const message = chance.sentence();
        const ruleId = `skill/${chance.word()}`;

        const diagnostic: LintDiagnostic = {
            filePath,
            line,
            severity: "error",
            message,
            ruleId,
            target: "skill",
        };

        expect(diagnostic.filePath).toBe(filePath);
        expect(diagnostic.line).toBe(line);
        expect(diagnostic.severity).toBe("error");
        expect(diagnostic.message).toBe(message);
        expect(diagnostic.ruleId).toBe(ruleId);
        expect(diagnostic.target).toBe("skill");
    });

    it("should optionally include a field name", () => {
        const field = chance.word();

        const diagnostic: LintDiagnostic = {
            filePath: chance.word(),
            line: chance.natural({ min: 1, max: 100 }),
            severity: "warning",
            message: chance.sentence(),
            field,
            ruleId: `skill/${chance.word()}`,
            target: "skill",
        };

        expect(diagnostic.field).toBe(field);
    });
});
