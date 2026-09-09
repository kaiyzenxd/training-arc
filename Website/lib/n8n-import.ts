/* ------------------------------------------------------------------ *
 *  n8n workflow importer
 *
 *  Turns a workflow export (nodes with real canvas positions +
 *  connections) into board `nodes` and `edges`. Node names, kinds, and
 *  reference designators can be refined per node via `overrides`.
 * ------------------------------------------------------------------ */

import type { BoardNode, BoardEdge, NodeKind } from "@/lib/workflows";
import { iconForType, ICON_BY_KIND } from "@/components/node-icon";

interface RawNode {
  name: string;
  type: string;
  position: [number, number];
  parameters?: Record<string, unknown>;
  credentials?: Record<string, unknown>;
}

export interface RawWorkflow {
  nodes: RawNode[];
  connections: Record<
    string,
    { main?: Array<Array<{ node: string } | null> | null> }
  >;
}

export interface NodeOverride {
  kind?: NodeKind;
  ref?: string;
  /** short name shown on the board / in the bill of materials */
  label?: string;
  /** the "does" line in the bill of materials */
  detail?: string;
  /** leave this node off the board */
  omit?: boolean;
  /** on an IF/switch: its non-first outputs are normal branches, not faults */
  plainBranches?: boolean;
}

const REF_PREFIX: Record<NodeKind, string> = {
  trigger: "J",
  logic: "K",
  agent: "A",
  tool: "U",
  outcome: "P",
};

function inferKind(node: RawNode): NodeKind {
  const t = node.type
    .replace("n8n-nodes-base.", "")
    .replace("@n8n/n8n-nodes-langchain.", "");
  if (t === "errorTrigger" || /trigger$/i.test(t) || t === "webhook") return "trigger";
  if (/agent/i.test(t)) return "agent";
  if (t === "if" || t === "switch" || t === "filter") return "logic";
  const blob = JSON.stringify(node.parameters ?? {});
  if (/anthropic\.com|api\.openai\.com|generativelanguage|api\.cohere\.ai/i.test(blob))
    return "agent";
  return "tool";
}

export function fromN8n(
  raw: RawWorkflow,
  overrides: Record<string, NodeOverride> = {},
): { nodes: BoardNode[]; edges: BoardEdge[] } {
  const real = raw.nodes.filter(
    (n) => n.type !== "n8n-nodes-base.stickyNote" && !overrides[n.name]?.omit,
  );

  // reading order: rows top-to-bottom, then left-to-right within a row
  const ordered = [...real].sort((a, b) => {
    const rowA = Math.round(a.position[1] / 130);
    const rowB = Math.round(b.position[1] / 130);
    return rowA !== rowB ? rowA - rowB : a.position[0] - b.position[0];
  });

  const counters: Partial<Record<NodeKind, number>> = {};
  const nodes: BoardNode[] = ordered.map((n) => {
    const ov = overrides[n.name] ?? {};
    const kind = ov.kind ?? inferKind(n);
    let ref = ov.ref;
    if (!ref) {
      counters[kind] = (counters[kind] ?? 0) + 1;
      ref = `${REF_PREFIX[kind]}${counters[kind]}`;
    }
    const needsCred =
      !!(n.credentials && Object.keys(n.credentials).length) ||
      /"authentication"\s*:\s*"(generic|predefined)CredentialType"/.test(
        JSON.stringify(n.parameters ?? {}),
      );
    return {
      id: n.name,
      ref,
      kind,
      label: ov.label ?? n.name.replace(/\s*\[AUTO\]\s*$/i, ""),
      label2: ov.detail,
      pos: [n.position[0], n.position[1]],
      icon: iconForType(n.type) || ICON_BY_KIND[kind],
      needsCred,
    };
  });

  const known = new Set(nodes.map((n) => n.id));
  const edges: BoardEdge[] = [];
  for (const [from, conn] of Object.entries(raw.connections)) {
    if (!known.has(from)) continue;
    const plain = overrides[from]?.plainBranches;
    (conn.main ?? []).forEach((targets, outIndex) => {
      (targets ?? []).forEach((t) => {
        if (t && known.has(t.node)) {
          edges.push({ from, to: t.node, alt: outIndex > 0 && !plain });
        }
      });
    });
  }

  return { nodes, edges };
}
