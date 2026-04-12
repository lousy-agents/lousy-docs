const MAC_PATTERN = /Mac|iPhone|iPad|iPod/i;

export function isMacPlatform(userAgent: string): boolean {
    return MAC_PATTERN.test(userAgent);
}
