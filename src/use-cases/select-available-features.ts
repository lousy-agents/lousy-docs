import type { HomepageFeatureInventoryItem } from "../entities/feature";

export type ResolvedHomepageFeature = {
    id: string;
    title: string;
    summary: string;
    docsHref: string;
};

export function selectAvailableFeatures(
    inventory: readonly HomepageFeatureInventoryItem[],
    availableSlugs: readonly string[],
): ResolvedHomepageFeature[] {
    const slugSet = new Set(availableSlugs);
    const resolved: ResolvedHomepageFeature[] = [];

    for (const feature of inventory) {
        if (slugSet.has(feature.primaryContentSlug)) {
            resolved.push({
                id: feature.id,
                title: feature.title,
                summary: feature.summary,
                docsHref: feature.primaryDocsHref,
            });
            continue;
        }

        if (
            feature.fallbackDocsHref !== undefined &&
            feature.fallbackContentSlug !== undefined &&
            slugSet.has(feature.fallbackContentSlug)
        ) {
            resolved.push({
                id: feature.id,
                title: feature.title,
                summary: feature.summary,
                docsHref: feature.fallbackDocsHref,
            });
        }
    }

    return resolved;
}
