# Coding standards

- The required `format` and `lint` checks run the formatter and linter pinned here at exact versions, with a 100-column limit. Every dependency is pinned to an exact version.
- Deliver the issue's scope with the smallest change that meets it. Prefer deletion to new code.
- No new abstraction without two real call sites, and no caps, retries or fallbacks that no requirement names.
