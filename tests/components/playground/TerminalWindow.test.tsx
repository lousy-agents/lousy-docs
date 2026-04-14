import { render, screen } from "@testing-library/react";
import Chance from "chance";
import { describe, expect, it } from "vitest";
import { TerminalWindow } from "@/components/playground/TerminalWindow";

const chance = new Chance(42);

describe("TerminalWindow", () => {
    describe("given a title and children", () => {
        it("should display the title in the header", () => {
            const title = chance.word();

            render(
                <TerminalWindow title={title}>
                    <div>content</div>
                </TerminalWindow>,
            );

            expect(screen.getByText(title)).toBeInTheDocument();
        });

        it("should render children in the body", () => {
            const childText = chance.sentence();

            render(
                <TerminalWindow title="test">
                    <div>{childText}</div>
                </TerminalWindow>,
            );

            expect(screen.getByText(childText)).toBeInTheDocument();
        });
    });

    describe("given a rightAction prop", () => {
        it("should render the action in the header", () => {
            render(
                <TerminalWindow
                    title="test"
                    rightAction={<button type="button">Action</button>}
                >
                    <div>content</div>
                </TerminalWindow>,
            );

            expect(
                screen.getByRole("button", { name: /action/i }),
            ).toBeInTheDocument();
        });
    });
});
