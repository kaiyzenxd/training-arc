# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

User-decided: **Next.js (App Router) + TypeScript + Tailwind CSS + MDX**, deployed on
**Vercel**. Repo is a monorepo (`Training Arc/`); the site lives in `Website/` and
Vercel's Root Directory is set to `Website`. Auto-deploys on push to `main`.
Case-study content is authored as MDX files, one per workflow.

## Users

**Primary:** prospective freelance clients — business owners, founders, and
operations leads who have a manual or repetitive process and are evaluating
whether to hire Mark Ryan Baricuatro to build an automated solution for it. They
arrive skeptical, skim for proof that he can build something real and reliable,
and decide whether to make contact.

Secondary (not designed around): hiring managers and fellow automation builders.

## Product Purpose

A personal portfolio that showcases Mark Ryan Baricuatro's AI-automation
workflows as individual case studies — each framed as problem → design → result —
in order to win freelance automation work. Success is a qualified prospect
reaching out by email after reading one or more case studies.

## Positioning

The work on show is **AI-agent automation**: workflows where an LLM/agent makes
decisions, calls tools, and handles unstructured input — not just static
app-to-app plumbing. Built and operated on **self-hosted n8n** (Docker), which
signals ownership of the full stack rather than dependence on a hosted builder.

## Operating Context

- Workflows are built in self-hosted n8n running under Docker.
- Case studies are sourced from the `Workflow/` folder of the same repo, where the
  workflows are actually built, validated, and versioned.
- Each case study follows a fixed shape: **Problem** (what was manual/broken),
  **Design** (trigger, key nodes, data flow), **Notable decisions** (error
  handling, retries, idempotency), **Result** (outcome).
- Per workflow, the site either publishes a sanitized workflow JSON export or
  shows screenshots and write-up only.

## Capabilities and Constraints

- Content site; case studies authored as MDX, added by dropping in a file.
- Public contact is a plain email address: `markryanbaricuatro@gmail.com`.
- Deployed on Vercel; every push to `main` is a production deploy.
- Monorepo layout: portfolio in `Website/`, workflow workshop in `Workflow/`.
- Terminology: a **workflow** is one n8n automation; a **case study** is its
  write-up on the site.
- **Open decisions** (do not resolve by inventing): custom domain vs the free
  `*.vercel.app` URL; whether to add analytics; whether to publish raw sanitized
  workflow JSON or keep to write-ups + screenshots (current lean: write-ups +
  screenshots first, promote individual workflows to sanitized JSON case by case).

## Brand Commitments

- Name shown on the site: **Mark Ryan Baricuatro**.
- GitHub identity: `kaiyzenxd` (repo: `github.com/kaiyzenxd/training-arc`).
- No logo, wordmark, colors, or existing visual identity — none is binding yet.
- Voice: not yet defined (open).

## Evidence on Hand

- At least one real, built n8n workflow that can be screenshotted and written up;
  exact count to be confirmed at build time.
- **No** results or metrics captured yet — future work must not fabricate
  time-saved figures, throughput numbers, or error rates.
- **No** testimonials, named clients, or press. Do not invent any.
- The GitHub repo is public.

## Product Principles

1. Every workflow appears as a case study — problem, build, outcome — never a bare
   screenshot or feature list.
2. Credibility over volume: a few thoroughly documented workflows beat many thin
   entries.
3. The artifact leads; the site is a frame around the work, not the show.
4. Honest evidence only — no invented metrics, clients, or claims.
5. Adding a case study stays low-friction, so the portfolio keeps growing.
