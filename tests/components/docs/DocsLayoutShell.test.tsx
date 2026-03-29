import { render, screen } from "@testing-library/react";
import Chance from "chance";
import { describe, expect, it } from "vitest";
import { DocsLayoutShell } from "@/components/docs/DocsLayoutShell";

const chance = new Chance();

function createDocEntry(overrides?: { id?: string; title?: string }) {
    return {
        id: overrides?.id ?? chance.word(),
        title: overrides?.title ?? chance.sentence({ words: 3 }),
    };
}

function createHeading(overrides?: {
    depth?: number;
    slug?: string;
    text?: string;
}) {
    return {
        depth: overrides?.depth ?? 2,
        slug: overrides?.slug ?? chance.word(),
        text: overrides?.text ?? chance.sentence({ words: 3 }),
    };
}

describe("DocsLayoutShell", () => {
    describe("given docs, headings, and children content", () => {
        it("should render the site header with branding", () => {
            const docs = [createDocEntry()];
            const headings = [createHeading()];

            render(
                <DocsLayoutShell
                    docs={docs}
                    currentSlug={docs[0].id}
                    headings={headings}
                >
                    <p>Test content</p>
                </DocsLayoutShell>,
            );

            expect(screen.getByRole("banner")).toBeInTheDocument();
        });

        it("should render the children content in the main area", () => {
            const docs = [createDocEntry()];
            const childText = chance.sentence();

            render(
                <DocsLayoutShell
                    docs={docs}
                    currentSlug={docs[0].id}
                    headings={[]}
                >
                    <p>{childText}</p>
                </DocsLayoutShell>,
            );

            expect(screen.getByText(childText)).toBeInTheDocument();
        });

        it("should render the sidebar with doc navigation links", () => {
            const doc = createDocEntry({ id: "init", title: "init Command" });

            render(
                <DocsLayoutShell docs={[doc]} currentSlug="init" headings={[]}>
                    <p>Content</p>
                </DocsLayoutShell>,
            );

            expect(
                screen.getByRole("link", { name: "init Command" }),
            ).toBeInTheDocument();
        });

        it("should render the table of contents when headings are provided", () => {
            const heading = createHeading({ depth: 2 });

            render(
                <DocsLayoutShell
                    docs={[createDocEntry()]}
                    currentSlug="test"
                    headings={[heading]}
                >
                    <p>Content</p>
                </DocsLayoutShell>,
            );

            expect(
                screen.getByRole("navigation", { name: /table of contents/i }),
            ).toBeInTheDocument();
        });

        it("should render the site footer", () => {
            render(
                <DocsLayoutShell
                    docs={[createDocEntry()]}
                    currentSlug="test"
                    headings={[]}
                >
                    <p>Content</p>
                </DocsLayoutShell>,
            );

            expect(screen.getByText(/patchwork protocol/i)).toBeInTheDocument();
        });

        it("should render a main element for the content area", () => {
            render(
                <DocsLayoutShell
                    docs={[createDocEntry()]}
                    currentSlug="test"
                    headings={[]}
                >
                    <p>Content</p>
                </DocsLayoutShell>,
            );

            expect(screen.getByRole("main")).toBeInTheDocument();
        });
    });
});
