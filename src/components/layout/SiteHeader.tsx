import { Flex } from "antd";
import { HEADER_HEIGHT_PX } from "@/lib/layout-constants";
import { isMacPlatform } from "@/lib/platform";

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
    textDecoration: "none",
    userSelect: "none",
};

const mobileLogoStyle: React.CSSProperties = {
    ...logoStyle,
    fontSize: "1.125rem",
    letterSpacing: "0.05em",
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

const iconButtonStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    padding: "8px",
    color: "#bdce89",
    cursor: "pointer",
};

const searchButtonStyle: React.CSSProperties = {
    ...iconButtonStyle,
    display: "flex",
    alignItems: "center",
    gap: "4px",
};

const shortcutBadgeStyle: React.CSSProperties = {
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "0.6875rem",
    color: "rgba(189, 206, 137, 0.5)",
    border: "1px solid rgba(70, 72, 62, 0.15)",
    borderRadius: "4px",
    padding: "1px 5px",
    lineHeight: 1.4,
    pointerEvents: "none",
};

const navLinks = [
    { href: "/protocol", label: "PROTOCOL" },
    { href: "/terminal", label: "TERMINAL" },
    { href: "/patches", label: "PATCHES" },
    { href: "/docs", label: "DOCS" },
] as const;

function isNavLinkActive(href: string, pathname: string): boolean {
    return pathname === href || pathname.startsWith(`${href}/`);
}

interface DesktopHeaderProps {
    currentPathname: string;
}

function openSearch() {
    window.dispatchEvent(new CustomEvent("open-search"));
}

function getShortcutLabel(): string {
    return isMacPlatform(navigator.userAgent) ? "⌘K" : "Ctrl+K";
}

function DesktopHeader({ currentPathname }: DesktopHeaderProps) {
    return (
        <header style={headerStyle}>
            <Flex align="center" gap={16}>
                <a href="/" style={logoStyle}>
                    LOUSY_AGENTS
                </a>
            </Flex>
            <nav aria-label="Site navigation">
                <Flex align="center" gap={32}>
                    {navLinks.map(({ href, label }) => {
                        const isActive = isNavLinkActive(href, currentPathname);
                        return (
                            <a
                                key={href}
                                href={href}
                                style={isActive ? activeLinkStyle : linkStyle}
                                aria-current={isActive ? "page" : undefined}
                            >
                                {label}
                            </a>
                        );
                    })}
                </Flex>
            </nav>
            <Flex align="center" gap={16}>
                <button
                    type="button"
                    style={searchButtonStyle}
                    aria-label="Search"
                    onClick={openSearch}
                >
                    <span
                        className="material-symbols-outlined"
                        aria-hidden="true"
                    >
                        search
                    </span>
                    <kbd style={shortcutBadgeStyle}>{getShortcutLabel()}</kbd>
                </button>
                <button
                    type="button"
                    style={iconButtonStyle}
                    aria-label="Settings"
                >
                    <span
                        className="material-symbols-outlined"
                        aria-hidden="true"
                    >
                        settings
                    </span>
                </button>
                <button
                    type="button"
                    style={iconButtonStyle}
                    aria-label="Open terminal"
                >
                    <span
                        className="material-symbols-outlined"
                        aria-hidden="true"
                    >
                        terminal
                    </span>
                </button>
            </Flex>
        </header>
    );
}

interface MobileHeaderProps {
    onMenuToggle?: () => void;
    isMenuOpen?: boolean;
}

export function MobileHeader({ onMenuToggle, isMenuOpen }: MobileHeaderProps) {
    return (
        <header style={headerStyle}>
            <Flex align="center" gap={8}>
                {onMenuToggle && (
                    <button
                        type="button"
                        style={iconButtonStyle}
                        aria-label="Toggle navigation"
                        aria-expanded={isMenuOpen ?? false}
                        onClick={onMenuToggle}
                    >
                        <span
                            className="material-symbols-outlined"
                            aria-hidden="true"
                        >
                            menu
                        </span>
                    </button>
                )}
                <a href="/" style={mobileLogoStyle}>
                    LOUSY_AGENTS
                </a>
            </Flex>
            <Flex align="center" gap={8}>
                <button
                    type="button"
                    style={iconButtonStyle}
                    aria-label="Search"
                    onClick={openSearch}
                >
                    <span
                        className="material-symbols-outlined"
                        aria-hidden="true"
                    >
                        search
                    </span>
                </button>
                <button
                    type="button"
                    style={iconButtonStyle}
                    aria-label="Settings"
                >
                    <span
                        className="material-symbols-outlined"
                        aria-hidden="true"
                    >
                        settings
                    </span>
                </button>
            </Flex>
        </header>
    );
}

interface SiteHeaderProps {
    isMobile: boolean;
    onMobileMenuToggle?: () => void;
    isMobileMenuOpen?: boolean;
    currentPathname?: string;
}

export function SiteHeader({
    isMobile,
    onMobileMenuToggle,
    isMobileMenuOpen,
    currentPathname = typeof window !== "undefined"
        ? window.location.pathname
        : "",
}: SiteHeaderProps) {
    if (isMobile) {
        return (
            <MobileHeader
                onMenuToggle={onMobileMenuToggle}
                isMenuOpen={isMobileMenuOpen}
            />
        );
    }

    return <DesktopHeader currentPathname={currentPathname} />;
}
