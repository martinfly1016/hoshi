# Agent Workflow

This project uses a main-agent coordination model with specialist sub-agents for execution when work can be split safely.

## Main Agent

Responsibilities:

- Clarify product intent and acceptance criteria.
- Split work into independent tracks when useful.
- Coordinate specialist sub-agents and avoid overlapping file ownership.
- Keep `WORKLOG.md` updated with decisions, versions, links, commits, and lessons learned.
- Review sub-agent outputs before merging or publishing.
- Run final verification and report progress back to the Discord channel.

The main agent remains accountable for release quality and user-facing communication.

## Specialist Tracks

### Dev Agent

Scope:

- Implement frontend or calculation changes in assigned files.
- Keep changes scoped to the requested task.
- Report changed files, verification steps, and risks.

Typical files:

- `site3/*.html`
- `site3/*.jsx`
- `site3/*.css`
- `site3/calculation-*.js`

### QA Agent

Scope:

- Verify PC and mobile browser behavior.
- Reproduce reported issues with screenshots or concrete steps.
- Check that user-facing pages still load and calculate.
- Compare new page versions against archived versions when relevant.

Expected evidence:

- Browser viewport used.
- Input case used.
- Result observed.
- Screenshot path or concise findings.

### UI/UE Agent

Scope:

- Improve layout, visual hierarchy, readability, and responsive behavior.
- Preserve domain-specific structures such as four pillars in one horizontal row.
- Check text fit, spacing, touch targets, and mobile navigation.

Expected output:

- Design rationale.
- Affected breakpoints.
- Before/after risks.

### Algorithm Agent

Scope:

- Work on Bazi / Shichusuimei calculation correctness.
- Validate true solar time, late Zi hour rules, solar-term boundaries, hidden stems, ten gods, Na Yin, void branches, terrain, and related fields.
- Keep algorithm changes separate from user-interface presentation unless a display field contract changes.

Expected output:

- Test cases and expected values.
- Rule assumptions.
- Source or reasoning for calculation choices.

## Logs

- Project-level log: `WORKLOG.md`
- Specialist notes may be added under `agent-logs/` when a task is substantial:
  - `agent-logs/dev/YYYY-MM-DD.md`
  - `agent-logs/qa/YYYY-MM-DD.md`
  - `agent-logs/ui-ue/YYYY-MM-DD.md`
  - `agent-logs/algorithm/YYYY-MM-DD.md`

Short, low-risk tasks can be logged only in `WORKLOG.md`.

## Release Rules

- User-facing page changes must keep a previous version available under `site3/archive/`.
- Each release must add a row to the version table in `WORKLOG.md`.
- User-facing UI changes must be checked in both desktop and smartphone browser viewports.
- Algorithm changes must identify whether user-facing display fields need updates.
- GitHub Pages publishes from `gh-pages`; source changes are made on `main`.
