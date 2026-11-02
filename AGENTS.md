# Calctainer agent guide

## Product mission

Calctainer is a browser-based capacity planner for application workloads on HyperShift / Hosted Control Plane (HCP) clusters. It helps users plan workload resources, node pools, scheduling capacity, quota, resilience, and estimated infrastructure savings when comparing a classic OpenShift footprint with HCP.

The planner models workloads inside hosted clusters only. Management-cluster and hosted-control-plane consumption are excluded; the savings view must make that boundary clear. Scheduling and savings are estimates based on declared inputs, not guarantees or a complete platform TCO.

The central planning question is **how much worker capacity to order, and how to divide it across hosted clusters and node pools**. A hosted cluster can contain multiple pools with different instance flavours and sizes. The planned worker footprint is the sum of the capacity of every node in every pool across all hosted clusters; do not model an order as one VM size or one pool per cluster. The planner is not connected to a purchasing system: “order” means the user's intended provisioned capacity.

The product should help users move from an over-provisioned, fixed inventory mindset toward a realistic, explainable workload simulation. Let them compare a chosen pool composition and node-count range against baseline and peak workload demand, see what fits or remains at risk, and understand the trade-offs before choosing capacity. The goal is to teach practical resource planning through consequences, not to promise that a recommended order is exact.

## Product principles

- **One model, three audiences.** Guided, Standard, and Expert are progressive-disclosure modes over the same scenario. Mode changes must not discard workload, pool, quota, or assumption data.
- **Plan the whole footprint.** A scenario has multiple hosted clusters; each cluster may have multiple node pools. Report the composition and aggregate CPU/memory capacity across all pools, as well as per-cluster totals.
- **Bridge fixed inventory and simulation.** Support reasoning about an existing or proposed fixed worker inventory while making workload baseline/peak fit and min/current/max node counts understandable. Keep inventory capacity distinct from workload requests, quota caps, and autoscaling range.
- **Teach right-sizing without hiding risk.** Make excess capacity, resource imbalance, likely shortage, and the effect of growth or failure visible. Do not equate unused requests with waste in every situation or hide headroom needed for availability and operations.
- **Preserve the product people already use.** Keep the existing visual identity, interaction patterns, and app shell. Do not redesign the product or replace its stack without an explicit request.
- **Make recommendations explainable.** Show the assumptions and constraints behind node recommendations, quota use, findings, and savings. Avoid presenting estimates as observed usage or exact scheduler behavior.
- **Keep planning local-first.** There is no backend. Scenario files are the portable source of truth; browser storage is convenience only.
- **Use language appropriate to the selected mode.** Guided mode may explain Kubernetes terms in everyday language. Standard and Expert modes may use the precise Kubernetes vocabulary.
- **Keep work in scope.** Do not add management-cluster sizing, full Kubernetes scheduling semantics, operator dependency resolution, or deployment automation as if they were part of the current planner.

## Current product and domain

The app already supports:

- Guided VM-style profiles (vCPU, RAM, utilization profile, availability, instance count, disk, and growth) translated into workload requests, limits, replicas, and placement preferences.
- Standard workload editing and Expert controls for workload enablement, node-pool targets, manual pools, assumptions, catalogue choices, and a Kubernetes manifest preview. Users in all modes can switch from recommendations to a custom multi-pool mix.
- Deployment, StatefulSet, DaemonSet, and Job workload kinds; baseline and HPA-peak replica counts; CPU/memory requests and optional limits; per-replica external storage; node-pool targeting; and preferred or required anti-affinity.
- Auto-recommended or manually configured node pools per hosted cluster, instance-type candidate comparisons, autoscaling ranges, and dedicated pools. The custom pool editor is available in all modes; it starts from the recommendation and can add multiple independently sized/flavoured pools.
- Generic, AWS, and Azure instance-type catalogues; per-cluster and scenario infrastructure quotas checked against full peak worker-VM capacity, with optional automatic CPU/RAM caps.
- Deterministic approximate placement using spread or bin-pack strategies, node-failure checks, resource fragmentation, scale headroom, sizing findings, and a configurable classic-versus-HCP comparison.
- Scenario JSON import/export and workload CSV import/export. CSV import supports append or replace-per-cluster. A YAML manifest preview is for inspection and is not scenario import/export or a deployment guarantee.
- Local browser persistence for the scenario and UI preferences.

Use the implementation as the source of truth for what is shipped. In particular, do not describe the current app as having configurable operator-preset YAML catalogues, per-container custom applications, YAML scenario import/export, or independently editable flavour families unless those features are implemented.

### Known gaps

- The original prototype document is a broad product specification, not a feature checklist for the current app. Several of its requested workflows are not implemented:
  - Official Red Hat operator presets are bundled in `src/lib/engine/presets.ts` as fixed snapshots. Each preset expands into one workload per operator/operand pod; there is no editable preset catalogue, per-container modelling, or one-time operator overhead accounting. Generic templates in `defaults.ts` are sample workloads, not operator presets.
  - Workloads can be duplicated within the active cluster, but there are no explicit move/copy-between-clusters actions, cluster duplication, or side-by-side cluster comparison.
  - The workload model has four simplified kinds; `Job` is treated like a long-running workload in the manifest preview, not simulated with Kubernetes Job concurrency/completion semantics.
  - Scenario files are JSON only. YAML scenario import/export, workload merging, version migrations, and separate summary/node-pool/placement/assumption CSV exports or ZIP bundles are not implemented.
  - There is no separate configuration authoring format or maintainer catalogue editor for presets, instance types, or assumptions; current catalogues and defaults are bundled in TypeScript.
- The app does not expose provenance-tracked automatic values and removable overrides as a general scenario feature. Guided profile translation derives workload values, but editing detaches the profile rather than preserving a calculated-versus-overridden value history.
- Scenario import currently checks the version and a few top-level fields; it is not comprehensive validation or a migration system.
- CSV is a workload-list interchange, not a set of normalized reports. Formula-injection protection is not yet implemented.
- The current automated suite focuses on the calculation engine; it does not provide the full UI-test coverage described in the original prototype.

### Domain conventions

- The persisted scenario is schema version 1 (`Scenario` in `src/lib/engine/types.ts`).
- A hosted cluster can have multiple node pools. Each pool has its own instance type, node count or autoscaling range, and placement role. Scenario worker capacity is the sum, across every cluster and pool, of node count × instance-type vCPU and memory; show per-pool and per-cluster contributions so this total can inform an order.
- Keep three quantities separate in UI, calculations, and exports: provisioned node capacity (the worker footprint), workload requests/limits (demand and risk context), and quota (an allowed cap). A configured min/max autoscaling range is not itself the current or recommended order; identify which count is being summed.
- The legacy spreadsheet represented a fixed inventory of worker VMs by flavour and storage. The new planner extends that workflow with multiple clusters, multiple pool flavours, workload simulation, and node-count ranges. Do not treat the classic-vs-HCP savings estimate as a one-to-one VM conversion or the application's output as an actual purchase order.
- Use workload baseline and HPA peak to explain current and growth demand against node-pool capacity. If capacity is insufficient at baseline or peak, explain the affected workload/pool and the limiting assumption; if capacity is unused, explain why it may be removable while retaining configured spare/headroom.
- CPU is measured in cores/vCPU; memory and storage are measured in GiB. Storage is external PVC request per replica. Keep these units consistent through calculations and exports.
- A workload has baseline `replicas` and a peak `maxReplicas`; DaemonSets are modelled per node. Limits are reporting/risk context, not scheduling input.
- Hosted-cluster quota and scenario-wide quota are separate caps. CPU/memory consumption is the sum of pool maximum VM counts times full instance capacity (fixed pools use their configured count; recommendations include peak demand plus spare nodes). Keep these quota totals separate from current provisioned totals and actual peak simulation nodes. `Quota.auto` optionally derives CPU/RAM caps without overwriting manual caps; missing means manual under schema version 1. The legacy `quotaBasis` field is retained for file compatibility but ignored. Zero is a real cap; null/empty is unset. Storage remains a manual cap checked against peak PVC demand including DaemonSets at pool maximum, not VM disks. Quotas report shortages and never constrain or truncate recommendations/scheduling.
- Automatic CPU/RAM caps add `assumptions.quotaHeadroomPct` (0–100%, optional, defaults to 15% in version-1 files), then round upward to whole CPU cores and 16 GiB RAM steps. Shared defaults, steps, rounding, and headroom validation live in `engine/quotas.ts`. Scenario automatic caps sum rounded per-cluster requirements, not arbitrary manual allowances. Visible read-only fields show effective automatic caps; turning automation off restores editable manual values. Quota headroom does not change nodes, placement, or consumption.
- Workloads have an optional `namespace` (RFC 1123 label; missing means `default`, so older scenarios stay valid under schema version 1). Namespaces group and aggregate workloads in the UI, CSV, and manifest preview only; they must not change scheduling, quota, or recommendations. Grouping/aggregation, name validation, and rename helpers live in `src/lib/engine/namespaces.ts`; collapsed groups are UI state (`collapsedNs`, keyed `clusterId/namespace`). Each preset install gets its own namespace (`uniqueNamespace`), templates reuse their template namespace, and workload names are unique per namespace.
- Red Hat preset workloads carry an optional `preset` reference (`id`, `label`, `vendor: 'redhat'`, `basis`, `source`). `basis` is `documented` (Red Hat docs), `upstream` (upstream operator manifests), `measured` (consumption published in Red Hat docs), or `allowance` (planner assumption for pods that ship without requests; `UNSET_ALLOWANCE`). Keep Red Hat presets visually separate from generic templates, keep every value sourced, and list exclusions in `caveats`. When updating values, re-check the linked docs and update the review date.
- Recommended pools report `nodesBase`/`nodesPeak` as raw requirements; the recommended node count adds spare nodes to the sizing basis, and the autoscaling maximum is `nodesPeak + spareNodes`.
- Per-node platform DaemonSet overhead is distinct from user workloads. Do not add a separate operator-overhead model unless the domain model and UI are deliberately extended.
- Instance catalogue prices, derived pricing rates, classic baseline values, and platform overhead are planning assumptions. Keep their labels and provenance visible; do not present sample values as authoritative provider quotes.

## Stack and design constraints

Use the existing stack:

- Svelte 5 with TypeScript;
- Tailwind CSS v4 and Skeleton UI v5;
- Vite for development and production builds;
- Vitest for tests.

Do not migrate to vanilla JavaScript or introduce another UI framework. Keep calculation/domain logic framework-independent TypeScript in `src/lib/engine`; Svelte components should render and dispatch changes rather than own calculation rules. Reuse the Red Hat Display and Red Hat Mono typography, Petrol (`#007194`), Ziegelstein (`#b22222`), PANTONE 7405 (`#FFCC00`), neutral surface tokens, resource-series colors, compact ledger-style inputs, surface cards, responsive navigation, and light/dark theme behavior. Reserve red error tokens for error states rather than primary brand styling.

Metric series use independent `--res-cpu` (purple), `--res-mem` (pink), and `--res-storage` (mint) tokens in `app.css`; comparisons use `--metric-comparison`. Workload series in `colors.ts` use the same hue families. Keep theme-aware metric colors separate from success/warning/error statuses; retain explicit signs, units, labels, and status cues.

## Repository map

- `src/App.svelte` — app shell, mode selector, navigation, and view composition.
- `src/lib/engine/types.ts` — scenario, workload, assumptions, and result types.
- `src/lib/engine/defaults.ts` — scenario/workload/pool factories and sample scenarios.
- `src/lib/engine/catalog.ts` — bundled instance-type catalogues.
- `src/lib/engine/guided.ts` — Guided profile translation (validated input, step rounding without float noise).
- `src/lib/engine/presets.ts` — official Red Hat operator presets with per-component value provenance.
- `src/lib/engine/namespaces.ts` — namespace validation, grouping, and per-namespace aggregation.
- `src/lib/engine/nodes.ts`, `scheduler.ts`, `recommend.ts`, `analyze.ts` — capacity model, placement, pool recommendation, and findings.
- `src/lib/engine/io.ts`, `src/lib/yaml.ts` — scenario validation, CSV I/O, downloads, and workload manifest preview.
- `src/lib/state.svelte.ts` — central scenario/UI state, recalculation, and local persistence.
- `src/lib/components/` — user-facing views and shared controls.
- `src/lib/engine/engine.test.ts` — calculation and I/O tests.
- `src/lib/engine/sizing.test.ts` — guided workload sizing and automatic pool-sizing tests.
- `src/lib/engine/presets.test.ts` — Red Hat preset integrity, expansion, and scheduling tests.
- `src/lib/engine/namespaces.test.ts` — namespace validation, aggregation, CSV/JSON compatibility tests.

Keep changes in the nearest existing layer. Extract shared helpers only when needed; avoid speculative structure or a second state model.

## Working rules

### Before changing code

- Read this guide and the relevant implementation, tests, and docs.
- Check the current UI and model before assuming a feature is missing.
- Identify whether the requested behavior is already present, partially present, or genuinely new.
- Keep decisions that affect estimates explicit and documented.

### While changing code

- Keep derived results separate from scenario inputs and recalculate through the existing state/engine path.
- Preserve scenario data when switching audience modes.
- Keep scheduling deterministic and request-based; include platform overhead and DaemonSet behavior consistently.
- Validate user and imported data at boundaries. Invalid input must not silently become a plausible-looking estimate.
- Preserve the current look and feel, keyboard operation, visible focus, semantic labels, responsive layouts, and non-color status cues.
- Do not add network calls, accounts, telemetry, backend services, or dependencies without a concrete need.
- Treat generated Kubernetes YAML as an illustrative preview, not a fully validated deployable manifest.
- Keep CSV quoting correct and add formula-injection protection before expanding or relying on CSV interchange with untrusted values.
- Do not silently clamp values. If an interactive safeguard is introduced, show the user what was limited.

### Scenario compatibility

The scenario is versioned. When persisted fields or semantics change:

- increment the schema version when compatibility requires it;
- validate imported data with actionable diagnostics;
- provide a migration for supported older versions, or reject unsupported versions without replacing active state;
- preserve unknown extension fields when practical;
- update examples, docs, and tests.

Import must be atomic: validate the complete scenario before applying it. CSV workload import may have row-level diagnostics, but must clearly report skipped or invalid rows.

### Tests and verification

Add or update tests alongside calculation, state, import/export, and schema changes. Cover relevant cases from:

- guided translation and workload multiplication;
- node capacity and platform overhead;
- deterministic spread/bin-pack placement, anti-affinity, and dedicated-pool targeting;
- pool recommendation and autoscaling limits;
- quota basis and violations;
- fragmentation, failure checks, sizing findings, and classic/HCP comparison;
- JSON scenario validation and CSV parsing/escaping/formula-injection safety;
- mode switching, import failure behavior, and persistence when UI behavior changes.

Use existing scripts and run the smallest relevant checks:

- `pnpm test`
- `pnpm check`
- `pnpm build`

### Documentation and changelog

Keep `README.md` as the user-facing overview: how to run the app, the shipped modes and views, scope, data handling, and stack.

Keep this file as contributor/agent guidance: architecture, model semantics, constraints, and development rules. Do not let it become a speculative product backlog.

For each meaningful repository change, add a dated entry to `CHANGELOG.md`. Describe the user-facing or maintenance impact in plain language. Do not record routine inspections or claim a feature is complete when it is only planned.

## Roadmap — only implement when requested or needed

The following are not current commitments and must not be added speculatively:

- Richer scenario schema migrations and more complete import diagnostics.
- Formula-injection protection for CSV exports.
- Cross-cluster workload move/copy and cluster comparison workflows.
- Editable operator-preset catalogues, per-container component workloads, and provenance-aware automatic-value overrides.
- YAML scenario serialization and expanded CSV/ZIP reporting.
- Separate maintainable configuration files for instance catalogues, assumptions, and pricing.
- More advanced placement constraints, topology/zone modelling, GPU resources, or a full Kubernetes scheduler.
- Observed-metrics ingestion, cost/TCO modelling beyond the current assumptions, or shareable hosted reports.

When one of these is selected, define its user workflow and data semantics first, then implement a tested vertical slice and update the README, this guide, and changelog as appropriate.
