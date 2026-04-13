/**
 * Browser-compatible gateway for parsing YAML frontmatter from skill markdown content.
 * No Node.js filesystem dependencies — works entirely with text strings.
 */

import { parse as parseYaml } from "yaml";
import type { ParsedFrontmatter } from "@/entities/skill-lint";

/** Port interface for the skill content lint gateway */
export interface SkillContentLintGateway {
    parseFrontmatter(content: string): ParsedFrontmatter | null;
}

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
    } catch {
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
        data: data ?? {},
        fieldLines,
        frontmatterStartLine: 1,
    };
}

/** Creates a browser-compatible skill content lint gateway */
export function createSkillContentLintGateway(): SkillContentLintGateway {
    return { parseFrontmatter };
}
