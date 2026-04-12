#!/usr/bin/env bash
set -euo pipefail
shopt -s nullglob

if [ -n "${DOCS_GITHUB_TOKEN:-}" ]; then
    REPO_URL="https://x-access-token:${DOCS_GITHUB_TOKEN}@github.com/zpratt/lousy-agents.git"
else
    REPO_URL="https://github.com/zpratt/lousy-agents.git"
fi
DOCS_REF="${DOCS_REF:-}"
DOCS_DIR="src/content/docs"
TEMP_DIR=$(mktemp -d "${TMPDIR:-/tmp}/lousy-docs.XXXXXX")

cleanup() {
    rm -rf "$TEMP_DIR"
}
trap cleanup EXIT

on_network_error() {
    echo "ERROR: Failed to fetch docs from the lousy-agents repository." >&2
    echo "       Check your network connection or GitHub availability." >&2
    echo "       For reproducible builds, set DOCS_REF=<tag|branch>." >&2
}
trap on_network_error ERR

echo "Fetching docs from lousy-agents repository..."

if [ -n "$DOCS_REF" ]; then
    git clone --depth 1 --quiet "$REPO_URL" "$TEMP_DIR/lousy-agents"
    git -C "$TEMP_DIR/lousy-agents" fetch --depth 1 origin -- "$DOCS_REF"
    git -C "$TEMP_DIR/lousy-agents" checkout --quiet FETCH_HEAD
else
    git clone --depth 1 --quiet "$REPO_URL" "$TEMP_DIR/lousy-agents"
fi

# Git operations succeeded; remove network-specific ERR trap before file processing.
# set -euo pipefail still exits the script on any subsequent failure.
trap - ERR

rm -rf "$DOCS_DIR"
mkdir -p "$DOCS_DIR"
docs_files=("$TEMP_DIR/lousy-agents/docs/"*.md)
if [ "${#docs_files[@]}" -eq 0 ]; then
    echo "ERROR: No markdown files found in upstream docs/ directory." >&2
    exit 1
fi

# Copy files with lowercase filenames for consistent URL routing across all platforms
for src_file in "${docs_files[@]}"; do
    filename=$(basename "$src_file")
    lowercase_filename=$(echo "$filename" | tr '[:upper:]' '[:lower:]')
    cp "$src_file" "$DOCS_DIR/$lowercase_filename"
done

# Copy package-level README files as standalone docs
agent_shell_readme="$TEMP_DIR/lousy-agents/packages/agent-shell/README.md"
if [ -f "$agent_shell_readme" ]; then
    cp "$agent_shell_readme" "$DOCS_DIR/agent-shell.md"
else
    echo "WARNING: agent-shell README not found at packages/agent-shell/README.md" >&2
fi

inject_frontmatter() {
    local file="$1"
    local filename
    filename=$(basename "$file" .md)

    local first_line
    first_line=$(head -n 1 "$file")
    if [ "$first_line" = "---" ]; then
        return
    fi

    local title
    title=$(grep -m 1 '^# ' "$file" | sed 's/^# //' | sed 's/`//g') || true

    if [ -z "$title" ]; then
        title="$filename"
    fi

    local description
    description=$(awk '/^[^#]/ && NF {print; exit}' "$file" | sed 's/^ *//') || true
    if [ -z "$description" ]; then
        description="Documentation for $filename"
    fi

    # Escape backslashes and double quotes for valid YAML
    title=$(printf '%s' "$title" | sed 's/\\/\\\\/g; s/"/\\"/g')
    description=$(printf '%s' "$description" | sed 's/\\/\\\\/g; s/"/\\"/g')

    local tmpfile
    tmpfile=$(mktemp "${TMPDIR:-/tmp}/inject_frontmatter.XXXXXX")
    {
        echo "---"
        echo "title: \"$title\""
        echo "description: \"$description\""
        echo "---"
        echo ""
        cat "$file"
    } > "$tmpfile"
    mv "$tmpfile" "$file"
}

for file in "$DOCS_DIR"/*.md; do
    inject_frontmatter "$file"

    # Remove local image references that won't resolve in the docs site
    # Convert relative .md links to absolute /docs/ paths for proper routing
    # e.g., [init](init.md) -> [init](/docs/init)
    # The character class [a-z0-9_-] intentionally excludes ':', '.', and '/' so that
    # absolute URLs (e.g. https://example.com/file.md) and relative paths with directories
    # (e.g. ../other/file.md) are never matched or transformed.
    sed -i.bak -E \
        -e 's/!\[[^]]*\]\(\.\.\/media\/[^)]*\)//g' \
        -e 's/\]\(([a-z0-9_-]+)\.md\)/](\/docs\/\1)/g' \
        "$file"
    rm "${file}.bak"
done

# Copy local docs (authored in this repo) into the content directory.
# These already have frontmatter, so no injection is needed.
LOCAL_DOCS_DIR="src/content/local-docs"
if [ -d "$LOCAL_DOCS_DIR" ]; then
    local_files=("$LOCAL_DOCS_DIR/"*.md)
    if [ "${#local_files[@]}" -gt 0 ]; then
        for src_file in "${local_files[@]}"; do
            filename=$(basename "$src_file")
            lowercase_filename=$(echo "$filename" | tr '[:upper:]' '[:lower:]')
            cp "$src_file" "$DOCS_DIR/$lowercase_filename"
        done
        echo "Copied ${#local_files[@]} local doc(s) into $DOCS_DIR"
    fi
fi

echo "Docs fetched and processed successfully into $DOCS_DIR"
