/**
 * Use case for linting skill markdown content in the browser.
 * Validates frontmatter against the skill schema and produces diagnostics.
 */

import type {
    SkillLintDiagnostic,
    SkillLintOutput,
} from "@/entities/skill-lint";

/** Parsed frontmatter data with line number mapping */
export interface ParsedFrontmatter {
    readonly data: Record<string, unknown>;
    readonly fieldLines: ReadonlyMap<string, number>;
    readonly frontmatterStartLine: number;
}

/** A single validation issue from schema validation */
export interface FrontmatterValidationIssue {
    readonly path: readonly (string | number)[];
    readonly code: string;
    readonly message: string;
}

/** Result of frontmatter schema validation */
export interface FrontmatterValidationResult {
    readonly success: boolean;
    readonly data?: { readonly name: string; readonly description: string };
    readonly issues: readonly FrontmatterValidationIssue[];
    readonly unknownFields: readonly string[];
}

/** Port interface for the skill content lint gateway */
export interface SkillContentLintGateway {
    parseFrontmatter(content: string): ParsedFrontmatter | null;
    validateFrontmatter(
        data: Record<string, unknown>,
    ): FrontmatterValidationResult;
}

/** Maximum input size (500KB) to prevent YAML parser from freezing the browser */
const MAX_CONTENT_LENGTH = 512_000;

const RECOMMENDED_FIELDS = ["allowed-tools"] as const;

const RECOMMENDED_FIELD_RULE_IDS: Record<
    (typeof RECOMMENDED_FIELDS)[number],
    string
> = {
    "allowed-tools": "skill/missing-allowed-tools",
} as const;

export interface LintSkillContentInput {
    readonly content: string;
    readonly skillName?: string;
}

export class LintSkillContentUseCase {
    constructor(private readonly gateway: SkillContentLintGateway) {}

    async execute(input: LintSkillContentInput): Promise<SkillLintOutput> {
        const { content } = input;

        if (content.length > MAX_CONTENT_LENGTH) {
            return {
                diagnostics: [
                    {
                        line: 1,
                        severity: "error",
                        message: `Input exceeds maximum size of ${MAX_CONTENT_LENGTH} characters. Please reduce the content size.`,
                        ruleId: "skill/input-too-large",
                    },
                ],
                summary: {
                    totalFiles: 1,
                    totalErrors: 1,
                    totalWarnings: 0,
                },
            };
        }

        let diagnostics: SkillLintDiagnostic[] = [];

        const parsed = this.gateway.parseFrontmatter(content);

        if (!parsed) {
            const delimiterState = this.detectFrontmatterDelimiters(content);
            const message =
                delimiterState === "none"
                    ? "Missing YAML frontmatter. Skill files must begin with --- delimited YAML frontmatter."
                    : delimiterState === "unclosed"
                      ? "Unclosed YAML frontmatter. Opening --- found but no closing --- delimiter."
                      : "Invalid YAML frontmatter. The content between --- delimiters could not be parsed as valid YAML.";
            const ruleId =
                delimiterState === "none"
                    ? "skill/missing-frontmatter"
                    : "skill/invalid-frontmatter";

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

        diagnostics = this.validateFrontmatter(parsed, input.skillName);

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
        skillName: string | undefined,
    ): SkillLintDiagnostic[] {
        const diagnostics: SkillLintDiagnostic[] = [];

        const result = this.gateway.validateFrontmatter(parsed.data);

        if (!result.success) {
            for (const issue of result.issues) {
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

        if (
            result.success &&
            result.data &&
            skillName !== undefined &&
            result.data.name !== skillName
        ) {
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

        for (const field of result.unknownFields) {
            const line =
                parsed.fieldLines.get(field) ?? parsed.frontmatterStartLine;
            diagnostics.push({
                line,
                severity: "warning",
                message: `Unknown frontmatter field '${field}'`,
                field,
                ruleId: "skill/unknown-field",
            });
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

    private detectFrontmatterDelimiters(
        content: string,
    ): "none" | "unclosed" | "complete" {
        const lines = content.split("\n");
        if (lines[0]?.trim() !== "---") {
            return "none";
        }
        for (let i = 1; i < lines.length; i++) {
            if (lines[i]?.trim() === "---") {
                return "complete";
            }
        }
        return "unclosed";
    }
}
