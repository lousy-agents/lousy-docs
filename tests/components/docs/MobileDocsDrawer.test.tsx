import { render, screen } from "@testing-library/react";
import Chance from "chance";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MobileDocsDrawer } from "@/components/docs/MobileDocsDrawer";

const chance = new Chance(99);

function createDocEntry(overrides?: { id?: string; title?: string }) {
    return {
        id: overrides?.id ?? chance.word(),
        title: overrides?.title ?? chance.sentence({ words: 3 }),
    };
}

describe("MobileDocsDrawer", () => {
    let originalMatchMedia: typeof window.matchMedia;

    beforeEach(() => {
        originalMatchMedia = window.matchMedia;
    });

    afterEach(() => {
        window.matchMedia = originalMatchMedia;
        vi.restoreAllMocks();
    });

    describe("given the drawer is closed", () => {
        it("should not render the sidebar navigation", () => {
            const doc = createDocEntry({ id: "init", title: "init Command" });

            render(
                <MobileDocsDrawer
                    docs={[doc]}
                    currentSlug="init"
                    open={false}
                    onClose={vi.fn()}
                />,
            );

            expect(
                screen.queryByRole("navigation", { name: "Documentation" }),
            ).not.toBeInTheDocument();
        });
    });

    describe("given the drawer is open", () => {
        it("should render the sidebar navigation", () => {
            const doc = createDocEntry({ id: "init", title: "init Command" });

            render(
                <MobileDocsDrawer
                    docs={[doc]}
                    currentSlug="init"
                    open={true}
                    onClose={vi.fn()}
                />,
            );

            expect(
                screen.getByRole("navigation", { name: "Documentation" }),
            ).toBeInTheDocument();
        });

        it("should have an accessible label on the drawer", () => {
            const doc = createDocEntry({ id: "init", title: "init Command" });

            render(
                <MobileDocsDrawer
                    docs={[doc]}
                    currentSlug="init"
                    open={true}
                    onClose={vi.fn()}
                />,
            );

            expect(
                screen.getByText("Documentation navigation"),
            ).toBeInTheDocument();
        });
    });
});
