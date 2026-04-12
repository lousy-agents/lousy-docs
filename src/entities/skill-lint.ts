/**
 * Browser-compatible skill lint entities.
 * Provides types and a Zod schema for validating skill frontmatter
 * without Node.js filesystem dependencies.
 */

import { z } from "zod";

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

/** Zod schema for validating skill frontmatter fields */
export const SkillFrontmatterSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .max(64, "Name must be 64 characters or fewer")
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Name must contain only lowercase letters, numbers, and hyphens. It cannot start/end with a hyphen or contain consecutive hyphens.",
        ),
    description: z
        .string()
        .min(1, "Description is required")
        .max(1024, "Description must be 1024 characters or fewer")
        .refine((s) => s.trim().length > 0, {
            message: "Description cannot be empty or whitespace-only",
        }),
    license: z.string().optional(),
    compatibility: z
        .string()
        .max(500, "Compatibility must be 500 characters or fewer")
        .optional(),
    metadata: z.record(z.string(), z.string()).optional(),
    "allowed-tools": z.string().optional(),
});
