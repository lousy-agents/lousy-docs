import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SkillEditor } from "@/components/playground/SkillEditor";

const MULTI_LINE_CONTENT = Array.from(
    { length: 50 },
    (_, i) => `Line ${i + 1}: content`,
).join("\n");

describe("SkillEditor", () => {
    describe("given the editor is rendered", () => {
        it("should display a labeled text area", () => {
            render(<SkillEditor value="" onChange={vi.fn()} onRun={vi.fn()} />);

            expect(
                screen.getByRole("textbox", { name: /skill markdown/i }),
            ).toBeInTheDocument();
        });

        it("should display placeholder text explaining expected input", () => {
            render(<SkillEditor value="" onChange={vi.fn()} onRun={vi.fn()} />);

            const textarea = screen.getByRole("textbox", {
                name: /skill markdown/i,
            });
            expect(textarea).toHaveAttribute("placeholder");
            expect(textarea.getAttribute("placeholder")).toMatch(/paste/i);
        });

        it("should display a Run Lint button", () => {
            render(<SkillEditor value="" onChange={vi.fn()} onRun={vi.fn()} />);

            expect(
                screen.getByRole("button", { name: /run.lint/i }),
            ).toBeInTheDocument();
        });
    });

    describe("given user interaction", () => {
        it("should call onChange when the user types in the editor", async () => {
            const handleChange = vi.fn();
            const user = userEvent.setup();

            render(
                <SkillEditor
                    value=""
                    onChange={handleChange}
                    onRun={vi.fn()}
                />,
            );

            const textarea = screen.getByRole("textbox", {
                name: /skill markdown/i,
            });
            await user.type(textarea, "a");

            expect(handleChange).toHaveBeenCalled();
        });

        it("should call onRun when the Run Lint button is clicked", async () => {
            const handleRun = vi.fn();
            const user = userEvent.setup();

            render(
                <SkillEditor
                    value="some content"
                    onChange={vi.fn()}
                    onRun={handleRun}
                />,
            );

            await user.click(screen.getByRole("button", { name: /run.lint/i }));

            expect(handleRun).toHaveBeenCalledTimes(1);
        });
    });

    describe("given the editor has a value", () => {
        it("should display the provided value in the text area", () => {
            const content = "---\nname: my-skill\n---";

            render(
                <SkillEditor
                    value={content}
                    onChange={vi.fn()}
                    onRun={vi.fn()}
                />,
            );

            expect(
                screen.getByRole("textbox", { name: /skill markdown/i }),
            ).toHaveValue(content);
        });
    });

    describe("given the editor is scrolled", () => {
        it("should sync the line numbers scrollTop when the textarea is scrolled", () => {
            render(
                <SkillEditor
                    value={MULTI_LINE_CONTENT}
                    onChange={vi.fn()}
                    onRun={vi.fn()}
                />,
            );
            const textarea = screen.getByRole("textbox", {
                name: /skill markdown/i,
            });
            const lineNumbers = screen.getByTestId("line-numbers");

            textarea.scrollTop = 200;
            fireEvent.scroll(textarea);

            expect(lineNumbers.scrollTop).toBe(200);
        });

        it("should scroll the editor when the mouse wheel is used over the line numbers gutter", () => {
            render(
                <SkillEditor
                    value={MULTI_LINE_CONTENT}
                    onChange={vi.fn()}
                    onRun={vi.fn()}
                />,
            );
            const textarea = screen.getByRole("textbox", {
                name: /skill markdown/i,
            });
            const lineNumbers = screen.getByTestId("line-numbers");

            fireEvent.wheel(lineNumbers, { deltaY: 80 });

            expect(textarea.scrollTop).toBe(80);
        });
    });
});
