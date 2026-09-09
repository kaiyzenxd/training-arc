import type { BoardNode, BoardEdge, Workflow } from "@/lib/workflows";

export interface PlacedNode extends BoardNode {
  col: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface PlacedEdge {
  from: string;
  to: string;
  state?: BoardEdge["state"];
  /** else / false / fault branch — drawn secondary */
  alt?: boolean;
  d: string;
  /** solder blob at the branch origin */
  bx: number;
  by: number;
  /** column of the source node — drives the signal-run stagger */
  fromCol: number;
}

export interface BoardLayout {
  width: number;
  height: number;
  nodes: PlacedNode[];
  edges: PlacedEdge[];
  /** the full left-to-right spine path, for the trace pulse / draw-in */
  spine: string;
  spineLen: number;
  laneY: (lane: number) => number;
}

const COL_W = 168;
const PAD_X = 92;
const NODE_W = 112;
const NODE_H = 50;
const LANE_H = 66;
const CALLOUT_BAND = 46;

/** longest-path column assignment from the trigger(s) */
function assignColumns(nodes: BoardNode[], edges: BoardEdge[]): Map<string, number> {
  const col = new Map<string, number>();
  const incoming = new Map<string, string[]>();
  for (const n of nodes) incoming.set(n.id, []);
  for (const e of edges) incoming.get(e.to)?.push(e.from);

  const visiting = new Set<string>();
  const resolve = (id: string): number => {
    if (col.has(id)) return col.get(id)!;
    if (visiting.has(id)) return 0; // cycle guard
    visiting.add(id);
    const ins = incoming.get(id) ?? [];
    const c = ins.length === 0 ? 0 : Math.max(...ins.map((p) => resolve(p) + 1));
    visiting.delete(id);
    col.set(id, c);
    return c;
  };
  for (const n of nodes) resolve(n.id);
  return col;
}

/** BFS distance from the trigger(s) — used to stagger the signal run */
function distFromStart(nodes: BoardNode[], edges: BoardEdge[]): Map<string, number> {
  const out = new Map<string, string[]>();
  const indeg = new Map<string, number>();
  for (const n of nodes) {
    out.set(n.id, []);
    indeg.set(n.id, 0);
  }
  for (const e of edges) {
    out.get(e.from)?.push(e.to);
    indeg.set(e.to, (indeg.get(e.to) ?? 0) + 1);
  }
  const dist = new Map<string, number>();
  const queue: string[] = [];
  for (const n of nodes) {
    if ((indeg.get(n.id) ?? 0) === 0) {
      dist.set(n.id, 0);
      queue.push(n.id);
    }
  }
  let i = 0;
  const seen = new Set(queue);
  while (i < queue.length) {
    const id = queue[i++];
    const d = dist.get(id) ?? 0;
    for (const next of out.get(id) ?? []) {
      if (!dist.has(next) || (dist.get(next) ?? 0) < d + 1) dist.set(next, d + 1);
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  for (const n of nodes) if (!dist.has(n.id)) dist.set(n.id, 0);
  return dist;
}

/** chamfered orthogonal connector between two box edges */
function ortho(x1: number, y1: number, x2: number, y2: number): string {
  const dy = y2 - y1;
  if (Math.abs(dy) < 1) return `M ${x1} ${y1} H ${x2}`;
  const s = Math.sign(dy);
  const c = Math.max(2, Math.min(14, Math.abs(dy) / 2, (x2 - x1) / 2 - 4));
  const midx = (x1 + x2) / 2;
  return [
    `M ${x1} ${y1}`,
    `H ${midx - c}`,
    `L ${midx} ${y1 + s * c}`,
    `V ${y2 - s * c}`,
    `L ${midx + c} ${y2}`,
    `H ${x2}`,
  ].join(" ");
}

/** Layout from real n8n canvas positions (`workflow.layout === "n8n"`). */
function layoutFromPositions(workflow: Workflow): BoardLayout {
  const SCALE = 0.9;
  const padX = 56;
  const padY = 34;
  const nw = 132;
  const nh = 50;

  const pts = workflow.nodes.map((n) => n.pos ?? [0, 0]);
  const minX = Math.min(...pts.map((p) => p[0]));
  const minY = Math.min(...pts.map((p) => p[1]));

  const dist = distFromStart(workflow.nodes, workflow.edges);

  const placed: PlacedNode[] = workflow.nodes.map((n) => {
    const [px, py] = n.pos ?? [0, 0];
    return {
      ...n,
      col: dist.get(n.id) ?? 0,
      x: padX + (px - minX) * SCALE,
      y: padY + (py - minY) * SCALE,
      w: nw,
      h: nh,
    };
  });
  const byId = new Map(placed.map((n) => [n.id, n]));

  const bottom = Math.max(...placed.map((n) => n.y + n.h));
  const right = Math.max(...placed.map((n) => n.x + n.w));
  const returnLaneY = bottom + 34;
  const width = right + padX;
  const height = returnLaneY + padY;

  const placedEdges: PlacedEdge[] = workflow.edges
    .filter((e) => byId.has(e.from) && byId.has(e.to))
    .map((e) => {
      const a = byId.get(e.from)!;
      const b = byId.get(e.to)!;
      const x1 = a.x + a.w;
      const y1 = a.y + a.h / 2;
      const x2 = b.x;
      const y2 = b.y + b.h / 2;
      let d: string;
      if (x2 >= x1 + 36) {
        d = ortho(x1, y1, x2, y2);
      } else {
        // backward / stacked — drop to the return lane and come back
        d = `M ${x1} ${y1} H ${x1 + 16} V ${returnLaneY} H ${x2 - 16} V ${y2} H ${x2}`;
      }
      return {
        from: e.from,
        to: e.to,
        state: e.state,
        alt: e.alt,
        d,
        bx: x1,
        by: y1,
        fromCol: a.col,
      };
    });

  const spine = placedEdges
    .filter((e) => !e.alt)
    .map((e) => e.d)
    .join(" ");

  return {
    width,
    height,
    nodes: placed,
    edges: placedEdges,
    spine,
    spineLen: 0,
    laneY: () => 0,
  };
}

export function layoutBoard(
  workflow: Workflow,
  opts: { callouts?: boolean } = {},
): BoardLayout {
  if (workflow.layout === "n8n") return layoutFromPositions(workflow);

  const band = opts.callouts === false ? 20 : CALLOUT_BAND;
  const padX = opts.callouts === false ? 56 : PAD_X;
  const { nodes, edges } = workflow;
  const cols = assignColumns(nodes, edges);
  const maxCol = Math.max(...nodes.map((n) => cols.get(n.id) ?? 0));

  const lanes = nodes.map((n) => n.lane ?? 0);
  const minLane = Math.min(0, ...lanes);
  const maxLane = Math.max(0, ...lanes);

  const width = padX * 2 + maxCol * COL_W + NODE_W;
  const midY = band + (maxLane - minLane) * (LANE_H / 2) + NODE_H / 2;
  const height = midY + NODE_H / 2 + band + (maxLane - minLane) * (LANE_H / 2);

  const laneY = (lane: number) => midY + lane * (LANE_H / 2) - NODE_H / 2;

  const placed: PlacedNode[] = nodes.map((n) => {
    const col = cols.get(n.id) ?? 0;
    return {
      ...n,
      col,
      x: padX + col * COL_W,
      y: laneY(n.lane ?? 0),
      w: NODE_W,
      h: NODE_H,
    };
  });
  const byId = new Map(placed.map((n) => [n.id, n]));

  const placedEdges: PlacedEdge[] = edges.map((e) => {
    const a = byId.get(e.from)!;
    const b = byId.get(e.to)!;
    const x1 = a.x + a.w;
    const y1 = a.y + a.h / 2;
    const x2 = b.x;
    const y2 = b.y + b.h / 2;
    const midx = (x1 + x2) / 2;
    const dy = y2 - y1;
    let d: string;
    if (Math.abs(dy) < 0.5) {
      d = `M ${x1} ${y1} H ${x2}`;
    } else {
      const bend = Math.min(Math.abs(dy) / 2, COL_W * 0.32);
      const sy = y1 + Math.sign(dy) * (Math.abs(dy) / 2 - bend);
      d = `M ${x1} ${y1} H ${midx - bend} L ${midx - bend + bend} ${sy + Math.sign(dy) * bend} L ${midx + bend} ${y2} H ${x2}`;
    }
    return { from: e.from, to: e.to, state: e.state, d, bx: x1, by: y1, fromCol: a.col };
  });

  // spine = the main-lane run, trigger -> outcome, for the pulse
  const spineNodes = placed
    .filter((n) => (n.lane ?? 0) === 0)
    .sort((a, b) => a.col - b.col);
  let spine = "";
  spineNodes.forEach((n, i) => {
    const cy = n.y + n.h / 2;
    if (i === 0) spine += `M ${n.x} ${cy} `;
    else spine += `L ${n.x} ${cy} `;
    spine += `L ${n.x + n.w} ${cy} `;
  });
  const spineLen = spineNodes.reduce(
    (acc, n, i) =>
      acc + n.w + (i > 0 ? n.x - (spineNodes[i - 1].x + spineNodes[i - 1].w) : 0),
    0,
  );

  return { width, height, nodes: placed, edges: placedEdges, spine, spineLen, laneY };
}

export const BOARD_CONST = { COL_W, PAD_X, NODE_W, NODE_H, LANE_H, CALLOUT_BAND };
