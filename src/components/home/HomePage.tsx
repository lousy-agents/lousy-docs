import { Flex } from "antd";
import { useCallback, useState } from "react";
import { CoreModulesSection } from "@/components/home/CoreModulesSection";
import { HeroSection } from "@/components/home/HeroSection";
import { QuickstartFlowSection } from "@/components/home/QuickstartFlowSection";
import { MobileNavDrawer } from "@/components/layout/MobileNavDrawer";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { AntDProvider } from "@/components/providers/AntDProvider";
import { useIsMobile } from "@/hooks/useIsMobile";
import { HEADER_HEIGHT_PX } from "@/lib/layout-constants";
import type { ResolvedHomepageFeature } from "@/use-cases/select-available-features";

interface HomePageProps {
    resolvedFeatures: readonly ResolvedHomepageFeature[];
}

export function HomePage({ resolvedFeatures }: HomePageProps) {
    const isMobile = useIsMobile();
    const [navDrawerOpen, setNavDrawerOpen] = useState(false);

    const handleMenuToggle = useCallback(() => {
        setNavDrawerOpen((prev) => !prev);
    }, []);

    const handleDrawerClose = useCallback(() => {
        setNavDrawerOpen(false);
    }, []);

    return (
        <AntDProvider>
            <Flex
                vertical
                style={{ minHeight: "100vh", backgroundColor: "#121410" }}
            >
                <SiteHeader
                    isMobile={isMobile}
                    onMobileMenuToggle={handleMenuToggle}
                    isMobileMenuOpen={navDrawerOpen}
                />
                <main style={{ flex: 1, paddingTop: `${HEADER_HEIGHT_PX}px` }}>
                    <HeroSection />
                    <CoreModulesSection resolvedFeatures={resolvedFeatures} />
                    <QuickstartFlowSection />
                </main>
                <SiteFooter />
            </Flex>
            {isMobile && (
                <MobileNavDrawer
                    open={navDrawerOpen}
                    onClose={handleDrawerClose}
                />
            )}
        </AntDProvider>
    );
}
