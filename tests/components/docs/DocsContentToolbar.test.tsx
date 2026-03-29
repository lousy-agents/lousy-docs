import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Chance from "chance";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DocsContentToolbar } from "@/components/docs/DocsContentToolbar";

const chance = new Chance();

describe("DocsContentToolbar", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("given a current slug", () => {
        it("should render a link to view the page as markdown", () => {
            const slug = chance.word();

            render(<DocsContentToolbar currentSlug={slug} />);

            const link = screen.getByRole("link", {
                name: /view markdown/i,
            });
            expect(link).toHaveAttribute("href", `/docs/${slug}.md`);
        });

        it("should open the markdown link in a new tab", () => {
            const slug = chance.word();

            render(<DocsContentToolbar currentSlug={slug} />);

            const link = screen.getByRole("link", {
                name: /view markdown/i,
            });
            expect(link).toHaveAttribute("target", "_blank");
            expect(link).toHaveAttribute("rel", "noopener noreferrer");
        });

        it("should render a button to copy the page as markdown", () => {
            const slug = chance.word();

            render(<DocsContentToolbar currentSlug={slug} />);

            expect(
                screen.getByRole("button", { name: /copy markdown/i }),
            ).toBeInTheDocument();
        });

        it("should fetch and copy markdown to clipboard when copy button is clicked", async () => {
            const slug = chance.word();
            const markdownContent = chance.paragraph();
            const user = userEvent.setup();

            const fetchMarkdown = vi.fn().mockResolvedValue(markdownContent);
            const copyToClipboard = vi.fn().mockResolvedValue(undefined);

            render(
                <DocsContentToolbar
                    currentSlug={slug}
                    fetchMarkdown={fetchMarkdown}
                    copyToClipboard={copyToClipboard}
                />,
            );

            await user.click(
                screen.getByRole("button", { name: /copy markdown/i }),
            );

            expect(fetchMarkdown).toHaveBeenCalledWith(`/docs/${slug}.md`);
            expect(copyToClipboard).toHaveBeenCalledWith(markdownContent);
        });

        it("should show copied confirmation after successful copy", async () => {
            const slug = chance.word();
            const user = userEvent.setup();

            const fetchMarkdown = vi.fn().mockResolvedValue(chance.paragraph());
            const copyToClipboard = vi.fn().mockResolvedValue(undefined);

            render(
                <DocsContentToolbar
                    currentSlug={slug}
                    fetchMarkdown={fetchMarkdown}
                    copyToClipboard={copyToClipboard}
                />,
            );

            await user.click(
                screen.getByRole("button", { name: /copy markdown/i }),
            );

            expect(
                screen.getByRole("button", { name: /copied/i }),
            ).toBeInTheDocument();
        });
    });
});
