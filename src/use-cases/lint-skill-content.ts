/**
 * Use case for linting skill markdown content in the browser.
 * Validates frontmatter against the skill schema and produces diagnostics.
 */

import {
    type ParsedFrontmatter,
    type SkillLintDiagnostic,
    type SkillLintOutput,
} from "@/entities/skill-lint";
import { SkillFrontmatterSchema } from "@/gateways/skill-content-lint-gateway";

/** Port interface for the skill content lint gateway */
export interface SkillContentLintGateway {
    parseFrontmatter(content: string): ParsedFrontmatter | null;
}

const RECOMMENDED_FIELDS = ["allowed-tools"] as const;

const RECOMMENDED_FIELD_RULE_IDS: Record<
    (typeof RECOMMENDED_FIELDS)[number],
    string
> = {
    "allowed-tools": "skill/missing-allowed-tools",
} as const;

export interface LintSkillContentInput {
    readonly content: string;
    readonly skillName: string;
}

export class LintSkillContentUseCase {
    constructor(private readonly gateway: SkillContentLintGateway) {}

    async execute(input: LintSkillContentInput): Promise<SkillLintOutput> {
        const { content, skillName } = input;
        let diagnostics: SkillLintDiagnostic[] = [];

        const parsed = this.gateway.parseFrontmatter(content);

        if (!parsed) {
            const hasDelimiters = this.hasFrontmatterDelimiters(content);
            const message = hasDelimiters
                ? "Invalid YAML frontmatter. The content between --- delimiters could not be parsed as valid YAML."
                : "Missing YAML frontmatter. Skill files must begin with --- delimited YAML frontmatter.";
            const ruleId = hasDelimiters
                ? "skill/invalid-frontmatter"
                : "skill/missing-frontmatter";

            diagnostics.push({
                line: 1,
                severity: "error",
                message,
                ruleId,
            });

            return {
                diagnostics,
                summary: {
                    totalFiles: 1,
                    totalErrors: 1,
                    totalWarnings: 0,
                },
            };
        }

        diagnostics = this.validateFrontmatter(parsed, skillName);

        const totalErrors = diagnostics.filter(
            (d) => d.severity === "error",
        ).length;
        const totalWarnings = diagnostics.filter(
            (d) => d.severity === "warning",
        ).length;

        return {
            diagnostics,
            summary: {
                totalFiles: 1,
                totalErrors,
                totalWarnings,
            },
        };
    }

    private validateFrontmatter(
        parsed: ParsedFrontmatter,
        skillName: string,
    ): SkillLintDiagnostic[] {
        const diagnostics: SkillLintDiagnostic[] = [];

        const result = SkillFrontmatterSchema.safeParse(parsed.data);

        if (!result.success) {
            for (const issue of result.error.issues) {
                const fieldName = issue.path[0]?.toString();
                const line = fieldName
                    ? (parsed.fieldLines.get(fieldName) ??
                      parsed.frontmatterStartLine)
                    : parsed.frontmatterStartLine;

                const ruleId = this.getRuleIdForField(
                    fieldName,
                    issue.code,
                    parsed.data,
                );

                diagnostics.push({
                    line,
                    severity: "error",
                    message: issue.message,
                    field: fieldName,
                    ruleId,
                });
            }
        }

        if (result.success && result.data.name !== skillName) {
            const nameLine =
                parsed.fieldLines.get("name") ?? parsed.frontmatterStartLine;
            diagnostics.push({
                line: nameLine,
                severity: "error",
                message: `Frontmatter name '${result.data.name}' must match skill name '${skillName}'`,
                field: "name",
                ruleId: "skill/name-mismatch",
            });
        }

        for (const field of RECOMMENDED_FIELDS) {
            if (parsed.data[field] === undefined) {
                diagnostics.push({
                    line: parsed.frontmatterStartLine,
                    severity: "warning",
                    message: `Recommended field '${field}' is missing`,
                    field,
                    ruleId: RECOMMENDED_FIELD_RULE_IDS[field],
                });
            }
        }

        return diagnostics;
    }

    private getRuleIdForField(
        fieldName: string | undefined,
        issueCode: string,
        inputData: Record<string, unknown>,
    ): string {
        const isMissing =
            issueCode === "invalid_type" &&
            (fieldName === undefined || !Object.hasOwn(inputData, fieldName));

        if (fieldName === "name") {
            return isMissing
                ? "skill/missing-name"
                : "skill/invalid-name-format";
        }
        if (fieldName === "description") {
            return isMissing
                ? "skill/missing-description"
                : "skill/invalid-description";
        }
        return "skill/invalid-frontmatter";
    }

    private hasFrontmatterDelimiters(content: string): boolean {
        const lines = content.split("\n");
        if (lines[0]?.trim() !== "---") {
            return false;
        }
        for (let i = 1; i < lines.length; i++) {
            if (lines[i]?.trim() === "---") {
                return true;
            }
        }
        return false;
    }
}
