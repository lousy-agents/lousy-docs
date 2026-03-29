import { getCollection } from "astro:content";
import type { APIRoute, GetStaticPaths } from "astro";

export const getStaticPaths: GetStaticPaths = async () => {
    const docs = await getCollection("docs");
    return docs.map((doc) => ({
        params: { slug: doc.id },
        props: { body: doc.body },
    }));
};

export const GET: APIRoute = async ({ props, params }) => {
    const body = props.body;
    if (typeof body !== "string") {
        throw new Error(
            `Missing markdown body for doc "${params.slug}". Check that the content collection entry has content.`,
        );
    }
    return new Response(body, {
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
    });
};
