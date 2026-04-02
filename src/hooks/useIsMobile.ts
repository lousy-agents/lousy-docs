import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(): boolean {
    const query = `(max-width: ${MOBILE_BREAKPOINT}px)`;
    const [isMobile, setIsMobile] = useState(
        () => window.matchMedia(query).matches,
    );

    useEffect(() => {
        const mql = window.matchMedia(query);
        const handler = (event: { matches: boolean }) => {
            setIsMobile(event.matches);
        };

        mql.addEventListener("change", handler);
        return () => {
            mql.removeEventListener("change", handler);
        };
    }, [query]);

    return isMobile;
}
