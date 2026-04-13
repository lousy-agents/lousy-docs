import { describe, expect, it } from "vitest";
import type {
    SkillLintDiagnostic,
    SkillLintSeverity,
} from "@/entities/skill-lint";
import { SkillFrontmatterSchema } from "@/gateways/skill-content-lint-gateway";

describe("SkillFrontmatterSchema", () => {
    describe("given valid frontmatter data", () => {
        it("should accept a valid name and description", () => {
            const data = {
                name: "my-skill",
                description: "A brief description of the skill",
            };

            const result = SkillFrontmatterSchema.safeParse(data);

            expect(result.success).toBe(true);
        });

        it("should accept optional allowed-tools field", () => {
            const data = {
                name: "my-skill",
                description: "A brief description",
                "allowed-tools": "grep, find",
            };

            const result = SkillFrontmatterSchema.safeParse(data);

            expect(result.success).toBe(true);
        });
    });

    describe("given missing required fields", () => {
        it("should reject when name is missing", () => {
            const data = {
                description: "A brief description",
            };

            const result = SkillFrontmatterSchema.safeParse(data);

            expect(result.success).toBe(false);
        });

        it("should reject when description is missing", () => {
            const data = {
                name: "my-skill",
            };

            const result = SkillFrontmatterSchema.safeParse(data);

            expect(result.success).toBe(false);
        });
    });

    describe("given invalid name format", () => {
        it("should reject names with uppercase letters", () => {
            const data = {
                name: "MySkill",
                description: "A brief description",
            };

            const result = SkillFrontmatterSchema.safeParse(data);

            expect(result.success).toBe(false);
        });

        it("should reject names with spaces", () => {
            const data = {
                name: "my skill",
                description: "A brief description",
            };

            const result = SkillFrontmatterSchema.safeParse(data);

            expect(result.success).toBe(false);
        });

        it("should reject empty names", () => {
            const data = {
                name: "",
                description: "A brief description",
            };

            const result = SkillFrontmatterSchema.safeParse(data);

            expect(result.success).toBe(false);
        });
    });

    describe("given invalid description", () => {
        it("should reject empty descriptions", () => {
            const data = {
                name: "my-skill",
                description: "",
            };

            const result = SkillFrontmatterSchema.safeParse(data);

            expect(result.success).toBe(false);
        });

        it("should reject whitespace-only descriptions", () => {
            const data = {
                name: "my-skill",
                description: "   ",
            };

            const result = SkillFrontmatterSchema.safeParse(data);

            expect(result.success).toBe(false);
        });
    });
});

describe("SkillLintDiagnostic", () => {
    it("should represent a diagnostic with all required fields", () => {
        const diagnostic: SkillLintDiagnostic = {
            line: 2,
            severity: "error" as SkillLintSeverity,
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
