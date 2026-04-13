import Chance from "chance";
import { describe, expect, it } from "vitest";
import {
    createSkillContentLintGateway,
    SkillFrontmatterSchema,
} from "@/gateways/skill-content-lint-gateway";

const chance = new Chance();

describe("SkillContentLintGateway", () => {
    const gateway = createSkillContentLintGateway();

    describe("parseFrontmatter", () => {
        describe("given valid frontmatter", () => {
            it("should parse name and description fields", () => {
                const name = `skill-${chance.word({ length: 8 })}`;
                const description = chance.sentence();
                const content = `---\nname: ${name}\ndescription: ${description}\n---\n\n# ${name}`;

                const result = gateway.parseFrontmatter(content);

                expect(result).not.toBeNull();
                expect(result?.data.name).toBe(name);
                expect(result?.data.description).toBe(description);
            });

            it("should map field names to line numbers", () => {
                const content = `---\nname: my-skill\ndescription: A description\n---\n`;

                const result = gateway.parseFrontmatter(content);

                expect(result?.fieldLines.get("name")).toBe(2);
                expect(result?.fieldLines.get("description")).toBe(3);
            });

            it("should set frontmatterStartLine to 1", () => {
                const content = `---\nname: my-skill\ndescription: A description\n---\n`;

                const result = gateway.parseFrontmatter(content);

                expect(result?.frontmatterStartLine).toBe(1);
            });
        });

        describe("given missing frontmatter", () => {
            it("should return null when content has no frontmatter delimiters", () => {
                const content = "# Just a markdown heading\n\nSome content.";

                const result = gateway.parseFrontmatter(content);

                expect(result).toBeNull();
            });

            it("should return null when opening delimiter is missing", () => {
                const content = "name: my-skill\n---\n";

                const result = gateway.parseFrontmatter(content);

                expect(result).toBeNull();
            });

            it("should return null when closing delimiter is missing", () => {
                const content = "---\nname: my-skill\n";

                const result = gateway.parseFrontmatter(content);

                expect(result).toBeNull();
            });
        });

        describe("given invalid YAML content", () => {
            it("should return null for malformed YAML between delimiters", () => {
                const content = "---\n: invalid: yaml: content\n---\n";

                const result = gateway.parseFrontmatter(content);

                expect(result).toBeNull();
            });
        });

        describe("given empty frontmatter", () => {
            it("should return an empty data object", () => {
                const content = "---\n---\n";

                const result = gateway.parseFrontmatter(content);

                expect(result).not.toBeNull();
                expect(result?.data).toEqual({});
            });
        });
    });

    describe("validateFrontmatter", () => {
        describe("given valid frontmatter data", () => {
            it("should return success with parsed name and description", () => {
                const data = {
                    name: "my-skill",
                    description: chance.sentence(),
                };

                const result = gateway.validateFrontmatter(data);

                expect(result.success).toBe(true);
                expect(result.data?.name).toBe("my-skill");
                expect(result.data?.description).toBe(data.description);
                expect(result.issues).toHaveLength(0);
            });
        });

        describe("given missing required fields", () => {
            it("should return failure with issues for missing name", () => {
                const data = {
                    description: chance.sentence(),
                };

                const result = gateway.validateFrontmatter(data);

                expect(result.success).toBe(false);
                expect(result.issues.length).toBeGreaterThan(0);
                expect(
                    result.issues.some(
                        (i) =>
                            i.path.includes("name") ||
                            i.message.toLowerCase().includes("required"),
                    ),
                ).toBe(true);
            });

            it("should return failure with issues for missing description", () => {
                const data = {
                    name: "my-skill",
                };

                const result = gateway.validateFrontmatter(data);

                expect(result.success).toBe(false);
                expect(result.issues.length).toBeGreaterThan(0);
            });
        });

        describe("given invalid field values", () => {
            it("should return failure for invalid name format", () => {
                const data = {
                    name: "Invalid Name",
                    description: chance.sentence(),
                };

                const result = gateway.validateFrontmatter(data);

                expect(result.success).toBe(false);
                expect(result.issues.length).toBeGreaterThan(0);
            });
        });
    });
});

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
