import { Flex, Typography } from "antd";
import { useCallback, useState } from "react";
import { MobileNavDrawer } from "@/components/layout/MobileNavDrawer";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { LintResults } from "@/components/playground/LintResults";
import { SkillEditor } from "@/components/playground/SkillEditor";
import { AntDProvider } from "@/components/providers/AntDProvider";
import type { SkillLintOutput } from "@/entities/skill-lint";
import { createSkillContentLintGateway } from "@/gateways/skill-content-lint-gateway";
import { useIsMobile } from "@/hooks/useIsMobile";
import { HEADER_HEIGHT_PX } from "@/lib/layout-constants";
import { LintSkillContentUseCase } from "@/use-cases/lint-skill-content";

const { Title, Text } = Typography;

const gateway = createSkillContentLintGateway();
const lintUseCase = new LintSkillContentUseCase(gateway);

const pageStyle: React.CSSProperties = {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "3rem 1.5rem",
    width: "100%",
};

const headingStyle: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 900,
    fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
    letterSpacing: "-0.02em",
    color: "#e6ead8",
    marginBottom: "0.25rem",
};

const glowSpanStyle: React.CSSProperties = {
    color: "#bdce89",
    textShadow: "0 0 8px rgba(189, 206, 137, 0.4)",
};

const subheadingStyle: React.CSSProperties = {
    fontFamily: "'Manrope', sans-serif",
    color: "rgba(230, 234, 216, 0.5)",
    fontSize: "0.9375rem",
    lineHeight: 1.7,
    maxWidth: "36rem",
};

const badgeStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "3px 10px",
    backgroundColor: "#5f6e34",
    color: "#def0a8",
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "0.6875rem",
    fontWeight: 500,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    borderRadius: "2px",
    marginBottom: "1rem",
};

const skillNameInputStyle: React.CSSProperties = {
    backgroundColor: "#0d0f0b",
    color: "#e6ead8",
    border: "none",
    borderBottom: "2px solid rgba(70, 72, 62, 0.3)",
    padding: "0.5rem 0.75rem",
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "0.875rem",
    outline: "none",
    width: "100%",
    maxWidth: "260px",
    transition: "border-color 0.2s",
};

const labelStyle: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: "0.6875rem",
    color: "rgba(189, 206, 137, 0.5)",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
};

export function PlaygroundPage() {
    const isMobile = useIsMobile();
    const [navDrawerOpen, setNavDrawerOpen] = useState(false);
    const [content, setContent] = useState("");
    const [skillName, setSkillName] = useState("my-skill");
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
                style={{ minHeight: "100vh", backgroundColor: "#121410" }}
            >
                <SiteHeader
                    isMobile={isMobile}
                    onMobileMenuToggle={handleMenuToggle}
                    isMobileMenuOpen={navDrawerOpen}
                    currentPathname="/playground"
                />
                <main style={{ flex: 1, paddingTop: `${HEADER_HEIGHT_PX}px` }}>
                    <div style={pageStyle}>
                        <Text style={badgeStyle}>LINT_PLAYGROUND V1.0</Text>

                        <Title level={2} style={headingStyle}>
                            VALIDATE YOUR{" "}
                            <span style={glowSpanStyle}>SKILLS.</span>
                        </Title>

                        <Text style={subheadingStyle}>
                            Paste your SKILL.md content below and run the linter
                            to validate frontmatter structure. No CLI
                            installation required.
                        </Text>

                        <Flex vertical gap={24} style={{ marginTop: "2.5rem" }}>
                            <Flex vertical gap={6}>
                                <label
                                    htmlFor="skill-name-input"
                                    style={labelStyle}
                                >
                                    Skill Name
                                </label>
                                <input
                                    id="skill-name-input"
                                    type="text"
                                    value={skillName}
                                    onChange={(e) =>
                                        setSkillName(e.target.value)
                                    }
                                    style={skillNameInputStyle}
                                    placeholder="my-skill"
                                />
                            </Flex>

                            <SkillEditor
                                value={content}
                                onChange={setContent}
                                onRun={handleRunLint}
                            />

                            <LintResults result={result} />
                        </Flex>
                    </div>
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
