import { Flex } from "antd";
import { useCallback, useState } from "react";
import { MobileNavDrawer } from "@/components/layout/MobileNavDrawer";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { LintResults } from "@/components/playground/LintResults";
import { SkillEditor } from "@/components/playground/SkillEditor";
import { AntDProvider } from "@/components/providers/AntDProvider";
import type { SkillLintOutput } from "@/entities/skill-lint";
import { createSkillContentLintGateway } from "@/gateways/skill-content-lint-gateway";
import { useIsMobile } from "@/hooks/useIsMobile";
import { HEADER_HEIGHT_PX } from "@/lib/layout-constants";
import { LintSkillContentUseCase } from "@/use-cases/lint-skill-content";

const gateway = createSkillContentLintGateway();
const lintUseCase = new LintSkillContentUseCase(gateway);

const subHeaderStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 24px",
    height: "48px",
    backgroundColor: "#0d0f0b",
    borderBottom: "1px solid rgba(70, 72, 62, 0.25)",
    flexShrink: 0,
};

const subHeaderLeftStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
};

const playgroundTitleStyle: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: "1rem",
    color: "#e6ead8",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
};

const badgeStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "2px 8px",
    backgroundColor: "rgba(95, 110, 52, 0.3)",
    border: "1px solid rgba(70, 72, 62, 0.3)",
    color: "#bdce89",
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "9px",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
};

const subHeaderRightStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "10px",
    color: "rgba(155, 160, 138, 0.6)",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
};

const splitLayoutStyle: React.CSSProperties = {
    display: "flex",
    flex: 1,
    overflow: "hidden",
};

const leftPanelStyle: React.CSSProperties = {
    width: "55%",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid rgba(70, 72, 62, 0.15)",
};

const rightPanelStyle: React.CSSProperties = {
    width: "45%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#131410",
};

const mobilePanelStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    gap: "0",
};

export function PlaygroundPage() {
    const isMobile = useIsMobile();
    const [navDrawerOpen, setNavDrawerOpen] = useState(false);
    const [content, setContent] = useState("");
    const [skillName] = useState("my-skill");
    const [result, setResult] = useState<SkillLintOutput | null>(null);

    const handleMenuToggle = useCallback(() => {
        setNavDrawerOpen((prev) => !prev);
    }, []);

    const handleDrawerClose = useCallback(() => {
        setNavDrawerOpen(false);
    }, []);

    const handleRunLint = useCallback(async () => {
        const output = await lintUseCase.execute({
            content,
            skillName,
        });
        setResult(output);
    }, [content, skillName]);

    return (
        <AntDProvider>
            <Flex
                vertical
                style={{
                    height: "100vh",
                    backgroundColor: "#121410",
                    overflow: "hidden",
                }}
            >
                <SiteHeader
                    isMobile={isMobile}
                    onMobileMenuToggle={handleMenuToggle}
                    isMobileMenuOpen={navDrawerOpen}
                    currentPathname="/playground"
                />
                <main
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                        paddingTop: `${HEADER_HEIGHT_PX}px`,
                        overflow: "hidden",
                    }}
                >
                    <header style={subHeaderStyle}>
                        <div style={subHeaderLeftStyle}>
                            <h2 style={playgroundTitleStyle}>
                                LINT_PLAYGROUND
                            </h2>
                            <span style={badgeStyle}>BETA_V.01</span>
                        </div>
                        <div style={subHeaderRightStyle}>
                            <span
                                style={{
                                    width: "6px",
                                    height: "6px",
                                    borderRadius: "50%",
                                    backgroundColor: "#bdce89",
                                    display: "inline-block",
                                }}
                            />
                            UP_LINK: STABLE
                        </div>
                    </header>
                    {isMobile ? (
                        <div
                            style={{
                                ...mobilePanelStyle,
                                overflow: "auto",
                            }}
                        >
                            <div style={{ minHeight: "400px" }}>
                                <SkillEditor
                                    value={content}
                                    onChange={setContent}
                                    onRun={handleRunLint}
                                />
                            </div>
                            <div style={{ minHeight: "300px" }}>
                                <LintResults result={result} />
                            </div>
                        </div>
                    ) : (
                        <div style={splitLayoutStyle}>
                            <div style={leftPanelStyle}>
                                <SkillEditor
                                    value={content}
                                    onChange={setContent}
                                    onRun={handleRunLint}
                                />
                            </div>
                            <div style={rightPanelStyle}>
                                <LintResults result={result} />
                            </div>
                        </div>
                    )}
                </main>
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
