import { Flex, Typography } from "antd";

const { Text } = Typography;

const headerStyle: React.CSSProperties = {
    padding: "0 2rem",
    height: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 100,
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    backgroundColor: "rgba(26, 28, 24, 0.85)",
};

const logoStyle: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: "1.25rem",
    color: "#bdce89",
    letterSpacing: "-0.02em",
    cursor: "default",
    userSelect: "none",
};

const navLinkStyle: React.CSSProperties = {
    fontFamily: "'Manrope', sans-serif",
    fontSize: "0.875rem",
    color: "#e6ead8",
    opacity: 0.7,
    cursor: "pointer",
    textDecoration: "none",
    transition: "opacity 0.15s",
};

const tagStyle: React.CSSProperties = {
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "0.7rem",
    color: "#eebd8e",
    backgroundColor: "rgba(238, 189, 142, 0.1)",
    padding: "2px 6px",
    borderRadius: "3px",
    border: "1px dashed rgba(238, 189, 142, 0.3)",
    marginLeft: "0.5rem",
};

export function SiteHeader() {
    return (
        <header style={headerStyle}>
            <Flex align="center" gap={8}>
                <span style={logoStyle}>lousy-docs</span>
                <span style={tagStyle}>beta</span>
            </Flex>
            <Flex align="center" gap={32} component="nav">
                <a href="/" style={navLinkStyle}>
                    <Text style={{ ...navLinkStyle, color: "inherit" }}>
                        Home
                    </Text>
                </a>
                <a href="/docs" style={navLinkStyle}>
                    <Text style={{ ...navLinkStyle, color: "inherit" }}>
                        Docs
                    </Text>
                </a>
                <a
                    href="https://github.com/lousy-agents"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={navLinkStyle}
                >
                    <Text style={{ ...navLinkStyle, color: "inherit" }}>
                        GitHub
                    </Text>
                </a>
            </Flex>
        </header>
    );
}
