import type { Workflow } from "@/lib/workflows";

export const invoiceInboxReconciliation: Workflow = {
  slug: "invoice-inbox-reconciliation",
  title: "Invoice inbox reconciliation",
  trigger: "Email to ap@ with a PDF attached",
  stack: ["n8n", "Vision-capable agent", "Accounting API", "Object storage", "Slack"],
  rev: "02",
  date: "2026-08",
  status: "retrying",
  summary:
    "Pulls the numbers off every incoming invoice, matches them to an open purchase order, and posts a draft bill — or flags exactly what doesn't line up.",
  synthetic: true,
  nodes: [
    { id: "trig", ref: "J1", kind: "trigger", label: "Invoice email arrives" },
    { id: "dedupe", ref: "R1", kind: "logic", label: "Seen this file before?" },
    { id: "extract", ref: "U1", kind: "agent", label: "Read the invoice", label2: "vendor, amount, PO, lines" },
    { id: "match", ref: "U2", kind: "agent", label: "Match to an open PO" },
    { id: "conf", ref: "U3", kind: "logic", label: "Confident enough?" },
    { id: "post", ref: "A1", kind: "tool", label: "Post a draft bill", lane: -1 },
    { id: "review", ref: "A2", kind: "tool", label: "Send to a human queue", lane: 1 },
    { id: "out", ref: "P1", kind: "outcome", label: "Draft bill, ready to approve" },
  ],
  edges: [
    { from: "trig", to: "dedupe" },
    { from: "dedupe", to: "extract" },
    { from: "extract", to: "match" },
    { from: "match", to: "conf" },
    { from: "conf", to: "post" },
    { from: "conf", to: "review", state: "retrying" },
    { from: "post", to: "out" },
    { from: "review", to: "out" },
  ],
  prose: {
    problem: [
      "Invoices arrived as email attachments in every layout imaginable. Someone opened each one, keyed the vendor, amount, and PO number into the accounting system, and checked it against what was ordered.",
      "It was slow, it was error-prone at the end of the month, and duplicates slipped through when the same invoice was sent twice.",
    ],
    design: [
      "Each new attachment is hashed and checked against everything processed before, so a re-send is caught immediately.",
      "A vision-capable agent reads the document — not a rigid template, so it copes with new vendors — and returns the vendor, totals, PO reference, and line items as structured fields, each with a confidence score.",
      "A second step matches those fields against open purchase orders: exact PO reference first, then vendor plus amount within tolerance.",
      "A confidence gate decides what happens next. Clean, high-confidence matches post as draft bills for a person to approve. Anything uncertain — a missing PO, an amount outside tolerance, a low extraction score — goes to a review queue with the specific mismatch spelled out.",
    ],
    decisions: [
      {
        note:
          "Nothing posts to the ledger automatically. The best case is a draft bill a human approves in one click; the workflow's job is to remove the typing, not the sign-off.",
        ref: "A1",
      },
      {
        note:
          "The confidence gate fails toward review, not toward posting. A false 'needs a look' is cheap to clear; a false 'all good' is a wrong payment.",
        ref: "U3",
      },
      {
        note:
          "Duplicate detection runs on a file hash before any model is called, so re-sends cost nothing and can never double-book.",
        ref: "R1",
      },
    ],
    result: [
      "Each invoice is read and matched to a purchase order as it arrives, so reconciliation happens continuously instead of in a month-end batch.",
      "Clean matches become draft bills for one-click approval; anything uncertain lands in a review queue that names the specific mismatch, not just that something is wrong.",
    ],
  },
};
