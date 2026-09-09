import type { Workflow } from "@/lib/workflows";

export const inboundLeadTriage: Workflow = {
  slug: "inbound-lead-triage",
  title: "Inbound lead triage & routing",
  trigger: "New form submission (webhook)",
  stack: ["n8n", "GPT-4-class agent", "Enrichment API", "CRM", "Slack", "Calendar"],
  rev: "03",
  date: "2026-07",
  status: "passing",
  summary:
    "Reads every inbound enquiry, works out who it is and what they need, then drafts a reply and routes it to the right person — or books the call itself.",
  synthetic: true,
  nodes: [
    { id: "trig", ref: "J1", kind: "trigger", label: "Form submission arrives" },
    { id: "enrich", ref: "R1", kind: "tool", label: "Look up the company", label2: "size, sector, stack" },
    { id: "agent", ref: "U1", kind: "agent", label: "Classify intent & fit", label2: "reasons over message + data" },
    { id: "route", ref: "U2", kind: "logic", label: "Decide the route" },
    { id: "book", ref: "A1", kind: "tool", label: "Offer times & book", lane: -1 },
    { id: "draft", ref: "A2", kind: "tool", label: "Draft a reply for a human", lane: 1 },
    { id: "crm", ref: "U3", kind: "tool", label: "Write to the CRM" },
    { id: "out", ref: "P1", kind: "outcome", label: "Routed in under a minute" },
  ],
  edges: [
    { from: "trig", to: "enrich" },
    { from: "enrich", to: "agent" },
    { from: "agent", to: "route" },
    { from: "route", to: "book" },
    { from: "route", to: "draft" },
    { from: "book", to: "crm" },
    { from: "draft", to: "crm" },
    { from: "crm", to: "out" },
  ],
  prose: {
    problem: [
      "Inbound enquiries landed in a shared inbox and waited. By the time someone read one, qualified it, and found the right owner, the best leads had gone cold or gone elsewhere.",
      "The manual triage was also inconsistent — whoever picked it up applied their own gut feel for fit and urgency.",
    ],
    design: [
      "A webhook fires the moment a form is submitted. An enrichment call fills in what the form left out: company size, sector, and the tools they already run.",
      "The agent reads the message alongside that context and makes two judgements — what the person actually wants, and how good a fit they are. It returns a short structured rationale, not just a label, so a human can sanity-check it later.",
      "A routing step turns that judgement into an action: strong fit with clear intent gets offered calendar times directly; everything else gets a drafted reply queued for a person, with the agent's reasoning attached.",
      "Every path ends by writing the enquiry, the classification, and the action taken back to the CRM.",
    ],
    decisions: [
      {
        note:
          "The agent never sends the first reply on a borderline lead. If fit or intent is unclear, it drafts and hands off — a slightly slower reply beats a confidently wrong one.",
        ref: "U2",
      },
      {
        note:
          "Enrichment is allowed to fail. On a timeout it retries twice, then the agent runs on the form data alone and flags that it did so.",
        ref: "R1",
      },
      {
        note:
          "Calendar booking is the only step that acts on the outside world without a human. It is scoped to a single meeting type and a fixed availability window.",
        ref: "A1",
      },
    ],
    result: [
      "Enquiries are read, qualified, and routed within about a minute of arriving, at any hour.",
      "Owners get a lead with the context already gathered and a first-draft reply written, so their job is to check and send rather than start from a blank page.",
    ],
  },
};
