import { render, screen } from "@testing-library/react";
import { describe, expect, it, type MockInstance, vi } from "vitest";
import { SiteHeader } from "@/components/layout/SiteHeader";

describe("SiteHeader", () => {
    describe("given a desktop viewport", () => {
        it("should render a search button", () => {
            render(<SiteHeader isMobile={false} />);

            expect(
                screen.getByRole("button", { name: /search/i }),
            ).toBeInTheDocument();
        });

        it("should dispatch open-search event when search button is clicked", () => {
            render(<SiteHeader isMobile={false} />);
            const handler = vi.fn();
            window.addEventListener("open-search", handler);

            try {
                screen.getByRole("button", { name: /search/i }).click();

                expect(handler).toHaveBeenCalledTimes(1);
            } finally {
                window.removeEventListener("open-search", handler);
            }
        });

        it("should render a nav element for navigation links", () => {
            render(<SiteHeader isMobile={false} />);

            expect(
                screen.getByRole("navigation", { name: "Site navigation" }),
            ).toBeInTheDocument();
        });

        it("should render the site branding as a link to the homepage", () => {
            render(<SiteHeader isMobile={false} />);

            const logo = screen.getByRole("link", { name: "LOUSY_AGENTS" });
            expect(logo).toBeInTheDocument();
            expect(logo).toHaveAttribute("href", "/");
        });

        it("should render the Docs navigation link", () => {
            render(<SiteHeader isMobile={false} />);

            expect(
                screen.getByRole("link", { name: /docs/i }),
            ).toBeInTheDocument();
        });

        it("should render the Playground navigation link", () => {
            render(<SiteHeader isMobile={false} />);

            expect(
                screen.getByRole("link", { name: /playground/i }),
            ).toBeInTheDocument();
        });

        it("should mark the Playground link as active when on the playground page", () => {
            render(
                <SiteHeader isMobile={false} currentPathname="/playground" />,
            );

            expect(
                screen.getByRole("link", { name: /playground/i }),
            ).toHaveAttribute("aria-current", "page");
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

        it("should not render a mobile menu button", () => {
            render(<SiteHeader isMobile={false} />);

            expect(
                screen.queryByRole("button", { name: /toggle navigation/i }),
            ).not.toBeInTheDocument();
        });

        describe("keyboard shortcut hint", () => {
            let userAgentSpy: MockInstance;

            it("should display ⌘K hint on Mac platforms", () => {
                userAgentSpy = vi
                    .spyOn(navigator, "userAgent", "get")
                    .mockReturnValue(
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
                    );

                try {
                    render(<SiteHeader isMobile={false} />);

                    expect(screen.getByText("⌘K")).toBeInTheDocument();
                } finally {
                    userAgentSpy.mockRestore();
                }
            });

            it("should display Ctrl+K hint on non-Mac platforms", () => {
                userAgentSpy = vi
                    .spyOn(navigator, "userAgent", "get")
                    .mockReturnValue(
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                    );

                try {
                    render(<SiteHeader isMobile={false} />);

                    expect(screen.getByText("Ctrl+K")).toBeInTheDocument();
                } finally {
                    userAgentSpy.mockRestore();
                }
            });

            it("should display Ctrl+K hint when navigator is not available (SSR/non-browser)", () => {
                const savedNavigator = globalThis.navigator;
                delete (globalThis as unknown as Record<string, unknown>)
                    .navigator;

                try {
                    render(<SiteHeader isMobile={false} />);

                    expect(screen.getByText("Ctrl+K")).toBeInTheDocument();
                } finally {
                    globalThis.navigator = savedNavigator;
                }
            });

            it("should use a larger font size for the ⌘K badge on Mac/iPadOS platforms", () => {
                userAgentSpy = vi
                    .spyOn(navigator, "userAgent", "get")
                    .mockReturnValue(
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
                    );

                try {
                    render(<SiteHeader isMobile={false} />);

                    expect(screen.getByText("⌘K").style.fontSize).toBe(
                        "0.75rem",
                    );
                } finally {
                    userAgentSpy.mockRestore();
                }
            });

            it("should use a larger font size for the ⌘K badge on iPadOS platforms", () => {
                userAgentSpy = vi
                    .spyOn(navigator, "userAgent", "get")
                    .mockReturnValue(
                        "Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15",
                    );

                try {
                    render(<SiteHeader isMobile={false} />);

                    expect(screen.getByText("⌘K").style.fontSize).toBe(
                        "0.75rem",
                    );
                } finally {
                    userAgentSpy.mockRestore();
                }
            });

            it("should use a smaller font size for the Ctrl+K badge on non-Mac platforms", () => {
                userAgentSpy = vi
                    .spyOn(navigator, "userAgent", "get")
                    .mockReturnValue(
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                    );

                try {
                    render(<SiteHeader isMobile={false} />);

                    expect(screen.getByText("Ctrl+K").style.fontSize).toBe(
                        "0.625rem",
                    );
                } finally {
                    userAgentSpy.mockRestore();
                }
            });

            it("should use the non-Mac font size for the Ctrl+K badge when navigator is unavailable", () => {
                const savedNavigator = globalThis.navigator;
                delete (globalThis as unknown as Record<string, unknown>)
                    .navigator;

                try {
                    render(<SiteHeader isMobile={false} />);

                    expect(screen.getByText("Ctrl+K").style.fontSize).toBe(
                        "0.625rem",
                    );
                } finally {
                    globalThis.navigator = savedNavigator;
                }
            });
        });
    });

    describe("given a mobile viewport", () => {
        it("should render a search button", () => {
            render(<SiteHeader isMobile={true} />);

            expect(
                screen.getByRole("button", { name: /search/i }),
            ).toBeInTheDocument();
        });

        it("should dispatch open-search event when search button is clicked", () => {
            render(<SiteHeader isMobile={true} />);
            const handler = vi.fn();
            window.addEventListener("open-search", handler);

            try {
                screen.getByRole("button", { name: /search/i }).click();

                expect(handler).toHaveBeenCalledTimes(1);
            } finally {
                window.removeEventListener("open-search", handler);
            }
        });

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

        it("should not display a keyboard shortcut hint", () => {
            render(<SiteHeader isMobile={true} />);

            expect(screen.queryByText("⌘K")).not.toBeInTheDocument();
            expect(screen.queryByText("Ctrl+K")).not.toBeInTheDocument();
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
