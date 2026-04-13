import Chance from "chance";
import { describe, expect, it } from "vitest";
import { createSkillContentLintGateway } from "@/gateways/skill-content-lint-gateway";
import { LintSkillContentUseCase } from "@/use-cases/lint-skill-content";

const chance = new Chance();

function createUseCase() {
    const gateway = createSkillContentLintGateway();
    return new LintSkillContentUseCase(gateway);
}

describe("LintSkillContentUseCase", () => {
    describe("given valid skill content", () => {
        it("should return no error diagnostics", async () => {
            const useCase = createUseCase();
            const skillName = "my-skill";
            const content = `---\nname: ${skillName}\ndescription: A valid skill description\n---\n\n# ${skillName}`;

            const result = await useCase.execute({
                content,
                skillName,
            });

            const errors = result.diagnostics.filter(
                (d) => d.severity === "error",
            );
            expect(errors).toHaveLength(0);
        });

        it("should report a warning for missing allowed-tools", async () => {
            const useCase = createUseCase();
            const skillName = "my-skill";
            const content = `---\nname: ${skillName}\ndescription: A valid skill description\n---\n`;

            const result = await useCase.execute({
                content,
                skillName,
            });

            const warnings = result.diagnostics.filter(
                (d) => d.severity === "warning",
            );
            expect(warnings.length).toBeGreaterThan(0);
            expect(warnings[0]?.message).toContain("allowed-tools");
        });

        it("should report zero errors in the summary", async () => {
            const useCase = createUseCase();
            const skillName = "my-skill";
            const content = `---\nname: ${skillName}\ndescription: A valid description\nallowed-tools: grep\n---\n`;

            const result = await useCase.execute({
                content,
                skillName,
            });

            expect(result.summary.totalErrors).toBe(0);
        });
    });

    describe("given missing frontmatter", () => {
        it("should return an error diagnostic", async () => {
            const useCase = createUseCase();
            const content = "# Just a heading\n\nNo frontmatter here.";

            const result = await useCase.execute({
                content,
                skillName: "my-skill",
            });

            expect(result.summary.totalErrors).toBeGreaterThan(0);
            const error = result.diagnostics.find(
                (d) => d.severity === "error",
            );
            expect(error?.message).toContain("frontmatter");
        });
    });

    describe("given invalid frontmatter fields", () => {
        it("should return an error when name is missing", async () => {
            const useCase = createUseCase();
            const content = `---\ndescription: A valid description\n---\n`;

            const result = await useCase.execute({
                content,
                skillName: "my-skill",
            });

            expect(result.summary.totalErrors).toBeGreaterThan(0);
        });

        it("should return an error when name format is invalid", async () => {
            const useCase = createUseCase();
            const content = `---\nname: InvalidName\ndescription: A valid description\n---\n`;

            const result = await useCase.execute({
                content,
                skillName: "InvalidName",
            });

            expect(result.summary.totalErrors).toBeGreaterThan(0);
        });

        it("should return an error when name does not match skill name", async () => {
            const useCase = createUseCase();
            const content = `---\nname: different-name\ndescription: A valid description\n---\n`;

            const result = await useCase.execute({
                content,
                skillName: "my-skill",
            });

            const mismatchError = result.diagnostics.find(
                (d) => d.ruleId === "skill/name-mismatch",
            );
            expect(mismatchError).toBeDefined();
        });
    });

    describe("given empty content", () => {
        it("should return an error diagnostic", async () => {
            const useCase = createUseCase();

            const result = await useCase.execute({
                content: "",
                skillName: "my-skill",
            });

            expect(result.summary.totalErrors).toBeGreaterThan(0);
        });
    });

    describe("given content exceeding maximum size", () => {
        it("should return an input-too-large error without parsing", async () => {
            const useCase = createUseCase();
            const oversizedContent = "a".repeat(512_001);

            const result = await useCase.execute({
                content: oversizedContent,
                skillName: "my-skill",
            });

            expect(result.summary.totalErrors).toBe(1);
            expect(result.diagnostics[0]?.ruleId).toBe("skill/input-too-large");
            expect(result.diagnostics[0]?.message).toContain("512000");
        });
    });

    describe("result structure", () => {
        it("should include a summary with file, error, and warning counts", async () => {
            const useCase = createUseCase();
            const skillName = chance.word({ length: 8 });
            const content = `---\nname: ${skillName}\ndescription: ${chance.sentence()}\n---\n`;

            const result = await useCase.execute({ content, skillName });

            expect(result.summary).toHaveProperty("totalFiles");
            expect(result.summary).toHaveProperty("totalErrors");
            expect(result.summary).toHaveProperty("totalWarnings");
            expect(result.summary.totalFiles).toBe(1);
        });
    });
});
