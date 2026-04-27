import { Button, Flex, Typography } from "antd";
import { HEADER_HEIGHT_PX } from "@/lib/layout-constants";

const { Title, Paragraph, Text } = Typography;

const sectionStyle: React.CSSProperties = {
    position: "relative",
    minHeight: `calc(100vh - ${HEADER_HEIGHT_PX}px)`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "5rem 1.5rem",
    overflow: "hidden",
    backgroundColor: "#121410",
};

const gridOverlayStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    opacity: 0.2,
    pointerEvents: "none",
    display: "grid",
    gridTemplateColumns: "repeat(12, 1fr)",
};

const gridLineStyle: React.CSSProperties = {
    borderRight: "1px solid rgba(70, 72, 62, 0.1)",
    height: "100%",
};

const containerStyle: React.CSSProperties = {
    maxWidth: "72rem",
    width: "100%",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "3rem",
    position: "relative",
    zIndex: 1,
};

const contentRowStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "3rem",
    width: "100%",
};

const textColumnStyle: React.CSSProperties = {
    flex: "1 1 400px",
    textAlign: "left",
};

const badgeStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "4px 12px",
    backgroundColor: "#5f6e34",
    color: "#def0a8",
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "0.75rem",
    fontWeight: 500,
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    marginBottom: "1.5rem",
    borderRadius: "2px",
};

const headlineStyle: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 900,
    fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
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
    fontSize: "1.125rem",
    lineHeight: 1.7,
    color: "#c7c7ba",
    maxWidth: "28rem",
    marginTop: "1.5rem",
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

const secondaryButtonStyle: React.CSSProperties = {
    background: "transparent",
    border: "1px solid rgba(70, 72, 62, 0.3)",
    color: "#bdce89",
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    borderRadius: "6px",
    height: "48px",
    padding: "0 2rem",
    fontSize: "0.875rem",
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
};

const terminalColumnStyle: React.CSSProperties = {
    flex: "1 1 400px",
    maxWidth: "36rem",
    position: "relative",
};

const terminalWrapperStyle: React.CSSProperties = {
    position: "relative",
    padding: "4px",
    backgroundColor: "#292b26",
    borderRadius: "8px",
    transform: "rotate(2deg)",
    transition: "transform 0.5s",
    zIndex: 0,
};

const terminalBodyStyle: React.CSSProperties = {
    backgroundColor: "#0d0f0b",
    borderRadius: "6px",
    overflow: "hidden",
    position: "relative",
};

const terminalHeaderStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    backgroundColor: "#1a1c18",
};

const dotStyle = (color: string): React.CSSProperties => ({
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: color,
});

const terminalTitleStyle: React.CSSProperties = {
    marginLeft: "16px",
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "10px",
    color: "rgba(199, 199, 186, 0.5)",
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
};

const terminalContentStyle: React.CSSProperties = {
    padding: "1.5rem",
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "0.875rem",
    lineHeight: 1.7,
};

const crtOverlayStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    background: `
        linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%),
        linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))
    `,
    backgroundSize: "100% 4px, 3px 100%",
    pointerEvents: "none",
};

const mascotWrapperStyle: React.CSSProperties = {
    position: "absolute",
    top: "-3rem",
    right: "-2rem",
    width: "10rem",
    height: "10rem",
    zIndex: 2,
};

const mascotGlowStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(189, 206, 137, 0.2)",
    filter: "blur(32px)",
};

const mascotImgStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    position: "relative",
    zIndex: 1,
    filter: "grayscale(1) contrast(1.25) sepia(1)",
    transition: "filter 0.7s",
};

export function HeroSection() {
    return (
        <section style={sectionStyle} aria-label="Hero">
            <div style={gridOverlayStyle} aria-hidden="true">
                {["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"].map(
                    (id) => (
                        <div key={id} style={gridLineStyle} />
                    ),
                )}
            </div>

            <div style={containerStyle}>
                <div style={contentRowStyle}>
                    <div style={textColumnStyle}>
                        <Text style={badgeStyle}>DOCUMENTED CAPABILITIES</Text>

                        <Title level={1} style={headlineStyle}>
                            STOP GUESSING.
                            <br />
                            <span style={glowStyle}>START GUIDING.</span>
                        </Title>

                        <Paragraph style={descStyle}>
                            Lousy Agents is a CLI that scaffolds AI agent
                            workspaces with <code>init</code>, validates agents,
                            skills, and instructions in CI with{" "}
                            <code>lint</code>, and connects your editor to the
                            same lint intelligence through an MCP server.
                        </Paragraph>

                        <Flex
                            gap={16}
                            wrap="wrap"
                            style={{ marginTop: "2rem" }}
                        >
                            <Button
                                style={primaryButtonStyle}
                                size="large"
                                href="/docs/quickstart"
                            >
                                READ_QUICKSTART
                            </Button>
                            <Button
                                style={secondaryButtonStyle}
                                size="large"
                                href="https://github.com/zpratt/lousy-agents"
                                target="_blank"
                                rel="noreferrer noopener"
                            >
                                VIEW_ON_GITHUB
                            </Button>
                        </Flex>
                    </div>

                    <div style={terminalColumnStyle}>
                        <div style={terminalWrapperStyle}>
                            <div style={terminalBodyStyle}>
                                <div style={terminalHeaderStyle}>
                                    <div
                                        style={dotStyle(
                                            "rgba(255, 180, 171, 0.4)",
                                        )}
                                    />
                                    <div
                                        style={dotStyle(
                                            "rgba(238, 189, 142, 0.4)",
                                        )}
                                    />
                                    <div
                                        style={dotStyle(
                                            "rgba(189, 206, 137, 0.4)",
                                        )}
                                    />
                                    <span style={terminalTitleStyle}>
                                        shell — lousy-agents
                                    </span>
                                </div>
                                <div style={terminalContentStyle}>
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "12px",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        <span style={{ color: "#bdce89" }}>
                                            $
                                        </span>
                                        <span style={{ color: "#e3e3dc" }}>
                                            npx @lousy-agents/cli@latest init
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            color: "rgba(189, 206, 137, 0.7)",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        Scaffolding agents, skills, and
                                        instructions...
                                    </div>
                                    <div
                                        style={{
                                            color: "rgba(238, 189, 142, 0.8)",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        Writing .github/ and .claude/ config
                                        files...
                                    </div>
                                    <div
                                        style={{
                                            color: "#bdce89",
                                            display: "flex",
                                            gap: "4px",
                                        }}
                                    >
                                        <span>✓</span>
                                        <span
                                            style={{
                                                backgroundColor:
                                                    "rgba(189, 206, 137, 0.2)",
                                                padding: "0 4px",
                                            }}
                                        >
                                            Project initialized successfully.
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            marginTop: "2rem",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "flex-end",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: "10px",
                                                color: "#c7c7ba",
                                            }}
                                        >
                                            Next: see /docs/quickstart
                                        </span>
                                        <div
                                            style={{
                                                width: "8px",
                                                height: "20px",
                                                backgroundColor: "#bdce89",
                                                animation:
                                                    "pulse 1s ease-in-out infinite",
                                            }}
                                            aria-hidden="true"
                                        />
                                    </div>
                                </div>
                                <div
                                    style={crtOverlayStyle}
                                    aria-hidden="true"
                                />
                            </div>

                            <div style={mascotWrapperStyle}>
                                <div
                                    style={mascotGlowStyle}
                                    aria-hidden="true"
                                />
                                <picture>
                                    <source
                                        type="image/webp"
                                        srcSet="/mascot-160w.webp 1x, /mascot-320w.webp 2x"
                                    />
                                    <img
                                        alt="Lousy Agents mascot"
                                        src="/mascot-160w.jpg"
                                        srcSet="/mascot-160w.jpg 1x, /mascot-320w.jpg 2x"
                                        width={160}
                                        height={160}
                                        loading="eager"
                                        decoding="async"
                                        style={mascotImgStyle}
                                    />
                                </picture>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
