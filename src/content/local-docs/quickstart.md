---
title: "Quickstart"
description: "Get up and running with Lousy Agents in three steps: scaffold your project, automate your quality checks, and connect your AI assistant."
---

# Quickstart

Get up and running with Lousy Agents in three steps: scaffold your project, automate your quality checks, and connect your AI assistant.

## 1. Scaffold your project (`init`)

The fastest way to start building with Lousy Agents is the `init` command. It sets up the recommended directory structure, base agents, and initial skills for your workspace.

```bash
npx @lousy-agents/cli@latest init
```

**What this does:**

- Creates the necessary configuration files.
- Scaffolds a starting architecture (agents, skills, instructions).
- Prepares your project for immediate AI-assisted development.

> For full details on project types and options, see the [init Command](/docs/init) documentation.

## 2. Enforce quality in CI (`lint`)

Once your project is structured, keep your agents and instructions healthy as your codebase evolves. The `lint` command catches broken hooks, orphaned skills, and poor instruction quality.

To run it automatically on GitHub, add it to your CI pipeline:

```yaml
name: Lousy Lint
on: [push, pull_request]

jobs:
  lint-agents:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd  # v6.0.2
      - name: Lousy Agents Lint
        uses: zpratt/lousy-agents@e4d7eea8ebe635b34c99b118936b95bdaab36411  # v5.9.4
```

> For all available lint rules and CLI options, see the [lint Command](/docs/lint) documentation.

## 3. Supercharge your assistant (MCP Server)

Lousy really shines when your AI assistant understands your custom architecture. By attaching the Lousy MCP Server to your editor (like Cursor or Claude Desktop), the AI can actively read and validate your workspace.

Add this to your MCP configuration:

```json
{
  "servers": {
    "lousy-agents": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "-p", "@lousy-agents/mcp", "lousy-agents-mcp"]
    }
  }
}
```

**Why this matters:**
The MCP server exposes Lousy's internal `lint` intelligence directly to your AI. When you ask your assistant to create or modify an agent, it will automatically validate instruction coverage, analyze instruction quality, and correct itself before proposing code.

> For setup details and supported editors, see the [MCP Server](/docs/mcp-server) documentation.
