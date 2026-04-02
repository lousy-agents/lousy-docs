import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Chance from "chance";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DocsLayoutShell } from "@/components/docs/DocsLayoutShell";

const chance = new Chance(42);

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

function mockMatchMedia(matches: boolean) {
    const listeners: Array<(event: { matches: boolean }) => void> = [];
    const mql = {
        matches,
        media: "",
        addEventListener: vi.fn(
            (_event: string, cb: (event: { matches: boolean }) => void) => {
                listeners.push(cb);
            },
        ),
        removeEventListener: vi.fn(),
    };
    window.matchMedia = vi
        .fn()
        .mockReturnValue(mql) as unknown as typeof window.matchMedia;
    return { mql, listeners };
}

describe("DocsLayoutShell", () => {
    let originalMatchMedia: typeof window.matchMedia;

    beforeEach(() => {
        originalMatchMedia = window.matchMedia;
    });

    afterEach(() => {
        window.matchMedia = originalMatchMedia;
        vi.restoreAllMocks();
    });

    describe("given a desktop viewport", () => {
        beforeEach(() => {
            mockMatchMedia(false);
        });

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

    describe("given a mobile viewport", () => {
        beforeEach(() => {
            mockMatchMedia(true);
        });

        it("should not render the sidebar inline", () => {
            const doc = createDocEntry({ id: "init", title: "init Command" });

            render(
                <DocsLayoutShell docs={[doc]} currentSlug="init" headings={[]}>
                    <p>Content</p>
                </DocsLayoutShell>,
            );

            expect(
                screen.queryByRole("navigation", { name: "Documentation" }),
            ).not.toBeInTheDocument();
        });

        it("should not render the table of contents", () => {
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
                screen.queryByRole("navigation", {
                    name: /table of contents/i,
                }),
            ).not.toBeInTheDocument();
        });

        it("should render the main content area", () => {
            const childText = chance.sentence();

            render(
                <DocsLayoutShell
                    docs={[createDocEntry()]}
                    currentSlug="test"
                    headings={[]}
                >
                    <p>{childText}</p>
                </DocsLayoutShell>,
            );

            expect(screen.getByText(childText)).toBeInTheDocument();
        });

        it("should render a menu button in the header", () => {
            render(
                <DocsLayoutShell
                    docs={[createDocEntry()]}
                    currentSlug="test"
                    headings={[]}
                >
                    <p>Content</p>
                </DocsLayoutShell>,
            );

            expect(
                screen.getByRole("button", { name: /open menu/i }),
            ).toBeInTheDocument();
        });

        it("should show sidebar navigation in a drawer when menu button is clicked", async () => {
            const user = userEvent.setup();
            const doc = createDocEntry({ id: "init", title: "init Command" });

            render(
                <DocsLayoutShell docs={[doc]} currentSlug="init" headings={[]}>
                    <p>Content</p>
                </DocsLayoutShell>,
            );

            await user.click(
                screen.getByRole("button", { name: /open menu/i }),
            );

            expect(
                screen.getByRole("navigation", { name: "Documentation" }),
            ).toBeInTheDocument();
        });
    });
});
