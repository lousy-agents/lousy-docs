import { Button, Flex, Typography } from "antd";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { AntDProvider } from "@/components/providers/AntDProvider";
import { useIsMobile } from "@/hooks/useIsMobile";
import { HEADER_HEIGHT_PX } from "@/lib/layout-constants";

const { Title, Paragraph, Text } = Typography;

const sectionStyle: React.CSSProperties = {
    minHeight: `calc(100vh - ${HEADER_HEIGHT_PX}px)`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "4rem 1.5rem",
    backgroundColor: "#121410",
};

const containerStyle: React.CSSProperties = {
    maxWidth: "40rem",
    width: "100%",
    textAlign: "center",
};

const badgeStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "4px 12px",
    backgroundColor: "#1a1c18",
    border: "1px solid rgba(70, 72, 62, 0.15)",
    color: "#eebd8e",
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "0.75rem",
    fontWeight: 500,
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    marginBottom: "2rem",
    borderRadius: "2px",
};

const headingStyle: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 900,
    fontSize: "clamp(2rem, 5vw, 3.5rem)",
    lineHeight: 1,
    letterSpacing: "-0.03em",
    color: "#e3e3dc",
    margin: 0,
};

const glowStyle: React.CSSProperties = {
    color: "#bdce89",
    textShadow: "0 0 8px rgba(189, 206, 137, 0.6)",
};

const descStyle: React.CSSProperties = {
    fontFamily: "'Manrope', sans-serif",
    fontSize: "1rem",
    lineHeight: 1.7,
    color: "#c7c7ba",
    marginTop: "1.5rem",
    marginBottom: "2.5rem",
};

const primaryButtonStyle: React.CSSProperties = {
    background: "linear-gradient(to bottom, #bdce89, #5f6e34)",
    border: "none",
    color: "#283501",
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    borderRadius: "6px",
    height: "48px",
    padding: "0 2rem",
    fontSize: "0.875rem",
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
};

const codeStyle: React.CSSProperties = {
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "0.75rem",
    color: "rgba(189, 206, 137, 0.5)",
    letterSpacing: "0.05em",
    marginTop: "3rem",
    display: "block",
};

interface ComingSoonPageProps {
    pageName: string;
    statusCode?: string;
}

function ComingSoonContent({
    pageName,
    statusCode = "503",
}: ComingSoonPageProps) {
    return (
        <section style={sectionStyle} aria-label={`${pageName} — Coming Soon`}>
            <div style={containerStyle}>
                <Text style={badgeStyle}>STATUS: SCHEDULED</Text>

                <Title level={1} style={headingStyle}>
                    COMING
                    <br />
                    <span style={glowStyle}>SOON.</span>
                </Title>

                <Paragraph style={descStyle}>
                    <strong style={{ color: "#bdce89" }}>{pageName}</strong> is
                    currently in development. In the meantime, explore the docs
                    to get started with Lousy Agents.
                </Paragraph>

                <Flex justify="center" gap={16} wrap="wrap">
                    <Button
                        style={primaryButtonStyle}
                        size="large"
                        href="/docs/quickstart"
                    >
                        VIEW_DOCS
                    </Button>
                    <Button
                        size="large"
                        href="/"
                        style={{
                            background: "transparent",
                            border: "1px solid rgba(189, 206, 137, 0.2)",
                            color: "#bdce89",
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontWeight: 700,
                            borderRadius: "6px",
                            height: "48px",
                            padding: "0 2rem",
                            fontSize: "0.875rem",
                            letterSpacing: "0.05em",
                            textTransform: "uppercase" as const,
                        }}
                    >
                        RETURN_HOME
                    </Button>
                </Flex>

                <Text style={codeStyle}>
                    {`MODULE_${pageName.toUpperCase().replace(/\s/g, "_")} // PENDING_DEPLOY // ${statusCode}`}
                </Text>
            </div>
        </section>
    );
}

export function ComingSoonPage({ pageName, statusCode }: ComingSoonPageProps) {
    const isMobile = useIsMobile();

    return (
        <AntDProvider>
            <Flex
                vertical
                style={{ minHeight: "100vh", backgroundColor: "#121410" }}
            >
                <SiteHeader isMobile={isMobile} />
                <main style={{ flex: 1, paddingTop: `${HEADER_HEIGHT_PX}px` }}>
                    <ComingSoonContent
                        pageName={pageName}
                        statusCode={statusCode}
                    />
                </main>
                <SiteFooter />
            </Flex>
        </AntDProvider>
    );
}
