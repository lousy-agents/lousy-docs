import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

const DOC_ORDER = [
    "readme",
    "init",
    "new",
    "lint",
    "copilot-setup",
    "mcp-server",
];

export const GET: APIRoute = async () => {
    const allDocs = await getCollection("docs");

    const sorted = DOC_ORDER.map((slug) =>
        allDocs.find((doc) => doc.id === slug),
    ).filter((doc): doc is NonNullable<typeof doc> => doc !== undefined);

    const header = [
        "# Lousy Agents",
        "",
        "> Developer tooling for coding agent governance, observability, and least-privilege infrastructure.",
        "",
    ].join("\n");

    const body = sorted.map((doc) => doc.body).join("\n\n---\n\n");

    return new Response(`${header}\n---\n\n${body}`, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
};
