import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MobileNavDrawer } from "@/components/layout/MobileNavDrawer";

describe("MobileNavDrawer", () => {
    let originalMatchMedia: typeof window.matchMedia;

    beforeEach(() => {
        originalMatchMedia = window.matchMedia;
    });

    afterEach(() => {
        window.matchMedia = originalMatchMedia;
        vi.restoreAllMocks();
    });

    describe("given the drawer is closed", () => {
        it("should not render navigation links", () => {
            render(<MobileNavDrawer open={false} onClose={vi.fn()} />);

            expect(
                screen.queryByRole("navigation", { name: "Site navigation" }),
            ).not.toBeInTheDocument();
        });
    });

    describe("given the drawer is open", () => {
        it("should have an accessible label on the drawer", () => {
            render(<MobileNavDrawer open={true} onClose={vi.fn()} />);

            expect(
                screen.getByRole("dialog", { name: "Site navigation" }),
            ).toBeInTheDocument();
        });

        it("should render a navigation region", () => {
            render(<MobileNavDrawer open={true} onClose={vi.fn()} />);

            expect(
                screen.getByRole("navigation", { name: "Site navigation" }),
            ).toBeInTheDocument();
        });

        it("should render the Protocol link", () => {
            render(<MobileNavDrawer open={true} onClose={vi.fn()} />);

            const link = screen.getByRole("link", { name: /protocol/i });
            expect(link).toHaveAttribute("href", "/protocol");
        });

        it("should render the Terminal link", () => {
            render(<MobileNavDrawer open={true} onClose={vi.fn()} />);

            const link = screen.getByRole("link", { name: /terminal/i });
            expect(link).toHaveAttribute("href", "/terminal");
        });

        it("should render the Patches link", () => {
            render(<MobileNavDrawer open={true} onClose={vi.fn()} />);

            const link = screen.getByRole("link", { name: /patches/i });
            expect(link).toHaveAttribute("href", "/patches");
        });

        it("should render the Docs link", () => {
            render(<MobileNavDrawer open={true} onClose={vi.fn()} />);

            const link = screen.getByRole("link", { name: /docs/i });
            expect(link).toHaveAttribute("href", "/docs/quickstart");
        });

        it("should render the Playground link", () => {
            render(<MobileNavDrawer open={true} onClose={vi.fn()} />);

            const link = screen.getByRole("link", { name: /playground/i });
            expect(link).toHaveAttribute("href", "/playground");
        });
    });
});
