import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SpecDrivenSection } from "@/components/home/SpecDrivenSection";

describe("SpecDrivenSection", () => {
    describe("given no props", () => {
        it("should render the spec-driven development heading", () => {
            render(<SpecDrivenSection />);

            expect(
                screen.getByRole("heading", {
                    name: /spec-driven development/i,
                }),
            ).toBeInTheDocument();
        });

        it("should render the define the spec step", () => {
            render(<SpecDrivenSection />);

            expect(
                screen.getByRole("heading", { name: /define the spec/i }),
            ).toBeInTheDocument();
        });

        it("should render the mock the world step", () => {
            render(<SpecDrivenSection />);

            expect(
                screen.getByRole("heading", { name: /mock the world/i }),
            ).toBeInTheDocument();
        });

        it("should render the atomic deploy step", () => {
            render(<SpecDrivenSection />);

            expect(
                screen.getByRole("heading", { name: /atomic deploy/i }),
            ).toBeInTheDocument();
        });

        it("should render the section description", () => {
            render(<SpecDrivenSection />);

            expect(
                screen.getByText(
                    /the three pillars of the patchwork protocol/i,
                ),
            ).toBeInTheDocument();
        });
    });
});
