import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroSection } from "@/components/home/HeroSection";

const BANNED_TERMS = [
    "Multi-Agent",
    "cognitive workloads",
    "operational perimeter",
    "hallucination loops",
    "feedback loop",
    "logic feedback loop",
];

describe("HeroSection", () => {
    describe("given no props", () => {
        it("renders the headline", () => {
            render(<HeroSection />);

            expect(
                screen.getByRole("heading", { level: 1 }),
            ).toBeInTheDocument();
        });

        it("renders a subhead that mentions init, lint, and MCP", () => {
            render(<HeroSection />);

            const main = screen.getByRole("heading", { level: 1 }).parentElement
                ?.parentElement;
            const sectionText = main?.textContent ?? "";
            expect(sectionText).toMatch(/\binit\b/);
            expect(sectionText).toMatch(/\blint\b/);
            expect(sectionText).toMatch(/\bMCP\b/);
        });

        it("renders no banned coined terms in the hero copy", () => {
            const { container } = render(<HeroSection />);

            const text = container.textContent ?? "";
            for (const term of BANNED_TERMS) {
                expect(text).not.toContain(term);
            }
        });

        it("renders the primary CTA pointing to /docs/quickstart", () => {
            render(<HeroSection />);

            const links = screen.getAllByRole("link");
            const quickstart = links.find(
                (link) => link.getAttribute("href") === "/docs/quickstart",
            );
            expect(quickstart).toBeDefined();
        });

        it("renders the secondary CTA pointing to the lousy-agents GitHub repo", () => {
            render(<HeroSection />);

            const links = screen.getAllByRole("link");
            const gh = links.find(
                (link) =>
                    link.getAttribute("href") ===
                    "https://github.com/zpratt/lousy-agents",
            );
            expect(gh).toBeDefined();
        });

        it("renders no anchor with an /about href", () => {
            render(<HeroSection />);

            const links = screen.getAllByRole("link");
            const about = links.find(
                (link) => link.getAttribute("href") === "/about",
            );
            expect(about).toBeUndefined();
        });

        it("renders the documented init terminal command", () => {
            render(<HeroSection />);

            expect(
                screen.getByText(/npx @lousy-agents\/cli@latest init/i),
            ).toBeInTheDocument();
        });

        it("does not render a hardcoded version string like vN.N.N", () => {
            const { container } = render(<HeroSection />);

            expect(container.textContent ?? "").not.toMatch(/v\d+\.\d+\.\d+/);
        });

        it("does not render the agent_v window title", () => {
            const { container } = render(<HeroSection />);

            expect(container.textContent ?? "").not.toContain("agent_v");
        });
    });
});
