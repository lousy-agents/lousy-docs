import { expect, test } from "@playwright/test";

function normalizePath(href: string, base: string): string {
    const url = new URL(href, base);
    let path = url.pathname;
    path = path.replace(/\/{2,}/g, "/");
    if (path.length > 1 && path.endsWith("/")) {
        path = path.replace(/\/+$/, "");
    }
    return path;
}

test.describe("Homepage link integrity", () => {
    test("every internal link inside <main> resolves to a 200 page", async ({
        page,
        request,
        baseURL,
    }) => {
        await page.goto("/");
        // The home page is a client:only React island; wait for it to hydrate
        // so anchors are present in the DOM before walking them.
        await page.waitForSelector("main a[href]");

        const hrefs = await page.$$eval("main a[href]", (anchors) =>
            anchors
                .map((a) => a.getAttribute("href") ?? "")
                .filter((href) => href.startsWith("/")),
        );

        const seen = new Set<string>();
        const failures: Array<{ path: string; status: number }> = [];

        for (const href of hrefs) {
            const path = normalizePath(href, baseURL ?? "http://localhost");
            if (seen.has(path)) {
                continue;
            }
            seen.add(path);

            const response = await request.get(path);
            if (response.status() !== 200) {
                failures.push({ path, status: response.status() });
            }
        }

        expect(failures).toEqual([]);
        expect(seen.size).toBeGreaterThan(0);
    });
});
