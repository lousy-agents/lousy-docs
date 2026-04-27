import { describe, expect, it } from "vitest";
import {
    DOCUMENTED_FEATURES,
    documentedFeaturesInventorySchema,
    HomepageFeatureInventoryItemSchema,
} from "@/lib/documented-features";
import docsSlugs from "../fixtures/docs-slugs.json";

describe("DOCUMENTED_FEATURES inventory", () => {
    describe("given the seeded inventory", () => {
        it("contains entries for each of the six documented features", () => {
            const ids = DOCUMENTED_FEATURES.map((f) => f.id).sort();
            expect(ids).toEqual([
                "agent-shell",
                "copilot-setup",
                "init",
                "lint",
                "mcp-server",
                "new",
            ]);
        });

        it("uses unique ids", () => {
            const ids = DOCUMENTED_FEATURES.map((f) => f.id);
            expect(new Set(ids).size).toBe(ids.length);
        });

        it("backs every feature's primary content slug with the docs collection", () => {
            const knownSlugs = new Set<string>(docsSlugs as string[]);
            const missing = DOCUMENTED_FEATURES.filter(
                (feature) => !knownSlugs.has(feature.primaryContentSlug),
            ).map((feature) => feature.primaryContentSlug);

            expect(missing).toEqual([]);
        });

        it("backs configured fallback slugs with the docs collection", () => {
            const knownSlugs = new Set<string>(docsSlugs as string[]);
            const missing = DOCUMENTED_FEATURES.filter(
                (feature) =>
                    feature.fallbackContentSlug !== undefined &&
                    !knownSlugs.has(feature.fallbackContentSlug),
            ).map((feature) => feature.fallbackContentSlug);

            expect(missing).toEqual([]);
        });
    });
});

describe("HomepageFeatureInventoryItemSchema", () => {
    describe("given a primaryDocsHref that does not match /docs/<slug>", () => {
        it("rejects the item", () => {
            const result = HomepageFeatureInventoryItemSchema.safeParse({
                id: "x",
                title: "x",
                summary: "x",
                primaryDocsHref: "/foo/bar",
                primaryContentSlug: "bar",
            });

            expect(result.success).toBe(false);
        });
    });

    describe("given a primaryContentSlug that does not match the slug captured from primaryDocsHref", () => {
        it("rejects the item", () => {
            const result = HomepageFeatureInventoryItemSchema.safeParse({
                id: "x",
                title: "x",
                summary: "x",
                primaryDocsHref: "/docs/init",
                primaryContentSlug: "lint",
            });

            expect(result.success).toBe(false);
        });
    });

    describe("given a fallbackDocsHref without a fallbackContentSlug", () => {
        it("rejects the item", () => {
            const result = HomepageFeatureInventoryItemSchema.safeParse({
                id: "x",
                title: "x",
                summary: "x",
                primaryDocsHref: "/docs/init",
                primaryContentSlug: "init",
                fallbackDocsHref: "/docs/quickstart",
            });

            expect(result.success).toBe(false);
        });
    });

    describe("given a fallbackContentSlug without a fallbackDocsHref", () => {
        it("rejects the item", () => {
            const result = HomepageFeatureInventoryItemSchema.safeParse({
                id: "x",
                title: "x",
                summary: "x",
                primaryDocsHref: "/docs/init",
                primaryContentSlug: "init",
                fallbackContentSlug: "quickstart",
            });

            expect(result.success).toBe(false);
        });
    });

    describe("given a valid item with fallback configuration", () => {
        it("accepts the item", () => {
            const result = HomepageFeatureInventoryItemSchema.safeParse({
                id: "init",
                title: "init",
                summary: "Scaffold your workspace.",
                primaryDocsHref: "/docs/init",
                primaryContentSlug: "init",
                fallbackDocsHref: "/docs/quickstart",
                fallbackContentSlug: "quickstart",
            });

            expect(result.success).toBe(true);
        });
    });
});

describe("documentedFeaturesInventorySchema", () => {
    describe("given an inventory with duplicate ids", () => {
        it("rejects the inventory", () => {
            const result = documentedFeaturesInventorySchema.safeParse([
                {
                    id: "init",
                    title: "init",
                    summary: "x",
                    primaryDocsHref: "/docs/init",
                    primaryContentSlug: "init",
                },
                {
                    id: "init",
                    title: "init",
                    summary: "y",
                    primaryDocsHref: "/docs/init",
                    primaryContentSlug: "init",
                },
            ]);

            expect(result.success).toBe(false);
        });
    });
});
