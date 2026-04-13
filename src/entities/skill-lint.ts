/**
 * Browser-compatible skill lint entities.
 * Provides pure TypeScript types for skill frontmatter validation
 * without framework dependencies.
 */

/** Severity levels for skill lint diagnostics */
export type SkillLintSeverity = "error" | "warning";

/** A single lint diagnostic for a skill file */
export interface SkillLintDiagnostic {
    readonly line: number;
    readonly severity: SkillLintSeverity;
    readonly message: string;
    readonly field?: string;
    readonly ruleId: string;
}

/** Parsed frontmatter data with line number mapping */
export interface ParsedFrontmatter {
    readonly data: Record<string, unknown>;
    readonly fieldLines: ReadonlyMap<string, number>;
    readonly frontmatterStartLine: number;
}

/** Aggregated lint result summary */
export interface SkillLintSummary {
    readonly totalFiles: number;
    readonly totalErrors: number;
    readonly totalWarnings: number;
}

/** Complete lint output for display */
export interface SkillLintOutput {
    readonly diagnostics: readonly SkillLintDiagnostic[];
    readonly summary: SkillLintSummary;
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
}

/** Port interface for the skill content lint gateway */
export interface SkillContentLintGateway {
    parseFrontmatter(content: string): ParsedFrontmatter | null;
    validateFrontmatter(
        data: Record<string, unknown>,
    ): FrontmatterValidationResult;
}
