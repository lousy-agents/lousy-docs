import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
    output: "static",
    site: "https://lousy-docs.lousy-agents.workers.dev",
    integrations: [react(), sitemap()],
    redirects: {
        "/docs": "/docs/readme",
        "/docs/README": "/docs/readme",
    },
});
