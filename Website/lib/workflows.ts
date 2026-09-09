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
  /** lane offset: 0 = main line, -1 = branch up, 1 = branch down */
  lane?: number;
}

export interface BoardEdge {
  from: string;
  to: string;
  /** overrides the board's overall state for this segment */
  state?: RunState;
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
  nodes: BoardNode[];
  edges: BoardEdge[];
  prose: Prose;
}

import { inboundLeadTriage } from "@/content/workflows/inbound-lead-triage";
import { invoiceInboxReconciliation } from "@/content/workflows/invoice-inbox-reconciliation";
import { supportTicketDeflection } from "@/content/workflows/support-ticket-deflection";

/** Ordered — the first entry is featured on the home board. */
export const workflows: Workflow[] = [
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
