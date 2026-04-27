import { Typography } from "antd";
import type { ResolvedHomepageFeature } from "@/use-cases/select-available-features";

const { Title, Paragraph } = Typography;

const ACCENT_COLORS: Record<string, string> = {
    init: "#bdce89",
    new: "#a0d3c8",
    lint: "#eebd8e",
    "copilot-setup": "#cfb0e0",
    "mcp-server": "#8ec4ee",
    "agent-shell": "#d4c294",
};

const FALLBACK_ACCENT = "#bdce89";

const ICON_BY_ID: Record<string, string> = {
    init: "rocket_launch",
    new: "add_box",
    lint: "spellcheck",
    "copilot-setup": "settings_suggest",
    "mcp-server": "dns",
    "agent-shell": "terminal",
};

interface CoreModulesSectionProps {
    resolvedFeatures: readonly ResolvedHomepageFeature[];
}

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

const subheadingStyle: React.CSSProperties = {
    fontFamily: "'Manrope', sans-serif",
    fontSize: "1rem",
    color: "#c7c7ba",
    maxWidth: "40rem",
    textAlign: "center",
    marginTop: "0.5rem",
};

const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
    gap: "1.5rem",
};

const cardStyle = (accentColor: string): React.CSSProperties => ({
    backgroundColor: "#1e201c",
    padding: "2rem",
    borderTop: "1px solid rgba(70, 72, 62, 0.15)",
    borderRight: "1px solid rgba(70, 72, 62, 0.15)",
    borderBottom: "1px solid rgba(70, 72, 62, 0.15)",
    borderLeft: `4px solid ${accentColor}`,
    boxShadow: "0 4px 40px rgba(18, 20, 16, 0.06)",
    transition: "background-color 0.2s",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
});

const iconStyle = (accentColor: string): React.CSSProperties => ({
    fontSize: "2rem",
    color: accentColor,
    display: "block",
});

const titleStyle: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: "1.25rem",
    color: "#e3e3dc",
    letterSpacing: "-0.02em",
    margin: 0,
};

const descriptionStyle: React.CSSProperties = {
    fontFamily: "'Manrope', sans-serif",
    fontSize: "0.9375rem",
    color: "#c7c7ba",
    lineHeight: 1.7,
    margin: 0,
};

const linkStyle = (accentColor: string): React.CSSProperties => ({
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 600,
    fontSize: "0.875rem",
    color: accentColor,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    textDecoration: "none",
    marginTop: "auto",
    alignSelf: "flex-start",
});

export function CoreModulesSection({
    resolvedFeatures,
}: CoreModulesSectionProps) {
    return (
        <section style={sectionStyle} aria-label="Documented features">
            <div style={containerStyle}>
                <div style={headerStyle}>
                    <Title level={2} style={headingStyle}>
                        Documented Features
                    </Title>
                    <div style={underlineStyle} aria-hidden="true" />
                    <Paragraph style={subheadingStyle}>
                        Every card below maps 1:1 to a published Lousy Agents
                        docs page. If it's not documented, it isn't here.
                    </Paragraph>
                </div>

                <div style={gridStyle}>
                    {resolvedFeatures.map((feature) => {
                        const accentColor =
                            ACCENT_COLORS[feature.id] ?? FALLBACK_ACCENT;
                        const icon = ICON_BY_ID[feature.id] ?? "code";
                        return (
                            <article
                                key={feature.id}
                                style={cardStyle(accentColor)}
                                data-feature-id={feature.id}
                            >
                                <span
                                    className="material-symbols-outlined"
                                    style={iconStyle(accentColor)}
                                    aria-hidden="true"
                                >
                                    {icon}
                                </span>
                                <Title level={3} style={titleStyle}>
                                    {feature.title}
                                </Title>
                                <Paragraph style={descriptionStyle}>
                                    {feature.summary}
                                </Paragraph>
                                <a
                                    href={feature.docsHref}
                                    style={linkStyle(accentColor)}
                                    className="home-card-link"
                                    aria-label={`Learn more about ${feature.title}`}
                                >
                                    Learn more →
                                </a>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
