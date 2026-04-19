import { Typography } from "antd";

const { Title, Paragraph } = Typography;

interface ProcessStep {
    number: string;
    title: string;
    description: string;
    icon: string;
    accentColor: string;
    iconBg: string;
}

const steps: ProcessStep[] = [
    {
        number: "01",
        title: "Define the Spec",
        description:
            "Write rigorous, YAML-based definitions of agent boundaries, data inputs, and success criteria.",
        icon: "edit_note",
        accentColor: "#bdce89",
        iconBg: "#5f6e34",
    },
    {
        number: "02",
        title: "Mock the World",
        description:
            "Simulate all external API dependencies using our built-in mocking engine to test without costs.",
        icon: "data_object",
        accentColor: "#eebd8e",
        iconBg: "#333531",
    },
    {
        number: "03",
        title: "Atomic Deploy",
        description:
            "Push to production with a single command. The Protocol ensures 100% adherence to your specification.",
        icon: "rocket_launch",
        accentColor: "#bdce89",
        iconBg: "#5f6e34",
    },
];

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
    maxWidth: "32rem",
};

const stepsContainerStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "3rem",
    alignItems: "flex-start",
};

const stepStyle: React.CSSProperties = {
    flex: "1 1 220px",
};

const numberOverlayStyle: React.CSSProperties = {
    position: "relative",
    marginBottom: "2rem",
};

const bigNumberStyle: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 900,
    fontSize: "5rem",
    color: "rgba(70, 72, 62, 0.1)",
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
    textTransform: "uppercase" as const,
    marginBottom: "1rem",
});

const stepDescStyle: React.CSSProperties = {
    fontFamily: "'Manrope', sans-serif",
    fontSize: "1rem",
    color: "#c7c7ba",
    lineHeight: 1.7,
};

const connectorStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    paddingTop: "5rem",
    color: "rgba(70, 72, 62, 0.3)",
};

export function SpecDrivenSection() {
    return (
        <section style={sectionStyle} aria-label="Spec-Driven Development">
            <div style={bgDecorationStyle} aria-hidden="true" />
            <div style={containerStyle}>
                <div style={headerStyle}>
                    <Title level={2} style={headingStyle}>
                        Spec-Driven Development
                    </Title>
                    <Paragraph style={subtitleStyle}>
                        The three pillars of spec-driven development. No edge
                        cases, only expected outcomes.
                    </Paragraph>
                </div>

                <div style={stepsContainerStyle}>
                    {steps.map((step, index) => (
                        <div
                            key={step.number}
                            style={{
                                display: "contents",
                            }}
                        >
                            <div style={stepStyle}>
                                <div style={numberOverlayStyle}>
                                    <span
                                        style={bigNumberStyle}
                                        aria-hidden="true"
                                    >
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
                                    level={4}
                                    style={stepTitleStyle(step.accentColor)}
                                >
                                    {step.title}
                                </Title>
                                <Paragraph style={stepDescStyle}>
                                    {step.description}
                                </Paragraph>
                            </div>
                            {index < steps.length - 1 && (
                                <div style={connectorStyle} aria-hidden="true">
                                    <span className="material-symbols-outlined">
                                        arrow_forward
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
