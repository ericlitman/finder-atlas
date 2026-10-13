# Agent guide

`AGENTS.md` and `CLAUDE.md` are the same file. Change both together.

- Work belongs to Linear team `FINDER` (`.linear.toml`). A branch name includes its issue ID, and a PR body includes `Linear: FINDER-<n>`.
- Open PRs ready for review. Unfret reviews each head at push and publishes its verdict once the checks listed in `.github/unfret.json` pass; comment `@unfret review` when no `Unfret` check appears. Mergify merges once those checks and `Unfret` pass.
- `babysit-pr` watches a PR and reports what blocks it.
- Code is written and reviewed against `CODING_STANDARDS.md`. `REVIEW.md` records what a reviewer cannot see in a diff.
