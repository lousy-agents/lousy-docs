import { expect, type Locator, type Page } from "@playwright/test";

export class DocsPage {
    readonly page: Page;
    readonly content: Locator;
    readonly sidebar: Locator;

    private static buildDocsUrl(slug: string): string {
        return `/docs/${slug}`;
    }

    constructor(page: Page) {
        this.page = page;
        this.content = page.getByRole("main");
        this.sidebar = page.getByRole("navigation", { name: "Documentation" });
    }

    async goto(slug = "readme"): Promise<void> {
        await this.page.goto(DocsPage.buildDocsUrl(slug));
    }

    async clickContentLink(name: string): Promise<void> {
        await this.content.getByRole("link", { name }).click();
    }

    async clickSidebarLink(name: string): Promise<void> {
        await this.sidebar.getByRole("link", { name }).click();
    }

    async expectToBeOnReadmePage(): Promise<void> {
        await expect(this.page).toHaveURL(DocsPage.buildDocsUrl("readme"));
    }

    async expectToBeOnPage(slug: string): Promise<void> {
        await expect(this.page).toHaveURL(DocsPage.buildDocsUrl(slug));
    }

    async expectHeadingToBeVisible(name: string): Promise<void> {
        await expect(
            this.content.getByRole("heading", { name, exact: false }),
        ).toBeVisible();
    }

    async expectSidebarLinkToBeActive(name: string): Promise<void> {
        await expect(
            this.sidebar.getByRole("link", { name }),
        ).toHaveAttribute("aria-current", "page");
    }
}
