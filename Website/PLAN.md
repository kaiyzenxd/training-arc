# Website — Portfolio Site Plan

A public portfolio hosted on GitHub that showcases AI automation workflows, plus
the skills needed to keep building and maintaining the site itself.

Status: **planning only — nothing built yet.**

---

## 1. Goals

- Showcase AI automation workflows as individual case studies (problem → design → result).
- Present as a credible portfolio: clean, fast, easy to scan.
- Fully static, free to host on GitHub Pages.
- Carry its own "how to build websites" skills so future work is repeatable.

## 2. Stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | **Next.js (App Router)** | full Next.js — no static export needed on Vercel |
| Language | TypeScript | |
| Styling | Tailwind CSS | fast iteration, small output |
| Content | MDX per workflow | case studies live as content, not hardcoded pages |
| Hosting | **Vercel** | auto-deploys on every push to GitHub |
| Node | pin in `.nvmrc` / `package.json` engines | |

### Vercel specifics

- The repo root is `Training Arc/`, but the Next.js app lives in `Website/`.
  In Vercel project settings set **Root Directory = `Website`**. Vercel then runs
  `npm install` / `npm run build` inside that folder only.
- No `output: 'export'`, no `basePath`, no `.nojekyll`, no GitHub Actions file.
  Vercel builds and deploys automatically.
- `next/image` works fully (no `unoptimized` needed).
- Every push to `main` → production deploy. Every other branch / PR → preview URL.
- Custom domain (optional) is added in Vercel dashboard later.

## 3. Proposed structure

Note: `.git/` and `.claude/skills/` live at the repo root (`Training Arc/`), not here.

```
Website/
├── PLAN.md                  # this file
├── README.md                # short: what it is, how to run/deploy (write at build time)
├── app/
│   ├── layout.tsx
│   ├── page.tsx             # home / hero + featured workflows
│   ├── work/
│   │   ├── page.tsx         # index of all workflow case studies
│   │   └── [slug]/page.tsx  # renders one case study from MDX
│   └── about/page.tsx
├── content/
│   └── workflows/
│       └── <slug>.mdx       # one file per workflow case study
├── components/
│   ├── WorkflowCard.tsx
│   ├── Prose.tsx            # MDX typography wrapper
│   └── ...
├── public/
│   └── workflows/<slug>/    # screenshots, diagrams, exported JSON (optional)
├── lib/
│   └── content.ts           # read/parse MDX frontmatter
├── next.config.mjs
└── tailwind.config.ts
```

## 4. Workflow case study format

Each `content/workflows/<slug>.mdx` frontmatter:

```yaml
---
title: "Invoice intake → Xero"
summary: "One-line what it does and the payoff."
date: 2026-01-15
tags: [n8n, webhook, accounting]
stack: [n8n, OpenAI, Xero API]
status: production        # demo | production | archived
repo: ""                  # link to workflow folder / gist (optional)
hero: /workflows/invoice-intake/hero.png
---
```

Body sections (keep consistent):
1. **Problem** — what was manual/broken.
2. **Design** — trigger, key nodes, data flow (embed a diagram).
3. **Notable decisions** — error handling, retries, idempotency.
4. **Result** — time saved, volume handled, reliability.

Source workflows come from `../Workflow/`. Decide per workflow whether to publish
the raw JSON (sanitize credentials first).

## 5. Website-building skills to include (root `.claude/skills/`)

Purpose: make site maintenance repeatable without re-deriving conventions.

- **new-case-study** — scaffold a new `<slug>.mdx` + `public/workflows/<slug>/`
  from the template, update any index.
- **deploy-check** — run `npm run build` locally, verify `out/` + `.nojekyll`,
  check `basePath` assumptions, common Pages 404 causes.
- **site-conventions** — component patterns, Tailwind tokens, content rules,
  image sizing/format (use `next/image` unoptimized or plain `<img>` for export).

(These get authored during the build phase, not now.)

## 6. Open decisions

- [x] One repo: `Training Arc/` holds both `Website/` and `Workflow/`.
- [x] Hosting: Vercel, Root Directory = `Website`.
- [ ] Custom domain, or use the free `*.vercel.app` URL to start?
- [ ] Publish raw workflow JSON, or screenshots + description only? (see Workflow/PLAN.md §7)
- [ ] Analytics (privacy-friendly, e.g. Vercel Analytics or GoatCounter) or none?

## 7. Build-phase checklist (later)

1. `npx create-next-app@latest` in `Website/` (TS, Tailwind, App Router, no src dir).
2. Add MDX pipeline + `lib/content.ts`.
3. Build home / work index / case study route + `about`.
4. Add 1–2 real case studies from `../Workflow/`.
5. Push to GitHub, import the repo in Vercel, set Root Directory = `Website`.
6. Author the root `.claude/skills/` skills.
7. Write `README.md`.
