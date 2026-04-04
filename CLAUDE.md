# Citadel — Remote Control for Gas Town

## What is Citadel?

Citadel is a browser-based control plane UI for Gas Town. Think of it as a more robust, prettier version of `gt feed` — the terminal TUI dashboard that shows agent activity, convoy status, and event streams — but running in a web browser with full interactivity.

Like `gt feed`, Citadel shows:
- Agent states and activity (workers, deacon, witness, dogs)
- Convoy progress and tracked issues
- Real-time event updates via SSE

Unlike `gt feed`, Citadel adds:
- **Mail management** — send messages, compose, reply, thread view
- **Mayor chat** — direct messaging interface to the Mayor
- **Bead explorer** — browse, filter, sling beads to agents
- **Rig management** — boot/start/stop rigs, add new rigs
- **Worker detail** — deep dive with session preview, nudge, sling, molecule progress
- **Refinery visualization** — merge queue with CI status
- **Molecule DAG** — visual step graph with dependency arrows
- **Formula catalog** — browse available workflow formulas
- **Wisp explorer** — ephemeral bead visibility

Citadel is a **pure HTTP client**. It does not replace gt, beads, Dolt, mail routing, or tmux. It calls Gas Town's dashboard API (`gt dashboard`) from the browser.

## Tech Stack

- **Framework:** React 19 + Vite + TypeScript
- **UI:** shadcn/ui (Radix) + Tailwind CSS, dark/light theme
- **State:** Zustand (normalized entity store)
- **Data Fetching:** TanStack Query with SSE-driven invalidation
- **Validation:** Zod (runtime schema validation on all API responses)
- **Routing:** React Router v7
- **DAG Viz:** @xyflow/react (React Flow)
- **Testing:** Vitest + React Testing Library + MSW

## Architecture

Feature-sliced: each feature owns its page, components, and query hooks. Shared API client and normalized store at the top.

```
src/
  api/          # Client, Zod schemas, types
  store/        # Zustand normalized store
  hooks/        # Shared hooks (useSSE, usePolling)
  features/     # One folder per feature (mail, workers, beads, etc.)
  components/   # Shared UI (Layout, Sidebar, RigFilter, StatusBadge, etc.)
  lib/          # Utilities
```

## Data Flow

```
SSE (/api/events) → hash change → TanStack Query invalidation → refetch → Zod parse → store → UI
Mutations → POST → await response → refetch → Zod parse → store → UI (pessimistic, no optimistic updates)
```

## API Contract

Citadel consumes the Gas Town dashboard API. It does NOT modify the gastown codebase. All endpoints are defined in the design spec at `docs/superpowers/specs/2026-04-04-citadel-design.md`.

Key endpoints:
- `GET /api/crew`, `/api/ready`, `/api/mail/*`, `/api/events`, `/api/session/preview`
- `POST /api/run` (execute allowlisted gt commands with `--json`)
- `POST /api/nudge`, `/api/mail/send`, `/api/issues/*`

## Build & Test

```bash
npm install
npm run dev          # Dev server
npm run build        # Production build
npx vitest run       # Run tests
npx tsc --noEmit     # Type check
```

## Phased Delivery

See `docs/superpowers/plans/2026-04-04-citadel.md` for the full 14-phase plan.

- Phase 1: Foundation (scaffold, API client, store, SSE, layout, settings) ✅
- Phase 2: Mail ✅
- Phase 3: Mayor Chat ✅
- Phase 4-14: In progress

## Hard Boundaries

- No fake data in production paths
- No bypassing CSRF validation
- No shelling out to `gt` (browser → HTTP only)
- No optimistic UI updates
- No changes to the gastown repo
- Token never logged or leaked
