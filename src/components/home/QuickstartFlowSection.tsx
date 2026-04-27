import { Button, Typography } from "antd";

const { Title, Paragraph } = Typography;

type QuickstartStep = {
    readonly id: string;
    readonly number: string;
    readonly label: string;
    readonly description: string;
    readonly icon: string;
    readonly accentColor: string;
    readonly iconBg: string;
};

const STEPS: readonly QuickstartStep[] = [
    {
        id: "init",
        number: "01",
        label: "init",
        description:
            "Scaffold the recommended directory structure, base agents, and starting skills for your workspace with a single command.",
        icon: "rocket_launch",
        accentColor: "#bdce89",
        iconBg: "#5f6e34",
    },
    {
        id: "lint-in-ci",
        number: "02",
        label: "lint (in CI)",
        description:
            "Keep agents and instructions healthy as your codebase evolves — wire `lint` into GitHub Actions to catch broken hooks and weak instructions automatically.",
        icon: "spellcheck",
        accentColor: "#eebd8e",
        iconBg: "#333531",
    },
    {
        id: "mcp-server",
        number: "03",
        label: "MCP Server",
        description:
            "Attach the Lousy Agents MCP Server to your editor so your AI assistant can read and validate your workspace as you work.",
        icon: "dns",
        accentColor: "#bdce89",
        iconBg: "#5f6e34",
    },
];

const QUICKSTART_HREF = "/docs/quickstart";

const sectionStyle: React.CSSProperties = {
    padding: "4rem 1.5rem",
    backgroundColor: "#121410",
    position: "relative",
    overflow: "hidden",
};

const bgDecorationStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    right: 0,
    width: "33%",
    height: "100%",
    backgroundColor: "#1a1c18",
    transform: "skewX(-12deg) translateX(50%)",
    opacity: 0.5,
};

const containerStyle: React.CSSProperties = {
    maxWidth: "72rem",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
};

const headerStyle: React.CSSProperties = {
    marginBottom: "3rem",
};

const headingStyle: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 900,
    fontSize: "clamp(2rem, 4vw, 3rem)",
    letterSpacing: "-0.03em",
    color: "#e3e3dc",
    textTransform: "uppercase" as const,
    marginBottom: "1rem",
};

const subtitleStyle: React.CSSProperties = {
    fontFamily: "'Manrope', sans-serif",
    fontSize: "1rem",
    color: "#c7c7ba",
    maxWidth: "36rem",
};

const stepsContainerStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "3rem",
    alignItems: "flex-start",
};

const stepLinkStyle: React.CSSProperties = {
    flex: "1 1 220px",
    textDecoration: "none",
    color: "inherit",
    display: "block",
};

const numberOverlayStyle: React.CSSProperties = {
    position: "relative",
    marginBottom: "2rem",
};

const bigNumberStyle: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 900,
    fontSize: "5rem",
    color: "rgba(70, 72, 62, 0.18)",
    position: "absolute",
    top: "-3rem",
    left: "-1rem",
    lineHeight: 1,
};

const iconBoxStyle = (bg: string, border: string): React.CSSProperties => ({
    width: "4rem",
    height: "4rem",
    backgroundColor: bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "2px",
    position: "relative",
    zIndex: 1,
    border: `2px solid ${border}`,
    transition: "background-color 0.2s",
});

const stepTitleStyle = (color: string): React.CSSProperties => ({
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: "1.5rem",
    color,
    letterSpacing: "-0.03em",
    marginBottom: "1rem",
});

const stepDescStyle: React.CSSProperties = {
    fontFamily: "'Manrope', sans-serif",
    fontSize: "1rem",
    color: "#c7c7ba",
    lineHeight: 1.7,
    margin: 0,
};

const ctaWrapperStyle: React.CSSProperties = {
    marginTop: "3rem",
    display: "flex",
    justifyContent: "flex-start",
};

const ctaStyle: React.CSSProperties = {
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

export function QuickstartFlowSection() {
    return (
        <section style={sectionStyle} aria-label="Quickstart flow">
            <div style={bgDecorationStyle} aria-hidden="true" />
            <div style={containerStyle}>
                <div style={headerStyle}>
                    <Title level={2} style={headingStyle}>
                        The Documented Quickstart
                    </Title>
                    <Paragraph style={subtitleStyle}>
                        Three steps from a fresh repo to AI assistants that
                        validate themselves: scaffold your project, enforce
                        quality in CI, and connect your editor through the MCP
                        server.
                    </Paragraph>
                </div>

                <div style={stepsContainerStyle}>
                    {STEPS.map((step) => (
                        <a
                            key={step.id}
                            href={QUICKSTART_HREF}
                            style={stepLinkStyle}
                            className="home-step-link"
                            aria-label={`Learn about ${step.label}`}
                        >
                            <div style={numberOverlayStyle}>
                                <span style={bigNumberStyle} aria-hidden="true">
                                    {step.number}
                                </span>
                                <div
                                    style={iconBoxStyle(
                                        step.iconBg,
                                        `${step.accentColor}33`,
                                    )}
                                >
                                    <span
                                        className="material-symbols-outlined"
                                        style={{
                                            color:
                                                step.iconBg === "#333531"
                                                    ? step.accentColor
                                                    : "#def0a8",
                                        }}
                                        aria-hidden="true"
                                    >
                                        {step.icon}
                                    </span>
                                </div>
                            </div>
                            <Title
                                level={3}
                                style={stepTitleStyle(step.accentColor)}
                            >
                                {step.label}
                            </Title>
                            <Paragraph style={stepDescStyle}>
                                {step.description}
                            </Paragraph>
                        </a>
                    ))}
                </div>

                <div style={ctaWrapperStyle}>
                    <Button
                        style={ctaStyle}
                        size="large"
                        href={QUICKSTART_HREF}
                    >
                        OPEN THE QUICKSTART
                    </Button>
                </div>
            </div>
        </section>
    );
}
