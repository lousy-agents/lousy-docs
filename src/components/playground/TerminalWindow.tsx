import type { ReactNode } from "react";

const wrapperStyle: React.CSSProperties = {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    border: "1px solid rgba(70, 72, 62, 0.15)",
    flex: 1,
    minHeight: 0,
};

const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    height: "40px",
    backgroundColor: "#1a1c18",
    borderBottom: "1px solid rgba(70, 72, 62, 0.15)",
    flexShrink: 0,
};

const headerLeftStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
};

const dotColors = [
    "rgba(255, 180, 171, 0.4)",
    "rgba(238, 189, 142, 0.4)",
    "rgba(189, 206, 137, 0.4)",
];

const dotStyle = (color: string): React.CSSProperties => ({
    width: "8px",
    height: "8px",
    backgroundColor: color,
});

const titleStyle: React.CSSProperties = {
    marginLeft: "10px",
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "10px",
    color: "rgba(189, 206, 137, 0.5)",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    fontWeight: 700,
};

const contentStyle: React.CSSProperties = {
    position: "relative",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#0d0f0b",
    minHeight: 0,
    overflow: "hidden",
};

const crtOverlayStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    background: `
        linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.08) 50%),
        linear-gradient(90deg, rgba(255, 0, 0, 0.02), rgba(0, 255, 0, 0.008), rgba(0, 0, 255, 0.02))
    `,
    backgroundSize: "100% 4px, 3px 100%",
    pointerEvents: "none",
    zIndex: 1,
};

interface TerminalWindowProps {
    title: string;
    children: ReactNode;
    rightAction?: ReactNode;
}

export function TerminalWindow({
    title,
    children,
    rightAction,
}: TerminalWindowProps) {
    return (
        <div style={wrapperStyle}>
            <div style={headerStyle}>
                <div style={headerLeftStyle}>
                    {dotColors.map((color) => (
                        <div
                            key={color}
                            style={dotStyle(color)}
                            aria-hidden="true"
                        />
                    ))}
                    <span style={titleStyle}>{title}</span>
                </div>
                {rightAction && <div>{rightAction}</div>}
            </div>
            <div style={contentStyle}>
                {children}
                <div style={crtOverlayStyle} aria-hidden="true" />
            </div>
        </div>
    );
}
