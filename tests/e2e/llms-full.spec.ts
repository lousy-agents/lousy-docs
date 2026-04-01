import { expect, test } from "@playwright/test";

const SEPARATOR = "\n\n---\n\n";
const DOC_ORDER_COUNT = 6;

test.describe("/llms-full.txt endpoint", () => {
    test.describe("given a request for the full documentation file", () => {
        test("returns a 200 response with text/plain content type", async ({
            request,
        }) => {
            // Act
            const response = await request.get("/llms-full.txt");

            // Assert
            expect(response.status()).toBe(200);
            expect(response.headers()["content-type"]).toContain("text/plain");
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

        test("includes all curated docs as distinct sections", async ({
            request,
        }) => {
            // Arrange
            const expectedSectionCount = 1 + DOC_ORDER_COUNT; // header section + one per curated doc

            // Act
            const response = await request.get("/llms-full.txt");
            const body = await response.text();
            const sections = body.split(SEPARATOR);

            // Assert
            expect(sections.length).toBeGreaterThanOrEqual(
                expectedSectionCount,
            );
        });

        test("places the readme doc before the init doc", async ({
            request,
        }) => {
            // Act
            const response = await request.get("/llms-full.txt");
            const body = await response.text();

            // Assert — readme content precedes init content in the response
            const readmeIndex = body.indexOf("# Lousy Agents");
            const initIndex = body.indexOf("init Command");
            expect(readmeIndex).toBeGreaterThanOrEqual(0);
            expect(initIndex).toBeGreaterThan(readmeIndex);
        });
    });
});
