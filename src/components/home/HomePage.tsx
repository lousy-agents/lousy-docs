import { Flex } from "antd";
import { CoreModulesSection } from "@/components/home/CoreModulesSection";
import { DeveloperPatch } from "@/components/home/DeveloperPatch";
import { HeroSection } from "@/components/home/HeroSection";
import { SpecDrivenSection } from "@/components/home/SpecDrivenSection";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { AntDProvider } from "@/components/providers/AntDProvider";

export function HomePage() {
    return (
        <AntDProvider>
            <Flex
                vertical
                style={{ minHeight: "100vh", backgroundColor: "#121410" }}
            >
                <SiteHeader />
                <main style={{ flex: 1, paddingTop: "64px" }}>
                    <HeroSection />
                    <CoreModulesSection />
                    <SpecDrivenSection />
                    <DeveloperPatch />
                </main>
                <SiteFooter />
            </Flex>
        </AntDProvider>
    );
}
