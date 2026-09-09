import type { Workflow } from "@/lib/workflows";
import { fromN8n, type RawWorkflow, type NodeOverride } from "@/lib/n8n-import";
import raw from "./kb-ingestion.workflow.json";

const overrides: Record<string, NodeOverride> = {
  "Watch KB Folder Created [AUTO]": {
    ref: "J1",
    label: "New file in the Drive folder",
    detail: "Google Drive Trigger — polls one folder every minute for created files",
  },
  "Check File Type [AUTO]": {
    ref: "K1",
    label: "Is it a Google Doc?",
    detail: "Only application/vnd.google-apps.document continues",
  },
  "Extract File Metadata [AUTO]": {
    ref: "U1",
    label: "Keep id, name, URL",
  },
  "Download File Content [AUTO]": {
    ref: "U2",
    label: "Export the Doc as plain text",
    detail: "Drive export endpoint, text/plain",
  },
  "Extract and Clean Text [AUTO]": {
    ref: "U3",
    label: "Normalise & cap at 15k chars",
    detail: "Collapses blank lines, truncates long documents",
  },
  "Check Has Content [AUTO]": {
    ref: "K2",
    label: "More than 50 characters?",
  },
  "Search Existing Record [AUTO]": {
    ref: "U4",
    label: "Look this doc up in Airtable",
    detail: "Match on DocId — the Drive file id, not the title",
  },
  "Build Claude Request [AUTO]": {
    ref: "U5",
    label: "Assemble the indexer prompt",
    detail: "Carries the Airtable record id through if the doc already exists",
  },
  "Generate Summary and Keywords [AUTO]": {
    ref: "A1",
    kind: "agent",
    label: "Claude: summary, keywords, doc type",
    detail: "Strict JSON — 2–3 sentence summary, 8–12 keywords, sop / product_doc / faq / other",
  },
  "Parse and Build Record [AUTO]": {
    ref: "U6",
    label: "Validate the JSON, build the row + Slack card",
    detail: "Falls back to empty summary / 'other' if the JSON won't parse",
  },
  "Check Record Exists [AUTO]": {
    ref: "K3",
    label: "Seen this doc before?",
    plainBranches: true,
  },
  "Update KB Record [AUTO]": { ref: "U7", label: "Update the existing row" },
  "Create KB Record [AUTO]": { ref: "U8", label: "Create a new row" },
  "Merge Save Result": {
    ref: "U9",
    label: "Rejoin the two paths",
    detail: "Whichever branch ran, continue as one",
  },
  "Send Ingestion Alert [AUTO]": {
    ref: "P1",
    kind: "outcome",
    label: "Post the ingested-doc card in Slack",
  },
  "On Ingestion Error": {
    ref: "J2",
    label: "Any unhandled error",
    detail: "Error Trigger — catches a failure anywhere in the run",
  },
  "Log Ingestion Error [AUTO]": {
    ref: "U10",
    label: "Capture node, message, time",
  },
  "Send Ingestion Error Alert [AUTO]": {
    ref: "P2",
    kind: "outcome",
    label: "Alert the team in Slack",
  },
};

const board = fromN8n(raw as unknown as RawWorkflow, overrides);

export const kbIngestion: Workflow = {
  slug: "kb-ingestion",
  title: "KB Ingestion — Drive to knowledge base",
  trigger: "New Google Doc in a watched Drive folder",
  stack: ["n8n (self-hosted)", "Google Drive", "Claude (Sonnet)", "Airtable", "Slack"],
  rev: "01",
  date: "2026-08",
  status: "passing",
  summary:
    "Watches a Google Drive folder. When a Doc is added, it exports the text, has Claude write a summary, a set of search keywords, and a doc type, and upserts a record into Airtable — building the index that the KB Query bot answers from.",
  synthetic: false,
  layout: "n8n",
  download: "/workflows/kb-ingestion.workflow.json",
  related: ["kb-query"],
  nodes: board.nodes,
  edges: board.edges,
  prose: {
    problem: [
      "The team wrote things down in Google Docs, but a folder of Docs isn't searchable, and every attempt to keep a separate index — a table, a spreadsheet — fell behind within weeks because updating it was manual.",
      "It needed to be automatic: put a Doc in the folder, and it becomes a searchable record without anyone touching a database.",
    ],
    design: [
      "A Google Drive Trigger polls one folder every minute. Anything that isn't a Google Doc is dropped before anything else runs.",
      "The Doc is exported as plain text, cleaned up, and capped at 15,000 characters. If there's almost nothing in it — under 50 characters — it stops there.",
      "It then looks the file up in Airtable by its Drive file id and carries that id through the run, so the final step knows whether it's updating an existing record or creating a new one.",
      "One Claude call does the indexing: strict JSON with a two-to-three sentence summary, 8–12 search keywords, and a doc type (SOP, product doc, FAQ, or other). If that JSON won't parse, the workflow writes a record with safe defaults instead of failing.",
      "An update-or-create branch writes an identical set of columns either way, and a Merge rejoins the two paths so the Slack notification only deals with one. The notification is a card with the title, type, and summary.",
    ],
    decisions: [
      {
        note: "Records are keyed on the Drive file id, not the title. If the trigger ever fires twice for the same file, it updates the existing row instead of creating a duplicate.",
        ref: "U4",
      },
      {
        note: "The keywords Claude generates here are the whole retrieval mechanism for KB Query — there's no vector database. The work of making a document findable is done once, at ingestion, by asking for the terms someone would actually search for.",
        ref: "A1",
      },
      {
        note: "Claude is pinned to strict JSON and the parser falls back to an empty summary and 'other' type, so a bad model response produces a thin record rather than a broken run.",
        ref: "U6",
      },
      {
        note: "The file-type check runs before the Drive download; the content-length check runs before the Claude call. A non-Doc or an empty file costs nothing.",
        ref: "K1",
      },
      {
        note: "Update and create write an identical column set and rejoin through a Merge, so the notification and anything added later only deal with one path, not two.",
        ref: "U9",
      },
      {
        note: "An Error Trigger catches anything unhandled anywhere in the run and posts the failed node and message to the same Slack channel as the success card.",
        ref: "J2",
      },
    ],
    result: [
      "A Doc dropped in the folder is summarised, keyworded, and in the index within about a minute — no one opens Airtable.",
      "That index is exactly what KB Query searches, so the two workflows together mean: write a Doc, then ask about it in Slack.",
    ],
  },
};
