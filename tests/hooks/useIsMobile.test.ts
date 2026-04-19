import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useIsMobile } from "@/hooks/useIsMobile";

const MOBILE_BREAKPOINT = 767;

function createMockMatchMedia(matches: boolean) {
    const listeners: Array<(event: { matches: boolean }) => void> = [];
    const mql = {
        matches,
        media: `(max-width: ${MOBILE_BREAKPOINT}px)`,
        addEventListener: vi.fn(
            (_event: string, cb: (event: { matches: boolean }) => void) => {
                listeners.push(cb);
            },
        ),
        removeEventListener: vi.fn(
            (_event: string, cb: (event: { matches: boolean }) => void) => {
                const index = listeners.indexOf(cb);
                if (index !== -1) listeners.splice(index, 1);
            },
        ),
    };
    return {
        mql,
        listeners,
        matchMediaFn: vi.fn().mockReturnValue(mql),
    };
}

describe("useIsMobile", () => {
    let originalMatchMedia: typeof window.matchMedia;

    beforeEach(() => {
        originalMatchMedia = window.matchMedia;
    });

    afterEach(() => {
        window.matchMedia = originalMatchMedia;
        vi.restoreAllMocks();
    });

    describe("given a mobile viewport", () => {
        it("returns true when viewport is below the mobile breakpoint", () => {
            const { matchMediaFn } = createMockMatchMedia(true);
            window.matchMedia =
                matchMediaFn as unknown as typeof window.matchMedia;

            const { result } = renderHook(() => useIsMobile());

            expect(result.current).toBe(true);
        });
    });

    describe("given a desktop viewport", () => {
        it("returns false when viewport is above the mobile breakpoint", () => {
            const { matchMediaFn } = createMockMatchMedia(false);
            window.matchMedia =
                matchMediaFn as unknown as typeof window.matchMedia;

            const { result } = renderHook(() => useIsMobile());

            expect(result.current).toBe(false);
        });
    });

    describe("given a viewport resize crossing the breakpoint", () => {
        it("updates from desktop to mobile when the media query starts matching", () => {
            const { matchMediaFn, listeners, mql } =
                createMockMatchMedia(false);
            window.matchMedia =
                matchMediaFn as unknown as typeof window.matchMedia;

            const { result } = renderHook(() => useIsMobile());
            expect(result.current).toBe(false);

            act(() => {
                mql.matches = true;
                for (const listener of listeners) {
                    listener({ matches: true });
                }
            });

            expect(result.current).toBe(true);
        });

        it("updates from mobile to desktop when the media query stops matching", () => {
            const { matchMediaFn, listeners, mql } = createMockMatchMedia(true);
            window.matchMedia =
                matchMediaFn as unknown as typeof window.matchMedia;

            const { result } = renderHook(() => useIsMobile());
            expect(result.current).toBe(true);

            act(() => {
                mql.matches = false;
                for (const listener of listeners) {
                    listener({ matches: false });
                }
            });

            expect(result.current).toBe(false);
        });
    });

    describe("given the hook unmounts", () => {
        it("removes the event listener on cleanup", () => {
            const { matchMediaFn, mql } = createMockMatchMedia(false);
            window.matchMedia =
                matchMediaFn as unknown as typeof window.matchMedia;

            const { unmount } = renderHook(() => useIsMobile());
            unmount();

            expect(mql.removeEventListener).toHaveBeenCalledWith(
                "change",
                expect.any(Function),
            );
        });
    });

    describe("given the viewport changes between render and effect mount", () => {
        it("reflects the current media query state when the effect syncs on mount", () => {
            // useState initializer sees desktop (false) — the pre-race state
            const { mql: renderMql } = createMockMatchMedia(false);
            // useEffect sees mobile (true) — viewport changed during the race window
            const { mql: effectMql } = createMockMatchMedia(true);
            const matchMediaFn = vi
                .fn()
                .mockReturnValueOnce(renderMql) // first call: useState lazy initializer
                .mockReturnValueOnce(effectMql); // second call: useEffect
            window.matchMedia =
                matchMediaFn as unknown as typeof window.matchMedia;

            const { result } = renderHook(() => useIsMobile());

            // Initial state was false (from useState); effect syncs mql.matches=true
            // This assertion fails if setIsMobile(mql.matches) is removed from the hook
            expect(result.current).toBe(true);
        });
    });

    describe("given the media query string", () => {
        it("queries for the correct mobile breakpoint", () => {
            const { matchMediaFn } = createMockMatchMedia(false);
            window.matchMedia =
                matchMediaFn as unknown as typeof window.matchMedia;

            renderHook(() => useIsMobile());

            expect(matchMediaFn).toHaveBeenCalledWith(
                `(max-width: ${MOBILE_BREAKPOINT}px)`,
            );
        });
    });
});
