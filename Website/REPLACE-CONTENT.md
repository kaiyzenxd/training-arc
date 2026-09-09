# Replace-before-real-launch checklist

Everything here is placeholder or synthetic and must be swapped for real material
before this is presented as a live portfolio.

## Synthetic case studies

All three workflows in `content/workflows/` are **invented sample patterns**, not
client builds. They are realistic and safe to show while marked synthetic, but
they are not proof of your work.

| File | What to do |
|---|---|
| `inbound-lead-triage.ts` | Replace with a real workflow, or delete. |
| `invoice-inbox-reconciliation.ts` | Replace with a real workflow, or delete. |
| `support-ticket-deflection.ts` | Replace with a real workflow, or delete. |

For each real one you add: set `synthetic: false`. Once **no** workflow is
synthetic, also remove the footer disclaimer in `components/footer.tsx`
(the `.site-footer-note` line).

## Not fabricated (deliberately left out)

The build did **not** invent any of these — add them only when true:

- **Metrics** — time saved, volumes, error rates, "under a minute". The current
  `result` sections are written qualitatively on purpose. Add real numbers to the
  `prose.result` text when you have them.
- **Client names / logos / testimonials** — none anywhere. Add a testimonial
  section later if you get permission to quote a client.

## Identity / links to confirm

- `components/footer.tsx` and several `mailto:` links use
  `markryanbaricuatro@gmail.com` — confirm that's the address you want public.
- `components/footer.tsx` links `github.com/kaiyzenxd` — confirm.
- `components/nav.tsx` shows "MRB" + "Mark Ryan Baricuatro". No logo asset; add
  one to `public/` and wire it in if you want a mark.
- `app/layout.tsx` `SITE_URL` is `https://mrb-portfolio.vercel.app` — update to
  your real Vercel URL (or custom domain) after the first deploy, so OpenGraph
  tags and `metadataBase` are correct.

## Favicon

`app/favicon.ico` is the Next.js default. Replace with your own.
