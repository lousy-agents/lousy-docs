import { Flex, Typography } from "antd";

const { Text } = Typography;

const calloutStyle: React.CSSProperties = {
    padding: "1rem 1.25rem",
    borderRadius: "6px",
    backgroundColor: "rgba(189, 206, 137, 0.06)",
    border: "1px solid rgba(70, 72, 62, 0.15)",
    marginBottom: "1.5rem",
};

const linkStyle: React.CSSProperties = {
    color: "#bdce89",
    fontWeight: 600,
    textDecoration: "none",
};

const descriptionStyle: React.CSSProperties = {
    color: "#e6ead8",
    fontSize: "0.875rem",
    fontFamily: "'Manrope', sans-serif",
};

export function QuickstartCallout() {
    return (
        <Flex
            vertical
            gap={4}
            style={calloutStyle}
            className="quickstart-callout"
        >
            <Text style={descriptionStyle}>
                New to Lousy Agents?{" "}
                <a href="/docs/quickstart" style={linkStyle}>
                    Get up and running in three steps →
                </a>
            </Text>
        </Flex>
    );
}
