import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroSection } from "@/components/home/HeroSection";

describe("HeroSection", () => {
    describe("given no props", () => {
        it("should render the main headline with stop guessing", () => {
            render(<HeroSection />);

            expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
                /stop guessing/i,
            );
        });

        it("should render the highlighted text start guiding", () => {
            render(<HeroSection />);

            expect(screen.getByText(/start guiding/i)).toBeInTheDocument();
        });

        it("should render the system status badge", () => {
            render(<HeroSection />);

            expect(
                screen.getByText(/system_status: operational/i),
            ).toBeInTheDocument();
        });

        it("should render the initialize cli call-to-action", () => {
            render(<HeroSection />);

            expect(
                screen.getByRole("link", { name: /initialize_cli/i }),
            ).toBeInTheDocument();
        });

        it("should render the read manifesto call-to-action", () => {
            render(<HeroSection />);

            expect(
                screen.getByRole("link", { name: /read_manifesto/i }),
            ).toBeInTheDocument();
        });

        it("should render a terminal mockup with a shell prompt", () => {
            render(<HeroSection />);

            expect(
                screen.getByText(/lousy deploy --target production/i),
            ).toBeInTheDocument();
        });

        it("should render the mascot image with descriptive alt text", () => {
            render(<HeroSection />);

            expect(
                screen.getByRole("img", { name: /mascot/i }),
            ).toBeInTheDocument();
        });
    });
});
