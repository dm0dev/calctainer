# Calctainer

Calctainer is a browser-based capacity planner for application workloads on HyperShift / Hosted Control Plane (HCP) clusters. It helps teams move from fixed worker-VM inventories toward an explainable plan for how much capacity to provision, how to divide it among hosted clusters and node pools, and whether baseline and peak workloads fit.

The planning unit is the **whole worker footprint**: one hosted cluster may have multiple node pools, each with its own VM flavour and node count or autoscaling range. Aggregate worker CPU and memory are the sum of capacity across all selected pools and clusters. This is a planning estimate, not a purchase order or purchasing integration.

## Run locally

```sh
pnpm install
pnpm dev        # http://localhost:5173
pnpm test       # calculation, workload-sizing, preset, and I/O tests
pnpm check      # Svelte and TypeScript checks
pnpm build      # static bundle in dist/
```

The HTML entry page is `src/index.html`. Vite serves `src` as its root, copies static assets from `public`, and writes the production site to `dist/index.html`. Run the commands above from the repository root.

## Accessibility testing

Run pa11y or Lighthouse against a local dev or preview server to check WCAG 2.1 AA compliance:

```sh
# Start the app in one terminal
pnpm dev          # or: pnpm build && pnpm preview

# Run a single-page accessibility check in another terminal
pnpm a11y         # pa11y (axe-core) on http://localhost:5173

# CI-friendly run (exits non-zero on violations)
pnpm a11y:ci      # pa11y-ci on http://localhost:5173
pnpm a11y:ci:all  # pa11y-ci with .pa11yci.json config
```

The configuration file `.pa11yci.json` sets the default standard to WCAG2AA, runs both the axe and HTML_CodeSniffer runners (axe applies the WCAG 2.0 and 2.1 A/AA rules), and configures Chrome launch options. To test additional pages, pass URLs directly:

```sh
npx pa11y http://localhost:5173 http://localhost:5173/other-page
```

### Lighthouse

Lighthouse provides a broader audit covering accessibility, performance, SEO, and best practices. Run it against the same local server:

```sh
# Generate an HTML report (opens in browser)
pnpm lighthouse

# Generate a JSON report for CI or programmatic use
pnpm lighthouse:ci
```

Both tools reuse the Chromium engine installed with pa11y. pa11y focuses on WCAG rule violations, while Lighthouse gives a scored accessibility category plus additional web-vital metrics. Use pa11y for precise WCAG compliance checks and Lighthouse for a broader development-time audit.

## Planning modes

| Mode     | Intended for                                            | Focus                                                                                                                                                                                                      |
|----------|---------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Guided   | Kubernetes beginners and VM administrators              | Describe applications as VM-like profiles (vCPU, RAM, load, availability, instances, disk, growth); get plain-language findings and a guided workflow.                                                     |
| Standard | Users familiar with OpenShift or Kubernetes             | Edit workload replicas, HPA peak, requests/limits, storage, and placement; customize multiple node pools and review quota details.                                                                         |
| Expert   | Advanced users planning a classic OpenShift to HCP move | Configure workload enablement and pool targets, compose multiple manual node pools with different VM flavours and node ranges, edit assumptions and catalogues, and inspect a Kubernetes manifest preview. |

All modes use the same scenario. Switching modes changes presentation, not the underlying plan.

The interface is available in English and German. On first use it follows a German browser locale when available and otherwise defaults to English; change the language in the header or during onboarding. The preference is saved locally with the other UI settings.

## From inventory to simulation

The previous spreadsheet workflow described a fixed worker inventory by VM flavour and storage. Calctainer retains that capacity-planning question while adding workload demand and range-based simulation:

1. Define how many hosted clusters are needed and the node pools in each.
2. Choose pool flavours and node counts/ranges; compare the resulting total CPU and memory capacity with workload requests at baseline and HPA peak.
3. Use placement, quota, failure, and findings views to see what fits, where capacity is stranded, what growth is supported, and what risks remain.

Keep provisioned node capacity distinct from workload requests/limits and quota caps. A pool's maximum autoscaling size is potential headroom, not capacity currently ordered; check whether a displayed total refers to minimum, selected/recommended nodes, peak, or maximum. Spare capacity may be intentional for growth, failure recovery, or maintenance rather than automatically wasted.

## What it models

- Multiple hosted clusters, each with workload definitions, quota, and automatic or manual node pools.
- A custom pool mix can be started from the recommendation in Guided, Standard, or Expert mode. Add pools with distinct VM flavours and node-count/autoscaling ranges; the editor shows the aggregate minimum and maximum worker footprint for that hosted cluster.
- Deployments, StatefulSets, DaemonSets, and Jobs, including baseline and HPA-peak replicas, CPU/memory requests and limits, external storage, dedicated-pool targeting, and anti-affinity.
- Namespaces group related workloads inside a hosted cluster. In every mode the workload list is grouped by namespace; each group can be collapsed, renamed (or merged into another namespace), extended, or removed, and shows summed pods, CPU/memory requests and limits, storage, and fit status. Each Red Hat operator install gets its own namespace (a second install gets a numbered one) and starts collapsed; each generic template adds to its template namespace; plain new workloads go to `default`. Namespaces are for organisation and reporting only — they do not affect scheduling or quota.
- Official Red Hat operator presets — Red Hat build of Keycloak, OpenShift GitOps, OpenShift Pipelines, OpenShift Service Mesh 3, cert-manager Operator, Advanced Cluster Security (secured cluster), OpenShift Logging collector, OpenShift Serverless (Serving), and Streams for Apache Kafka. They are shown separately from the generic templates, add one workload per operator/operand pod, and badge each workload with its value source: Red Hat documentation, upstream operator default, measured figure from Red Hat docs, or a planner allowance (0.1 CPU / 0.25 GiB) for components that ship without requests. Each preset lists what it excludes (for example databases, sidecars, LokiStack, Kafka brokers) and links to its sources. Values reflect documentation reviewed on 2026-11-01; verify them against your installed versions.
- Generic, AWS, and Azure instance-type catalogues, with editable planning assumptions and estimated instance costs.
- Approximate deterministic placement using spread or bin-pack, including platform overhead, fragmentation, scale headroom, and a node-failure check.
- Findings for quota, sizing, resource balance, resilience, and other planning concerns.
- Infrastructure CPU/RAM quotas check the full worker-VM footprint at peak: sum of each pool's maximum VM count times its instance capacity (fixed pools use their configured count). Recommendations include peak workload demand and spare nodes; custom autoscaling pools reserve their configured maximum. This quota footprint is not the current order, workload requests/limits, or the number of nodes the peak scheduler happened to need. Quota shortages are reported without reducing the plan to fit.
- Each cluster and the scenario total have an **Automatically calculate CPU/RAM quota** toggle in every mode. The CPU/RAM input fields stay visible and show calculated caps read-only while automation is enabled; turning it off restores editable saved manual caps. **Automatic quota headroom** in Assumptions adds 15% by default (configurable from 0–100%) to peak VM capacity, then rounds CPU up to whole cores and RAM up to 16 GiB steps. Scenario caps sum the individually rounded cluster requirements so rounding cannot cause allocation overcommit. These are allowances to request, not granted budgets; headroom does not add worker nodes or resolve scheduling shortages. Storage remains a separate, manually set PVC quota checked against peak replicas and DaemonSets at pool maximum; VM disks are not modelled.
- The top summary shows **Scenario quota** CPU/RAM allowances and percentages (full peak worker-VM capacity divided by those allowances), plus the separate PVC quota. Percentages remain visible for automatic quotas. **Reserved by apps** / **Requested / allocatable** instead shows baseline workload requests divided by allocatable capacity on current nodes: declared app demand, not observed usage or infrastructure quota consumption.
- A configurable classic-versus-HCP estimate. HCP results cover hosted-cluster workers only; management-cluster and hosted-control-plane costs are excluded.

The simulation is a planning approximation, not the Kubernetes scheduler. It does not guarantee that a real cluster will schedule every workload.

Memory limits are not memory usage or reservable RAM: requests determine placement, while limits inform a burst-risk warning. Guided and Standard use a fixed 100% of allocatable pool memory as the warning threshold; only Expert can change it, and a higher threshold does not create physical capacity.

## Import, export, and local data

- Scenario import/export: complete scenario files in JSON.
- Quota automation is saved in schema-version-1 JSON as optional `quota.auto` / `scenarioQuota.auto`; missing means manual. Optional `assumptions.quotaHeadroomPct` defaults to 15 when absent in older files. Older files remain loadable, but the legacy `assumptions.quotaBasis` field is no longer used: infrastructure quota checks always use peak VM capacity rather than baseline capacity or workload requests/limits. Empty caps mean unset; zero means no allowance.
- Workload import/export: spreadsheet-compatible CSV with a `namespace` column (missing → `default`; rows with invalid namespaces are skipped and reported); import supports append or replace per cluster and accepts comma- or semicolon-separated files.
- The YAML shown for a workload is an illustrative Kubernetes manifest preview, not scenario serialization or a deployment guarantee.
- Working scenarios and UI preferences are saved in browser `localStorage`. Data is not sent to a service; export a scenario file to move or back it up.
- The English/German interface preference is local UI state and does not change scenario files, workload values, calculations, or CSV/JSON formats.

## Current limitations

Red Hat operator presets are bundled, fixed snapshots of default resource values; they are not configurable catalogues, and each pod is modelled as one workload rather than per container. Generic templates remain sample workloads. Workloads can be duplicated in their current cluster, but there are no explicit cross-cluster move/copy actions or side-by-side cluster comparison. Scenario files are JSON-only; CSV covers workload lists rather than summary/report bundles. Scenario validation and migration support are limited, so use exported files from compatible app versions and keep backups.

## Stack and design

Built with Svelte 5, TypeScript, Tailwind CSS v4, Skeleton UI v5, Vite, and Vitest. Red Hat Display is used for interface typography, with Red Hat Mono for numeric data; the brand palette uses Petrol (`#007194`), Ziegelstein (`#b22222`), PANTONE 7405 (`#FFCC00`), and neutral surfaces. Metrics use berry (CPU), blue/mint (memory), and dark/light gray (storage), with light/dark variants; workload-chart series use purple, pink, and mint shades. Savings figures and healthy statuses use a success palette based on `#217563`, with explicit signs distinguishing savings from increases; warning and error colors indicate actual alerts. The calculation engine is in `src/lib/engine` and is kept separate from Svelte rendering. The interface uses a compact ledger-inspired design, responsive navigation, and light/dark themes.

## AI-assisted development

This repository was developed with substantial assistance from AI agents. The maintainer estimates that AI agents contributed to up to 80% of the implementation. This is an approximate estimate, not a measured share; project direction, review, and responsibility remain with the human maintainer.

## License

Calctainer is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Scope and assumptions

Only workloads running inside hosted clusters are modelled. The application does not model management-cluster or hosted-control-plane resource consumption, nor does it attempt full Kubernetes scheduling semantics. Classic-versus-HCP comparison is not a one-to-one conversion of old worker VMs and is not a complete platform TCO. Instance pricing, platform overhead, utilization, classic-cluster baseline, and other defaults are planning assumptions; review them in **Assumptions** and replace sample values with values appropriate to your environment.
