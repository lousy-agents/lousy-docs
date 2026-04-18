import { expect, type Locator, type Page } from "@playwright/test";

export class PlaygroundPage {
    readonly page: Page;
    readonly tablist: Locator;
    readonly tabpanel: Locator;
    readonly textarea: Locator;

    private static readonly PLAYGROUND_PATH = "/playground";

    constructor(page: Page) {
        this.page = page;
        this.tablist = page.getByRole("tablist", { name: "Lint target type" });
        this.tabpanel = page.getByRole("tabpanel");
        this.textarea = page.getByRole("textbox");
    }

    async goto(): Promise<void> {
        await this.page.goto(PlaygroundPage.PLAYGROUND_PATH);
    }

    tab(name: string): Locator {
        return this.page.getByRole("tab", { name });
    }

    async clickTab(name: string): Promise<void> {
        const t = this.tab(name);
        await t.click();
        await t.focus();
    }

    async expectTabToBeSelected(name: string): Promise<void> {
        await expect(this.tab(name)).toHaveAttribute("aria-selected", "true");
    }

    async expectTabNotToBeSelected(name: string): Promise<void> {
        await expect(this.tab(name)).toHaveAttribute("aria-selected", "false");
    }

    async expectTabToBeFocused(name: string): Promise<void> {
        await expect(this.tab(name)).toBeFocused();
    }

    async expectFileLabel(text: string | RegExp): Promise<void> {
        await expect(this.page.getByText(text, { exact: false })).toBeVisible();
    }

    async expectTextareaAriaLabel(label: string): Promise<void> {
        await expect(this.textarea).toHaveAttribute("aria-label", label);
    }

    async expectTabpanelLabelledBy(tabId: string): Promise<void> {
        await expect(this.tabpanel).toHaveAttribute("aria-labelledby", tabId);
    }
}
