import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SiteHeader } from "@/components/layout/SiteHeader";

describe("SiteHeader", () => {
    describe("given a desktop viewport", () => {
        it("should render a nav element for navigation links", () => {
            render(<SiteHeader isMobile={false} />);

            expect(screen.getByRole("navigation")).toBeInTheDocument();
        });

        it("should render the site branding as a link to the homepage", () => {
            render(<SiteHeader isMobile={false} />);

            const logo = screen.getByRole("link", { name: "LOUSY_AGENTS" });
            expect(logo).toBeInTheDocument();
            expect(logo).toHaveAttribute("href", "/");
        });

        it("should render the Protocol navigation link", () => {
            render(<SiteHeader isMobile={false} />);

            expect(
                screen.getByRole("link", { name: /protocol/i }),
            ).toBeInTheDocument();
        });

        it("should render the Terminal navigation link", () => {
            render(<SiteHeader isMobile={false} />);

            expect(
                screen.getByRole("link", { name: /terminal/i }),
            ).toBeInTheDocument();
        });

        it("should render the Patches navigation link", () => {
            render(<SiteHeader isMobile={false} />);

            expect(
                screen.getByRole("link", { name: /patches/i }),
            ).toBeInTheDocument();
        });

        it("should render the Docs navigation link", () => {
            render(<SiteHeader isMobile={false} />);

            expect(
                screen.getByRole("link", { name: /docs/i }),
            ).toBeInTheDocument();
        });

        it("should mark no nav link as active when on the homepage", () => {
            render(<SiteHeader isMobile={false} currentPathname="/" />);

            expect(
                screen.queryByRole("link", { current: "page" }),
            ).not.toBeInTheDocument();
        });

        it("should mark the Docs link as active when on the docs index page", () => {
            render(<SiteHeader isMobile={false} currentPathname="/docs" />);

            expect(screen.getByRole("link", { name: /docs/i })).toHaveAttribute(
                "aria-current",
                "page",
            );
        });

        it("should mark the Docs link as active when on a docs sub-page", () => {
            render(
                <SiteHeader isMobile={false} currentPathname="/docs/readme" />,
            );

            expect(screen.getByRole("link", { name: /docs/i })).toHaveAttribute(
                "aria-current",
                "page",
            );
        });

        it("should mark the Protocol link as active when on the protocol page", () => {
            render(<SiteHeader isMobile={false} currentPathname="/protocol" />);

            expect(
                screen.getByRole("link", { name: /protocol/i }),
            ).toHaveAttribute("aria-current", "page");
        });

        it("should not render a mobile menu button", () => {
            render(<SiteHeader isMobile={false} />);

            expect(
                screen.queryByRole("button", { name: /toggle navigation/i }),
            ).not.toBeInTheDocument();
        });
    });

    describe("given a mobile viewport", () => {
        it("should render the site branding as a link to the homepage", () => {
            render(<SiteHeader isMobile={true} />);

            const logo = screen.getByRole("link", { name: "LOUSY_AGENTS" });
            expect(logo).toBeInTheDocument();
            expect(logo).toHaveAttribute("href", "/");
        });

        it("should not render the desktop navigation links", () => {
            render(<SiteHeader isMobile={true} />);

            expect(
                screen.queryByRole("link", { name: /protocol/i }),
            ).not.toBeInTheDocument();
            expect(
                screen.queryByRole("link", { name: /terminal/i }),
            ).not.toBeInTheDocument();
        });

        it("should not render a mobile menu button when no toggle handler is provided", () => {
            render(<SiteHeader isMobile={true} />);

            expect(
                screen.queryByRole("button", { name: /toggle navigation/i }),
            ).not.toBeInTheDocument();
        });

        it("should render a mobile menu button when a toggle handler is provided", () => {
            const handleToggle = vi.fn();
            render(
                <SiteHeader
                    isMobile={true}
                    onMobileMenuToggle={handleToggle}
                />,
            );

            expect(
                screen.getByRole("button", { name: /toggle navigation/i }),
            ).toBeInTheDocument();
        });

        it("should set aria-expanded to false when the menu is closed", () => {
            const handleToggle = vi.fn();
            render(
                <SiteHeader
                    isMobile={true}
                    onMobileMenuToggle={handleToggle}
                    isMobileMenuOpen={false}
                />,
            );

            expect(
                screen.getByRole("button", { name: /toggle navigation/i }),
            ).toHaveAttribute("aria-expanded", "false");
        });

        it("should set aria-expanded to true when the menu is open", () => {
            const handleToggle = vi.fn();
            render(
                <SiteHeader
                    isMobile={true}
                    onMobileMenuToggle={handleToggle}
                    isMobileMenuOpen={true}
                />,
            );

            expect(
                screen.getByRole("button", { name: /toggle navigation/i }),
            ).toHaveAttribute("aria-expanded", "true");
        });
    });
});
