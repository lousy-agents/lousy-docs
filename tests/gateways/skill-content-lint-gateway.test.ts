import Chance from "chance";
import { describe, expect, it } from "vitest";
import { createSkillContentLintGateway } from "@/gateways/skill-content-lint-gateway";

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
});
