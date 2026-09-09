import type { Workflow } from "@/lib/workflows";
import { fromN8n, type RawWorkflow, type NodeOverride } from "@/lib/n8n-import";
import raw from "./kb-query.workflow.json";

const overrides: Record<string, NodeOverride> = {
  "Receive KB Query [AUTO]": {
    ref: "J1",
    label: "Slack @-mention",
    detail: "Native Slack Trigger — app_mention events across the workspace",
  },
  "Check Not Bot Message [AUTO]": {
    ref: "K1",
    label: "Ignore the bot's own posts",
    detail: "Drops any message carrying a bot_id so it can't answer itself",
  },
  "Extract Query Data [AUTO]": {
    ref: "U1",
    label: "Pull out who / where / question",
    detail: "Strips the @-mention, keeps the user, channel, and question text",
  },
  "Validate Input [AUTO]": {
    ref: "K2",
    label: "Question present, ≤ 2000 chars",
  },
  "Check Rate Limit [AUTO]": {
    ref: "U2",
    label: "Count this user's requests",
    detail: "In-memory sliding window — 20 per minute per user",
  },
  "Rate Limit Gate [AUTO]": { ref: "K3", label: "Under the limit?" },
  "Extract Search Keywords [AUTO]": {
    ref: "A1",
    kind: "agent",
    label: "Claude: 3–5 search terms",
    detail: "Small, cheap call — returns a JSON array of keywords",
  },
  "Parse Keywords [AUTO]": {
    ref: "U3",
    label: "Build the Airtable filter",
    detail: "Keywords → OR() filterByFormula; falls back to a broad search on a parse failure",
  },
  "Search KB Airtable [AUTO]": {
    ref: "U4",
    label: "Search the KnowledgeBase",
    detail: "Top 5 rows matching the keyword filter",
  },
  "Check Results Found [AUTO]": { ref: "U5", label: "Any rows come back?" },
  "Route on Results [AUTO]": {
    ref: "K4",
    label: "Answer, or say we don't know",
  },
  "Build Context [AUTO]": {
    ref: "U6",
    label: "Assemble the prompt",
    detail: "Top 3 docs + a strict Slack-mrkdwn system prompt",
  },
  "Set No Results Message [AUTO]": {
    ref: "U7",
    label: "Canned 'nothing found' reply",
  },
  "Synthesize Answer [AUTO]": {
    ref: "A2",
    kind: "agent",
    label: "Claude: answer from the docs only",
    detail: "Grounded answer, cites the source document by name, no outside knowledge",
  },
  "Parse Claude Answer [AUTO]": { ref: "U8", label: "Take the reply text" },
  "Send Reply to Slack [AUTO]": {
    ref: "P1",
    kind: "outcome",
    label: "Post the answer in the thread",
  },
  "Validate Output [AUTO]": { ref: "K5", label: "Slack accepted it?" },
  "On Query Error": {
    ref: "J2",
    label: "Any unhandled error",
    detail: "Error Trigger — catches a failure anywhere in the run",
  },
  "Log Query Error [AUTO]": {
    ref: "U9",
    label: "Capture node, message, time",
  },
  "Send Query Error Alert [AUTO]": {
    ref: "P2",
    kind: "outcome",
    label: "Alert the team in Slack",
    detail: "Block message naming the failed node and the error",
  },
};

const board = fromN8n(raw as unknown as RawWorkflow, overrides);

export const kbQuery: Workflow = {
  slug: "kb-query",
  title: "KB Query — Slack knowledge-base bot",
  trigger: "Slack @-mention (app_mention)",
  stack: ["n8n (self-hosted)", "Slack app + native trigger", "Claude (Sonnet)", "Airtable"],
  rev: "02",
  date: "2026-08",
  status: "passing",
  summary:
    "A Slack bot you can @-mention in any channel. It turns the question into search terms, matches them against the Airtable index that KB Ingestion builds, and answers from the matching documents only — naming the source, or saying plainly it couldn't find one.",
  synthetic: false,
  layout: "n8n",
  video: "https://www.loom.com/share/7afc3429f1c24fefa8299eb568494546",
  download: "/workflows/kb-query.workflow.json",
  related: ["kb-ingestion"],
  raw,
  nodes: board.nodes,
  edges: board.edges,
  prose: {
    problem: [
      "The team wrote things down, but even with everything documented people asked the same questions in Slack — nobody breaks off a conversation to open a folder of Docs or a search tool.",
      "So the bot had to do two hard things: find the right document from a vague, conversational question, and answer from it honestly — including admitting when the answer isn't in there.",
    ],
    design: [
      "A dedicated Slack app sends every @-mention to n8n's native Slack Trigger. The first gate drops the bot's own messages so it can't answer itself in a loop; the question is then validated and rate-limited per user — a sliding window, 20 a minute — before any paid call is made.",
      "A small, cheap Claude call turns the question into 3–5 search terms. Those are matched against the Keywords field on each record — the field KB Ingestion fills in for every document — with a plain substring search, no vector database. If the model's keyword output can't be parsed, it falls back to a broad search.",
      "The top matches are checked for content. Nothing found, and the bot says so plainly. Results, and a second Claude call answers using only those documents' summaries and text, formatted for Slack's mrkdwn (which isn't standard Markdown), naming the source document in a sentence.",
      "The reply goes back to the thread and the Slack API's response is checked; a failure there is routed to the same error handler as anything else.",
    ],
    decisions: [
      {
        note: "The bot answers only from the retrieved documents and is told to say when the answer isn't there. It is never allowed to fall back on general knowledge for a support reply.",
        ref: "A2",
      },
      {
        note: "Two separate Claude calls — one to pull search terms out of the question, one to answer — instead of one big call. The first is tiny and cheap, and keeping them apart makes each prompt simple and each failure easy to place.",
        ref: "A1",
      },
      {
        note: "Retrieval is a keyword substring match, not embeddings. It works because the hard part — deciding what terms make a document findable — was already done by Claude at ingestion time. There's no vector store to run or keep in sync.",
        ref: "U3",
      },
      {
        note: "Input validation and rate limiting run before the first API call, so a burst of mentions can't run up a bill.",
        ref: "K3",
      },
      {
        note: "Every branch — bad input, rate-limited, no results, Slack rejected the send — has a defined path, and an Error Trigger catches anything unhandled and posts the failed node and message to Slack.",
        ref: "J2",
      },
    ],
    result: [
      "Anyone @-mentions the bot in any channel and gets an answer grounded in the team's docs, with the source named — or a plain 'not found', never a silent guess.",
      "It keeps working because the other half of the system keeps the index current: a Doc added to the watched folder is searchable within about a minute, so the bot answers from what the docs say now.",
    ],
  },
};
