import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QuickstartCallout } from "@/components/docs/QuickstartCallout";

describe("QuickstartCallout", () => {
    describe("given the callout is rendered", () => {
        it("should render a link to the quickstart page", () => {
            render(<QuickstartCallout />);

            const link = screen.getByRole("link", {
                name: /get up and running/i,
            });
            expect(link).toHaveAttribute("href", "/docs/quickstart");
        });

        it("should render a brief description of the quickstart guide", () => {
            render(<QuickstartCallout />);

            expect(
                screen.getByText(/new to lousy agents/i),
            ).toBeInTheDocument();
        });
    });
});
