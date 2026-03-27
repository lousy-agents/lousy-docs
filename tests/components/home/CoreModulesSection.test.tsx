import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CoreModulesSection } from "@/components/home/CoreModulesSection";

describe("CoreModulesSection", () => {
    describe("given no props", () => {
        it("should render the core modules heading", () => {
            render(<CoreModulesSection />);

            expect(
                screen.getByRole("heading", { name: /core modules/i }),
            ).toBeInTheDocument();
        });

        it("should render the cli engine feature card", () => {
            render(<CoreModulesSection />);

            expect(
                screen.getByRole("heading", { name: /cli engine/i }),
            ).toBeInTheDocument();
        });

        it("should render the smart linting feature card", () => {
            render(<CoreModulesSection />);

            expect(
                screen.getByRole("heading", { name: /smart linting/i }),
            ).toBeInTheDocument();
        });

        it("should render the mcp server feature card", () => {
            render(<CoreModulesSection />);

            expect(
                screen.getByRole("heading", { name: /mcp server/i }),
            ).toBeInTheDocument();
        });

        it("should render the agent shell feature card", () => {
            render(<CoreModulesSection />);

            expect(
                screen.getByRole("heading", { name: /agent shell/i }),
            ).toBeInTheDocument();
        });

        it("should render descriptions for each feature", () => {
            render(<CoreModulesSection />);

            expect(
                screen.getByText(/command interface optimized/i),
            ).toBeInTheDocument();
            expect(screen.getByText(/heuristic analysis/i)).toBeInTheDocument();
            expect(
                screen.getByText(/multi-agent control protocol/i),
            ).toBeInTheDocument();
            expect(
                screen.getByText(/sandboxed runtime environment/i),
            ).toBeInTheDocument();
        });
    });
});
