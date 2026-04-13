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
    padding: "0 16px",
    height: "48px",
    backgroundColor: "#0e0e0c",
    borderBottom: "1px solid rgba(72, 72, 64, 0.25)",
    flexShrink: 0,
};

const subHeaderLeftStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
};

const playgroundTitleStyle: React.CSSProperties = {
    fontFamily: "'Space Grotesk', monospace",
    fontWeight: 700,
    fontSize: "1.125rem",
    color: "#e6ead8",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    margin: 0,
};

const badgeStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "2px 8px",
    backgroundColor: "rgba(57, 61, 44, 0.5)",
    border: "1px solid rgba(72, 72, 64, 0.4)",
    color: "#9ba08a",
    fontFamily: "'Space Grotesk', monospace",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
};

const subHeaderRightStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    height: "100%",
};

const subHeaderNavStyle: React.CSSProperties = {
    display: "flex",
    height: "100%",
    gap: "0",
};

const subNavLinkActiveStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    fontFamily: "'Space Grotesk', monospace",
    fontSize: "11px",
    color: "#e6ead8",
    borderBottom: "1px solid #e6ead8",
    textDecoration: "none",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    background: "none",
    border: "none",
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: "#e6ead8",
    cursor: "default",
};

const subNavLinkStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    fontFamily: "'Space Grotesk', monospace",
    fontSize: "11px",
    color: "#9ba08a",
    textDecoration: "none",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    background: "none",
    border: "none",
    cursor: "default",
};

const subHeaderDividerStyle: React.CSSProperties = {
    width: "1px",
    height: "24px",
    backgroundColor: "rgba(72, 72, 64, 0.4)",
};

const uplinkStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "11px",
    color: "rgba(155, 160, 138, 0.6)",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
};

const bodyLayoutStyle: React.CSSProperties = {
    display: "flex",
    flex: 1,
    overflow: "hidden",
};

const sidebarStyle: React.CSSProperties = {
    width: "240px",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#131410",
    borderRight: "1px solid rgba(72, 72, 64, 0.25)",
    flexShrink: 0,
    fontFamily: "'Space Grotesk', monospace",
    fontSize: "11px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#e6ead8",
};

const sidebarHeaderStyle: React.CSSProperties = {
    padding: "16px",
    borderBottom: "1px solid rgba(72, 72, 64, 0.25)",
};

const sidebarTitleStyle: React.CSSProperties = {
    fontWeight: 700,
    fontSize: "11px",
    color: "#e6ead8",
};

const sidebarSubtitleStyle: React.CSSProperties = {
    fontSize: "10px",
    color: "rgba(155, 160, 138, 0.6)",
    marginTop: "2px",
};

const sidebarNavItemActiveStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    backgroundColor: "#1f201a",
    borderLeft: "4px solid #e6ead8",
    fontWeight: 700,
    cursor: "default",
};

const sidebarNavItemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px 12px 20px",
    color: "rgba(155, 160, 138, 0.8)",
    cursor: "default",
};

const sidebarFooterStyle: React.CSSProperties = {
    padding: "16px",
    borderTop: "1px solid rgba(72, 72, 64, 0.25)",
    marginTop: "auto",
    backgroundColor: "#131410",
};

const cpuBarTrackStyle: React.CSSProperties = {
    width: "100%",
    height: "4px",
    backgroundColor: "rgba(72, 72, 64, 0.4)",
    marginTop: "8px",
};

const cpuBarFillStyle: React.CSSProperties = {
    height: "100%",
    backgroundColor: "#9ba08a",
    width: "0%",
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

function Sidebar() {
    return (
        <aside style={sidebarStyle} aria-label="Playground navigation">
            <div style={sidebarHeaderStyle}>
                <div style={sidebarTitleStyle}>OPERATIONAL_COMMAND</div>
                <div style={sidebarSubtitleStyle}>SECTOR_07</div>
            </div>
            <nav style={{ flex: 1, paddingTop: "4px" }}>
                <div style={sidebarNavItemActiveStyle}>
                    <span aria-hidden="true">⌘</span>
                    <span>TERMINAL_STREAMS</span>
                </div>
                <div style={sidebarNavItemStyle}>
                    <span aria-hidden="true">⚑</span>
                    <span>LINT_RULES</span>
                </div>
                <div style={sidebarNavItemStyle}>
                    <span aria-hidden="true">☰</span>
                    <span>SYSTEM_LOGS</span>
                </div>
                <div style={sidebarNavItemStyle}>
                    <span aria-hidden="true">⌁</span>
                    <span>NETWORK_TELEMETRY</span>
                </div>
            </nav>
            <div style={sidebarFooterStyle}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "10px",
                    }}
                >
                    <span style={{ color: "rgba(155, 160, 138, 0.5)" }}>
                        CPU_LOAD
                    </span>
                    <span style={{ color: "#9ba08a" }}>0%</span>
                </div>
                <div style={cpuBarTrackStyle}>
                    <div style={cpuBarFillStyle} />
                </div>
            </div>
        </aside>
    );
}

const DEFAULT_SKILL_NAME = "my-skill";

export function PlaygroundPage() {
    const isMobile = useIsMobile();
    const [navDrawerOpen, setNavDrawerOpen] = useState(false);
    const [content, setContent] = useState("");
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
            skillName: DEFAULT_SKILL_NAME,
        });
        setResult(output);
    }, [content]);

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
                            <div style={subHeaderNavStyle}>
                                <span style={subNavLinkActiveStyle}>
                                    TERMINAL_STREAMS
                                </span>
                                <span style={subNavLinkStyle}>LINT_RULES</span>
                            </div>
                            <div style={subHeaderDividerStyle} />
                            <div style={uplinkStyle}>
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
                        <div style={bodyLayoutStyle}>
                            <Sidebar />
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
