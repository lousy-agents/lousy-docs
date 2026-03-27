import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "@/components/layout/SiteFooter";

describe("SiteFooter", () => {
    describe("given no props", () => {
        it("should render the lousy agents branding", () => {
            render(<SiteFooter />);

            expect(screen.getByText("LOUSY_AGENTS")).toBeInTheDocument();
        });

        it("should render the patchwork protocol copyright", () => {
            render(<SiteFooter />);

            expect(screen.getByText(/patchwork protocol/i)).toBeInTheDocument();
        });

        it("should render footer navigation links", () => {
            render(<SiteFooter />);

            expect(
                screen.getByRole("link", { name: /manual/i }),
            ).toBeInTheDocument();
        });
    });
});
