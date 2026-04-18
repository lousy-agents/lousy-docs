import { Typography } from "antd";

const { Title, Paragraph, Text } = Typography;

interface Feature {
    icon: string;
    title: string;
    description: string;
    version: string;
    accentColor: string;
}

const features: Feature[] = [
    {
        icon: "terminal",
        title: "CLI Engine",
        description:
            "Low-latency command interface optimized for rapid agent orchestration and monitoring.",
        version: "v2.0.1 // system.bin",
        accentColor: "#bdce89",
    },
    {
        icon: "spellcheck",
        title: "Smart Linting",
        description:
            "Heuristic analysis of agent logic to prevent hallucination loops before they execute.",
        version: "v2.0.1 // core.lint",
        accentColor: "#eebd8e",
    },
    {
        icon: "dns",
        title: "MCP Server",
        description:
            "Multi-Agent Control Protocol server for horizontal scaling of cognitive workloads.",
        version: "v2.0.1 // net.mcp",
        accentColor: "#bdce89",
    },
    {
        icon: "shield",
        title: "Agent Shell",
        description:
            "Sandboxed runtime environment ensuring agents never leave the defined operational perimeter.",
        version: "v2.0.1 // os.shell",
        accentColor: "#eebd8e",
    },
];

const sectionStyle: React.CSSProperties = {
    padding: "4rem 1.5rem",
    backgroundColor: "#1a1c18",
};

const containerStyle: React.CSSProperties = {
    maxWidth: "80rem",
    margin: "0 auto",
};

const headerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "2.5rem",
};

const headingStyle: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: "1.875rem",
    letterSpacing: "-0.02em",
    color: "#e3e3dc",
    textTransform: "uppercase" as const,
    marginBottom: "0.5rem",
};

const underlineStyle: React.CSSProperties = {
    width: "6rem",
    height: "4px",
    backgroundColor: "#eebd8e",
    marginBottom: "1rem",
};

const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "1.5rem",
};

const cardStyle = (accentColor: string): React.CSSProperties => ({
    backgroundColor: "#1e201c",
    padding: "2rem",
    borderLeft: `4px solid ${accentColor}`,
    transition: "background-color 0.2s",
});

const iconStyle = (accentColor: string): React.CSSProperties => ({
    fontSize: "2.25rem",
    color: accentColor,
    marginBottom: "1.5rem",
    display: "block",
});

const titleStyle: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: "1.25rem",
    color: "#e3e3dc",
    letterSpacing: "-0.02em",
    textTransform: "uppercase" as const,
    marginBottom: "1rem",
};

const descriptionStyle: React.CSSProperties = {
    fontFamily: "'Manrope', sans-serif",
    fontSize: "0.875rem",
    color: "#c7c7ba",
    lineHeight: 1.7,
    marginBottom: "1.5rem",
};

const versionStyle: React.CSSProperties = {
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "10px",
    color: "#eebd8e",
    opacity: 0.5,
    textTransform: "uppercase" as const,
};

export function CoreModulesSection() {
    return (
        <section style={sectionStyle} aria-label="Core Modules">
            <div style={containerStyle}>
                <div style={headerStyle}>
                    <Title level={2} style={headingStyle}>
                        Core Modules
                    </Title>
                    <div style={underlineStyle} aria-hidden="true" />
                </div>

                <div style={gridStyle}>
                    {features.map((feature) => (
                        <article
                            key={feature.title}
                            style={cardStyle(feature.accentColor)}
                        >
                            <span
                                className="material-symbols-outlined"
                                style={iconStyle(feature.accentColor)}
                                aria-hidden="true"
                            >
                                {feature.icon}
                            </span>
                            <Title level={3} style={titleStyle}>
                                {feature.title}
                            </Title>
                            <Paragraph style={descriptionStyle}>
                                {feature.description}
                            </Paragraph>
                            <Text style={versionStyle}>{feature.version}</Text>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
