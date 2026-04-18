import { test } from "@playwright/test";
import { PlaygroundPage } from "./pages";

test.describe("Playground target tabs", () => {
    test.describe("given the playground page is loaded", () => {
        test("displays SKILLS as the default active tab", async ({ page }) => {
            const playground = new PlaygroundPage(page);
            await playground.goto();

            await playground.expectTabToBeSelected("SKILLS");
            await playground.expectTabNotToBeSelected("AGENTS");
            await playground.expectTabNotToBeSelected("INSTRUCTIONS");
        });

        test("associates the tabpanel with the active tab via aria-labelledby", async ({
            page,
        }) => {
            const playground = new PlaygroundPage(page);
            await playground.goto();

            await playground.expectTabpanelLabelledBy("tab-skill");
        });
    });

    test.describe("given a user clicks a different tab", () => {
        test("switches the active tab to AGENTS when clicked", async ({
            page,
        }) => {
            const playground = new PlaygroundPage(page);
            await playground.goto();

            await playground.clickTab("AGENTS");

            await playground.expectTabToBeSelected("AGENTS");
            await playground.expectTabNotToBeSelected("SKILLS");
        });

        test("updates the file info label when switching to AGENTS", async ({
            page,
        }) => {
            const playground = new PlaygroundPage(page);
            await playground.goto();

            await playground.clickTab("AGENTS");

            await playground.expectFileLabel("agent.md");
        });

        test("updates the textarea aria-label when switching to AGENTS", async ({
            page,
        }) => {
            const playground = new PlaygroundPage(page);
            await playground.goto();

            await playground.clickTab("AGENTS");

            await playground.expectTextareaAriaLabel("Agent Markdown");
        });

        test("updates the tabpanel aria-labelledby when switching to INSTRUCTIONS", async ({
            page,
        }) => {
            const playground = new PlaygroundPage(page);
            await playground.goto();

            await playground.clickTab("INSTRUCTIONS");

            await playground.expectTabpanelLabelledBy("tab-instruction");
        });
    });

    test.describe("given keyboard navigation within the tablist", () => {
        test("moves focus to AGENTS when ArrowRight is pressed on SKILLS", async ({
            page,
        }) => {
            const playground = new PlaygroundPage(page);
            await playground.goto();

            await playground.tab("SKILLS").focus();
            await page.keyboard.press("ArrowRight");

            await playground.expectTabToBeFocused("AGENTS");
            await playground.expectTabToBeSelected("AGENTS");
        });

        test("moves focus to SKILLS when ArrowLeft is pressed on AGENTS", async ({
            page,
        }) => {
            const playground = new PlaygroundPage(page);
            await playground.goto();

            await playground.clickTab("AGENTS");
            await page.keyboard.press("ArrowLeft");

            await playground.expectTabToBeFocused("SKILLS");
            await playground.expectTabToBeSelected("SKILLS");
        });

        test("wraps from INSTRUCTIONS to SKILLS when ArrowRight is pressed", async ({
            page,
        }) => {
            const playground = new PlaygroundPage(page);
            await playground.goto();

            await playground.clickTab("INSTRUCTIONS");
            await page.keyboard.press("ArrowRight");

            await playground.expectTabToBeFocused("SKILLS");
            await playground.expectTabToBeSelected("SKILLS");
        });

        test("wraps from SKILLS to INSTRUCTIONS when ArrowLeft is pressed", async ({
            page,
        }) => {
            const playground = new PlaygroundPage(page);
            await playground.goto();

            await playground.tab("SKILLS").focus();
            await page.keyboard.press("ArrowLeft");

            await playground.expectTabToBeFocused("INSTRUCTIONS");
            await playground.expectTabToBeSelected("INSTRUCTIONS");
        });

        test("moves focus to the first tab when Home is pressed", async ({
            page,
        }) => {
            const playground = new PlaygroundPage(page);
            await playground.goto();

            await playground.clickTab("INSTRUCTIONS");
            await page.keyboard.press("Home");

            await playground.expectTabToBeFocused("SKILLS");
            await playground.expectTabToBeSelected("SKILLS");
        });

        test("moves focus to the last tab when End is pressed", async ({
            page,
        }) => {
            const playground = new PlaygroundPage(page);
            await playground.goto();

            await playground.tab("SKILLS").focus();
            await page.keyboard.press("End");

            await playground.expectTabToBeFocused("INSTRUCTIONS");
            await playground.expectTabToBeSelected("INSTRUCTIONS");
        });
    });
});
