#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const docsDir = fileURLToPath(new URL("../src/content/docs", import.meta.url));
const outFile = fileURLToPath(
    new URL("../tests/fixtures/docs-slugs.json", import.meta.url),
);

if (!fs.existsSync(docsDir)) {
    console.error(
        `ERROR: docs directory not found at ${docsDir}. Run \`bash scripts/fetch-docs.sh\` first.`,
    );
    process.exit(1);
}

const slugs = fs
    .readdirSync(docsDir)
    .filter((name) => name.endsWith(".md"))
    .map((name) => name.replace(/\.md$/, ""))
    .sort();

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, `${JSON.stringify(slugs, null, 2)}\n`);

console.log(`Wrote ${slugs.length} slug(s) to ${outFile}`);
