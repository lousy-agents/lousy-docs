import type { Page } from "@playwright/test";

export class HomePage {
    readonly page: Page;

    private static readonly HOME_PATH = "/";

    constructor(page: Page) {
        this.page = page;
    }

    async goto(): Promise<void> {
        await this.page.goto(HomePage.HOME_PATH);
    }

    async clickDocsLink(): Promise<void> {
        await this.page.getByRole("link", { name: "DOCS" }).click();
    }
}
