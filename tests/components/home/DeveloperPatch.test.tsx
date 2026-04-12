import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DeveloperPatch } from "@/components/home/DeveloperPatch";

describe("DeveloperPatch", () => {
    describe("given no props", () => {
        it("should render the developer patch heading", () => {
            render(<DeveloperPatch />);

            expect(screen.getByText(/developer patch/i)).toBeInTheDocument();
        });

        it("should render the tip content about feedback loops", () => {
            render(<DeveloperPatch />);

            expect(
                screen.getByText(/agent starts repeating itself/i),
            ).toBeInTheDocument();
        });

        it("should render the break-loop flag reference", () => {
            render(<DeveloperPatch />);

            expect(screen.getByText(/--break-loop/i)).toBeInTheDocument();
        });

        it("should render the mascot image with the optimized source", () => {
            render(<DeveloperPatch />);

            expect(
                screen.getByRole("img", { name: /lousy agent/i }),
            ).toHaveAttribute("src", "/mascot-48w.jpg");
        });
    });
});
