import { expect, test } from "@playwright/test";
import { DocsPage, SearchOverlay } from "./pages";

// These tests require the site to be built with `npm run build` so that the
// Pagefind index exists. Run with: npm run test:e2e:dist

test.describe("Search", () => {
    test.describe("given a user on the docs readme page", () => {
        test("displays results when searching for a term that appears in the docs", async ({
            page,
        }) => {
            // Arrange
            const docsPage = new DocsPage(page);
            const search = new SearchOverlay(page);
            await docsPage.goto("readme");

            // Act
            await search.openViaButton();
            await search.expectToBeVisible();
            await search.search("init");

            // Assert — search results must appear; currently fails because
            // data-pagefind-body is inside <template data-astro-template> (a
            // client:only slot) so Pagefind never indexes the docs content.
            await search.expectResultsToBeVisible();
        });

        test("clears the search input when the Clear button is clicked", async ({
            page,
        }) => {
            // Arrange
            const docsPage = new DocsPage(page);
            const search = new SearchOverlay(page);
            await docsPage.goto("readme");

            // Act
            await search.openViaButton();
            await search.expectToBeVisible();
            await search.search("hooks");
            await page.locator(".pagefind-ui__search-clear").click();

            // Assert
            await expect(search.input).toHaveValue("");
        });
    });
});
