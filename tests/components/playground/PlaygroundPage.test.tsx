import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PlaygroundPage } from "@/components/playground/PlaygroundPage";
import type { SkillContentLintGateway } from "@/use-cases/lint-skill-content";

describe("PlaygroundPage", () => {
    let originalMatchMedia: typeof window.matchMedia;

    beforeEach(() => {
        originalMatchMedia = window.matchMedia;
        window.matchMedia = vi.fn().mockReturnValue({
            matches: false,
            media: "",
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        }) as unknown as typeof window.matchMedia;
    });

    afterEach(() => {
        window.matchMedia = originalMatchMedia;
        vi.restoreAllMocks();
    });

    describe("given the page is rendered in empty state", () => {
        it("should display the playground heading", () => {
            render(<PlaygroundPage />);

            expect(
                screen.getByRole("heading", { name: /lint_playground/i }),
            ).toBeInTheDocument();
        });

        it("should display a skill markdown editor", () => {
            render(<PlaygroundPage />);

            expect(
                screen.getByRole("textbox", { name: /skill markdown/i }),
            ).toBeInTheDocument();
        });

        it("should display a Run Lint button", () => {
            render(<PlaygroundPage />);

            expect(
                screen.getByRole("button", { name: /run.lint/i }),
            ).toBeInTheDocument();
        });

        it("should display an empty results placeholder", () => {
            render(<PlaygroundPage />);

            expect(
                screen.getByText(/paste a file.*and execute/i),
            ).toBeInTheDocument();
        });
    });

    describe("given the user runs lint on valid content", () => {
        it("should display lint results after clicking Run Lint", async () => {
            const user = userEvent.setup();
            render(<PlaygroundPage />);

            const textarea = screen.getByRole("textbox", {
                name: /skill markdown/i,
            });
            await user.clear(textarea);
            await user.type(
                textarea,
                "---\nname: my-skill\ndescription: A valid skill\nallowed-tools: grep\n---\n",
            );

            await user.click(screen.getByRole("button", { name: /run.lint/i }));

            expect(screen.getByText(/0 errors/i)).toBeInTheDocument();
        });
    });

    describe("given the user runs lint on content with errors", () => {
        it("should display error diagnostics", async () => {
            const user = userEvent.setup();
            render(<PlaygroundPage />);

            const textarea = screen.getByRole("textbox", {
                name: /skill markdown/i,
            });
            await user.clear(textarea);
            await user.type(textarea, "---\ndescription: Missing name\n---\n");

            await user.click(screen.getByRole("button", { name: /run.lint/i }));

            expect(screen.getByText(/1 error/i)).toBeInTheDocument();
        });
    });

    describe("given the user runs lint on content without frontmatter", () => {
        it("should display a missing frontmatter error", async () => {
            const user = userEvent.setup();
            render(<PlaygroundPage />);

            const textarea = screen.getByRole("textbox", {
                name: /skill markdown/i,
            });
            await user.clear(textarea);
            await user.type(textarea, "# Just a heading");

            await user.click(screen.getByRole("button", { name: /run.lint/i }));

            expect(
                screen.getByText(/missing yaml frontmatter/i),
            ).toBeInTheDocument();
        });
    });

    describe("given the gateway throws an unexpected error", () => {
        it("should display an internal error diagnostic", async () => {
            const failingGateway: SkillContentLintGateway = {
                parseFrontmatter: () => {
                    throw new Error("Unexpected parse failure");
                },
                validateFrontmatter: () => ({
                    success: false,
                    issues: [],
                    unknownFields: [],
                }),
                validateAgentFrontmatter: () => ({
                    success: false,
                    issues: [],
                    unknownFields: [],
                }),
            };
            const user = userEvent.setup();
            render(<PlaygroundPage gateway={failingGateway} />);

            const textarea = screen.getByRole("textbox", {
                name: /skill markdown/i,
            });
            await user.clear(textarea);
            await user.type(textarea, "---\nname: test\n---\n");

            await user.click(screen.getByRole("button", { name: /run.lint/i }));

            expect(
                screen.getByText(/lint execution failed/i),
            ).toBeInTheDocument();
        });
    });
});
