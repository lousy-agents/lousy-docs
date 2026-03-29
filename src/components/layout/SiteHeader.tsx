import { Flex } from "antd";
import { HEADER_HEIGHT_PX } from "@/lib/layout-constants";

const headerStyle: React.CSSProperties = {
    padding: "0 1.5rem",
    height: `${HEADER_HEIGHT_PX}px`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: "#121410",
};

const logoStyle: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 900,
    fontSize: "1.5rem",
    color: "#bdce89",
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    cursor: "default",
    userSelect: "none",
};

const activeLinkStyle: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: "0.875rem",
    color: "#bdce89",
    letterSpacing: "-0.02em",
    textTransform: "uppercase" as const,
    textDecoration: "none",
    borderBottom: "2px solid #bdce89",
    paddingBottom: "4px",
};

const linkStyle: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: "0.875rem",
    color: "rgba(189, 206, 137, 0.6)",
    letterSpacing: "-0.02em",
    textTransform: "uppercase" as const,
    textDecoration: "none",
    transition: "color 0.15s",
};

export function SiteHeader() {
    return (
        <header style={headerStyle}>
            <Flex align="center" gap={16}>
                <span style={logoStyle}>LOUSY_AGENTS</span>
            </Flex>
            <nav>
                <Flex align="center" gap={32}>
                    <a href="/protocol" style={activeLinkStyle}>
                        PROTOCOL
                    </a>
                    <a href="/terminal" style={linkStyle}>
                        TERMINAL
                    </a>
                    <a href="/patches" style={linkStyle}>
                        PATCHES
                    </a>
                    <a href="/docs" style={linkStyle}>
                        DOCS
                    </a>
                </Flex>
            </nav>
            <Flex align="center" gap={16}>
                <button
                    type="button"
                    style={{
                        background: "none",
                        border: "none",
                        padding: "8px",
                        color: "#bdce89",
                        cursor: "pointer",
                    }}
                    aria-label="Settings"
                >
                    <span className="material-symbols-outlined">settings</span>
                </button>
                <button
                    type="button"
                    style={{
                        background: "none",
                        border: "none",
                        padding: "8px",
                        color: "#bdce89",
                        cursor: "pointer",
                    }}
                    aria-label="Open terminal"
                >
                    <span className="material-symbols-outlined">terminal</span>
                </button>
            </Flex>
        </header>
    );
}
