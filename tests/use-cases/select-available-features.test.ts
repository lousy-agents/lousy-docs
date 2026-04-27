import Chance from "chance";
import { describe, expect, it } from "vitest";
import type { HomepageFeatureInventoryItem } from "@/entities/feature";
import { selectAvailableFeatures } from "@/use-cases/select-available-features";

const chance = new Chance();

function makeFeature(
    overrides: Partial<HomepageFeatureInventoryItem> = {},
): HomepageFeatureInventoryItem {
    const id = overrides.id ?? chance.word();
    const slug = overrides.primaryContentSlug ?? id;
    return {
        id,
        title: chance.word(),
        summary: chance.sentence(),
        primaryDocsHref: `/docs/${slug}`,
        primaryContentSlug: slug,
        ...overrides,
    };
}

describe("selectAvailableFeatures", () => {
    describe("given a feature whose primary content slug is available", () => {
        it("resolves docsHref to the primary docs href", () => {
            const slug = chance.word();
            const inventory = [
                makeFeature({
                    primaryContentSlug: slug,
                    primaryDocsHref: `/docs/${slug}`,
                }),
            ];

            const result = selectAvailableFeatures(inventory, [slug]);

            expect(result).toHaveLength(1);
            expect(result[0]?.docsHref).toBe(`/docs/${slug}`);
        });
    });

    describe("given a feature whose primary slug is missing but a fallback is configured and the quickstart slug is available", () => {
        it("resolves docsHref to the fallback docs href", () => {
            const slug = chance.word();
            const inventory = [
                makeFeature({
                    primaryContentSlug: slug,
                    primaryDocsHref: `/docs/${slug}`,
                    fallbackDocsHref: "/docs/quickstart",
                    fallbackContentSlug: "quickstart",
                }),
            ];

            const result = selectAvailableFeatures(inventory, ["quickstart"]);

            expect(result).toHaveLength(1);
            expect(result[0]?.docsHref).toBe("/docs/quickstart");
        });
    });

    describe("given a feature whose primary slug is missing and no fallback is configured", () => {
        it("omits the feature", () => {
            const slug = chance.word();
            const inventory = [
                makeFeature({
                    primaryContentSlug: slug,
                    primaryDocsHref: `/docs/${slug}`,
                }),
            ];

            const result = selectAvailableFeatures(inventory, []);

            expect(result).toEqual([]);
        });
    });

    describe("given a feature whose primary slug is missing, fallback is configured, but quickstart is also missing", () => {
        it("omits the feature", () => {
            const slug = chance.word();
            const inventory = [
                makeFeature({
                    primaryContentSlug: slug,
                    primaryDocsHref: `/docs/${slug}`,
                    fallbackDocsHref: "/docs/quickstart",
                    fallbackContentSlug: "quickstart",
                }),
            ];

            const result = selectAvailableFeatures(inventory, []);

            expect(result).toEqual([]);
        });
    });

    describe("given an empty inventory", () => {
        it("returns an empty array", () => {
            const result = selectAvailableFeatures([], [chance.word()]);

            expect(result).toEqual([]);
        });
    });

    describe("given an empty available slug set", () => {
        it("returns an empty array", () => {
            const inventory = [makeFeature()];

            const result = selectAvailableFeatures(inventory, []);

            expect(result).toEqual([]);
        });
    });

    describe("given multiple features in the inventory", () => {
        it("preserves the inventory order in its output", () => {
            const slugA = `${chance.word()}-a`;
            const slugB = `${chance.word()}-b`;
            const slugC = `${chance.word()}-c`;
            const inventory = [
                makeFeature({
                    id: "a",
                    primaryContentSlug: slugA,
                    primaryDocsHref: `/docs/${slugA}`,
                }),
                makeFeature({
                    id: "b",
                    primaryContentSlug: slugB,
                    primaryDocsHref: `/docs/${slugB}`,
                }),
                makeFeature({
                    id: "c",
                    primaryContentSlug: slugC,
                    primaryDocsHref: `/docs/${slugC}`,
                }),
            ];

            const result = selectAvailableFeatures(inventory, [
                slugC,
                slugA,
                slugB,
            ]);

            expect(result.map((r) => r.id)).toEqual(["a", "b", "c"]);
        });
    });

    describe("given an unknown slug in the available set", () => {
        it("does not introduce a feature for it", () => {
            const slug = chance.word();
            const inventory = [
                makeFeature({
                    primaryContentSlug: slug,
                    primaryDocsHref: `/docs/${slug}`,
                }),
            ];

            const result = selectAvailableFeatures(inventory, [
                chance.word(),
                chance.word(),
            ]);

            expect(result).toEqual([]);
        });
    });
});
