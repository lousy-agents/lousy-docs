import { Flex } from "antd";
import { useCallback, useMemo, useState } from "react";
import { MobileNavDrawer } from "@/components/layout/MobileNavDrawer";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { LintResults } from "@/components/playground/LintResults";
import { SkillEditor } from "@/components/playground/SkillEditor";
import { AntDProvider } from "@/components/providers/AntDProvider";
import type { LintOutput } from "@/entities/skill-lint";
import { createSkillContentLintGateway } from "@/gateways/skill-content-lint-gateway";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
    HEADER_HEIGHT_PX,
    MOBILE_EDITOR_MIN_HEIGHT_PX,
} from "@/lib/layout-constants";
import {
    type PlaygroundLintTarget,
    PlaygroundLintUseCase,
    type SkillContentLintGateway,
} from "@/use-cases/lint-skill-content";

const subHeaderStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 16px",
    height: "48px",
    backgroundColor: "#121410",
    borderBottom: "1px solid rgba(70, 72, 62, 0.25)",
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
    border: "1px solid rgba(70, 72, 62, 0.25)",
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
    textDecoration: "none",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    background: "none",
    border: "none",
    borderBottom: "1px solid rgba(189, 206, 137, 0.6)",
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
    backgroundColor: "rgba(70, 72, 62, 0.25)",
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
    backgroundColor: "#1a1c18",
    borderRight: "1px solid rgba(70, 72, 62, 0.15)",
    flexShrink: 0,
    fontFamily: "'Space Grotesk', monospace",
    fontSize: "11px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#e6ead8",
};

const sidebarHeaderStyle: React.CSSProperties = {
    padding: "16px",
    borderBottom: "1px solid rgba(70, 72, 62, 0.25)",
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
    backgroundColor: "#1e201c",
    borderLeft: "2px solid #bdce89",
    fontWeight: 700,
    cursor: "default",
};

const sidebarFooterStyle: React.CSSProperties = {
    padding: "16px",
    borderTop: "1px solid rgba(70, 72, 62, 0.25)",
    backgroundColor: "#1a1c18",
    marginTop: "auto",
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
    overflow: "hidden",
    minHeight: 0,
};

const rightPanelStyle: React.CSSProperties = {
    width: "45%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#1a1c18",
    overflow: "hidden",
    minHeight: 0,
};

const mobilePanelStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    gap: "0",
};

function Sidebar({ linterState }: { linterState: string }) {
    return (
        <aside style={sidebarStyle} aria-label="Playground sidebar">
            <div style={sidebarHeaderStyle}>
                <div style={sidebarTitleStyle}>LINT_PLAYGROUND</div>
                <div style={sidebarSubtitleStyle}>SKILL VALIDATOR</div>
            </div>
            <div style={{ flex: 1, paddingTop: "4px" }} role="presentation">
                <div style={sidebarNavItemActiveStyle}>
                    <span aria-hidden="true">⌘</span>
                    <span>TERMINAL_STREAMS</span>
                </div>
            </div>
            <div style={sidebarFooterStyle}>
                <div
                    style={{
                        fontSize: "10px",
                        color: "rgba(155, 160, 138, 0.5)",
                        letterSpacing: "0.12em",
                    }}
                >
                    {linterState}
                </div>
            </div>
        </aside>
    );
}

interface PlaygroundPageProps {
    gateway?: SkillContentLintGateway;
}

export function PlaygroundPage({
    gateway: injectedGateway,
}: PlaygroundPageProps = {}) {
    const isMobile = useIsMobile();
    const [navDrawerOpen, setNavDrawerOpen] = useState(false);
    const [content, setContent] = useState("");
    const [result, setResult] = useState<LintOutput | null>(null);
    const [activeTarget, setActiveTarget] =
        useState<PlaygroundLintTarget>("skill");

    const lintUseCase = useMemo(() => {
        const gw = injectedGateway ?? createSkillContentLintGateway();
        return new PlaygroundLintUseCase(gw);
    }, [injectedGateway]);

    const handleMenuToggle = useCallback(() => {
        setNavDrawerOpen((prev) => !prev);
    }, []);

    const handleDrawerClose = useCallback(() => {
        setNavDrawerOpen(false);
    }, []);

    const handleTargetChange = useCallback((target: PlaygroundLintTarget) => {
        setActiveTarget(target);
        setContent("");
        setResult(null);
    }, []);

    const handleRunLint = useCallback(async () => {
        try {
            const output = await lintUseCase.execute({
                content,
                target: activeTarget,
            });
            setResult(output);
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : "Unknown lint error";
            setResult(
                PlaygroundLintUseCase.createInternalErrorOutput(
                    activeTarget,
                    message,
                ),
            );
        }
    }, [content, lintUseCase, activeTarget]);

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
                        {!isMobile && (
                            <div style={subHeaderRightStyle}>
                                <div style={subHeaderNavStyle}>
                                    <span style={subNavLinkActiveStyle}>
                                        TERMINAL_STREAMS
                                    </span>
                                    <span style={subNavLinkStyle}>
                                        LINT_RULES
                                    </span>
                                </div>
                                <div style={subHeaderDividerStyle} />
                            </div>
                        )}
                    </header>
                    {isMobile ? (
                        <div
                            style={{
                                ...mobilePanelStyle,
                                overflow: "auto",
                            }}
                        >
                            <div
                                style={{
                                    minHeight: `${MOBILE_EDITOR_MIN_HEIGHT_PX}px`,
                                    flexShrink: 0,
                                }}
                            >
                                <SkillEditor
                                    value={content}
                                    onChange={setContent}
                                    onRun={handleRunLint}
                                    activeTarget={activeTarget}
                                    onTargetChange={handleTargetChange}
                                />
                            </div>
                            <div style={{ minHeight: "300px" }}>
                                <LintResults result={result} />
                            </div>
                        </div>
                    ) : (
                        <div style={bodyLayoutStyle}>
                            <Sidebar
                                linterState={
                                    result ? "LINT_COMPLETE" : "AWAITING_INPUT"
                                }
                            />
                            <div style={splitLayoutStyle}>
                                <div style={leftPanelStyle}>
                                    <SkillEditor
                                        value={content}
                                        onChange={setContent}
                                        onRun={handleRunLint}
                                        activeTarget={activeTarget}
                                        onTargetChange={handleTargetChange}
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
