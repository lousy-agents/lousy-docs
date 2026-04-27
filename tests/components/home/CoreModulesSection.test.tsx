import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CoreModulesSection } from "@/components/home/CoreModulesSection";
import type { ResolvedHomepageFeature } from "@/use-cases/select-available-features";

const ALL_SIX: ResolvedHomepageFeature[] = [
    {
        id: "init",
        title: "init",
        summary: "Scaffold your workspace.",
        docsHref: "/docs/init",
    },
    {
        id: "new",
        title: "new",
        summary: "Generate skills and agents.",
        docsHref: "/docs/new",
    },
    {
        id: "lint",
        title: "lint",
        summary: "Validate agents in CI.",
        docsHref: "/docs/lint",
    },
    {
        id: "copilot-setup",
        title: "copilot-setup",
        summary: "Generate the Copilot setup workflow.",
        docsHref: "/docs/copilot-setup",
    },
    {
        id: "mcp-server",
        title: "MCP Server",
        summary:
            "Connect your editor through the Model Context Protocol server.",
        docsHref: "/docs/mcp-server",
    },
    {
        id: "agent-shell",
        title: "Agent Shell",
        summary:
            "An audit-trail wrapper around npm's script-shell for agent telemetry.",
        docsHref: "/docs/agent-shell",
    },
];

const BANNED_CARD_TITLES = ["CLI Engine", "Smart Linting", "Multi-Agent"];
const BANNED_DESCRIPTION_TERMS = [
    "cognitive workloads",
    "operational perimeter",
    "hallucination loops",
    "feedback loop",
    "logic feedback loop",
];

describe("CoreModulesSection", () => {
    describe("given the six documented features", () => {
        it("renders one card per resolved feature with its docs link", () => {
            render(<CoreModulesSection resolvedFeatures={ALL_SIX} />);

            for (const feature of ALL_SIX) {
                const link = screen.getByRole("link", {
                    name: new RegExp(`learn more about ${feature.title}`, "i"),
                });
                expect(link).toHaveAttribute("href", feature.docsHref);
            }
        });

        it("renders the MCP Server card with the Model Context Protocol expansion", () => {
            render(<CoreModulesSection resolvedFeatures={ALL_SIX} />);

            expect(
                screen.getByText(/model context protocol/i),
            ).toBeInTheDocument();
        });

        it("renders the Agent Shell card describing it as an audit-trail wrapper", () => {
            render(<CoreModulesSection resolvedFeatures={ALL_SIX} />);

            const text = document.body.textContent?.toLowerCase() ?? "";
            expect(text).toContain("audit-trail");
            expect(text).not.toContain("sandboxed runtime");
        });

        it("renders no banned card titles", () => {
            render(<CoreModulesSection resolvedFeatures={ALL_SIX} />);

            for (const banned of BANNED_CARD_TITLES) {
                expect(
                    screen.queryByRole("heading", {
                        name: new RegExp(banned, "i"),
                    }),
                ).not.toBeInTheDocument();
            }
        });

        it("renders no fabricated version-style strings in any card", () => {
            const { container } = render(
                <CoreModulesSection resolvedFeatures={ALL_SIX} />,
            );

            expect(container.textContent ?? "").not.toMatch(/v\d+\.\d+\.\d+/);
            expect(container.textContent ?? "").not.toMatch(
                /system\.bin|core\.lint|net\.mcp|os\.shell/,
            );
        });

        it("renders no banned coined terms in any card description", () => {
            const { container } = render(
                <CoreModulesSection resolvedFeatures={ALL_SIX} />,
            );

            const text = (container.textContent ?? "").toLowerCase();
            for (const banned of BANNED_DESCRIPTION_TERMS) {
                expect(text).not.toContain(banned.toLowerCase());
            }
        });

        it("assigns a non-empty, distinct accent color per feature id", () => {
            const { container } = render(
                <CoreModulesSection resolvedFeatures={ALL_SIX} />,
            );

            const cards =
                container.querySelectorAll<HTMLElement>("[data-feature-id]");
            expect(cards.length).toBe(ALL_SIX.length);

            const accents = new Set<string>();
            for (const card of cards) {
                const color = card.style.borderLeftColor;
                expect(color).not.toBe("");
                accents.add(color);
            }
            expect(accents.size).toBe(ALL_SIX.length);
        });
    });

    describe("given an empty resolvedFeatures array", () => {
        it("renders no feature cards", () => {
            const { container } = render(
                <CoreModulesSection resolvedFeatures={[]} />,
            );

            expect(container.querySelectorAll("[data-feature-id]").length).toBe(
                0,
            );
        });
    });
});
