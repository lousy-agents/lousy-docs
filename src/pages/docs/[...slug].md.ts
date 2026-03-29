import { getCollection } from "astro:content";
import type { APIRoute, GetStaticPaths } from "astro";

export const getStaticPaths: GetStaticPaths = async () => {
    const docs = await getCollection("docs");
    return docs.map((doc) => ({
        params: { slug: doc.id },
        props: { body: doc.body },
    }));
};

export const GET: APIRoute = async ({ props }) => {
    return new Response(String(props.body ?? ""), {
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
    });
};
