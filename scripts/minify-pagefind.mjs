/**
 * Post-build script to minify pagefind-highlight.js using esbuild.
 *
 * Pagefind generates pagefind-highlight.js during the Astro build.
 * This script minifies it in-place to reduce its transfer size.
 */

import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { transform } from "esbuild";

const filePath = join("dist", "pagefind", "pagefind-highlight.js");

try {
    const source = await readFile(filePath, "utf-8");
    const result = await transform(source, {
        minify: true,
        target: "es2020",
    });
    await writeFile(filePath, result.code, "utf-8");
    const savedBytes = source.length - result.code.length;
    console.log(
        `[minify-pagefind] Minified pagefind-highlight.js (saved ${savedBytes} bytes)`,
    );
} catch (error) {
    if (error.code === "ENOENT") {
        console.log(
            "[minify-pagefind] pagefind-highlight.js not found — skipping",
        );
    } else {
        throw error;
    }
}
