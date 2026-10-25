# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

The engineering standards live in `AGENTS.md` and are imported below, so this file carries only what is specific to Claude Code. Change a rule in `AGENTS.md`, never here.

@./AGENTS.md

## Instruction files Claude Code does not load for you

The five files under `.github/instructions/` are scoped by Copilot `applyTo` frontmatter, which Claude Code does not evaluate. They are not in your context unless you read them. Read the relevant one before working in the area it governs, because each carries the worked examples and edge cases that `AGENTS.md` only summarizes:

| File | Read it before |
|------|----------------|
| `.github/instructions/software-architecture.instructions.md` | Changing anything under `src/` — carries the layer rules, worked examples, and the full import matrix |
| `.github/instructions/test.instructions.md` | Writing or changing a test — carries the naming convention and the MSW/Chance worked example |
| `.github/instructions/visual-verification.instructions.md` | Any UI-layer change — carries the full Visual Debugging Protocol |
| `.github/instructions/pipeline.instructions.md` | Editing a GitHub Actions workflow |
| `.github/instructions/spec.instructions.md` | Writing or reviewing a feature spec |

`.github/agents/reviewer.md` defines a hostile architecture reviewer. It is a Copilot agent definition rather than a subagent you can invoke, so treat it as the standard your work will be judged against.

## MCP servers

Configured in `.vscode/mcp.json`: **context7** (library and API documentation — use it for anything version-specific rather than recalling an API), **playwright** (the browser tools the Visual Debugging Protocol depends on), **sequential-thinking**, and **lousy-agents**.

The Visual Debugging Protocol depends on Playwright MCP being reachable. If it is not, say so rather than declaring a UI task complete, because the protocol's whole point is that a screenshot is the only evidence a change rendered.
