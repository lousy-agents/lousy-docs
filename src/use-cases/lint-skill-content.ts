/**
 * Use case for linting content in the browser.
 * Validates frontmatter against target-specific schemas and produces diagnostics
 * in the @lousy-agents/lint LintOutput format.
 *
 * Supports skill, agent, and instruction content types.
 */

import type {
    LintDiagnostic,
    LintOutput,
    LintTarget,
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

/** Port interface for the content lint gateway */
export interface SkillContentLintGateway {
    parseFrontmatter(content: string): ParsedFrontmatter | null;
    validateFrontmatter(
        data: Record<string, unknown>,
    ): FrontmatterValidationResult;
    validateAgentFrontmatter(
        data: Record<string, unknown>,
    ): FrontmatterValidationResult;
}

/** Supported playground lint target types */
export type PlaygroundLintTarget = "skill" | "agent" | "instruction";

/** Maximum input size (500KB) to prevent YAML parser from freezing the browser */
const MAX_CONTENT_LENGTH = 512_000;

/** Placeholder file path used for playground input (not a real file) */
export const PLAYGROUND_FILE_PATH = "playground-input";

const SKILL_RECOMMENDED_FIELDS = ["allowed-tools"] as const;

const SKILL_RECOMMENDED_FIELD_RULE_IDS: Record<
    (typeof SKILL_RECOMMENDED_FIELDS)[number],
    string
> = {
    "allowed-tools": "skill/missing-allowed-tools",
} as const;

export interface PlaygroundLintInput {
    readonly content: string;
    readonly expectedName?: string;
    readonly target?: PlaygroundLintTarget;
}

/** @deprecated Use PlaygroundLintInput instead */
export type LintSkillContentInput = PlaygroundLintInput;

/** Maps a PlaygroundLintTarget to the LintTarget used in diagnostics */
function toLintTarget(target: PlaygroundLintTarget): LintTarget {
    return target;
}

export class PlaygroundLintUseCase {
    constructor(private readonly gateway: SkillContentLintGateway) {}

    async execute(input: PlaygroundLintInput): Promise<LintOutput> {
        const { content } = input;
        const target = input.target ?? "skill";
        const lintTarget = toLintTarget(target);

        if (content.length > MAX_CONTENT_LENGTH) {
            return this.buildSingleErrorOutput(lintTarget, {
                message: `Input exceeds maximum size of ${MAX_CONTENT_LENGTH} characters. Please reduce the content size.`,
                ruleId: `${target}/input-too-large`,
            });
        }

        if (target === "instruction") {
            return this.lintInstruction(content, lintTarget);
        }

        return this.lintFrontmatterTarget(content, input.expectedName, target);
    }

    private lintInstruction(
        content: string,
        lintTarget: LintTarget,
    ): LintOutput {
        const diagnostics: LintDiagnostic[] = [];

        if (content.trim().length === 0) {
            diagnostics.push({
                filePath: PLAYGROUND_FILE_PATH,
                line: 1,
                severity: "warning",
                message:
                    "Instruction file is empty. Add markdown content with headings and code blocks to document your project.",
                ruleId: "instruction/empty-content",
                target: lintTarget,
            });
        }

        return this.buildOutput(lintTarget, diagnostics);
    }

    private lintFrontmatterTarget(
        content: string,
        expectedName: string | undefined,
        target: PlaygroundLintTarget,
    ): LintOutput {
        const lintTarget = toLintTarget(target);
        const parsed = this.gateway.parseFrontmatter(content);

        if (!parsed) {
            const delimiterState = this.detectFrontmatterDelimiters(content);
            const targetLabel = target === "skill" ? "Skill" : "Agent";
            const message =
                delimiterState === "none"
                    ? `Missing YAML frontmatter. ${targetLabel} files must begin with --- delimited YAML frontmatter.`
                    : delimiterState === "unclosed"
                      ? "Unclosed YAML frontmatter. Opening --- found but no closing --- delimiter."
                      : "Invalid YAML frontmatter. The content between --- delimiters could not be parsed as valid YAML.";
            const ruleId =
                delimiterState === "none"
                    ? `${target}/missing-frontmatter`
                    : `${target}/invalid-frontmatter`;

            return this.buildSingleErrorOutput(lintTarget, {
                message,
                ruleId,
            });
        }

        const validate =
            target === "agent"
                ? this.gateway.validateAgentFrontmatter
                : this.gateway.validateFrontmatter;
        const diagnostics = this.validateTargetFrontmatter(
            parsed,
            expectedName,
            target,
            validate,
        );

        return this.buildOutput(lintTarget, diagnostics);
    }

    private validateTargetFrontmatter(
        parsed: ParsedFrontmatter,
        expectedName: string | undefined,
        target: PlaygroundLintTarget,
        validate: (
            data: Record<string, unknown>,
        ) => FrontmatterValidationResult,
    ): LintDiagnostic[] {
        const diagnostics: LintDiagnostic[] = [];
        const result = validate(parsed.data);

        this.addValidationIssueDiagnostics(diagnostics, result, parsed, target);

        if (
            result.success &&
            result.data &&
            expectedName !== undefined &&
            result.data.name !== expectedName
        ) {
            const nameLine =
                parsed.fieldLines.get("name") ?? parsed.frontmatterStartLine;
            diagnostics.push({
                filePath: PLAYGROUND_FILE_PATH,
                line: nameLine,
                severity: "error",
                message: `Frontmatter name '${result.data.name}' must match ${target} name '${expectedName}'`,
                field: "name",
                ruleId: `${target}/name-mismatch`,
                target,
            });
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
                ruleId: `${target}/unknown-field`,
                target,
            });
        }

        if (target === "skill") {
            for (const field of SKILL_RECOMMENDED_FIELDS) {
                if (parsed.data[field] === undefined) {
                    diagnostics.push({
                        filePath: PLAYGROUND_FILE_PATH,
                        line: parsed.frontmatterStartLine,
                        severity: "warning",
                        message: `Recommended field '${field}' is missing`,
                        field,
                        ruleId: SKILL_RECOMMENDED_FIELD_RULE_IDS[field],
                        target: "skill",
                    });
                }
            }
        }

        return diagnostics;
    }

    private addValidationIssueDiagnostics(
        diagnostics: LintDiagnostic[],
        result: FrontmatterValidationResult,
        parsed: ParsedFrontmatter,
        target: PlaygroundLintTarget,
    ): void {
        if (result.success) return;

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
                target,
            );

            diagnostics.push({
                filePath: PLAYGROUND_FILE_PATH,
                line,
                severity: "error",
                message: issue.message,
                field: fieldName,
                ruleId,
                target: toLintTarget(target),
            });
        }
    }

    private getRuleIdForField(
        fieldName: string | undefined,
        issueCode: string,
        inputData: Record<string, unknown>,
        target: PlaygroundLintTarget,
    ): string {
        const isMissing =
            issueCode === "invalid_type" &&
            (fieldName === undefined || !Object.hasOwn(inputData, fieldName));

        if (fieldName === "name") {
            return isMissing
                ? `${target}/missing-name`
                : `${target}/invalid-name-format`;
        }
        if (fieldName === "description") {
            return isMissing
                ? `${target}/missing-description`
                : `${target}/invalid-description`;
        }
        return `${target}/invalid-frontmatter`;
    }

    private buildOutput(
        target: LintTarget,
        diagnostics: LintDiagnostic[],
    ): LintOutput {
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
            target,
            filesAnalyzed: [PLAYGROUND_FILE_PATH],
            summary: {
                totalFiles: 1,
                totalErrors,
                totalWarnings,
                totalInfos,
            },
        };
    }

    private buildSingleErrorOutput(
        target: LintTarget,
        error: { message: string; ruleId: string },
    ): LintOutput {
        return {
            diagnostics: [
                {
                    filePath: PLAYGROUND_FILE_PATH,
                    line: 1,
                    severity: "error",
                    message: error.message,
                    ruleId: error.ruleId,
                    target,
                },
            ],
            target,
            filesAnalyzed: [PLAYGROUND_FILE_PATH],
            summary: {
                totalFiles: 1,
                totalErrors: 1,
                totalWarnings: 0,
                totalInfos: 0,
            },
        };
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

/** @deprecated Use PlaygroundLintUseCase instead */
export const LintSkillContentUseCase = PlaygroundLintUseCase;
