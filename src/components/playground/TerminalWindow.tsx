import type { ReactNode } from "react";

const wrapperStyle: React.CSSProperties = {
    position: "relative",
    backgroundColor: "#292b26",
    borderRadius: "8px",
    padding: "1px",
    border: "1px solid rgba(70, 72, 62, 0.15)",
};

const bodyStyle: React.CSSProperties = {
    backgroundColor: "#0d0f0b",
    borderRadius: "7px",
    overflow: "hidden",
    position: "relative",
};

const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    backgroundColor: "#1a1c18",
};

const dotColors = [
    "rgba(255, 180, 171, 0.4)",
    "rgba(238, 189, 142, 0.4)",
    "rgba(189, 206, 137, 0.4)",
];

const dotStyle = (color: string): React.CSSProperties => ({
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: color,
});

const titleStyle: React.CSSProperties = {
    marginLeft: "12px",
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "11px",
    color: "rgba(199, 199, 186, 0.5)",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
};

const contentStyle: React.CSSProperties = {
    position: "relative",
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
            <div style={bodyStyle}>
                <div style={headerStyle}>
                    {dotColors.map((color, index) => (
                        <div
                            key={index}
                            style={dotStyle(color)}
                            aria-hidden="true"
                        />
                    ))}
                    <span style={titleStyle}>{title}</span>
                    {rightAction && (
                        <div style={{ marginLeft: "auto" }}>{rightAction}</div>
                    )}
                </div>
                <div style={contentStyle}>
                    {children}
                    <div style={crtOverlayStyle} aria-hidden="true" />
                </div>
            </div>
        </div>
    );
}
