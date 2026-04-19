export type NavLink = {
    readonly href: string;
    readonly label: string;
    readonly activePrefix?: string;
};

export const navLinks: readonly NavLink[] = [
    { href: "/docs/quickstart", label: "Docs", activePrefix: "/docs" },
    { href: "/playground", label: "Playground" },
];
