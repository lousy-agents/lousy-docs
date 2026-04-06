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

        test("closes when the Escape key is pressed", async ({ page }) => {
            // Arrange
            const docsPage = new DocsPage(page);
            const search = new SearchOverlay(page);
            await docsPage.goto("readme");
            await search.openViaButton();
            await search.expectToBeVisible();

            // Act
            await search.closeViaEscape();

            // Assert
            await search.expectToBeClosed();
        });

        test("closes when the close button inside the dialog is clicked", async ({
            page,
        }) => {
            // Arrange
            const docsPage = new DocsPage(page);
            const search = new SearchOverlay(page);
            await docsPage.goto("readme");
            await search.openViaButton();
            await search.expectToBeVisible();

            // Act
            await search.closeViaButton();

            // Assert
            await search.expectToBeClosed();
        });

        test("closes when clicking the backdrop outside the panel", async ({
            page,
        }) => {
            // Arrange
            const docsPage = new DocsPage(page);
            const search = new SearchOverlay(page);
            await docsPage.goto("readme");
            await search.openViaButton();
            await search.expectToBeVisible();

            // Act
            await search.closeViaBackdrop();

            // Assert
            await search.expectToBeClosed();
        });

        test("opens and closes via Ctrl+K keyboard shortcut", async ({
            page,
        }) => {
            // Arrange
            const docsPage = new DocsPage(page);
            const search = new SearchOverlay(page);
            await docsPage.goto("readme");

            // Act — open
            await search.toggleViaKeyboard("Control");
            await search.expectToBeVisible();

            // Act — close
            await search.toggleViaKeyboard("Control");
            await search.expectToBeClosed();
        });

        test("restores focus to the search button after the overlay is closed", async ({
            page,
        }) => {
            // Arrange
            const docsPage = new DocsPage(page);
            const search = new SearchOverlay(page);
            await docsPage.goto("readme");
            const searchButton = page.getByRole("button", { name: "Search" });
            await searchButton.click();
            await search.expectToBeVisible();

            // Act
            await search.closeViaEscape();

            // Assert — focus should return to the button that opened the overlay
            await search.expectToBeClosed();
            await expect(searchButton).toBeFocused();
        });
    });
});
