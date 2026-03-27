import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteHeader } from "@/components/layout/SiteHeader";

describe("SiteHeader", () => {
    describe("given no props", () => {
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
    });
});
