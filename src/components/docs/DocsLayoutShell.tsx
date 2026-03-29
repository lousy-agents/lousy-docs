import { Flex } from "antd";
import type { ReactNode } from "react";
import { DocsContentToolbar } from "@/components/docs/DocsContentToolbar";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { DocsTableOfContents } from "@/components/docs/DocsTableOfContents";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { AntDProvider } from "@/components/providers/AntDProvider";
import type { DocEntry, TocHeading } from "@/lib/docs-types";
import { HEADER_HEIGHT_PX } from "@/lib/layout-constants";

interface DocsLayoutShellProps {
    docs: DocEntry[];
    currentSlug: string;
    headings: TocHeading[];
    children: ReactNode;
}

const contentStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
    padding: "2rem 3rem",
    maxWidth: "820px",
    overflowWrap: "break-word",
};

export function DocsLayoutShell({
    docs,
    currentSlug,
    headings,
    children,
}: DocsLayoutShellProps) {
    return (
        <AntDProvider>
            <Flex
                vertical
                style={{ minHeight: "100vh", backgroundColor: "#121410" }}
            >
                <SiteHeader />
                <Flex
                    style={{
                        flex: 1,
                        paddingTop: `${HEADER_HEIGHT_PX}px`,
                    }}
                >
                    <DocsSidebar docs={docs} currentSlug={currentSlug} />
                    <main style={contentStyle}>
                        <DocsContentToolbar currentSlug={currentSlug} />
                        {children}
                    </main>
                    <DocsTableOfContents headings={headings} />
                </Flex>
                <SiteFooter />
            </Flex>
        </AntDProvider>
    );
}
