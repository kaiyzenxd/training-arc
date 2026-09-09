---
name: MRB Portfolio
description: AI-agent automations drawn as fabricated circuit boards on a cutting mat.
colors:
  mat: "#e5e8e1"
  mat-raised: "#edefe9"
  mat-line: "#dcdfd6"
  mat-edge: "#c7ccc0"
  ink: "#23271f"
  ink-soft: "#5b6157"
  ink-faint: "#626759"
  ink-line: "#9aa093"
  board: "#173653"
  board-deep: "#0f2740"
  board-fail: "#0e2033"
  silk: "#eef2f4"
  silk-soft: "#a9bccc"
  silk-faint: "#8ea6b8"
  trace: "#aeb9c0"
  trace-lit: "#e8eef1"
  solder: "#c6cbce"
  retry: "#e0a13a"
  fail: "#d1483b"
  pass: "#7fd0aa"
typography:
  display:
    fontFamily: "Archivo, 'Arial Narrow', sans-serif"
    fontSize: "clamp(1.9rem, 6vw, 3.6rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.018em"
    fontVariation: "'wght' 800, 'wdth' 125"
  headline:
    fontFamily: "Archivo, 'Arial Narrow', sans-serif"
    fontSize: "clamp(1.35rem, 3.4vw, 2.15rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.018em"
    fontVariation: "'wght' 800, 'wdth' 125"
  title:
    fontFamily: "Archivo, 'Arial Narrow', sans-serif"
    fontSize: "clamp(1.05rem, 1.9vw, 1.4rem)"
    fontWeight: 500
    lineHeight: 1.4
  body:
    fontFamily: "Archivo, 'Arial Narrow', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'Martian Mono', ui-monospace, 'SFMono-Regular', monospace"
    fontSize: "0.625rem"
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: "0.16em"
  data:
    fontFamily: "'Martian Mono', ui-monospace, 'SFMono-Regular', monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.45
rounded:
  xs: "2px"
  sm: "3px"
  md: "4px"
  lg: "6px"
spacing:
  grid: "24px"
  xs: "6px"
  sm: "10px"
  md: "14px"
  lg: "26px"
components:
  button-primary:
    backgroundColor: "transparent"
    textColor: "{colors.silk}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: "11px 20px"
  button-primary-hover:
    backgroundColor: "{colors.silk}"
    textColor: "{colors.board}"
  button-dark:
    backgroundColor: "{colors.mat-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: "11px 20px"
  button-dark-hover:
    backgroundColor: "{colors.board}"
    textColor: "{colors.silk}"
  board:
    backgroundColor: "{colors.board}"
    textColor: "{colors.silk}"
    rounded: "{rounded.lg}"
    padding: "clamp(16px, 3vw, 26px)"
  title-block:
    backgroundColor: "transparent"
    textColor: "{colors.silk}"
    rounded: "{rounded.sm}"
    padding: "clamp(14px, 2.4vw, 20px)"
  tb-flag:
    backgroundColor: "{colors.silk}"
    textColor: "{colors.board}"
    typography: "{typography.label}"
    padding: "3px 9px"
  contact-strip:
    backgroundColor: "{colors.mat-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "clamp(26px, 4vw, 40px)"
---

# Design System: MRB Portfolio

## Overview

**Creative North Star: "Fab Drawing"**

Every automation is drawn as a board that could be sent to a fab house, and the
whole page is the drawing sheet it arrives on. The site reads like an inspection
document: a cool gray-green cutting mat with a faint 24px grid underneath, deep
matte indigo solder-mask panels sitting on it under one soft drop shadow, tinned
traces routing left-to-right from a trigger pad through labeled component
packages to an outcome pad. Reference designators, leader-line callouts, a title
block, a bill-of-materials, and a corner-marked sheet frame all carry the
metaphor without decoration.

The personality is rigorous, quiet, and reliability-minded. Density is
deliberate: generous outer margins, tight internal grids in the title blocks,
data set in tracked uppercase mono so it scans like a spec sheet. Color is
almost entirely structural (mat, ink, board, silkscreen, trace); the only
saturated hues are amber, red, and green, and they appear exclusively as
workflow run-state. Motion is a single authored moment per board.

It explicitly refuses the category default: no dark hero with violet glow, no
floating decorative node-graph, no row of same-size glass cards, no gradient
accents. Depth is never a glow.

**Key Characteristics:**
- Cutting-mat ground (#e5e8e1) with a faint 24px CSS grid, on every page
- Deep matte indigo solder-mask boards (#173653) with 1.5px silkscreen hairline borders and 6px corners
- Archivo expanded-heavy (wght 800, wdth 125) for every stamped heading; Martian Mono, tracked and uppercase, for every label, field, and legend
- Amber / red / green only as run-state, never as decoration
- One soft offset+blur drop shadow for depth; no glow, no zero-blur
- A drawing-sheet frame with L-shaped corner marks and a bottom-right fab title block wrapping the whole site

## Colors

A structural palette: three greige mat tones, four inks, an indigo board family
with its silkscreen and trace tints, and three signal colors held in reserve.

### Primary
- **Solder-Mask Indigo** (#173653): the board surface — every workflow panel, the on-hover fill of the dark pad button, the About page list markers, the `::selection` background on the mat.
- **Board Deep** (#0f2740): endpoint pads (trigger/outcome rects), board scrollbar track, and the shadow color that all elevation is tinted with.
- **Board Fail** (#0e2033): reserved darkened board tone for a failed-run panel.

### Secondary (silkscreen & trace — the marks printed on the board)
- **Silkscreen White** (#eef2f4): primary text and hairline detail on the board; never pure white. Also the `.on-board` selection and focus color.
- **Silkscreen Soft** (#a9bccc): component outlines, secondary silk text.
- **Silkscreen Faint** (#8ea6b8): title-block borders, leader lines, callout sub-text, legend rest-state.
- **Tinned Trace** (#aeb9c0): default 2px trace stroke and pin ticks.
- **Trace Lit** (#e8eef1): the highlighted spine of a passing board.
- **Solder** (#c6cbce): the small junction blobs where traces branch.

### Tertiary (run-state signal — used ONLY as workflow state)
- **Retry Amber** (#e0a13a): a retrying trace (dashed 6/5) and its legend/status dot.
- **Fail Red** (#d1483b): a failed trace and its legend/status dot.
- **Pass Green** (#7fd0aa): a passing trace, the load-time trace pulse, and its legend/status dot.

### Neutral
- **Cutting Mat** (#e5e8e1): the page ground everywhere.
- **Mat Raised** (#edefe9): lifted surfaces — footer, contact strip.
- **Mat Line** (#dcdfd6): the 24px background grid and hairline dividers.
- **Mat Edge** (#c7ccc0): scrollbar thumb on the mat.
- **Ink** (#23271f): body text and headings on the mat; contact-strip and BOM borders.
- **Ink Soft** (#5b6157): secondary body copy, intro copy, back-links.
- **Ink Faint** (#626759): small print, section labels, field keys on the mat (AA at ~4.7:1).
- **Ink Line** (#9aa093): borders and rules only — never text.

### Named Rules
**The Run-State Rule.** Amber, red, and green appear only to report a workflow's
run status (trace color, legend swatch, status dot). They are never used for
emphasis, links, buttons, or decoration. On any given screen their combined area
is a few pixels of trace.

**The No-Pure-White Rule.** The lightest ink on the board is Silkscreen White
(#eef2f4), never #fff. The mat is never pure white either.

**The Ink-Line Rule.** #9aa093 is a border/rule color only. Text never uses it.

## Typography

**Display Font:** Archivo (variable, `wdth` axis) — with Arial Narrow fallback
**Body Font:** Archivo (regular weight)
**Label/Mono Font:** Martian Mono — with ui-monospace fallback

**Character:** A hard-stamped industrial pairing. Archivo is pushed to its
heavy, expanded extreme (`font-variation-settings: "wght" 800, "wdth" 125`,
uppercase, -0.018em tracking, 0.98 line-height) so headings read like an ink
stamp on a drawing. Martian Mono is the data face: every label, field key,
legend, reference designator, callout, and the sheet title block is set in it,
tracked wide (0.14–0.20em) and uppercased, so metadata scans like a parts list.

### Hierarchy
- **Display / Stamp** (Archivo, wght 800 / wdth 125, clamp(1.9rem, 6vw, 3.6rem), lh 0.98, uppercase): page titles (`.intro-title`), the contact-strip headline, the footer name. Class `.stamp`.
- **Headline** (Archivo, wght 800 / wdth 125, clamp(1.35rem, 3.4vw, 2.15rem), uppercase): board title-block name (`.tb-name`), case-study section heads (`.prose-h`).
- **Title / Lede** (Archivo, weight 500, clamp(1.05rem, 1.9vw, 1.4rem), lh 1.4): the home-page lede paragraph; its bold spans shift to wght 800 / wdth 115.
- **Body** (Archivo, weight 400, 1rem, lh 1.5–1.65, color Ink Soft): all running copy. Measure capped at 52–68ch (`.prose-measure` 68ch, `.prose-measure` on copy 52ch).
- **Label** (Martian Mono, weight 600, 0.5625–0.625rem, 0.14–0.20em tracking, uppercase): field keys, legends, nav links, section labels, the sheet title block, the `FEATURED` flag. Classes `.legend` / `.field-key`.
- **Data** (Martian Mono, weight 400–500, 0.6875–0.75rem): field values, notes-block values, BOM refs, SVG callouts (`.callout-text` fixed at 10px).

### Named Rules
**The Two-Face Rule.** Archivo stamps, Martian Mono labels. If it is a heading or
prose it is Archivo; if it is metadata, a designator, or a legend it is Martian
Mono, tracked and uppercase. Nothing else is used.

**The One-Callout-Size Rule.** Every leader-line callout on a board is set at one
constant size (`.callout-text`, 10px). Callouts are never scaled for emphasis.

## Layout

Centered single column, `max-width: 1280px`, page padding `clamp(20px, 5vw, 64px)`
with a `clamp(28px, 4.5vw, 60px)` top. The home page opens with a tight lede
(max 46rem) so the featured board leads the first viewport; the board itself is
full-width to `max-width: 100%` inside the page column, its SVG horizontally
scrollable on narrow screens (`min-width` 560px hero / 430px compact).

Secondary boards sit in `.board-grid` — one column, two columns at `min-width:
900px`, `clamp(20px, 3vw, 32px)` gap. Case-study body is a single column that
becomes a `15rem 1fr` split with a sticky left rail at `min-width: 1040px`.

Section rhythm is large: `clamp(48px, 8vw, 96px)` between major sections,
`clamp(56px, 9vw, 104px)` above the contact strip. Internal rhythm is tight and
grid-based: title-block field grids at 12–20px gaps, `auto-fit minmax(150px,
1fr)` columns above 480px. Background grid is 24px, offset `-1px -1px`.

Breakpoints in use: 480px (title-block fields), 560px (hide full name in nav),
620/640px (sheet stamp / drawing frame collapse), 900px (board grid), 1040px
(case-study rail).

## Elevation & Depth

A hybrid: tonal layering on the mat (Mat / Mat Raised for lifted chrome), plus
exactly one shadow idiom for the boards and pads. Every shadow is a soft
offset-plus-blur tinted with Board Deep (`rgba(15, 39, 64, ...)`). There is no
glow, no inset shadow, and no zero-blur hard offset anywhere in the system.
Board interiors get their own faint 6px solder-mask dot texture and a hairline
`Silkscreen Soft` border rather than an inner shadow.

### Shadow Vocabulary
- **Board** (`box-shadow: 0 18px 40px -18px rgba(15, 39, 64, 0.45)`): the featured/full board resting on the mat.
- **Board Small** (`box-shadow: 0 10px 24px -14px rgba(15, 39, 64, 0.4)`): compact boards in the grid.
- **Pad** (`box-shadow: 0 3px 9px -2px rgba(15, 39, 64, 0.32)`): the silkscreen pad button inside a board title block.
- **Pad Dark** (`box-shadow: 0 3px 9px -3px rgba(35, 39, 31, 0.24)`): the dark pad button on the mat (`.pad-button--dark`).

### Named Rules
**The One-Shadow Rule.** Depth is one soft drop shadow (y-offset + blur, Board
Deep tint). Never a glow, never an inset, never a zero-blur hard offset. Hover
adds a 1–3px `translateY` lift, not a bigger shadow.

## Shapes

Small, mechanical radii throughout: focus rings 1px, pad buttons 2px,
title-blocks / notes-blocks 3px, contact strip and SVG package rects 4px, the
board itself 6px, endpoint pads 3px. Nothing is pill-shaped; nothing is a
perfect circle except the 7px status dots, the 3px solder blobs, and the 2.4px
agent-package origin dot.

Borders are hairlines: 1px (title-block, dividers, drawing frame), 1.25–1.5px
(SVG component outlines, pad button, board border), 1.5px (BOM top rule,
registration marks). Traces are 2px, the lit spine 2–3px. The `.synthetic-stamp`
is the one rotated element (`rotate(-1.2deg)`), reading like a hand-applied
rubber stamp. The recurring silhouette is the routed board: a wide panel, pads
at the far left and right, orthogonal traces with 45°-chamfered bends between.

## Components

### Buttons
- **Shape:** near-square (2px radius), 1.5px border.
- **Primary — the pad button** (`.pad-button`): transparent fill, 1.5px Silkscreen White border, Silkscreen White Martian Mono label (0.75rem, 0.13em tracking, uppercase), `11px 20px` padding, Pad shadow, a CSS-drawn 7px arrowhead (`::after`, rotated bordered square) as its trailing mark. Lives inside board title blocks.
- **Hover / Focus:** fill flips to Silkscreen White, text to Solder-Mask Indigo, `translateY(-1px)`, 160ms ease. Focus-visible: 2px outline (Silkscreen on board, Indigo on mat), 2px offset.
- **Dark variant** (`.pad-button--dark`): on the mat — Ink border and text, Pad Dark shadow; hover fills Solder-Mask Indigo with Silkscreen text.

### Cards / Containers — the Board
- **Corner Style:** 6px radius, `overflow: hidden`.
- **Background:** Solder-Mask Indigo with a faint white 6px radial-dot texture overlay.
- **Border:** 1.5px Silkscreen Soft; hover on a linked board shifts it to Silkscreen White with a `translateY(-3px)` lift.
- **Shadow Strategy:** Board (hero/full) or Board Small (compact) — see Elevation.
- **Internal Padding:** `clamp(16px, 3vw, 26px)` header/scroll; compact drops to 14px.
- **Anatomy:** header (title-block + notes-block), horizontally-scrollable SVG body, then a bottom legend strip (full) or a one-line summary (compact).

### The other mat container
- **Contact strip / footer:** Mat Raised fill, 1px Ink border (contact strip) or 1px Mat Line top border (footer), 4px / square corners, `clamp(26px, 4vw, 40px)` padding.

### Title Block & Fields
- **Title block:** transparent, 1px Silkscreen Faint border, 3px radius. Holds an optional `FEATURED` flag (solid Silkscreen chip, Indigo text, 0.2em tracking), the stamped workflow name, a mono field grid (TRIGGER / STACK / STATUS), an optional dashed `SYNTHETIC` stamp, and the pad button.
- **Notes block:** same border treatment, a `dt/dd` grid (PARTS / BRANCHES / RUNTIME / REV).
- **Field keys** (`.field-key`): Martian Mono 600, 0.625rem, 0.16em tracking, uppercase, Silkscreen Faint. **Values:** Martian Mono, 0.6875–0.75rem, Silkscreen White.

### Navigation
- **Style:** a single `.site-nav` bar, 1px Mat Line bottom border, `18px clamp(18px, 5vw, 64px)` padding. Left: `MRB` in Archivo black expanded (`font-stretch: 125%`) beside the full name in small mono (hidden below 560px). Right: `Work / About / Email` as `.legend` mono links (0.625rem).
- **States:** hover draws a 1px Ink bottom border under the link (140ms). Active/current is not specially marked.
- **Footer:** Mat Raised, stamped name + one mono line + email/GitHub links, a dashed-top-border mono disclaimer note.

### Signature: the Board SVG
Generated from typed `nodes`/`edges` via `lib/board-layout.ts` (COL_W 168, NODE
112x50, LANE_H 66). Components are Silkscreen-Soft-outlined rounded rects (4px)
with a bold mono reference designator (`.pkg-ref`, e.g. `U1`, `R4`) and a kind
tag (`TRIGGER / AGENT / TOOL / DECISION / OUTCOME`); agent packages get vertical
pin ticks and a corner origin dot, others get horizontal ticks. Endpoints
(trigger/outcome) are filled Board Deep with three short "finger" connectors.
Traces are 2px, orthogonal with a chamfered bend, `pathLength={1}`, with a 3px
Solder blob at each branch. A retrying trace is dashed `6 5`; failed/retrying
traces take their run-state color. Non-endpoint packages carry a 1px leader line
to an UPPERCASE mono callout at one constant 10px size, alternating above/below
by lane and column parity.

### Signature: the Sheet
- **Drawing frame** (`.drawing-frame`): `position: absolute; inset: 9px` (5px below 640px), 1px `rgba(35,39,31,0.2)` border, four 14px L-shaped corner registration marks. `pointer-events: none`. On every page.
- **Sheet stamp** (`.sheet-stamp`): a fab title block flush to the bottom-right of every page — a 4-cell mono grid PROJECT / SHEET / SCALE / REV, 1px Ink outer border, Ink-Line inner dividers, per-route SHEET name (Index / Schedule / Detail / Notes / 404). Collapses to a 2-column grid below 620px.

### Bill of Materials (case study)
`.bom-list`: a 1.5px Ink top rule, rows split `1.9rem` mono ref + stacked
what/kind, 1px Mat Line row dividers. `.decision-ref` designators are boxed (1px
Ink, 2px radius) mono tags.

## Do's and Don'ts

### Do:
- **Do** put every workflow on a Solder-Mask Indigo board (#173653) with a 1.5px Silkscreen border, 6px corners, and one Board shadow.
- **Do** set every label, field key, legend, designator, and callout in Martian Mono, tracked (≥0.14em) and uppercase.
- **Do** stamp headings in Archivo at `font-variation-settings: "wght" 800, "wdth" 125`, uppercase.
- **Do** keep the mat ground and its faint 24px grid visible on every page, wrapped by the drawing frame and stamped with the bottom-right sheet title block.
- **Do** convey depth with a single soft offset+blur shadow tinted `rgba(15, 39, 64, ...)`; use `translateY` for hover lift.
- **Do** reserve amber (#e0a13a), red (#d1483b), and green (#7fd0aa) exclusively for workflow run-state (trace, legend swatch, status dot).
- **Do** label unverified case-study content with the dashed `SYNTHETIC` stamp and keep the footer disclaimer until real client work replaces it.
- **Do** draw icons as authored SVG (see `<Chevron>`) or CSS borders.

### Don't:
- **Don't** use a glow, an inset shadow, or a zero-blur hard offset shadow anywhere.
- **Don't** introduce gradient fills, violet/blue accents, or same-size glass cards — this world refuses the category hero.
- **Don't** use pure #fff for text or ground; the lightest inks are #eef2f4 (board) and the mat tones.
- **Don't** color text with #9aa093 (Ink Line) — it is a border color only.
- **Don't** use amber/red/green for emphasis, links, or buttons.
- **Don't** scale callouts, add a second display face, or set body copy wider than ~68ch.
- **Don't** use glyph-font or third-party icon-set icons.
- **Don't** add motion beyond the two gated board moments (the one-time trace pulse on a passing board; the deploy route-in on the case-study board), and keep both behind `prefers-reduced-motion`.
