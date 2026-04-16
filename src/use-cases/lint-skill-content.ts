/**
 * Use case for linting skill markdown content in the browser.
 * Validates frontmatter against the skill schema and produces diagnostics
 * in the @lousy-agents/lint LintOutput format.
 */

import type { LintDiagnostic, LintOutput } from "@/entities/skill-lint";

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

/** Placeholder file path used for playground input (not a real file) */
export const PLAYGROUND_FILE_PATH = "playground-input";

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

    async execute(input: LintSkillContentInput): Promise<LintOutput> {
        const { content } = input;

        if (content.length > MAX_CONTENT_LENGTH) {
            return {
                diagnostics: [
                    {
                        filePath: PLAYGROUND_FILE_PATH,
                        line: 1,
                        severity: "error",
                        message: `Input exceeds maximum size of ${MAX_CONTENT_LENGTH} characters. Please reduce the content size.`,
                        ruleId: "skill/input-too-large",
                        target: "skill",
                    },
                ],
                target: "skill",
                filesAnalyzed: [PLAYGROUND_FILE_PATH],
                summary: {
                    totalFiles: 1,
                    totalErrors: 1,
                    totalWarnings: 0,
                    totalInfos: 0,
                },
            };
        }

        let diagnostics: LintDiagnostic[] = [];

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
                filePath: PLAYGROUND_FILE_PATH,
                line: 1,
                severity: "error",
                message,
                ruleId,
                target: "skill",
            });

            return {
                diagnostics,
                target: "skill",
                filesAnalyzed: [PLAYGROUND_FILE_PATH],
                summary: {
                    totalFiles: 1,
                    totalErrors: 1,
                    totalWarnings: 0,
                    totalInfos: 0,
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
        const totalInfos = diagnostics.filter(
            (d) => d.severity === "info",
        ).length;

        return {
            diagnostics,
            target: "skill",
            filesAnalyzed: [PLAYGROUND_FILE_PATH],
            summary: {
                totalFiles: 1,
                totalErrors,
                totalWarnings,
                totalInfos,
            },
        };
    }

    private validateFrontmatter(
        parsed: ParsedFrontmatter,
        skillName: string | undefined,
    ): LintDiagnostic[] {
        const diagnostics: LintDiagnostic[] = [];

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
                    filePath: PLAYGROUND_FILE_PATH,
                    line,
                    severity: "error",
                    message: issue.message,
                    field: fieldName,
                    ruleId,
                    target: "skill",
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
                filePath: PLAYGROUND_FILE_PATH,
                line: nameLine,
                severity: "error",
                message: `Frontmatter name '${result.data.name}' must match skill name '${skillName}'`,
                field: "name",
                ruleId: "skill/name-mismatch",
                target: "skill",
            });
        }

        for (const field of RECOMMENDED_FIELDS) {
            if (parsed.data[field] === undefined) {
                diagnostics.push({
                    filePath: PLAYGROUND_FILE_PATH,
                    line: parsed.frontmatterStartLine,
                    severity: "warning",
                    message: `Recommended field '${field}' is missing`,
                    field,
                    ruleId: RECOMMENDED_FIELD_RULE_IDS[field],
                    target: "skill",
                });
            }
        }

        for (const field of result.unknownFields) {
            const line =
                parsed.fieldLines.get(field) ?? parsed.frontmatterStartLine;
            diagnostics.push({
                filePath: PLAYGROUND_FILE_PATH,
                line,
                severity: "warning",
                message: `Unknown frontmatter field '${field}'`,
                field,
                ruleId: "skill/unknown-field",
                target: "skill",
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
