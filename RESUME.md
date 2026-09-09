# Resume notes — where we left off (2026-09-09)

## Done

- Git repo live at `github.com/kaiyzenxd/training-arc` (branch `main`).
- `impeccable` design skill installed at `.claude/skills/impeccable/`.
- `PRODUCT.md` written (portfolio product context).
- `impeccable shape` + `craft` run. Visual world locked: **"Fab Drawing"**
  (each workflow drawn as a fabricated circuit board). Direction contract in
  `.impeccable/surfaces/website-app-page-tsx.md`.
- **Website built** in `Website/` — Next.js 16 + TS + Tailwind v4:
  - Home, `/work`, `/work/[slug]` (case study), `/about`, 404.
  - `components/board.tsx` = the SVG board system; `lib/board-layout.ts` = layout.
  - 3 synthetic sample case studies in `content/workflows/`.
  - Responsive verified (390–1440), build + lint clean.
  - `Website/README.md` + `Website/REPLACE-CONTENT.md` written.

## Finish review — COMPLETED (disposition: fix). Apply these 7, one batch:

1. **Hero pushes the board below the fold.** The 3.6rem H1 + 3-line intro shove
   the featured board and its routed trace out of the first viewport (desktop
   AND mobile). Contract wants a board-dominant first viewport. Compress/move the
   intro block so the title block + start of the trace are visible on load, and
   **delete the slogan H1** ("AI automation, drawn like a circuit board.") — it
   just restates the THESIS. Keep a real `<h1>` for a11y but small/functional.
2. **Invented latency metric.** `content/workflows/*` — outcome node
   "Routed in under a minute" and THE RESULT copy ("within about a minute…")
   are fabricated performance numbers (brief forbids). Reframe all 3 case
   studies' outcome + result as design properties (webhook-triggered,
   synchronous, human-checked) with NO time claims.
3. **Contrast fail.** `--color-ink-faint` (#878d80) on the mat ≈ 2.7:1 — used by
   the footer synthetic-disclosure note, section labels, BOM kind tags. Darken
   the token or move those to `--color-ink-soft`. The disclosure line must be
   legible.
4. **Draw the sheet.** Add a fab-drawing frame device to the page — a drawing
   border with a corner title block, or sheet/rev notation ("SHEET 1 OF 3") —
   so it reads as a document that could go to a fab house, not boards floating
   on graph paper.
5. **Unicode glyph icons.** `←`/`→` in "All workflows" and case-study prev/next
   are glyphs standing in for icons. Replace with an authored SVG chevron
   (match the `.pad-button` arrow).
6. **Hard offset shadow.** `--shadow-pad: 0 2px 0 0` is a zero-blur costume
   shadow; contract's depth rule is one soft blurred shadow. Give the pad a
   small blurred shadow or a real inset lip.
7. **Eyebrow/kicker.** "FEATURED WORKFLOW" label sits above the board's big
   title-block name = the banned kicker shape. Move the distinction inside the
   board (a "FEATURED" tag in the title block) and drop the standalone label.

KEEP (do not dilute): the board system fidelity (matte indigo panels, tinned
chamfered traces + solder blobs, reference designators + leader-line callouts,
run-state-only colour) and the synthetic label on every view.

Also flagged (not blocking): `PRODUCT.md` still says MDX — update to "typed TS
content modules". Ceiling not reached — optional: drawing border, corner title
block, drill/fab legend, dimension lines, fiducial marks.

## Then (in order)

8. Rebuild, re-capture screenshots (`scratchpad`-style CDP script), send the
   recaptures back to the finish reviewer for a verdict pass.
9. Generate `DESIGN.md` via the impeccable documenter.
10. Commit + push.
11. Deploy: import `training-arc` on Vercel, **Root Directory = `Website`**.
12. After deploy: set real `SITE_URL` in `Website/app/layout.tsx`.

## Open decisions (unchanged)

- Custom domain vs `*.vercel.app`.
- Analytics or not.
- Replace synthetic case studies with real workflows from `Workflow/`.
- `Workflow/` side (n8n MCP + workshop) not started yet.
- **Authorize Higgsfield + claude.ai connectors** via claude.ai connector settings
  (not a download; needs the OAuth flow which a non-interactive session can't run).
  Once done, image generation is available and `impeccable` can run comp-first.

## Screenshots from the last build

`Website/.impeccable/review/*.png` (gitignored) — `desktop.png`, `mobile.png`,
`case-desktop.png`, etc. Regenerate with the CDP script if needed:
`scratchpad/shoot.js` (in the session temp dir; may not survive — the pattern is
Chrome `--remote-debugging-port` + `Emulation.setDeviceMetricsOverride` +
`Page.captureScreenshot captureBeyondViewport:true`).
