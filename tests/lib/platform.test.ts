import { describe, expect, it } from "vitest";
import { isMacPlatform } from "@/lib/platform";

describe("isMacPlatform", () => {
    describe("given a Mac user agent string", () => {
        it("returns true for macOS user agent", () => {
            const userAgent =
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36";

            expect(isMacPlatform(userAgent)).toBe(true);
        });

        it("returns true for iPad user agent", () => {
            const userAgent =
                "Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15";

            expect(isMacPlatform(userAgent)).toBe(true);
        });

        it("returns true for iPhone user agent", () => {
            const userAgent =
                "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15";

            expect(isMacPlatform(userAgent)).toBe(true);
        });
    });

    describe("given a non-Mac user agent string", () => {
        it("returns false for Windows user agent", () => {
            const userAgent =
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

            expect(isMacPlatform(userAgent)).toBe(false);
        });

        it("returns false for Linux user agent", () => {
            const userAgent =
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36";

            expect(isMacPlatform(userAgent)).toBe(false);
        });

        it("returns false for an empty string", () => {
            expect(isMacPlatform("")).toBe(false);
        });
    });
});
