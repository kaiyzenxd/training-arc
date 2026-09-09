/* ------------------------------------------------------------------ *
 *  Workflow content model
 *
 *  Each workflow is structured data — the board is drawn from `nodes`
 *  and `edges`, the write-up from `prose`. Add a case study by dropping
 *  a new file in content/workflows/ and registering it below.
 * ------------------------------------------------------------------ */

export type NodeKind = "trigger" | "agent" | "tool" | "logic" | "outcome";
export type RunState = "passing" | "retrying" | "failed";

export interface BoardNode {
  /** stable id, referenced by edges */
  id: string;
  /** reference designator printed on the package, e.g. U1, A2, R3 */
  ref: string;
  kind: NodeKind;
  /** plain-language callout — what this part does, in one short line */
  label: string;
  /** optional second callout line */
  label2?: string;
  /** lane offset: 0 = main line, -1 = branch up, 1 = branch down (auto layout) */
  lane?: number;
  /** real canvas position [x, y] — set by the n8n importer (layout: "n8n") */
  pos?: [number, number];
  /** silkscreen glyph name (see components/node-icon) */
  icon?: string;
  /** the node carried a credential in the export (stripped on publish) */
  needsCred?: boolean;
}

export interface BoardEdge {
  from: string;
  to: string;
  /** overrides the board's overall state for this segment */
  state?: RunState;
  /** true = an else / false / fault branch — drawn secondary */
  alt?: boolean;
}

export interface DecisionNote {
  /** the design decision, stated plainly */
  note: string;
  /** the node ref it traces back to */
  ref?: string;
}

export interface Prose {
  problem: string[];
  design: string[];
  decisions: DecisionNote[];
  result: string[];
}

export interface Workflow {
  slug: string;
  title: string;
  /** what sets it off */
  trigger: string;
  /** the pieces it runs on */
  stack: string[];
  /** revision, e.g. "03" */
  rev: string;
  /** YYYY-MM */
  date: string;
  status: RunState;
  /** one line: what it does and the payoff */
  summary: string;
  /** true = illustrative sample, not a shipped client build */
  synthetic: boolean;
  /** "auto" = computed left-to-right; "n8n" = real canvas positions */
  layout?: "auto" | "n8n";
  /** demo video (Loom share URL) */
  video?: string;
  /** path under /public to the sanitised workflow export */
  download?: string;
  /** slugs of related workflows */
  related?: string[];
  /** the raw (sanitised) workflow export, for the JSON view */
  raw?: unknown;
  nodes: BoardNode[];
  edges: BoardEdge[];
  prose: Prose;
}

import { kbQuery } from "@/content/workflows/kb-query";
import { kbIngestion } from "@/content/workflows/kb-ingestion";
import { inboundLeadTriage } from "@/content/workflows/inbound-lead-triage";
import { invoiceInboxReconciliation } from "@/content/workflows/invoice-inbox-reconciliation";
import { supportTicketDeflection } from "@/content/workflows/support-ticket-deflection";

/** Ordered — the first entry is featured on the home board. */
export const workflows: Workflow[] = [
  kbQuery,
  kbIngestion,
  inboundLeadTriage,
  invoiceInboxReconciliation,
  supportTicketDeflection,
];

export function getWorkflow(slug: string): Workflow | undefined {
  return workflows.find((w) => w.slug === slug);
}

export function getFeatured(): Workflow {
  return workflows[0];
}

export const STATE_LABEL: Record<RunState, string> = {
  passing: "Passing",
  retrying: "Retrying",
  failed: "Failed",
};
