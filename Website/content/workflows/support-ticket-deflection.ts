import type { Workflow } from "@/lib/workflows";

export const supportTicketDeflection: Workflow = {
  slug: "support-ticket-deflection",
  title: "Support ticket deflection",
  trigger: "New ticket in the helpdesk",
  stack: ["n8n", "Retrieval agent", "Vector store", "Helpdesk API", "Docs site"],
  rev: "04",
  date: "2026-06",
  status: "passing",
  summary:
    "Searches the docs for every new ticket, answers the ones it can stand behind with citations, and hands the rest to a person with the work already done.",
  synthetic: true,
  nodes: [
    { id: "trig", ref: "J1", kind: "trigger", label: "Ticket created" },
    { id: "search", ref: "R1", kind: "tool", label: "Search the docs & past tickets" },
    { id: "agent", ref: "U1", kind: "agent", label: "Draft an answer with citations" },
    { id: "grade", ref: "U2", kind: "logic", label: "Would I stand behind this?" },
    { id: "reply", ref: "A1", kind: "tool", label: "Send the reply", lane: -1 },
    { id: "escal", ref: "A2", kind: "tool", label: "Escalate with a summary", lane: 1 },
    { id: "tag", ref: "U3", kind: "tool", label: "Tag & suggest an owner" },
    { id: "out", ref: "P1", kind: "outcome", label: "Fast answers, honest hand-offs" },
  ],
  edges: [
    { from: "trig", to: "search" },
    { from: "search", to: "agent" },
    { from: "agent", to: "grade" },
    { from: "grade", to: "reply" },
    { from: "grade", to: "escal" },
    { from: "reply", to: "tag" },
    { from: "escal", to: "tag" },
    { from: "tag", to: "out" },
  ],
  prose: {
    problem: [
      "A large share of tickets were questions already answered in the documentation. Agents spent their day re-typing the same explanations, which pushed wait times up for the tickets that genuinely needed a person.",
    ],
    design: [
      "Every new ticket triggers a retrieval pass across the docs site and resolved tickets, pulling the handful of passages most likely to be relevant.",
      "The agent drafts an answer grounded in those passages and cites each one. If the retrieved material doesn't actually cover the question, it is instructed to say so rather than improvise.",
      "A grading step asks a blunt question: is this answer well-supported and complete? Only a clear yes gets sent to the customer. Everything else is escalated — but escalated well: the human gets the drafted answer, the sources, and a one-line summary of what's being asked.",
      "Either way, the ticket is tagged by topic and a likely owner is suggested, so routing isn't a second manual step.",
    ],
    decisions: [
      {
        note:
          "The agent may only answer from retrieved sources. No sources, no confident match — it escalates. It is never allowed to fall back on general knowledge for a support reply.",
        ref: "U1",
      },
      {
        note:
          "The grading step is a separate call with a strict rubric, not a self-check inside the drafting prompt. Asking a model to mark its own work in the same breath doesn't hold up.",
        ref: "U2",
      },
      {
        note:
          "An escalation is treated as a success, not a failure. The measure is whether the human's job got easier, not whether the bot replied.",
        ref: "A2",
      },
    ],
    result: [
      "Well-worn questions get an accurate, cited answer within minutes, day or night.",
      "The tickets that reach a person arrive pre-researched and pre-routed, so the queue that's left moves faster too.",
    ],
  },
};
