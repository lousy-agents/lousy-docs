import { z } from "zod";
import type { HomepageFeatureInventoryItem } from "@/entities/feature";

const HomepageFeatureInventoryItemBaseSchema = z.object({
    id: z.string(),
    title: z.string(),
    summary: z.string(),
    primaryDocsHref: z
        .string()
        .regex(/^\/docs\/[^/]+$/, "primaryDocsHref must match /docs/<slug>"),
    primaryContentSlug: z.string(),
    fallbackDocsHref: z.literal("/docs/quickstart").optional(),
    fallbackContentSlug: z.literal("quickstart").optional(),
});

export const HomepageFeatureInventoryItemSchema =
    HomepageFeatureInventoryItemBaseSchema.superRefine((feature, ctx) => {
        const capturedSlug = feature.primaryDocsHref.replace("/docs/", "");
        if (feature.primaryContentSlug !== capturedSlug) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["primaryContentSlug"],
                message:
                    "primaryContentSlug must equal the captured segment from primaryDocsHref",
            });
        }

        const hasFallbackHref = feature.fallbackDocsHref !== undefined;
        const hasFallbackSlug = feature.fallbackContentSlug !== undefined;
        if (hasFallbackHref !== hasFallbackSlug) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["fallbackDocsHref"],
                message:
                    "Fallback href and content slug must be configured together",
            });
        }
    });

export const documentedFeaturesInventorySchema = z
    .array(HomepageFeatureInventoryItemSchema)
    .refine((items) => new Set(items.map((i) => i.id)).size === items.length, {
        message: "Duplicate inventory IDs detected",
    });

export const DOCUMENTED_FEATURES: HomepageFeatureInventoryItem[] =
    documentedFeaturesInventorySchema.parse([
        {
            id: "init",
            title: "init",
            summary:
                "Scaffold a Lousy Agents workspace — configuration files, base agents, skills, and instructions — with a single CLI command.",
            primaryDocsHref: "/docs/init",
            primaryContentSlug: "init",
            fallbackDocsHref: "/docs/quickstart",
            fallbackContentSlug: "quickstart",
        },
        {
            id: "new",
            title: "new",
            summary:
                "Generate new resources such as Copilot agents and skills from the CLI, keeping your `.github/` and `.claude/` folders consistent.",
            primaryDocsHref: "/docs/new",
            primaryContentSlug: "new",
        },
        {
            id: "lint",
            title: "lint",
            summary:
                "Validate agents, skills, and instructions in CI — catch missing frontmatter, broken hooks, and weak instruction quality before they ship.",
            primaryDocsHref: "/docs/lint",
            primaryContentSlug: "lint",
            fallbackDocsHref: "/docs/quickstart",
            fallbackContentSlug: "quickstart",
        },
        {
            id: "copilot-setup",
            title: "copilot-setup",
            summary:
                "Generate a GitHub Copilot environment workflow so the Copilot coding agent has the dependencies it needs to work in your repo.",
            primaryDocsHref: "/docs/copilot-setup",
            primaryContentSlug: "copilot-setup",
        },
        {
            id: "mcp-server",
            title: "MCP Server",
            summary:
                "Connect your editor to the Lousy Agents Model Context Protocol server so your AI assistant can read and validate your workspace as you code.",
            primaryDocsHref: "/docs/mcp-server",
            primaryContentSlug: "mcp-server",
            fallbackDocsHref: "/docs/quickstart",
            fallbackContentSlug: "quickstart",
        },
        {
            id: "agent-shell",
            title: "Agent Shell",
            summary:
                "An audit-trail wrapper around npm's `script-shell` that records structured telemetry for npm script execution and Copilot lifecycle hooks.",
            primaryDocsHref: "/docs/agent-shell",
            primaryContentSlug: "agent-shell",
        },
    ]);
