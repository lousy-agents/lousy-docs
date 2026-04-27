import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HomePage } from "@/components/home/HomePage";
import type { ResolvedHomepageFeature } from "@/use-cases/select-available-features";

const TEST_FEATURES: ResolvedHomepageFeature[] = [
    {
        id: "init",
        title: "init",
        summary: "Scaffold your workspace.",
        docsHref: "/docs/init",
    },
    {
        id: "lint",
        title: "lint",
        summary: "Validate agents in CI.",
        docsHref: "/docs/lint",
    },
];

function mockMatchMedia(matches: boolean) {
    const listeners: Array<(event: { matches: boolean }) => void> = [];
    const mql = {
        matches,
        media: "",
        addEventListener: vi.fn(
            (_event: string, cb: (event: { matches: boolean }) => void) => {
                listeners.push(cb);
            },
        ),
        removeEventListener: vi.fn(),
    };
    window.matchMedia = vi
        .fn()
        .mockReturnValue(mql) as unknown as typeof window.matchMedia;
    return { mql, listeners };
}

describe("HomePage", () => {
    let originalMatchMedia: typeof window.matchMedia;

    beforeEach(() => {
        originalMatchMedia = window.matchMedia;
    });

    afterEach(() => {
        window.matchMedia = originalMatchMedia;
        vi.restoreAllMocks();
    });

    describe("given a mobile viewport", () => {
        beforeEach(() => {
            mockMatchMedia(true);
        });

        it("should render a menu button in the header", () => {
            render(<HomePage resolvedFeatures={TEST_FEATURES} />);

            expect(
                screen.getByRole("button", { name: /toggle navigation/i }),
            ).toBeInTheDocument();
        });

        it("should open the navigation drawer when the menu button is clicked", async () => {
            const user = userEvent.setup();
            render(<HomePage resolvedFeatures={TEST_FEATURES} />);

            await user.click(
                screen.getByRole("button", { name: /toggle navigation/i }),
            );

            expect(
                screen.getByRole("dialog", { name: "Site navigation" }),
            ).toBeInTheDocument();
        });

        it("should render navigation links in the drawer when opened", async () => {
            const user = userEvent.setup();
            render(<HomePage resolvedFeatures={TEST_FEATURES} />);

            await user.click(
                screen.getByRole("button", { name: /toggle navigation/i }),
            );

            expect(
                screen.getByRole("link", { name: /docs/i }),
            ).toBeInTheDocument();
            expect(
                screen.getByRole("link", { name: /playground/i }),
            ).toBeInTheDocument();
        });
    });

    describe("given a desktop viewport", () => {
        beforeEach(() => {
            mockMatchMedia(false);
        });

        it("should not render a mobile menu button", () => {
            render(<HomePage resolvedFeatures={TEST_FEATURES} />);

            expect(
                screen.queryByRole("button", { name: /toggle navigation/i }),
            ).not.toBeInTheDocument();
        });

        it("does not render the removed Spec-Driven Development section", () => {
            render(<HomePage resolvedFeatures={TEST_FEATURES} />);

            expect(
                screen.queryByRole("heading", {
                    name: /spec-driven development/i,
                }),
            ).not.toBeInTheDocument();
        });

        it("does not render the removed Developer Patch section", () => {
            const { container } = render(
                <HomePage resolvedFeatures={TEST_FEATURES} />,
            );

            expect(container.textContent ?? "").not.toMatch(/developer patch/i);
            expect(container.textContent ?? "").not.toMatch(/--break-loop/);
            expect(container.textContent ?? "").not.toMatch(/'79 simulation/);
        });

        it("renders the Quickstart flow section", () => {
            render(<HomePage resolvedFeatures={TEST_FEATURES} />);

            expect(
                screen.getByRole("heading", {
                    name: /the documented quickstart/i,
                }),
            ).toBeInTheDocument();
        });
    });
});
