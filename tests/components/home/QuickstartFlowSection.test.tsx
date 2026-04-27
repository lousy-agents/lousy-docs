import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QuickstartFlowSection } from "@/components/home/QuickstartFlowSection";

const STEP_LABELS = ["init", "lint (in CI)", "MCP Server"] as const;
const FORBIDDEN_PHRASES = [
    "Define the Spec",
    "Mock the World",
    "Atomic Deploy",
    "mocking engine",
    "atomic deploy",
];

describe("QuickstartFlowSection", () => {
    describe("given no props", () => {
        it("renders exactly three step links pointing to /docs/quickstart", () => {
            render(<QuickstartFlowSection />);

            const stepLinks = screen
                .getAllByRole("link")
                .filter(
                    (link) =>
                        link.getAttribute("href") === "/docs/quickstart" &&
                        link.getAttribute("aria-label") !== null,
                );

            expect(stepLinks).toHaveLength(3);
        });

        it("gives each step a unique aria-label that includes its full label", () => {
            render(<QuickstartFlowSection />);

            const stepLinks = screen
                .getAllByRole("link")
                .filter(
                    (link) =>
                        link.getAttribute("href") === "/docs/quickstart" &&
                        link.getAttribute("aria-label") !== null,
                );

            const labels = stepLinks.map((link) =>
                link.getAttribute("aria-label"),
            );
            expect(new Set(labels).size).toBe(3);

            for (const expected of STEP_LABELS) {
                const match = labels.find(
                    (label) => label === `Learn about ${expected}`,
                );
                expect(match).toBeDefined();
            }
        });

        it("renders a primary CTA linking to /docs/quickstart", () => {
            render(<QuickstartFlowSection />);

            const cta = screen.getByRole("link", {
                name: /open the quickstart/i,
            });
            expect(cta).toHaveAttribute("href", "/docs/quickstart");
        });

        it("does not render any of the fabricated spec-driven phrases", () => {
            const { container } = render(<QuickstartFlowSection />);

            const text = container.textContent ?? "";
            for (const phrase of FORBIDDEN_PHRASES) {
                expect(text).not.toContain(phrase);
            }
        });

        it("does not reference Protocol compliance enforcement", () => {
            const { container } = render(<QuickstartFlowSection />);

            const text = container.textContent ?? "";
            expect(text).not.toMatch(/Protocol\s+compliance/i);
            expect(text).not.toMatch(/Protocol[^.]*compliance/i);
        });
    });
});
