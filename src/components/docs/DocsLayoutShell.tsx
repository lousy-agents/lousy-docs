import { Flex } from "antd";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { DocsContentToolbar } from "@/components/docs/DocsContentToolbar";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { DocsTableOfContents } from "@/components/docs/DocsTableOfContents";
import { MobileDocsDrawer } from "@/components/docs/MobileDocsDrawer";
import { QuickstartCallout } from "@/components/docs/QuickstartCallout";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { AntDProvider } from "@/components/providers/AntDProvider";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { DocEntry, TocHeading } from "@/lib/docs-types";
import { HEADER_HEIGHT_PX } from "@/lib/layout-constants";

interface DocsLayoutShellProps {
    docs: DocEntry[];
    currentSlug: string;
    headings: TocHeading[];
    children: ReactNode;
}

const desktopContentStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
    padding: "2rem 3rem",
    maxWidth: "820px",
    overflowWrap: "break-word",
};

const mobileContentStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
    padding: "1rem",
    overflowWrap: "break-word",
};

export function DocsLayoutShell({
    docs,
    currentSlug,
    headings,
    children,
}: DocsLayoutShellProps) {
    const isMobile = useIsMobile();
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        if (!isMobile) {
            setDrawerOpen(false);
        }
    }, [isMobile]);

    const handleMenuToggle = useCallback(() => {
        setDrawerOpen((prev) => !prev);
    }, []);

    const handleDrawerClose = useCallback(() => {
        setDrawerOpen(false);
    }, []);

    const contentStyle = isMobile ? mobileContentStyle : desktopContentStyle;

    return (
        <AntDProvider>
            <Flex
                vertical
                className="fade-in-shell"
                data-testid="docs-shell"
                style={{
                    minHeight: "100vh",
                    backgroundColor: "#121410",
                }}
            >
                <SiteHeader
                    isMobile={isMobile}
                    onMobileMenuToggle={handleMenuToggle}
                    isMobileMenuOpen={drawerOpen}
                />
                <Flex
                    style={{
                        flex: 1,
                        paddingTop: `${HEADER_HEIGHT_PX}px`,
                        width: "100%",
                    }}
                >
                    <Flex
                        style={{
                            flex: 1,
                            maxWidth: "1260px",
                            width: "100%",
                            margin: "0 auto",
                        }}
                    >
                        {!isMobile && (
                            <DocsSidebar
                                docs={docs}
                                currentSlug={currentSlug}
                            />
                        )}
                        <main style={contentStyle}>
                            <DocsContentToolbar currentSlug={currentSlug} />
                            {currentSlug === "readme" && <QuickstartCallout />}
                            {children}
                        </main>
                        {!isMobile && (
                            <DocsTableOfContents headings={headings} />
                        )}
                    </Flex>
                </Flex>
                <SiteFooter />
            </Flex>
            {isMobile && (
                <MobileDocsDrawer
                    docs={docs}
                    currentSlug={currentSlug}
                    open={drawerOpen}
                    onClose={handleDrawerClose}
                />
            )}
        </AntDProvider>
    );
}
