import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SiteFooter } from "@/components/layout/SiteFooter";

describe("SiteFooter", () => {
    describe("given no props", () => {
        it("should render the lousy agents branding", () => {
            render(<SiteFooter />);

            expect(screen.getByText("LOUSY_AGENTS")).toBeInTheDocument();
        });

        it("should render the lousy agents copyright", () => {
            render(<SiteFooter />);

            expect(screen.getByText(/lousy agents/i)).toBeInTheDocument();
        });

        it("should render the current year in the copyright", () => {
            vi.useFakeTimers();
            vi.setSystemTime(new Date("2026-01-15"));

            try {
                render(<SiteFooter />);

                expect(screen.getByText(/2026/)).toBeInTheDocument();
            } finally {
                vi.useRealTimers();
            }
        });

        it("should render footer navigation links", () => {
            render(<SiteFooter />);

            expect(
                screen.getByRole("link", { name: /manual/i }),
            ).toBeInTheDocument();
        });
    });
});
