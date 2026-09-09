---
version: 1
slug: "website-app-page-tsx"
primary_target: "Website/app/page.tsx"
related_targets: ["Website/app/work/[slug]/page.tsx","Website/app/about/page.tsx"]
---

## Scope

The portfolio of Mark Ryan Baricuatro: home (a set of workflow "boards"), a case-study page per workflow, a short about + contact. Visitor mode: **Experience**.

## Audience & job

A skeptical operations lead or founder skimming on a laptop between meetings, deciding whether this person builds automation that works and won't break. Action: email via "Start a project". Proof: 2–3 real AI-agent n8n workflows shown doing their job — trigger, reasoning steps, tool calls, outcome, failure handling. No fabricated metrics, clients, or testimonials.

## Direction contract

**THESIS.** Each automation is drawn as a board that could be sent to a fab house — inspectable, labeled, stamped with a title block. It refuses the category arrangement: dark hero, violet glow, a floating decorative node-graph, same-size glass cards.

**OWN-WORLD.** Deep matte indigo solder-mask panels (#173653), 1.5px silkscreen-white hairline borders, 6px corners. Tinned-silver traces (2px) with 45° chamfered bends and small solder-blob junctions. Components are silver-outlined rounded rects with pin ticks and a mono reference designator (U1, R4), each tied by a 1px leader line to an UPPERCASE Martian Mono plain-language callout at one constant size. Ground is a cool gray-green cutting-mat (#e4e7e0) with a faint 24px grid. Archivo (expanded, heavy) stamps title-block headings; Martian Mono, tracked, sets every label, field, legend. Amber (#e0a13a) and signal-red (#d1483b) appear only as run-state. Depth is one soft drop shadow (y-offset + blur), never a glow.

**STORY.** The visitor sees a real workflow rendered as an engineered board, reads its title block (what it does, what it runs on), follows the lit trace from trigger to outcome, and concludes: rigorous, reliability-minded, real. They open one — it deploys from a compact outline into the full routed board with the write-up beneath — then email.

**FIRST VIEWPORT.** Cutting-mat ground, faint grid. The featured workflow's board dominates: a wide matte-indigo panel (~90vw, max 1180px) with a soft drop shadow. Top-left, a bordered title block in Martian Mono — WORKFLOW / TRIGGER / STACK / REV / DATE — with a stamped, etched-looking "Start a project" pad inside it. Board body: a TRIGGER pad far left, tinned traces routing rightward through 3–5 labeled component packages, to an OUTCOME pad far right; the featured trace is lit and a single pulse travels it once on load (static when reduced-motion). A legend strip runs along the board's bottom edge: PASSING / RETRYING / FAILED with trace swatches. Site nav is minimal on the ground itself — top-left "MRB · Work / About", email top-right. Two more boards follow below at half scale.

**FORM.** "Fab Drawing" — PCB fabrication / assembly document. Grounded direction 6 of 7. Seed key: 80db866d. Build path: code-led.

**FINISH.** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## States & ranges

Workflows: 3 at launch; must not look broken at 1 or sparse at 10. Case-study body: short (structure only, no numbers) to long (diagram + real metrics). Per workflow: passing / retrying / failed trace states. Board must read as intentional with only 1–2 workflows ready.

## Memorable moment

The compact board outline (title block + one trace) deploying into the full routed board on open — structural continuity, no page swap.

## Unresolved decisions

Custom domain vs `*.vercel.app`; analytics; publish sanitized workflow JSON or write-ups only. Real workflow content not yet supplied — launch uses clearly-labeled synthetic case studies with a replacement list handed to the user.
