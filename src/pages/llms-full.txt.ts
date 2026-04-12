import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

// LLM consumption: quickstart first for onboarding context
const DOC_ORDER = [
    "quickstart",
    "readme",
    "init",
    "new",
    "lint",
    "copilot-setup",
    "mcp-server",
    "agent-shell",
];

export const GET: APIRoute = async () => {
    const allDocs = await getCollection("docs");

    const docsById = new Map(allDocs.map((doc) => [doc.id, doc] as const));

    const orderedDocs = DOC_ORDER.map((slug) => {
        const doc = docsById.get(slug);

        if (!doc) {
            throw new Error(
                `Missing doc for slug "${slug}". Check DOC_ORDER and ensure all referenced docs are fetched.`,
            );
        }

        return doc;
    });

    const orderedIds = new Set(DOC_ORDER);
    const remainingDocs = allDocs
        .filter((doc) => !orderedIds.has(doc.id))
        .sort((a, b) => a.id.localeCompare(b.id));

    const sorted = [...orderedDocs, ...remainingDocs];

    const header = [
        "# Lousy Agents",
        "",
        "> Developer tooling for coding agent governance, observability, and least-privilege infrastructure.",
        "",
    ].join("\n");

    const body = sorted
        .map((doc) => {
            if (typeof doc.body !== "string") {
                throw new Error(
                    `Document "${doc.id}" is missing a body. Check that the content collection entry has content.`,
                );
            }

            return doc.body;
        })
        .join("\n\n---\n\n");

    return new Response(`${header}\n---\n\n${body}`, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
};
