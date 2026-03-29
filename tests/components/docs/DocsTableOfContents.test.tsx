import { render, screen } from "@testing-library/react";
import Chance from "chance";
import { describe, expect, it } from "vitest";
import { DocsTableOfContents } from "@/components/docs/DocsTableOfContents";

const chance = new Chance();

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

describe("DocsTableOfContents", () => {
    describe("given a list of headings", () => {
        it("should render a link for each h2 heading", () => {
            const heading = createHeading({ depth: 2 });
            const headings = [heading];

            render(<DocsTableOfContents headings={headings} />);

            expect(
                screen.getByRole("link", { name: heading.text }),
            ).toBeInTheDocument();
        });

        it("should render a link for each h3 heading", () => {
            const heading = createHeading({ depth: 3 });
            const headings = [heading];

            render(<DocsTableOfContents headings={headings} />);

            expect(
                screen.getByRole("link", { name: heading.text }),
            ).toBeInTheDocument();
        });

        it("should link each heading to its anchor", () => {
            const slug = chance.word();
            const heading = createHeading({ slug });
            const headings = [heading];

            render(<DocsTableOfContents headings={headings} />);

            const link = screen.getByRole("link", { name: heading.text });
            expect(link).toHaveAttribute("href", `#${slug}`);
        });

        it("should render the On This Page heading", () => {
            const headings = [createHeading()];

            render(<DocsTableOfContents headings={headings} />);

            expect(
                screen.getByRole("heading", { name: "On This Page" }),
            ).toBeInTheDocument();
        });

        it("should render a table of contents navigation landmark", () => {
            const headings = [createHeading()];

            render(<DocsTableOfContents headings={headings} />);

            expect(
                screen.getByRole("navigation", { name: /table of contents/i }),
            ).toBeInTheDocument();
        });
    });

    describe("given no headings", () => {
        it("should not render the navigation", () => {
            render(<DocsTableOfContents headings={[]} />);

            expect(
                screen.queryByRole("navigation", {
                    name: /table of contents/i,
                }),
            ).not.toBeInTheDocument();
        });
    });

    describe("given only h1 headings", () => {
        it("should not render the navigation since h1 is excluded", () => {
            const headings = [createHeading({ depth: 1 })];

            render(<DocsTableOfContents headings={headings} />);

            expect(
                screen.queryByRole("navigation", {
                    name: /table of contents/i,
                }),
            ).not.toBeInTheDocument();
        });
    });
});
