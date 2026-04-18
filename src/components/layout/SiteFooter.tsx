import { Flex } from "antd";

const footerStyle: React.CSSProperties = {
    backgroundColor: "#121410",
    padding: "2rem",
    marginTop: "auto",
};

const brandStyle: React.CSSProperties = {
    fontFamily: "monospace",
    fontWeight: 700,
    fontSize: "0.75rem",
    color: "#eebd8e",
    letterSpacing: "-0.02em",
    textTransform: "uppercase" as const,
};

const linkStyle: React.CSSProperties = {
    fontFamily: "monospace",
    fontSize: "0.75rem",
    color: "rgba(238, 189, 142, 0.5)",
    letterSpacing: "-0.02em",
    textTransform: "uppercase" as const,
    textDecoration: "none",
    transition: "color 0.15s",
};

const copyrightStyle: React.CSSProperties = {
    fontFamily: "monospace",
    fontSize: "10px",
    color: "rgba(238, 189, 142, 0.6)",
    textTransform: "uppercase" as const,
};

export function SiteFooter() {
    return (
        <footer style={footerStyle}>
            <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
                <span style={brandStyle}>LOUSY_AGENTS</span>
                <Flex gap={24} wrap="wrap">
                    <a href="/status" style={linkStyle}>
                        SYSTEM_STATUS
                    </a>
                    <a href="/security" style={linkStyle}>
                        SECURITY_LOG
                    </a>
                    <a
                        href="/feed"
                        style={{
                            ...linkStyle,
                            color: "#eebd8e",
                            textDecoration: "underline",
                            textUnderlineOffset: "4px",
                        }}
                    >
                        ENCRYPTED_FEED
                    </a>
                    <a href="/docs/quickstart" style={linkStyle}>
                        MANUAL
                    </a>
                </Flex>
                <span style={copyrightStyle}>
                    &copy;{new Date().getFullYear()} PATCHWORK PROTOCOL V.2.0.1
                </span>
            </Flex>
        </footer>
    );
}
