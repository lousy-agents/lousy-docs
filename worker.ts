interface CloudflareAssets {
    fetch(request: Request): Promise<Response>;
}

interface Env {
    ASSETS: CloudflareAssets;
}

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);

        if (url.pathname === "/robots.txt") {
            const assetResponse = await env.ASSETS.fetch(request);
            const text = await assetResponse.text();
            // Strip Content-Signal directives injected by Cloudflare's managed robots.txt
            // feature. Google flags this as an "Unknown directive" since it is not part
            // of the standard robots.txt specification.
            const cleaned = text
                .split("\n")
                .filter((line) => !line.startsWith("Content-Signal:"))
                .join("\n")
                .trimEnd();
            return new Response(cleaned, {
                headers: {
                    "Content-Type": "text/plain; charset=utf-8",
                },
            });
        }

        return env.ASSETS.fetch(request);
    },
};
