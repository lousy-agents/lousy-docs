import { expect, test } from "@playwright/test";

const SEPARATOR = "\n\n---\n\n";

test.describe("/llms-full.txt endpoint", () => {
    test.describe("given a request for the full documentation file", () => {
        test("returns a 200 response with text/plain content type", async ({
            request,
        }) => {
            // Act
            const response = await request.get("/llms-full.txt");

            // Assert
            expect(response.status()).toBe(200);
            expect(response.headers()["content-type"]).toBe(
                "text/plain; charset=utf-8",
            );
        });

        test("returns a response body starting with the site header", async ({
            request,
        }) => {
            // Act
            const response = await request.get("/llms-full.txt");
            const body = await response.text();

            // Assert
            expect(body).toMatch(/^# Lousy Agents/);
            expect(body).toContain(
                "> Developer tooling for coding agent governance, observability, and least-privilege infrastructure.",
            );
        });

        test("concatenates docs using the expected separator", async ({
            request,
        }) => {
            // Act
            const response = await request.get("/llms-full.txt");
            const body = await response.text();

            // Assert
            expect(body).toContain(SEPARATOR);
        });

        test("includes sections for each curated doc", async ({ request }) => {
            // Arrange — markers that uniquely identify each curated doc's body
            const curatedMarkers = [
                "Lousy Agents Documentation",
                "`init` Command",
                "`new` Command",
                "`lint` Command",
                "copilot-setup",
                "MCP Server",
            ];

            // Act
            const response = await request.get("/llms-full.txt");
            const body = await response.text();
            const sections = body.split(SEPARATOR);

            // Assert — header section + at least one section per curated doc
            expect(sections.length).toBeGreaterThanOrEqual(
                1 + curatedMarkers.length,
            );

            for (const marker of curatedMarkers) {
                expect(body).toContain(marker);
            }
        });

        test("places the readme doc before the init doc", async ({
            request,
        }) => {
            // Act
            const response = await request.get("/llms-full.txt");
            const body = await response.text();
            const sections = body.split(SEPARATOR);

            // Assert — find sections containing readme and init markers
            const readmeSectionIndex = sections.findIndex((section) =>
                section.includes("Lousy Agents Documentation"),
            );
            const initSectionIndex = sections.findIndex((section) =>
                section.includes(
                    "Scaffolds new projects with everything needed",
                ),
            );
            expect(readmeSectionIndex).toBeGreaterThanOrEqual(0);
            expect(initSectionIndex).toBeGreaterThan(readmeSectionIndex);
        });
    });
});
