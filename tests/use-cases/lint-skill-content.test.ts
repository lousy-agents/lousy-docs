import Chance from "chance";
import { describe, expect, it } from "vitest";
import { createSkillContentLintGateway } from "@/gateways/skill-content-lint-gateway";
import { PlaygroundLintUseCase } from "@/use-cases/lint-skill-content";

const chance = new Chance(42);

function createUseCase() {
    const gateway = createSkillContentLintGateway();
    return new PlaygroundLintUseCase(gateway);
}

describe("PlaygroundLintUseCase", () => {
    describe("given valid skill content", () => {
        it("should return no error diagnostics", async () => {
            const useCase = createUseCase();
            const skillName = "my-skill";
            const content = `---\nname: ${skillName}\ndescription: A valid skill description\n---\n\n# ${skillName}`;

            const result = await useCase.execute({
                content,
                expectedName: skillName,
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
                expectedName: skillName,
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
                expectedName: skillName,
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
                expectedName: "my-skill",
            });

            expect(result.summary.totalErrors).toBeGreaterThan(0);
            const error = result.diagnostics.find(
                (d) => d.severity === "error",
            );
            expect(error?.message).toContain("frontmatter");
            expect(error?.ruleId).toBe("skill/missing-frontmatter");
        });
    });

    describe("given unclosed frontmatter delimiters", () => {
        it("should return an invalid-frontmatter error with unclosed message", async () => {
            const useCase = createUseCase();
            const content = "---\nname: my-skill\n";

            const result = await useCase.execute({
                content,
            });

            expect(result.summary.totalErrors).toBe(1);
            const error = result.diagnostics[0];
            expect(error?.ruleId).toBe("skill/invalid-frontmatter");
            expect(error?.message).toContain("Unclosed");
        });
    });

    describe("given frontmatter delimiters with unparseable YAML", () => {
        it("should return an invalid-frontmatter error", async () => {
            const useCase = createUseCase();
            const content = "---\n: :\n---\n";

            const result = await useCase.execute({
                content,
                expectedName: "my-skill",
            });

            expect(result.summary.totalErrors).toBe(1);
            const error = result.diagnostics[0];
            expect(error?.ruleId).toBe("skill/invalid-frontmatter");
            expect(error?.message).toContain("Invalid YAML");
        });
    });

    describe("given invalid frontmatter fields", () => {
        it("should return an error when name is missing", async () => {
            const useCase = createUseCase();
            const content = `---\ndescription: A valid description\n---\n`;

            const result = await useCase.execute({
                content,
                expectedName: "my-skill",
            });

            expect(result.summary.totalErrors).toBeGreaterThan(0);
        });

        it("should return an error when name format is invalid", async () => {
            const useCase = createUseCase();
            const content = `---\nname: InvalidName\ndescription: A valid description\n---\n`;

            const result = await useCase.execute({
                content,
                expectedName: "InvalidName",
            });

            expect(result.summary.totalErrors).toBeGreaterThan(0);
        });

        it("should return an error when name does not match skill name", async () => {
            const useCase = createUseCase();
            const content = `---\nname: different-name\ndescription: A valid description\n---\n`;

            const result = await useCase.execute({
                content,
                expectedName: "my-skill",
            });

            const mismatchError = result.diagnostics.find(
                (d) => d.ruleId === "skill/name-mismatch",
            );
            expect(mismatchError).toBeDefined();
        });

        it("should skip name-mismatch check when expectedName is not provided", async () => {
            const useCase = createUseCase();
            const content = `---\nname: any-valid-name\ndescription: A valid description\n---\n`;

            const result = await useCase.execute({
                content,
            });

            const mismatchError = result.diagnostics.find(
                (d) => d.ruleId === "skill/name-mismatch",
            );
            expect(mismatchError).toBeUndefined();
        });

        it("should warn about unknown frontmatter fields", async () => {
            const useCase = createUseCase();
            const content = `---\nname: my-skill\ndescription: A valid description\nunknown-field: some value\n---\n`;

            const result = await useCase.execute({
                content,
                expectedName: "my-skill",
            });

            const unknownWarning = result.diagnostics.find(
                (d) => d.ruleId === "skill/unknown-field",
            );
            expect(unknownWarning).toBeDefined();
            expect(unknownWarning?.severity).toBe("warning");
            expect(unknownWarning?.message).toContain("unknown-field");
        });
    });

    describe("given empty content", () => {
        it("should return an error diagnostic", async () => {
            const useCase = createUseCase();

            const result = await useCase.execute({
                content: "",
                expectedName: "my-skill",
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
                expectedName: "my-skill",
            });

            expect(result.summary.totalErrors).toBe(1);
            expect(result.diagnostics[0]?.ruleId).toBe("skill/input-too-large");
            expect(result.diagnostics[0]?.message).toContain("512000");
        });
    });

    describe("result structure", () => {
        it("should include a summary with file, error, and warning counts", async () => {
            const useCase = createUseCase();
            const skillName = `skill-${chance.string({ length: 6, pool: "abcdefghijklmnopqrstuvwxyz0123456789" })}`;
            const content = `---\nname: ${skillName}\ndescription: ${chance.sentence()}\n---\n`;

            const result = await useCase.execute({
                content,
                expectedName: skillName,
            });

            expect(result.summary).toHaveProperty("totalFiles");
            expect(result.summary).toHaveProperty("totalErrors");
            expect(result.summary).toHaveProperty("totalWarnings");
            expect(result.summary.totalFiles).toBe(1);
        });

        it("should conform to @lousy-agents/lint LintOutput shape", async () => {
            const useCase = createUseCase();
            const skillName = `skill-${chance.string({ length: 6, pool: "abcdefghijklmnopqrstuvwxyz0123456789" })}`;
            const content = `---\nname: ${skillName}\ndescription: ${chance.sentence()}\n---\n`;

            const result = await useCase.execute({
                content,
                expectedName: skillName,
            });

            expect(result.target).toBe("skill");
            expect(result.filesAnalyzed).toEqual(["playground-input"]);
            expect(result.summary).toHaveProperty("totalInfos");
        });

        it("should include filePath and target on each diagnostic", async () => {
            const useCase = createUseCase();
            const content = "---\ndescription: Missing name\n---\n";

            const result = await useCase.execute({
                content,
                expectedName: "my-skill",
            });

            for (const diagnostic of result.diagnostics) {
                expect(diagnostic.filePath).toBe("playground-input");
                expect(diagnostic.target).toBe("skill");
            }
        });
    });
});

describe("PlaygroundLintUseCase with agent target", () => {
    describe("given valid agent content", () => {
        it("should return no error diagnostics", async () => {
            const useCase = createUseCase();
            const content = `---\nname: my-agent\ndescription: A valid agent description\n---\n`;

            const result = await useCase.execute({
                content,
                target: "agent",
            });

            const errors = result.diagnostics.filter(
                (d) => d.severity === "error",
            );
            expect(errors).toHaveLength(0);
        });

        it("should set the target to agent in the result", async () => {
            const useCase = createUseCase();
            const content = `---\nname: my-agent\ndescription: A valid agent\n---\n`;

            const result = await useCase.execute({
                content,
                target: "agent",
            });

            expect(result.target).toBe("agent");
        });

        it("should allow uppercase letters in agent names", async () => {
            const useCase = createUseCase();
            const content = `---\nname: MyAgent\ndescription: An agent with uppercase name\n---\n`;

            const result = await useCase.execute({
                content,
                target: "agent",
            });

            const nameErrors = result.diagnostics.filter(
                (d) =>
                    d.ruleId === "agent/invalid-name-format" ||
                    d.ruleId === "agent/missing-name",
            );
            expect(nameErrors).toHaveLength(0);
        });
    });

    describe("given missing agent frontmatter", () => {
        it("should return an error with agent-prefixed rule ID", async () => {
            const useCase = createUseCase();
            const content = "# Just a heading";

            const result = await useCase.execute({
                content,
                target: "agent",
            });

            expect(result.summary.totalErrors).toBe(1);
            expect(result.diagnostics[0]?.ruleId).toBe(
                "agent/missing-frontmatter",
            );
            expect(result.diagnostics[0]?.target).toBe("agent");
        });
    });

    describe("given agent content with missing name", () => {
        it("should return an error with agent/missing-name rule ID", async () => {
            const useCase = createUseCase();
            const content = `---\ndescription: An agent without a name\n---\n`;

            const result = await useCase.execute({
                content,
                target: "agent",
            });

            const missingName = result.diagnostics.find(
                (d) => d.ruleId === "agent/missing-name",
            );
            expect(missingName).toBeDefined();
            expect(missingName?.target).toBe("agent");
        });
    });

    describe("given agent content with unknown fields", () => {
        it("should warn with agent/unknown-field rule ID", async () => {
            const useCase = createUseCase();
            const content = `---\nname: my-agent\ndescription: Valid\nunknown-key: value\n---\n`;

            const result = await useCase.execute({
                content,
                target: "agent",
            });

            const unknownWarning = result.diagnostics.find(
                (d) => d.ruleId === "agent/unknown-field",
            );
            expect(unknownWarning).toBeDefined();
            expect(unknownWarning?.severity).toBe("warning");
        });
    });

    describe("given agent content with name mismatch", () => {
        it("should return an agent/name-mismatch error when expectedName does not match", async () => {
            const useCase = createUseCase();
            const content = `---\nname: actual-agent\ndescription: A valid agent\n---\n`;

            const result = await useCase.execute({
                content,
                target: "agent",
                expectedName: "expected-agent",
            });

            const mismatchError = result.diagnostics.find(
                (d) => d.ruleId === "agent/name-mismatch",
            );
            expect(mismatchError).toBeDefined();
            expect(mismatchError?.severity).toBe("error");
            expect(mismatchError?.target).toBe("agent");
        });
    });

    describe("given oversized agent content", () => {
        it("should return an agent/input-too-large error", async () => {
            const useCase = createUseCase();
            const oversizedContent = "a".repeat(512_001);

            const result = await useCase.execute({
                content: oversizedContent,
                target: "agent",
            });

            expect(result.diagnostics[0]?.ruleId).toBe("agent/input-too-large");
            expect(result.target).toBe("agent");
        });
    });
});

describe("PlaygroundLintUseCase with instruction target", () => {
    describe("given valid instruction content", () => {
        it("should return no error diagnostics", async () => {
            const useCase = createUseCase();
            const content = `# Project Instructions\n\nThis project uses TypeScript.\n\n## Commands\n\n\`\`\`bash\nnpm test\n\`\`\`\n`;

            const result = await useCase.execute({
                content,
                target: "instruction",
            });

            expect(result.summary.totalErrors).toBe(0);
        });

        it("should set the target to instruction in the result", async () => {
            const useCase = createUseCase();
            const content = "# Instructions\n\nSome content.";

            const result = await useCase.execute({
                content,
                target: "instruction",
            });

            expect(result.target).toBe("instruction");
        });
    });

    describe("given empty instruction content", () => {
        it("should return a warning about empty content", async () => {
            const useCase = createUseCase();

            const result = await useCase.execute({
                content: "",
                target: "instruction",
            });

            expect(result.summary.totalWarnings).toBe(1);
            expect(result.diagnostics[0]?.ruleId).toBe(
                "instruction/empty-content",
            );
            expect(result.diagnostics[0]?.severity).toBe("warning");
        });
    });

    describe("given whitespace-only instruction content", () => {
        it("should return a warning about empty content", async () => {
            const useCase = createUseCase();

            const result = await useCase.execute({
                content: "   \n  \t  ",
                target: "instruction",
            });

            expect(result.summary.totalWarnings).toBe(1);
            expect(result.diagnostics[0]?.ruleId).toBe(
                "instruction/empty-content",
            );
        });
    });

    describe("given oversized instruction content", () => {
        it("should return an instruction/input-too-large error", async () => {
            const useCase = createUseCase();
            const oversizedContent = "a".repeat(512_001);

            const result = await useCase.execute({
                content: oversizedContent,
                target: "instruction",
            });

            expect(result.diagnostics[0]?.ruleId).toBe(
                "instruction/input-too-large",
            );
            expect(result.target).toBe("instruction");
        });
    });
});
