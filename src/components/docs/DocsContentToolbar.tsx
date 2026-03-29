import { Flex } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";

interface DocsContentToolbarProps {
    currentSlug: string;
    fetchMarkdown?: (url: string) => Promise<string>;
    copyToClipboard?: (text: string) => Promise<void>;
}

const toolbarStyle: React.CSSProperties = {
    justifyContent: "flex-end",
    marginBottom: "0.5rem",
};

const linkStyle: React.CSSProperties = {
    fontFamily: "'Manrope', sans-serif",
    fontSize: "0.75rem",
    color: "rgba(189, 206, 137, 0.6)",
    textDecoration: "none",
    padding: "0.25rem 0.5rem",
    borderRadius: "4px",
    border: "1px solid rgba(70, 72, 62, 0.3)",
    transition: "color 0.15s, border-color 0.15s",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.25rem",
};

const buttonStyle: React.CSSProperties = {
    ...linkStyle,
    cursor: "pointer",
    backgroundColor: "transparent",
};

async function defaultFetchMarkdown(url: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch markdown: ${response.status}`);
    }
    return response.text();
}

async function defaultCopyToClipboard(text: string): Promise<void> {
    await navigator.clipboard.writeText(text);
}

export function DocsContentToolbar({
    currentSlug,
    fetchMarkdown = defaultFetchMarkdown,
    copyToClipboard = defaultCopyToClipboard,
}: DocsContentToolbarProps) {
    const [copied, setCopied] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const mountedRef = useRef(true);

    useEffect(() => {
        return () => {
            mountedRef.current = false;
            if (timerRef.current !== null) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const markdownUrl = `/docs/${currentSlug}.md`;

    const handleCopy = useCallback(async () => {
        try {
            const text = await fetchMarkdown(markdownUrl);
            if (!mountedRef.current) return;
            await copyToClipboard(text);
            if (!mountedRef.current) return;
            if (timerRef.current !== null) {
                clearTimeout(timerRef.current);
            }
            setCopied(true);
            timerRef.current = setTimeout(() => setCopied(false), 2000);
        } catch {
            // Silently fail — toolbar is a progressive enhancement
        }
    }, [fetchMarkdown, copyToClipboard, markdownUrl]);

    return (
        <Flex style={toolbarStyle} gap={8} align="center">
            <a
                href={markdownUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle}
                aria-label="View Markdown"
            >
                View Markdown
            </a>
            <button
                type="button"
                onClick={handleCopy}
                style={buttonStyle}
                aria-label={copied ? "Copied" : "Copy Markdown"}
            >
                {copied ? "Copied!" : "Copy Markdown"}
            </button>
        </Flex>
    );
}
