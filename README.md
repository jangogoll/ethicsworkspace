# Ethical Decision Workspace (MVP)

A calm, text-first prototype that helps teams document ethically relevant software decisions without automating moral judgment.

## Run locally

No build tooling is required.

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## What is implemented

- 6-screen flow:
  1. Landing
  2. Context & Decision
  3. Stakeholders
  4. Values & Tensions
  5. Deliberation (Options A/B)
  6. Decision Summary
- Sidebar orientation for steps 2-6.
- Header with workspace title + status badge.
- Progress indicator `Step X / 5`.
- Back/Continue navigation.
- Auto-save in local state + `localStorage`.
- Final summary rendering and copy-as-Markdown button.
- Responsibility acknowledgment checkbox is required before save.
- Save sets status to `Decided` and stores a timestamped log entry in localStorage.

## Persistence model

The app stores data in browser localStorage via `src/utils/storage.js`.

- `ethical-workspace-current`: current workspace object.
- `ethical-workspace-log`: list of saved decision records (`savedAt`, `workspaceId`, `summary`).

## Intentionally out of scope

- No authentication, backend, or external APIs.
- No ethics scores or normative recommendation engine.
- No multi-user collaboration.
- No PDF export (MVP only includes Markdown copy to clipboard).

## Structure

- `src/components/StepSidebar.js`
- `src/pages/*` for each step view
- `src/utils/storage.js`
- `src/main.js` as flow/state controller
