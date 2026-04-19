import { Drawer, Flex } from "antd";
import { navLinks } from "@/lib/nav-links";

interface MobileNavDrawerProps {
    open: boolean;
    onClose: () => void;
}

const drawerBodyStyle: React.CSSProperties = {
    backgroundColor: "#121410",
    padding: "1rem",
    overscrollBehavior: "contain",
};

const drawerHeaderStyle: React.CSSProperties = {
    backgroundColor: "#121410",
    borderBottom: "1px solid rgba(70, 72, 62, 0.15)",
};

const navLinkStyle: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: "1rem",
    color: "rgba(189, 206, 137, 0.6)",
    letterSpacing: "-0.02em",
    textTransform: "uppercase",
    textDecoration: "none",
    padding: "0.75rem 0.5rem",
    display: "block",
    transition: "color 0.15s",
};

export function MobileNavDrawer({ open, onClose }: MobileNavDrawerProps) {
    return (
        <Drawer
            placement="left"
            open={open}
            onClose={onClose}
            size="default"
            styles={{
                body: drawerBodyStyle,
                wrapper: { maxWidth: "280px" },
                header: drawerHeaderStyle,
            }}
            title="Site navigation"
        >
            <nav aria-label="Site navigation">
                <Flex vertical gap={4}>
                    {navLinks.map(({ href, label }) => (
                        <a key={href} href={href} style={navLinkStyle}>
                            {label}
                        </a>
                    ))}
                </Flex>
            </nav>
        </Drawer>
    );
}
