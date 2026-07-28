# Project

This project uses [Ponytail](https://github.com/DietrichGebert/ponytail) — a lazy senior dev ruleset for AI agents.

## How it works

`AGENTS.md` at the project root injects the Ponytail coding ladder into every AI agent session automatically. The rule: stop at the first rung that holds (YAGNI → reuse → stdlib → native → installed dep → one line → minimum that works).

**Result:** ~54% less generated code on average, ~20% cheaper token cost, ~27% faster.

## User preferences

- Write minimal code — always check the Ponytail ladder in `AGENTS.md` before writing anything.
- No boilerplate, no unused abstractions, no new dependencies unless necessary.
