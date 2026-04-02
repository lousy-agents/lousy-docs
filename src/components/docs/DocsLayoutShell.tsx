import { Drawer, Flex } from "antd";
import { type ReactNode, useCallback, useState } from "react";
import { DocsContentToolbar } from "@/components/docs/DocsContentToolbar";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { DocsTableOfContents } from "@/components/docs/DocsTableOfContents";
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

const drawerBodyStyle: React.CSSProperties = {
    backgroundColor: "#121410",
    padding: 0,
};

export function DocsLayoutShell({
    docs,
    currentSlug,
    headings,
    children,
}: DocsLayoutShellProps) {
    const isMobile = useIsMobile();
    const [drawerOpen, setDrawerOpen] = useState(false);

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
                style={{ minHeight: "100vh", backgroundColor: "#121410" }}
            >
                <SiteHeader onMobileMenuToggle={handleMenuToggle} />
                <Flex
                    style={{
                        flex: 1,
                        paddingTop: `${HEADER_HEIGHT_PX}px`,
                    }}
                >
                    {!isMobile && (
                        <DocsSidebar docs={docs} currentSlug={currentSlug} />
                    )}
                    <main style={contentStyle}>
                        <DocsContentToolbar currentSlug={currentSlug} />
                        {children}
                    </main>
                    {!isMobile && <DocsTableOfContents headings={headings} />}
                </Flex>
                <SiteFooter />
            </Flex>
            {isMobile && (
                <Drawer
                    placement="left"
                    open={drawerOpen}
                    onClose={handleDrawerClose}
                    size="default"
                    styles={{
                        body: drawerBodyStyle,
                        wrapper: { maxWidth: "280px" },
                    }}
                    closable={false}
                >
                    <DocsSidebar
                        docs={docs}
                        currentSlug={currentSlug}
                        variant="drawer"
                    />
                </Drawer>
            )}
        </AntDProvider>
    );
}
