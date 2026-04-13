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
    maxWidth: "900px",
    margin: "0 auto",
    padding: "2rem 1.5rem",
    width: "100%",
};

const headingStyle: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif",
    color: "#bdce89",
    marginBottom: "0.5rem",
};

const subheadingStyle: React.CSSProperties = {
    fontFamily: "'Manrope', sans-serif",
    color: "rgba(230, 234, 216, 0.6)",
    fontSize: "0.9375rem",
    marginBottom: "2rem",
};

const skillNameInputStyle: React.CSSProperties = {
    backgroundColor: "#1a1c18",
    color: "#e6ead8",
    border: "1px solid rgba(70, 72, 62, 0.15)",
    borderRadius: "6px",
    padding: "0.5rem 0.75rem",
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "0.875rem",
    outline: "none",
    width: "100%",
    maxWidth: "300px",
};

const labelStyle: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: "0.75rem",
    color: "rgba(189, 206, 137, 0.6)",
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
                        <Title level={2} style={headingStyle}>
                            Lint Playground
                        </Title>
                        <Text style={subheadingStyle}>
                            Paste your SKILL.md content below and run the linter
                            to validate frontmatter.
                        </Text>

                        <Flex vertical gap={24} style={{ marginTop: "1rem" }}>
                            <Flex vertical gap={8}>
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

                            <Flex vertical gap={8}>
                                <Text style={labelStyle}>Diagnostics</Text>
                                <LintResults result={result} />
                            </Flex>
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
