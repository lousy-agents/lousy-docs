/**
 * Browser-compatible gateway for parsing YAML frontmatter from skill markdown content.
 * No Node.js filesystem dependencies — works entirely with text strings.
 */

import { parse as parseYaml } from "yaml";
import { z } from "zod";
import type {
    FrontmatterValidationResult,
    ParsedFrontmatter,
    SkillContentLintGateway,
} from "@/use-cases/lint-skill-content";

/** Zod schema for validating skill frontmatter fields */
const SkillFrontmatterSchema = z.object({
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

/**
 * Parses YAML frontmatter from markdown content.
 * Returns null if frontmatter is missing, malformed, or cannot be parsed.
 */
function parseFrontmatter(content: string): ParsedFrontmatter | null {
    const lines = content.split("\n");

    if (lines[0]?.trim() !== "---") {
        return null;
    }

    let endIndex = -1;
    for (let i = 1; i < lines.length; i++) {
        if (lines[i]?.trim() === "---") {
            endIndex = i;
            break;
        }
    }

    if (endIndex === -1) {
        return null;
    }

    const yamlContent = lines.slice(1, endIndex).join("\n");

    let data: Record<string, unknown>;
    try {
        const parsed: unknown = parseYaml(yamlContent);
        if (
            parsed !== null &&
            typeof parsed === "object" &&
            !Array.isArray(parsed)
        ) {
            data = Object.fromEntries(Object.entries(parsed));
        } else {
            data = {};
        }
    } catch (_error: unknown) {
        // Invalid YAML is expected user input in the playground — return null
        // to let the use case produce a user-facing diagnostic message
        return null;
    }

    const fieldLines = new Map<string, number>();
    for (let i = 1; i < endIndex; i++) {
        const match = lines[i]?.match(/^([^\s:][^:]*?):\s/);
        if (match?.[1]) {
            fieldLines.set(match[1], i + 1);
        }
    }

    return {
        data,
        fieldLines,
        frontmatterStartLine: 1,
    };
}

function validateFrontmatter(
    data: Record<string, unknown>,
): FrontmatterValidationResult {
    const result = SkillFrontmatterSchema.safeParse(data);
    if (result.success) {
        return {
            success: true,
            data: {
                name: result.data.name,
                description: result.data.description,
            },
            issues: [],
        };
    }
    return {
        success: false,
        issues: result.error.issues.map((issue) => ({
            path: issue.path,
            code: issue.code,
            message: issue.message,
        })),
    };
}

/** Creates a browser-compatible skill content lint gateway */
export function createSkillContentLintGateway(): SkillContentLintGateway {
    return { parseFrontmatter, validateFrontmatter };
}
