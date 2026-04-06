import { expect, type Locator, type Page } from "@playwright/test";

export class SearchOverlay {
    readonly page: Page;
    readonly overlay: Locator;
    readonly panel: Locator;
    readonly input: Locator;
    readonly results: Locator;

    constructor(page: Page) {
        this.page = page;
        this.overlay = page.locator("#search-overlay");
        this.panel = page.locator(".search-overlay__panel");
        this.input = page.locator(".pagefind-ui__search-input");
        this.results = page.locator(".pagefind-ui__results");
    }

    async openViaButton(): Promise<void> {
        await this.page.getByRole("button", { name: "Search" }).click();
    }

    async search(query: string): Promise<void> {
        await this.input.fill(query);
    }

    async expectToBeVisible(): Promise<void> {
        await expect(this.overlay).toHaveClass(/search-overlay--open/);
    }

    async expectResultsToBeVisible(): Promise<void> {
        await expect(
            this.page.locator(".pagefind-ui__result").first(),
        ).toBeVisible({ timeout: 5000 });
    }
}
