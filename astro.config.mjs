import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import pagefind from "astro-pagefind";

export default defineConfig({
    output: "static",
    site: "https://lousy-docs.lousy-agents.workers.dev",
    integrations: [react(), sitemap(), pagefind()],
    redirects: {
        "/docs": "/docs/readme",
        "/docs/README": "/docs/readme",
    },
});
