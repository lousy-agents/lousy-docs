---
title: "Overview"
description: "What Lousy Agents is, who it's for, and how the three packages work together."
---

# Overview

Lousy Agents is a set of npm packages that give AI coding assistants the structure they need to produce consistent, production-grade code. Without clear constraints, AI agents guess — and often guess wrong. Lousy Agents provides the scaffolding, validation, and tooling they need to succeed.

**The core problem it solves:** managing your `.github/` and `.claude/` folders manually is tedious and error-prone. As your project grows, instruction files drift, skill definitions become stale, and hook configurations break silently. Lousy Agents automates the scaffolding and enforces quality automatically in CI.

## Who It's For

- **Software engineers** who want consistent AI output without babysitting every prompt
- **Team leads** standardizing AI tooling across a codebase or organization
- **Platform engineers** automating project setup in CI/CD pipelines

No prior AI agent experience required — just a willingness to structure your workflow.

## The Three Packages

Lousy Agents ships three focused npm packages. Most users start with the CLI and add the others only when they need them.

| Package | Entry point | Use it when |
| --------- | ----------- | ----------- |
| `@lousy-agents/cli` | `npx @lousy-agents/cli init` | You want the scaffolding CLI — **start here** |
| `@lousy-agents/mcp` | `npx -y -p @lousy-agents/mcp lousy-agents-mcp` | You want Lousy Agents tools available through an MCP client (VS Code, Cursor, Claude Desktop) |
| `@lousy-agents/agent-shell` | `npm install -g @lousy-agents/agent-shell` | You want a tamper-proof audit trail of AI agent tool usage |

**`@lousy-agents/cli` is the entry point.** It scaffolds your project, validates your agents and skills in CI, and generates GitHub Copilot environment setup workflows. The other two packages are optional add-ons.

**`@lousy-agents/mcp`** connects your AI editor to the same lint intelligence the CLI uses. When you ask your assistant to create or modify an agent, it validates instruction coverage and corrects itself before proposing code.

**`@lousy-agents/agent-shell`** wraps npm's `script-shell` to record structured telemetry for both npm script execution and Copilot lifecycle hooks — an audit trail that doesn't depend on agent self-reports.

## How It Works

Lousy Agents organizes AI behavior into three file types placed in well-known directories your AI assistant already reads:

- **Skills** — reusable instruction modules (`.github/skills/`, `.claude/skills/`)
- **Agents** — custom AI agent definitions (`.github/agents/`)
- **Instructions** — project-wide context files (`.github/copilot-instructions.md`, `CLAUDE.md`)

The CLI scaffolds these files for you, and the `lint` command validates them — catching missing frontmatter, broken hook configurations, and weak instruction quality before they cause problems.

## Recommended Reading Order

1. **[Quickstart](/docs/quickstart)** — Get up and running in three steps
2. **[`init` Command](/docs/init)** — Scaffold your first project
3. **[`lint` Command](/docs/lint)** — Validate agents, skills, and instructions in CI
4. **[MCP Server](/docs/mcp-server)** — Connect your AI editor via MCP
5. **[`copilot-setup` Command](/docs/copilot-setup)** — Generate a GitHub Copilot environment workflow
6. **[`new` Command](/docs/new)** — Create new skills and agents
7. **[Agent Shell](/docs/agent-shell)** — Add an audit trail for agent tool usage
