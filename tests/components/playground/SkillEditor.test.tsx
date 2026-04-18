import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Chance from "chance";
import { describe, expect, it, vi } from "vitest";
import { SkillEditor } from "@/components/playground/SkillEditor";
import type { PlaygroundLintTarget } from "@/use-cases/lint-skill-content";

const chance = new Chance();

function createProps(
    overrides?: Partial<{
        value: string;
        onChange: ReturnType<typeof vi.fn>;
        onRun: ReturnType<typeof vi.fn>;
        activeTarget: PlaygroundLintTarget;
        onTargetChange: ReturnType<typeof vi.fn>;
    }>,
) {
    return {
        value: "",
        onChange: vi.fn(),
        onRun: vi.fn(),
        activeTarget: "skill" as PlaygroundLintTarget,
        onTargetChange: vi.fn(),
        ...overrides,
    };
}

describe("SkillEditor", () => {
    describe("given the editor is rendered", () => {
        it("should display a labeled text area", () => {
            render(<SkillEditor {...createProps()} />);

            expect(
                screen.getByRole("textbox", { name: /skill markdown/i }),
            ).toBeInTheDocument();
        });

        it("should display placeholder text explaining expected input", () => {
            render(<SkillEditor {...createProps()} />);

            const textarea = screen.getByRole("textbox", {
                name: /skill markdown/i,
            });
            expect(textarea).toHaveAttribute("placeholder");
            expect(textarea.getAttribute("placeholder")).toMatch(/paste/i);
        });

        it("should display a Run Lint button", () => {
            render(<SkillEditor {...createProps()} />);

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
                <SkillEditor {...createProps({ onChange: handleChange })} />,
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
                    {...createProps({
                        value: "some content",
                        onRun: handleRun,
                    })}
                />,
            );

            await user.click(screen.getByRole("button", { name: /run.lint/i }));

            expect(handleRun).toHaveBeenCalledTimes(1);
        });
    });

    describe("given the editor has a value", () => {
        it("should display the provided value in the text area", () => {
            const content = chance.paragraph();

            render(<SkillEditor {...createProps({ value: content })} />);

            expect(
                screen.getByRole("textbox", { name: /skill markdown/i }),
            ).toHaveValue(content);
        });
    });

    describe("given the target type tabs", () => {
        it("should display clickable tabs for skills, agents, and instructions", () => {
            render(<SkillEditor {...createProps()} />);

            expect(
                screen.getByRole("tab", { name: "SKILLS" }),
            ).toBeInTheDocument();
            expect(
                screen.getByRole("tab", { name: "AGENTS" }),
            ).toBeInTheDocument();
            expect(
                screen.getByRole("tab", { name: "INSTRUCTIONS" }),
            ).toBeInTheDocument();
        });

        it("should mark the active target tab as selected", () => {
            render(<SkillEditor {...createProps({ activeTarget: "agent" })} />);

            const agentTab = screen.getByRole("tab", { name: "AGENTS" });
            expect(agentTab).toHaveAttribute("aria-selected", "true");
        });

        it("should call onTargetChange when a different tab is clicked", async () => {
            const handleTargetChange = vi.fn();
            const user = userEvent.setup();

            render(
                <SkillEditor
                    {...createProps({ onTargetChange: handleTargetChange })}
                />,
            );

            await user.click(screen.getByRole("tab", { name: "AGENTS" }));

            expect(handleTargetChange).toHaveBeenCalledWith("agent");
        });

        it("should not call onTargetChange when the active tab is clicked", async () => {
            const handleTargetChange = vi.fn();
            const user = userEvent.setup();

            render(
                <SkillEditor
                    {...createProps({
                        activeTarget: "skill",
                        onTargetChange: handleTargetChange,
                    })}
                />,
            );

            await user.click(screen.getByRole("tab", { name: "SKILLS" }));

            expect(handleTargetChange).not.toHaveBeenCalled();
        });

        it("should update the file info label based on active target", () => {
            render(
                <SkillEditor
                    {...createProps({ activeTarget: "instruction" })}
                />,
            );

            expect(
                screen.getByText(/copilot-instructions\.md \/ CLAUDE\.md/),
            ).toBeInTheDocument();
        });

        it("should update the textarea aria-label based on active target", () => {
            render(<SkillEditor {...createProps({ activeTarget: "agent" })} />);

            expect(
                screen.getByRole("textbox", { name: "Agent Markdown" }),
            ).toBeInTheDocument();
        });

        it("should set tabIndex 0 on the active tab and -1 on inactive tabs", () => {
            render(<SkillEditor {...createProps({ activeTarget: "skill" })} />);

            expect(screen.getByRole("tab", { name: "SKILLS" })).toHaveAttribute(
                "tabIndex",
                "0",
            );
            expect(screen.getByRole("tab", { name: "AGENTS" })).toHaveAttribute(
                "tabIndex",
                "-1",
            );
            expect(
                screen.getByRole("tab", { name: "INSTRUCTIONS" }),
            ).toHaveAttribute("tabIndex", "-1");
        });

        it("should navigate to the next tab when ArrowRight is pressed", async () => {
            const handleTargetChange = vi.fn();
            const user = userEvent.setup();

            render(
                <SkillEditor
                    {...createProps({
                        activeTarget: "skill",
                        onTargetChange: handleTargetChange,
                    })}
                />,
            );

            const skillTab = screen.getByRole("tab", { name: "SKILLS" });
            skillTab.focus();
            await user.keyboard("{ArrowRight}");

            expect(handleTargetChange).toHaveBeenCalledWith("agent");
        });

        it("should navigate to the previous tab when ArrowLeft is pressed", async () => {
            const handleTargetChange = vi.fn();
            const user = userEvent.setup();

            render(
                <SkillEditor
                    {...createProps({
                        activeTarget: "agent",
                        onTargetChange: handleTargetChange,
                    })}
                />,
            );

            const agentTab = screen.getByRole("tab", { name: "AGENTS" });
            agentTab.focus();
            await user.keyboard("{ArrowLeft}");

            expect(handleTargetChange).toHaveBeenCalledWith("skill");
        });

        it("should wrap around from the last tab to the first when ArrowRight is pressed", async () => {
            const handleTargetChange = vi.fn();
            const user = userEvent.setup();

            render(
                <SkillEditor
                    {...createProps({
                        activeTarget: "instruction",
                        onTargetChange: handleTargetChange,
                    })}
                />,
            );

            const instructionTab = screen.getByRole("tab", {
                name: "INSTRUCTIONS",
            });
            instructionTab.focus();
            await user.keyboard("{ArrowRight}");

            expect(handleTargetChange).toHaveBeenCalledWith("skill");
        });

        it("should wrap around from the first tab to the last when ArrowLeft is pressed", async () => {
            const handleTargetChange = vi.fn();
            const user = userEvent.setup();

            render(
                <SkillEditor
                    {...createProps({
                        activeTarget: "skill",
                        onTargetChange: handleTargetChange,
                    })}
                />,
            );

            const skillTab = screen.getByRole("tab", { name: "SKILLS" });
            skillTab.focus();
            await user.keyboard("{ArrowLeft}");

            expect(handleTargetChange).toHaveBeenCalledWith("instruction");
        });

        it("should navigate to the first tab when Home is pressed", async () => {
            const handleTargetChange = vi.fn();
            const user = userEvent.setup();

            render(
                <SkillEditor
                    {...createProps({
                        activeTarget: "instruction",
                        onTargetChange: handleTargetChange,
                    })}
                />,
            );

            const instructionTab = screen.getByRole("tab", {
                name: "INSTRUCTIONS",
            });
            instructionTab.focus();
            await user.keyboard("{Home}");

            expect(handleTargetChange).toHaveBeenCalledWith("skill");
        });

        it("should navigate to the last tab when End is pressed", async () => {
            const handleTargetChange = vi.fn();
            const user = userEvent.setup();

            render(
                <SkillEditor
                    {...createProps({
                        activeTarget: "skill",
                        onTargetChange: handleTargetChange,
                    })}
                />,
            );

            const skillTab = screen.getByRole("tab", { name: "SKILLS" });
            skillTab.focus();
            await user.keyboard("{End}");

            expect(handleTargetChange).toHaveBeenCalledWith("instruction");
        });

        it("should render a tabpanel associated with the active tab via aria-labelledby", () => {
            render(<SkillEditor {...createProps({ activeTarget: "agent" })} />);

            const tabpanel = screen.getByRole("tabpanel");
            expect(tabpanel).toHaveAttribute("aria-labelledby", "tab-agent");
        });
    });
});
