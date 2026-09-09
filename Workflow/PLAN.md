# Workflow — Automation Workshop Plan

Where the actual n8n workflows get built, plus the MCP config and skills that make
them high quality. Finished case studies get written up in `../Website/`.

Status: **planning only — nothing built yet.**

---

## 1. Purpose

- A consistent place to design, build, validate, and version n8n workflows.
- Keep the tooling (n8n-mcp, skills) and conventions in one repo.
- Each workflow is self-contained: exported JSON + notes + screenshots.

## 2. Proposed structure

```
Workflow/
├── PLAN.md                     # this file
├── README.md                   # how the workshop works (write at build time)
├── .mcp.json                   # n8n-mcp server config (project-scoped)
├── .claude/
│   └── skills/                 # workflow-building skills (see section 4)
├── workflows/
│   └── <slug>/
│       ├── workflow.json       # exported n8n workflow (sanitized)
│       ├── README.md           # problem, design, decisions, how to import
│       ├── screenshots/
│       └── test-data/          # sample payloads, fixtures
├── templates/
│   ├── workflow-readme.md      # per-workflow README template
│   └── checklist.md            # pre-ship quality checklist
└── docs/
    ├── conventions.md          # naming, error handling, structure rules
    └── credentials.md          # how creds are managed (never commit secrets)
```

## 3. MCP setup

- **n8n-mcp** server, configured in `.mcp.json` at the repo root (`Training Arc/`)
  so both folders' sessions can use it.
- Mode: **instance-connected** — user runs self-hosted n8n via Docker.
  Needs: n8n base URL (e.g. `http://localhost:5678`) + an n8n API key
  (n8n → Settings → n8n API → create key).
- Secrets go in an untracked file (`.env` / `.mcp.json` with the key) — add to
  `.gitignore`. Never commit the API key.
- The `n8n-mcp-skills` pack is already available and covers: tool selection,
  node config, expression syntax, validation, workflow patterns, error handling,
  sub-workflows, binary/data handling, AI agents, code nodes, self-hosting,
  and multi-instance routing.

## 4. Workflow-building skills to include (`.claude/skills/`)

Complementing the `n8n-mcp-skills` pack with repo-specific ones:

- **new-workflow** — scaffold `workflows/<slug>/` from `templates/`, create the
  README stub, screenshots dir, test-data dir.
- **ship-workflow** — run the quality checklist: validate_workflow, error handling
  on every external call, retries/idempotency, sanitize + export JSON, fill README.
- **export-to-portfolio** — take a shipped workflow and generate the
  `../Website/content/workflows/<slug>.mdx` case study draft.

## 5. Quality checklist (→ `templates/checklist.md`)

- [ ] `validate_workflow` passes (no errors; warnings reviewed).
- [ ] Every external call: error output wired, `retryOnFail` where sensible.
- [ ] Webhooks: explicit 2xx/4xx/5xx responses via Respond to Webhook.
- [ ] Idempotency / dedupe considered for triggers that can fire twice.
- [ ] No hardcoded secrets; all via credentials.
- [ ] Expressions validated (no `[undefined]` mapping errors).
- [ ] Exported JSON sanitized (no creds, no internal URLs, no PII in test data).
- [ ] README complete: problem, design, decisions, import steps.
- [ ] Screenshots current.

## 6. Conventions (→ `docs/conventions.md`, draft)

- **Slugs**: kebab-case, verb-first where it's an action (`sync-invoices-to-xero`).
- **Node naming**: describe the action, not the node type ("Fetch open invoices"
  not "HTTP Request").
- **Structure**: linear where possible; sub-workflows for anything reused or >~10 nodes.
- **Secrets**: never committed. `docs/credentials.md` lists what each workflow needs.

## 7. Open decisions

- [x] n8n: self-hosted via Docker, instance-connected MCP.
- [x] One repo: `Training Arc/` holds both folders.
- [ ] **Publish raw workflow JSON, or write-ups only?** What this means:
      exporting an n8n workflow gives a `.json` file describing every node. If the
      repo is public, anyone can see and copy that JSON. Risks: it can leak internal
      URLs, endpoint paths, business logic, and (if you're careless) secrets.
      Options:
      1. **Write-ups + screenshots only** — safest. Repo can be public, JSON stays out.
      2. **Publish sanitized JSON** — scrub URLs/keys/PII first, per workflow. More
         impressive for a portfolio (people can import and run it) but more work.
      3. **Keep the whole repo private** — build freely, publish only chosen
         write-ups to the Website. Simplest mentally; loses the "public GitHub" goal.
      Recommendation: start with the repo **public**, publish **write-ups + screenshots**,
      and promote individual workflows to sanitized JSON when you decide they're
      showcase-worthy.

## 8. Build-phase checklist (later)

1. Create folder structure + `templates/` + `docs/`.
2. Add `.mcp.json` for n8n-mcp (docs-only or instance-connected).
3. Author the 3 repo-specific skills.
4. Build the first real workflow end-to-end through the checklist.
5. Run `export-to-portfolio` to seed the first `../Website/` case study.
6. Write `README.md`.
