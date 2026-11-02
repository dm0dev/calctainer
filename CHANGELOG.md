# Changelog

## 2026-11-02

- Changed the primary palette to Petrol (`#007194`), Ziegelstein (`#b22222`), and PANTONE 7405 (`#FFCC00`); red is now reserved for semantic error states. Resource-series shades remain legible across light and dark themes.
- Added a README disclosure that AI agents contributed to an estimated up to 80% of the implementation, clarifying that the estimate is approximate and project responsibility remains with the human maintainer.

## 2026-11-01

- Trimmed the accessibility statement (`a11y.md`) to a voluntary statement for an open-source tool from a private person: provider links to the GitHub profile, feedback goes through project issues, and a note explains the adjusted information. pa11y-ci now runs the axe and HTML_CodeSniffer runners, so WCAG 2.1 A/AA rules are checked as well.
- Added an "Ease of Access" / "Barrierefreiheitserklärung" link in the navigation to a plainly styled static page. The page is generated from `a11y.md` by `scripts/build-a11y.mjs` (new dev dependency `marked`) before `pnpm dev` and `pnpm build`, so the Pages deploy always publishes the current statement; `a11y.md` changes now trigger CI. The page is not part of the app i18n; extra languages are appended as own sections.

- Merged CI and Pages deployment into one gated workflow (`ci.yml`): check, test, and build run first, and the Pages deploy reuses that same build artifact only after they pass. Accessibility and security stay as separate parallel workflows.

- Reduced GitHub Actions minutes: workflows skip docs-only changes, the accessibility check runs only on pull requests that touch UI files (or manually), the security audit runs only on dependency changes and weekly without installing dependencies, the Pages deploy no longer repeats checks and tests, Chrome downloads are skipped where unused, and jobs have timeouts.

- Added GitHub Actions: CI (type check, tests, build), accessibility benchmark (pa11y-ci + Lighthouse score gate ≥ 95), security (`pnpm audit`, dependency review, weekly), and GitHub Pages deployment from `main`. Added a Renovate config for dependency and GitHub Actions updates.
- Added `a11y.md` documenting the accessibility testing workflow and listing all WCAG 2.0 Level A and AA success criteria with automation status and current compliance assessment. Known gaps include skip links, focus order verification, resize-text behavior at 200% zoom, and ARIA live regions for status messages.
- Added pa11y accessibility testing with WCAG 2.0 AA checks. New scripts `pnpm a11y`, `pnpm a11y:ci`, and `pnpm a11y:ci:all` run against a local dev or preview server; configuration in `.pa11yci.json`.
- Added Lighthouse accessibility audits. New scripts `pnpm lighthouse` (HTML report) and `pnpm lighthouse:ci` (JSON report) reuse the Chromium engine from pa11y and focus on the accessibility category.
- Fixed WCAG 2.0 AA contrast-ratio violations on resource-colored table cells in dark mode. The CPU, memory, and storage colors now use lighter shades (`--color-primary-400`, `--color-secondary-300`, `--color-tertiary-400`) when dark mode is active, ensuring all text meets the 4.5:1 minimum contrast ratio.
- Set the memory-limit risk warning to a fixed 100% of allocatable pool memory in Guided and Standard; only Expert can adjust the threshold. Clarified that configured limits are not observed memory usage or additional physical RAM, and preserved saved scenario values when switching modes.
- Added a persistent English/German interface language selector, including onboarding and document-language updates. New visits follow the browser locale when it is German, otherwise English; changing language only affects presentation and leaves scenario data and exports unchanged.
- Replaced JetBrains Mono with Red Hat Mono for numeric data, completing the transition to a fully Red Hat typeface family (Display for UI, Mono for numbers).
- Added namespaces to group related workloads. The workload list (table and guided cards) is grouped by namespace, with collapsible group headers that sum pods, requests, limits, and storage and show fit status; groups can be renamed/merged, extended, removed, and enabled/disabled together (Expert). Each Red Hat operator install lands collapsed in its own namespace (e.g. `openshift-gitops`, `keycloak`, `stackrox`), generic templates use a template namespace, and the sample scenario now uses namespaces.
- Workload CSV gained a `namespace` column, the manifest preview shows `metadata.namespace`, and scenario import rejects invalid namespaces with a specific message. Older scenario and CSV files without namespaces load into `default`.

- Added official Red Hat operator presets (Red Hat build of Keycloak, OpenShift GitOps, OpenShift Pipelines, OpenShift Service Mesh 3, cert-manager Operator, Advanced Cluster Security secured cluster, OpenShift Logging collector, OpenShift Serverless Serving, Streams for Apache Kafka). They are listed apart from the generic templates, add one workload per operator/operand pod, and badge each workload with the value source (Red Hat docs, upstream default, measured, or planner allowance) plus exclusions and documentation links.
- Fixed guided workload sizing showing floating-point noise (for example `1.2000000000000002` CPU) and made invalid VM inputs (non-numeric, negative disk, zero VMs, unknown options) produce visible “Adjusted invalid input” notes instead of NaN or negative storage.
- Fixed automatic pool recommendations dropping the spare node at HPA peak: the autoscaling maximum is now the peak requirement plus spare nodes, consistent with the baseline count.
- Added unit tests for guided workload sizing (reference profiles, invariants across all options, edge cases), automatic pool sizing, and the Red Hat presets.

- Updated the interface typography to Red Hat Display and refreshed the light/dark palette around Red Hat red (`#ee0000`), brand blue/green accents, and neutral gray surfaces.
- Softened the page background by removing the high-contrast dual-scale grid, leaving a calm solid surface behind the ledger cards.
- Made the custom node-pool editor available in every planning mode. Switching from recommendations now starts with the recommended pool mix, and users can add multiple differently sized pools to one hosted cluster.
- Added a per-cluster summary of minimum and autoscaling-maximum node count, vCPU, and memory, plus a calculation test for mixed-flavour pools.
- Reworked `AGENTS.md` from a first-prototype specification into contributor guidance aligned with the current Svelte/TypeScript planner, including its implemented workload, catalogue, scheduling, quota, and import/export model.
- Updated `README.md` to document the shipped modes, planning capabilities, local data handling, approximation boundaries, and current stack.
- Kept the original goals that remain applicable: progressive disclosure, local-first operation, transparent assumptions, hosted-cluster-only scope, and deterministic approximate planning.
- Recorded material implementation gaps in `AGENTS.md`, including shallow scenario validation, CSV formula-injection protection, bundled configuration, and the absence of UI-test coverage.
- Cross-checked `AGENTS_OLD.md` and documented additional unimplemented workflows in the contributor guide and README: operator presets/component modelling, cross-cluster workload actions, YAML scenarios, and expanded reporting.
- Clarified the core capacity-planning model: sum worker CPU/memory across multiple node pools per hosted cluster, distinguish provisioned capacity from workload demand and quota, and frame the product as a bridge from fixed VM inventory to range-based workload simulation.
