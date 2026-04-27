import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HomePage } from "@/components/home/HomePage";
import { DOCUMENTED_FEATURES } from "@/lib/documented-features";
import { selectAvailableFeatures } from "@/use-cases/select-available-features";
import docsSlugs from "../../fixtures/docs-slugs.json";

const STATIC_ROUTES = new Set<string>([
    "/",
    "/docs",
    "/playground",
    "/llms-full.txt",
]);

const KNOWN_SLUGS = new Set<string>(docsSlugs as string[]);

const BANNED_DESCRIPTION_TERMS = [
    "cognitive workloads",
    "operational perimeter",
    "hallucination loops",
    "feedback loop",
    "logic feedback loop",
];

const EXPECTED_CARD_TITLES = [
    "init",
    "new",
    "lint",
    "copilot-setup",
    "MCP Server",
    "Agent Shell",
];

function normalizeInternalHref(href: string): string {
    const url = new URL(href, "http://localhost");
    let path = url.pathname;
    path = path.replace(/\/{2,}/g, "/");
    if (path.length > 1 && path.endsWith("/")) {
        path = path.replace(/\/+$/, "");
    }
    return path;
}

function translateForSlugCheck(path: string): string | null {
    const match = path.match(/^\/docs\/([^/]+)$/);
    return match ? (match[1] ?? null) : null;
}

function isResolvable(path: string): boolean {
    if (STATIC_ROUTES.has(path)) {
        return true;
    }
    const slug = translateForSlugCheck(path);
    if (slug !== null) {
        return KNOWN_SLUGS.has(slug);
    }
    return false;
}

describe("Homepage link integrity", () => {
    describe("given a desktop viewport with the full resolved feature set from the docs fixture", () => {
        beforeEach(() => {
            const mql = {
                matches: false,
                media: "",
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
            };
            window.matchMedia = vi
                .fn()
                .mockReturnValue(mql) as unknown as typeof window.matchMedia;
        });

        afterEach(() => {
            vi.restoreAllMocks();
        });

        it("resolves every internal anchor inside <main> to a docs slug or a static route", () => {
            const resolvedFeatures = selectAvailableFeatures(
                DOCUMENTED_FEATURES,
                docsSlugs as string[],
            );

            const { container } = render(
                <HomePage resolvedFeatures={resolvedFeatures} />,
            );

            const main = container.querySelector("main");
            expect(main).not.toBeNull();
            const anchors =
                main?.querySelectorAll<HTMLAnchorElement>("a[href]") ?? [];

            const unresolved: string[] = [];
            for (const anchor of Array.from(anchors)) {
                const href = anchor.getAttribute("href") ?? "";
                if (!href.startsWith("/")) {
                    continue;
                }
                const path = normalizeInternalHref(href);
                if (!isResolvable(path)) {
                    unresolved.push(path);
                }
            }

            expect(unresolved).toEqual([]);
        });

        it("renders the six expected card titles when all docs slugs are present", () => {
            const resolvedFeatures = selectAvailableFeatures(
                DOCUMENTED_FEATURES,
                docsSlugs as string[],
            );

            const { container } = render(
                <HomePage resolvedFeatures={resolvedFeatures} />,
            );

            const main = container.querySelector("main");
            const headings = Array.from(
                main?.querySelectorAll("article h3") ?? [],
            ).map((h) => h.textContent?.trim());

            for (const expected of EXPECTED_CARD_TITLES) {
                expect(headings).toContain(expected);
            }
        });

        it("renders no banned coined description terms anywhere in <main>", () => {
            const resolvedFeatures = selectAvailableFeatures(
                DOCUMENTED_FEATURES,
                docsSlugs as string[],
            );

            const { container } = render(
                <HomePage resolvedFeatures={resolvedFeatures} />,
            );

            const main = container.querySelector("main");
            const text = (main?.textContent ?? "").toLowerCase();
            for (const banned of BANNED_DESCRIPTION_TERMS) {
                expect(text).not.toContain(banned.toLowerCase());
            }
        });
    });
});
