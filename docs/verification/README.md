# Verification evidence

Prepared in CH-P0-002 per [07 Prompt B and definition of done](../07-implementation-plan.md). See [root instructions](../../AGENTS.md) and [current 002 review](../implementation/ch-p0-002-review.md). No application tests or CI results exist merely because this directory exists.

For each authorized story, record evidence in a story-named Markdown file: scope/requirements and environment/commit if known; dependency/gate evidence; exact commands and observed exit/results; meaningful positive/error/security checks; screenshots or sanitized logs when applicable; limitations and NOT RUN reasons; unresolved findings and reviewer/PR evidence when actually available. Never fabricate artifacts, remote URLs, approvals or passing tests.

Run checks appropriate to changed behavior. Use actual repository scripts once present; mocked unit success does not prove database locking, persisted financial effects or browser session behavior. Keep fixtures synthetic; redact cookies, tokens, DSNs, passwords, personal data and raw provider payloads from all artifacts. Do not use production credentials for tests.

Documentation-only work can record file/link/inventory/diff checks. Product implementation, migrations, deployment and restore exercises need their own scope authorization and gate evidence. Evidence preparation alone does not mark a story DONE or authorize the next story.
