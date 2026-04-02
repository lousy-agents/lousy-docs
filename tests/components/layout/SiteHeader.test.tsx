import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SiteHeader } from "@/components/layout/SiteHeader";

function mockMatchMedia(matches: boolean) {
    const mql = {
        matches,
        media: "",
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
    };
    window.matchMedia = vi
        .fn()
        .mockReturnValue(mql) as unknown as typeof window.matchMedia;
    return mql;
}

describe("SiteHeader", () => {
    let originalMatchMedia: typeof window.matchMedia;

    beforeEach(() => {
        originalMatchMedia = window.matchMedia;
    });

    afterEach(() => {
        window.matchMedia = originalMatchMedia;
        vi.restoreAllMocks();
    });

    describe("given a desktop viewport", () => {
        beforeEach(() => {
            mockMatchMedia(false);
        });

        it("should render a nav element for navigation links", () => {
            render(<SiteHeader />);

            expect(screen.getByRole("navigation")).toBeInTheDocument();
        });

        it("should render the site branding", () => {
            render(<SiteHeader />);

            expect(screen.getByText("LOUSY_AGENTS")).toBeInTheDocument();
        });

        it("should render the Protocol navigation link", () => {
            render(<SiteHeader />);

            expect(
                screen.getByRole("link", { name: /protocol/i }),
            ).toBeInTheDocument();
        });

        it("should render the Terminal navigation link", () => {
            render(<SiteHeader />);

            expect(
                screen.getByRole("link", { name: /terminal/i }),
            ).toBeInTheDocument();
        });

        it("should render the Patches navigation link", () => {
            render(<SiteHeader />);

            expect(
                screen.getByRole("link", { name: /patches/i }),
            ).toBeInTheDocument();
        });

        it("should render the Docs navigation link", () => {
            render(<SiteHeader />);

            expect(
                screen.getByRole("link", { name: /docs/i }),
            ).toBeInTheDocument();
        });

        it("should not render a mobile menu button", () => {
            render(<SiteHeader />);

            expect(
                screen.queryByRole("button", { name: /open menu/i }),
            ).not.toBeInTheDocument();
        });
    });

    describe("given a mobile viewport", () => {
        beforeEach(() => {
            mockMatchMedia(true);
        });

        it("should render the site branding", () => {
            render(<SiteHeader />);

            expect(screen.getByText("LOUSY_AGENTS")).toBeInTheDocument();
        });

        it("should not render the desktop navigation links", () => {
            render(<SiteHeader />);

            expect(
                screen.queryByRole("link", { name: /protocol/i }),
            ).not.toBeInTheDocument();
            expect(
                screen.queryByRole("link", { name: /terminal/i }),
            ).not.toBeInTheDocument();
        });

        it("should render a mobile menu button", () => {
            render(<SiteHeader />);

            expect(
                screen.getByRole("button", { name: /open menu/i }),
            ).toBeInTheDocument();
        });
    });
});
