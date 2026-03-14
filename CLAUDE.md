# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## gstack

Install skills before contributing:

```bash
git clone https://github.com/garrytan/gstack.git ~/.claude/skills/gstack && cd ~/.claude/skills/gstack && ./setup
```

**Web browsing**: Always use the `/browse` skill for all web browsing. Never use `mcp__claude-in-chrome__*` tools.

**Available skills**:
- `/plan-ceo-review` — review a plan from a CEO/product perspective
- `/plan-eng-review` — review a plan from an engineering perspective
- `/review` — code review
- `/ship` — ship a change (commit, push, PR)
- `/browse` — web browsing
- `/qa` — QA testing
- `/setup-browser-cookies` — set up browser cookies for authenticated browsing
- `/retro` — retrospective
