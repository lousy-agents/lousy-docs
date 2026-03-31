import { render, screen } from "@testing-library/react";
import Chance from "chance";
import { describe, expect, it } from "vitest";
import { DocsSidebar } from "@/components/docs/DocsSidebar";

const chance = new Chance(42);

function createDocEntry(overrides?: { id?: string; title?: string }) {
    return {
        id: overrides?.id ?? chance.word(),
        title: overrides?.title ?? chance.sentence({ words: 3 }),
    };
}

describe("DocsSidebar", () => {
    describe("given a list of docs", () => {
        it("should render a navigation link for each doc entry", () => {
            const docs = [
                createDocEntry({ id: "init", title: "init Command" }),
                createDocEntry({ id: "lint", title: "lint Command" }),
            ];

            render(<DocsSidebar docs={docs} currentSlug="init" />);

            expect(
                screen.getByRole("link", { name: "init Command" }),
            ).toBeInTheDocument();
            expect(
                screen.getByRole("link", { name: "lint Command" }),
            ).toBeInTheDocument();
        });

        it("should link each doc to the correct URL", () => {
            const docId = chance.word();
            const docs = [createDocEntry({ id: docId })];

            render(<DocsSidebar docs={docs} currentSlug={docId} />);

            const link = screen.getByRole("link", { name: docs[0].title });
            expect(link).toHaveAttribute("href", `/docs/${docId}`);
        });

        it("should render the Documentation heading", () => {
            const docs = [createDocEntry()];

            render(<DocsSidebar docs={docs} currentSlug={docs[0].id} />);

            expect(
                screen.getByRole("navigation", { name: "Documentation" }),
            ).toBeInTheDocument();
            expect(
                screen.getByRole("heading", { name: "Documentation" }),
            ).toBeInTheDocument();
        });

        it("should render the README entry as Overview in the navigation", () => {
            const docs = [createDocEntry({ id: "readme", title: "" })];

            render(<DocsSidebar docs={docs} currentSlug="readme" />);

            expect(
                screen.getByRole("link", { name: "Overview" }),
            ).toBeInTheDocument();
        });

        it("should render the README entry as Overview even when title is present", () => {
            const title = chance.sentence({ words: 3 });
            const docs = [createDocEntry({ id: "readme", title })];

            render(<DocsSidebar docs={docs} currentSlug="readme" />);

            expect(
                screen.getByRole("link", { name: "Overview" }),
            ).toBeInTheDocument();
            expect(screen.queryByRole("link", { name: title })).toBeNull();
        });

        it("should mark the active link with aria-current page", () => {
            const docs = [
                createDocEntry({ id: "init", title: "init Command" }),
                createDocEntry({ id: "lint", title: "lint Command" }),
            ];

            render(<DocsSidebar docs={docs} currentSlug="init" />);

            expect(
                screen.getByRole("link", { name: "init Command" }),
            ).toHaveAttribute("aria-current", "page");
            expect(
                screen.getByRole("link", { name: "lint Command" }),
            ).not.toHaveAttribute("aria-current");
        });

        it("should sort unknown docs alphabetically by id after known docs", () => {
            const docs = [
                createDocEntry({ id: "zebra", title: "Zebra Doc" }),
                createDocEntry({ id: "init", title: "init Command" }),
                createDocEntry({ id: "alpha", title: "Alpha Doc" }),
            ];

            render(<DocsSidebar docs={docs} currentSlug="init" />);

            const links = screen.getAllByRole("link");
            expect(links[0]).toHaveTextContent("init Command");
            expect(links[1]).toHaveTextContent("Alpha Doc");
            expect(links[2]).toHaveTextContent("Zebra Doc");
        });
    });
});
