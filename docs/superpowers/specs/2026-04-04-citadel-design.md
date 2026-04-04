# Citadel Design Spec

**Tagline:** Citadel — remote control for Gas Town.

Citadel is a browser-based control plane UI for Gas Town. It is a pure HTTP client that consumes Gas Town's dashboard API (`gt dashboard`). It does not replace gt, beads, Dolt, mail routing, or tmux — it calls them through the existing API surface.

---

## Stack

| Layer | Choice |
|-------|--------|
| Framework | React 19 + Vite + TypeScript |
| UI Components | shadcn/ui (Radix primitives) + Tailwind CSS |
| State | Zustand (normalized entity store) |
| Data Fetching | TanStack Query (caching, refetch, invalidation) |
| Schema Validation | Zod (runtime validation, type inference via `z.infer`) |
| Routing | React Router v7 |
| Theme | Dark + Light toggle (shadcn native, `next-themes`) |
| Layout | Collapsible sidebar, comfortable density (Linear-style) |
| DAG Visualization | @xyflow/react (React Flow) |
| Testing | Vitest, React Testing Library, MSW |

## Architecture: Feature-Sliced

```
src/
  api/                  # API client, Zod schemas, types (shared)
    client.ts           # fetch wrapper, token, base URL
    schemas/            # Zod schemas per endpoint
    types.ts            # z.infer'd TypeScript types
  store/                # Zustand normalized store
    index.ts
    slices/             # entity slices (workers, beads, mail, etc.)
  hooks/                # Shared hooks (useSSE, usePolling, useApiRun)
  features/
    mayor-chat/         # Feature 1: Mayor messaging
    workers/            # Feature 2: Worker dashboard
    infrastructure/     # Feature 3: Deacon, Witness, Dogs
    beads/              # Feature 4: Bead explorer
    rigs/               # Feature 5: Rig management
    worker-detail/      # Feature 6: Worker detail page
    refinery/           # Feature 7: Refinery visualization
    mail/               # Feature 8: Full mail tab
    convoys/            # Feature 9: Convoy tracker
    hooks-viz/          # Feature 10: Hook visualization
    molecules/          # Feature 11: Molecule & formula visualization
    wisps/              # Feature 12: Wisp explorer
  components/           # Shared UI (Layout, Sidebar, ConfirmDialog, etc.)
  lib/                  # Utilities (formatters, time helpers)
  App.tsx
  main.tsx
```

Each feature folder contains: `page.tsx`, `components/`, `hooks.ts` (TanStack Query hooks). Components start in the feature that creates them and get promoted to `src/components/` when a second feature needs them.

---

## Data Flow

### Real-time sync
```
SSE (/api/events) → hash change detected → TanStack Query invalidation → targeted refetch → Zod parse → Zustand store → UI
```

### Polling fallback (SSE disconnected)
```
10s interval → refetch active queries → Zod parse → Zustand store → UI
```

### Mutations (pessimistic)
```
User action → confirm dialog (if required) → POST → await response → refetch entity → Zod parse → Zustand store → UI
```

### API client
- Structured endpoints: direct fetch with typed Zod response
- Commands: `POST /api/run { command, confirmed? }` → parse output as JSON → Zod validate
- All POSTs include `X-Dashboard-Token` header

---

## SSE + Query Orchestration

- **useSSE hook** — connects to `/api/events`, debounces signals (200ms), invalidates active TanStack queries on hash change
- **Reconnect** — exponential backoff (1s → 2s → 4s → ... → 30s cap), full baseline refetch on reconnect
- **Polling fallback** — 10s interval, activates only when SSE disconnected, stops when SSE reconnects
- **Dedup** — duplicate hashes ignored, TanStack Query handles refetch dedup natively

---

## Normalized Store (Zustand)

```typescript
{
  workers: Map<"rig/name", Worker>
  beads: Map<"bead-id", Bead>
  mail: Map<"msg-id", MailMessage>
  threads: Map<"thread-id", MailThread>
  rigs: Map<"rig-name", Rig>
  convoys: Map<"convoy-id", Convoy>
  molecules: Map<"mol-id", Molecule>
  hooks: Map<"bead-id", Hook>
  formulas: Map<"name", Formula>
  wisps: Map<"wisp-id", Wisp>
}
```

**Update rule:** Latest full response wins. No partial merges. Full replace on refetch.

---

## Auth & Config

- **Connection config** — Base URL + CSRF token, stored in `localStorage`
- **Token input** — Settings page, user pastes from `gt dashboard` output
- **All POSTs** include `X-Dashboard-Token` header
- **Token never logged**, never in URLs, never in error messages
- **403 handling** — clear error: "Invalid or missing dashboard token — copy from Gas Town dashboard and paste into Citadel settings."

---

## Feature → Route Map

| Phase | Feature | Route | Key Components | Primary Data Sources |
|-------|---------|-------|----------------|---------------------|
| 1 | Connection + Config | `/settings` | ConnectionForm, TokenInput | `GET /api/commands` |
| 2 | Mail | `/mail` | InboxList, ThreadView, ComposeForm | `/api/mail/*` |
| 3 | Mayor Chat | `/mayor` | ChatThread, ComposeBox | `/api/mail/*` filtered to mayor/ |
| 4 | Workers | `/workers` | WorkerGrid, WorkerCard, RigFilter, SessionPreview | `/api/crew`, `polecat list`, `/api/session/preview` |
| 5 | Infrastructure | `/infra` | DeaconCard, WitnessCard, DogList, HealthBar | `deacon status`, `witness status`, `dog list` |
| 6 | Rigs | `/rigs` | RigList, RigActions, SetupWizard | `rig list`, setup endpoints |
| 7 | Beads | `/beads` | BeadTable, BeadDetail, SlingDialog, FilterBar | `/api/ready`, `/api/issues/*`, `sling` |
| 8 | Worker Detail | `/workers/:id` | WorkerHeader, HookPanel, MolProgress, SessionPreview, NudgeBox, SlingPanel, MailSection | `polecat status`, `crew status`, `hook show/status`, `mol status`, `/api/nudge` |
| 9 | Convoys | `/convoys` | ConvoyList, ConvoyDetail, ProgressBar, IssueTable | `convoy list`, `convoy status` |
| 10 | Hooks | `/hooks` | HookTable, StaleIndicator, HookDetail | `hooks list`, `hook status` |
| 11 | Molecules & Formulas | `/molecules`, `/formulas` | MoleculeList, DAGView, FormulasCatalog, FormulaDetail | `mol status/progress/dag`, `formula list/show` |
| 12 | Refinery | `/refinery` | RefineryCard, QueueList, MRStatusBadge | `refinery status/queue/ready/blocked` |
| 13 | Wisps | `/wisps` | WispList, WispBadge, CategoryFilter, WispHealth | `wisp list` |
| 14 | Polish | — | Mobile layout, SSE reconnect, error states, README | — |

---

## Shared Components (promoted as needed)

RigFilter, StatusBadge, ConfirmDialog, WispBadge, SlingDialog, SessionPreview, ProgressBar, TimeAgo, ErrorBanner

---

## DAG Visualization (Feature 11)

- **Rendering** — SVG-based with `@xyflow/react` (React Flow) for tiered node layout
- **Layout** — Use `tier_groups` from the API for horizontal tier placement
- **Nodes** — Custom node component with step title, status badge, parallel indicator
- **Edges** — Dependency arrows from `dependencies[]`, critical path highlighted
- **Color** — ready=green, blocked=red, in-progress=yellow, done=grey

---

## Error Handling

| Situation | Message |
|-----------|---------|
| Bad token | Invalid or missing dashboard token |
| Unreachable | Cannot reach Gas Town at `<baseUrl>` |
| CORS | Different-origin blocked — add Citadel's origin to Gas Town's WebAllowedOrigins setting |
| Command blocked | Gas Town rejected: not allowlisted |
| Schema mismatch | Unexpected response format from `<command>` |
| Timeout | Request timed out |

All errors visible in UI with endpoint + action context. Never fail silently on mutations.

---

## Testing Strategy

- **Unit** — Vitest for Zod schemas (parse valid/invalid shapes), store slices, utility functions
- **Component** — React Testing Library with mocked TanStack Query providers
- **API client** — MSW (Mock Service Worker) for HTTP mocking in tests
- **E2E** — Manual against real `gt dashboard`, documented in README

---

## Mutation Rules

- No optimistic updates — UI reflects server-confirmed state only
- On mutation success: refetch affected entity
- On mutation failure: show error, revert transient UI state
- Loading state + disabled double-submit while mutation in-flight
- `Confirm: true` commands require explicit confirmation dialog before sending `confirmed: true`

---

## Phase Gate Protocol

Before moving to next phase:
1. Run each API call against real `gt dashboard`
2. Confirm response parses against Zod schema without errors
3. Confirm UI renders correctly from real data
4. List any endpoints that returned errors or unexpected shapes
5. If any fail → stop and report

---

## Hard Boundaries

- No fake data in production paths
- No hardcoded responses
- No assuming undocumented CLI output formats
- No bypassing validation or CSRF
- No shelling out from Citadel to `gt` (browser → Gas Town HTTP only)
- No optimistic UI updates
- No swallowing errors to console only
- No changes to the gastown repo
