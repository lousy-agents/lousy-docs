import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ComingSoonPage } from "@/components/ComingSoonPage";

describe("ComingSoonPage", () => {
    describe("given a page name", () => {
        it("should render the page name in the description", () => {
            render(<ComingSoonPage pageName="Protocol" />);

            // The page name appears in the description paragraph as a <strong> element
            expect(
                screen.getByRole("region", {
                    name: /Protocol — Coming Soon/i,
                }),
            ).toBeInTheDocument();
        });

        it("should render a heading indicating the page is coming soon", () => {
            render(<ComingSoonPage pageName="Terminal" />);

            expect(
                screen.getByRole("heading", { level: 1 }),
            ).toBeInTheDocument();
        });

        it("should render a link to the docs", () => {
            render(<ComingSoonPage pageName="Patches" />);

            const docsLink = screen.getByRole("link", { name: /view_docs/i });
            expect(docsLink).toBeInTheDocument();
            expect(docsLink).toHaveAttribute("href", "/docs/quickstart");
        });

        it("should render a link to return home", () => {
            render(<ComingSoonPage pageName="Protocol" />);

            const homeLink = screen.getByRole("link", {
                name: /return_home/i,
            });
            expect(homeLink).toBeInTheDocument();
            expect(homeLink).toHaveAttribute("href", "/");
        });

        it("should render the status badge", () => {
            render(<ComingSoonPage pageName="Terminal" />);

            expect(screen.getByText(/status: scheduled/i)).toBeInTheDocument();
        });

        it("should render the page name in the status code text", () => {
            render(<ComingSoonPage pageName="Protocol" />);

            expect(screen.getByText(/MODULE_PROTOCOL/i)).toBeInTheDocument();
        });
    });

    describe("given no statusCode prop", () => {
        it("should use 503 as the default status code", () => {
            render(<ComingSoonPage pageName="Patches" />);

            expect(screen.getByText(/503/)).toBeInTheDocument();
        });
    });

    describe("given a custom statusCode prop", () => {
        it("should render the provided status code", () => {
            render(<ComingSoonPage pageName="Protocol" statusCode="404" />);

            expect(
                screen.getByText(/MODULE_PROTOCOL.*404/),
            ).toBeInTheDocument();
        });
    });
});
