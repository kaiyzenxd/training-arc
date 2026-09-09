# Website — Mark Ryan Baricuatro portfolio

A portfolio that shows AI-automation workflows as **fabricated circuit boards**:
each workflow is drawn with a title block, routed traces from trigger to outcome,
labelled component packages, and a bill of materials.

Built with Next.js (App Router) + TypeScript + Tailwind v4. Deploys to Vercel.

## Run it locally

```
npm install
npm run dev        # http://localhost:3000
```

```
npm run build      # production build
npm run start      # serve the production build
```

## Deploy (Vercel)

1. Push the whole `Training Arc` repo to GitHub (already done).
2. In Vercel: **Add New → Project**, import `training-arc`.
3. Set **Root Directory = `Website`**. Leave build/output settings on their
   Next.js defaults.
4. Deploy. Every push to `main` redeploys production; branches get preview URLs.

## Adding or editing a workflow (case study)

Each workflow is one typed file in [`content/workflows/`](content/workflows/).
To add one:

1. Copy an existing file, e.g. `content/workflows/inbound-lead-triage.ts`.
2. Edit the fields. The important ones:
   - `slug` — the URL (`/work/<slug>`). Lowercase, dash-separated.
   - `title`, `trigger`, `stack`, `rev`, `date`, `status` (`passing` | `retrying` | `failed`), `summary`.
   - `synthetic` — **set to `false`** once it's a real client build. While `true`
     the board shows a "Synthetic — sample build" stamp and the footer disclaimer.
   - `nodes` — the board. Each node: `id`, `ref` (e.g. `U1`), `kind`
     (`trigger` | `agent` | `tool` | `logic` | `outcome`), `label` (the plain-language
     callout), optional `label2`, optional `lane` (`-1` branch up / `1` branch down).
   - `edges` — `{ from, to }` pairs by node `id`. Add `state: "retrying"` to colour
     a single segment amber.
   - `prose` — `problem`, `design` (arrays of paragraphs), `decisions`
     (`{ note, ref }` — `ref` ties the decision back to a node), `result`.
3. Register it in [`lib/workflows.ts`](lib/workflows.ts): import it and add it to
   the `workflows` array. **The first entry in that array is the featured board on
   the home page.**

The board layout (columns, traces, callout placement) is computed automatically
from `nodes` + `edges` in [`lib/board-layout.ts`](lib/board-layout.ts) — you don't
position anything by hand.

## Design system

All tokens and component styles live in [`app/globals.css`](app/globals.css):
solder-mask/silkscreen/trace colours, the two typefaces (Archivo for stamped
headings, Martian Mono for labels), the cutting-mat ground, and the motion.
See [`../DESIGN.md`](../DESIGN.md) for the full record.

## Current content status

The three case studies shipped at launch are **synthetic samples** — realistic
AI-agent workflow patterns, clearly labelled, with **no invented metrics, clients,
or testimonials**. Replace them with real client work as it becomes available; see
[`REPLACE-CONTENT.md`](REPLACE-CONTENT.md).
