import { test } from "@playwright/test";
import { DocsPage, HomePage } from "./pages";

test.describe("Documentation navigation", () => {
    test.describe("given a user on the docs readme page", () => {
        test("navigates to the init documentation page when clicking the init link in content", async ({
            page,
        }) => {
            // Arrange
            const docsPage = new DocsPage(page);
            await docsPage.goto("readme");

            // Act
            await docsPage.clickContentLink("init Command");

            // Assert
            await docsPage.expectToBeOnPage("init");
            await docsPage.expectHeadingToBeVisible("init Command");
            await docsPage.expectSidebarLinkToBeActive("init Command");
        });

        test("navigates to the quickstart page when clicking the quickstart callout link", async ({
            page,
        }) => {
            // Arrange
            const docsPage = new DocsPage(page);
            await docsPage.goto("readme");

            // Act
            await docsPage.expectContentLinkToBeVisible(
                "Get up and running in three steps",
            );
            await docsPage.clickContentLink(
                "Get up and running in three steps",
            );

            // Assert
            await docsPage.expectToBeOnPage("quickstart");
            await docsPage.expectHeadingToBeVisible("Quickstart");
            await docsPage.expectSidebarLinkToBeActive("Quickstart");
        });
    });

    test.describe("given a user on the homepage", () => {
        test("navigating to docs via header link displays the readme documentation page with visible content", async ({
            page,
        }) => {
            // Arrange
            const homePage = new HomePage(page);
            const docsPage = new DocsPage(page);
            await homePage.goto();

            // Act
            await homePage.clickDocsLink();

            // Assert
            await docsPage.expectToBeOnReadmePage();
            await docsPage.expectHeadingToBeVisible(
                "Lousy Agents Documentation",
            );
            await docsPage.expectContentLinkToBeVisible(
                "Get up and running in three steps",
            );
            await docsPage.expectSidebarLinkToBeActive("Overview");
        });
    });

    test.describe("given a user on the init docs page", () => {
        test("displays the readme documentation page when clicking Overview in the sidebar", async ({
            page,
        }) => {
            // Arrange
            const docsPage = new DocsPage(page);
            await docsPage.goto("init");

            // Act
            await docsPage.clickSidebarLink("Overview");

            // Assert
            await docsPage.expectToBeOnReadmePage();
            await docsPage.expectHeadingToBeVisible(
                "Lousy Agents Documentation",
            );
            await docsPage.expectSidebarLinkToBeActive("Overview");
        });

        test("navigates to the quickstart page when clicking Quickstart in the sidebar", async ({
            page,
        }) => {
            // Arrange
            const docsPage = new DocsPage(page);
            await docsPage.goto("init");

            // Act
            await docsPage.clickSidebarLink("Quickstart");

            // Assert
            await docsPage.expectToBeOnPage("quickstart");
            await docsPage.expectHeadingToBeVisible("Quickstart");
            await docsPage.expectSidebarLinkToBeActive("Quickstart");
        });
    });
});
