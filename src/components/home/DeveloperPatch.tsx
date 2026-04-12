import { Typography } from "antd";

const { Paragraph, Text } = Typography;

const sectionStyle: React.CSSProperties = {
    padding: "4rem 1.5rem",
    maxWidth: "56rem",
    margin: "0 auto",
};

const patchStyle: React.CSSProperties = {
    backgroundColor: "rgba(100, 66, 29, 0.2)",
    borderLeft: "4px dashed #eebd8e",
    padding: "2rem",
    display: "flex",
    gap: "1.5rem",
    alignItems: "flex-start",
};

const mascotStyle: React.CSSProperties = {
    width: "3rem",
    height: "3rem",
    flexShrink: 0,
    filter: "grayscale(1)",
};

const headingStyle: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    color: "#eebd8e",
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
    marginBottom: "0.5rem",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.875rem",
};

const contentStyle: React.CSSProperties = {
    fontFamily: "'Manrope', sans-serif",
    fontSize: "0.875rem",
    color: "#dfaf81",
    lineHeight: 1.7,
    fontStyle: "italic",
};

const codeStyle: React.CSSProperties = {
    fontFamily: "'Courier New', Courier, monospace",
    color: "#bdce89",
};

export function DeveloperPatch() {
    return (
        <section style={sectionStyle} aria-label="Developer Patch">
            <div style={patchStyle}>
                <picture>
                    <source
                        type="image/webp"
                        srcSet="/mascot-48w.webp 48w, /mascot-96w.webp 96w"
                        sizes="48px"
                    />
                    <img
                        alt="Lousy Agent icon"
                        src="/mascot-320w.jpg"
                        width={48}
                        height={48}
                        loading="lazy"
                        decoding="async"
                        style={mascotStyle}
                    />
                </picture>
                <div>
                    <Text style={headingStyle}>
                        <span
                            className="material-symbols-outlined"
                            style={{ fontSize: "1rem" }}
                            aria-hidden="true"
                        >
                            lightbulb
                        </span>
                        Developer Patch v.0.9
                    </Text>
                    <Paragraph style={contentStyle}>
                        &ldquo;If your agent starts repeating itself, it&rsquo;s
                        likely a logic feedback loop. Use the{" "}
                        <span style={codeStyle}>--break-loop</span> flag in the
                        CLI to forcefully reset the cognitive buffer. We learned
                        this the hard way in the &rsquo;79 simulation.&rdquo;
                    </Paragraph>
                </div>
            </div>
        </section>
    );
}
