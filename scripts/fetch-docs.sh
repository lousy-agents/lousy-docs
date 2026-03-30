#!/usr/bin/env bash
set -euo pipefail
shopt -s nullglob

REPO_URL="https://github.com/zpratt/lousy-agents.git"
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
cp "${docs_files[@]}" "$DOCS_DIR/"

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
done

# Remove local image references that won't resolve in the docs site
for file in "$DOCS_DIR"/*.md; do
    sed -i.bak 's/!\[[^]]*\](\.\.\/media\/[^)]*)//g' "$file"
    rm "${file}.bak"
done

echo "Docs fetched and processed successfully into $DOCS_DIR"
