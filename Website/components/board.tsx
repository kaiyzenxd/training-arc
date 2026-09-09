import Link from "next/link";
import type { Workflow, RunState, NodeKind } from "@/lib/workflows";
import { STATE_LABEL } from "@/lib/workflows";
import { layoutBoard, type PlacedNode } from "@/lib/board-layout";

type Variant = "hero" | "full" | "compact";

const KIND_TAG: Record<NodeKind, string> = {
  trigger: "Trigger",
  agent: "Agent",
  tool: "Tool",
  logic: "Decision",
  outcome: "Outcome",
};

const STATE_COLOR: Record<RunState, string> = {
  passing: "var(--color-pass)",
  retrying: "var(--color-retry)",
  failed: "var(--color-fail)",
};

function Package({
  n,
  showCallout,
  compact,
  animate,
}: {
  n: PlacedNode;
  showCallout: boolean;
  compact: boolean;
  animate: boolean;
}) {
  const cx = n.x + n.w / 2;
  const cy = n.y + n.h / 2;
  const isEndpoint = n.kind === "trigger" || n.kind === "outcome";
  const pinsVertical = n.kind === "agent";

  const fingers =
    n.kind === "trigger"
      ? [n.x, n.x + 5, n.x + 10]
      : n.kind === "outcome"
        ? [n.x + n.w - 10, n.x + n.w - 5, n.x + n.w]
        : [];

  const ticks: { x1: number; y1: number; x2: number; y2: number }[] = [];
  if (!isEndpoint) {
    if (pinsVertical) {
      for (let i = 1; i <= 4; i++) {
        const px = n.x + (n.w / 5) * i;
        ticks.push({ x1: px, y1: n.y - 6, x2: px, y2: n.y });
        ticks.push({ x1: px, y1: n.y + n.h, x2: px, y2: n.y + n.h + 6 });
      }
    } else {
      for (let i = 1; i <= 3; i++) {
        const py = n.y + (n.h / 4) * i;
        ticks.push({ x1: n.x - 6, y1: py, x2: n.x, y2: py });
        ticks.push({ x1: n.x + n.w, y1: py, x2: n.x + n.w + 6, y2: py });
      }
    }
  }

  let calloutDir: 0 | -1 | 1 = 0;
  if (showCallout && !isEndpoint) {
    calloutDir = n.lane === 1 ? 1 : n.lane === -1 ? -1 : n.col % 2 === 0 ? -1 : 1;
  }
  const anchorX = n.col === 0 ? n.x : cx;
  const textAnchor = n.col === 0 ? "start" : "middle";
  const calloutY = calloutDir === -1 ? n.y - 32 : n.y + n.h + 32;
  const leaderY1 = calloutDir === -1 ? n.y : n.y + n.h;
  const leaderY2 = calloutDir === -1 ? n.y - 18 : n.y + n.h + 18;

  return (
    <g
      className="pkg"
      style={
        animate ? { animationDelay: `${n.col * 80 + 260}ms` } : undefined
      }
    >
      {calloutDir !== 0 && (
        <>
          <line
            x1={cx}
            y1={leaderY1}
            x2={cx}
            y2={leaderY2}
            stroke="var(--color-silk-faint)"
            strokeWidth={1}
          />
          <line
            x1={cx}
            y1={leaderY2}
            x2={anchorX}
            y2={leaderY2}
            stroke="var(--color-silk-faint)"
            strokeWidth={1}
          />
          <text
            x={anchorX}
            y={calloutY}
            textAnchor={textAnchor}
            className="callout-text"
          >
            <tspan x={anchorX}>{n.label}</tspan>
            {n.label2 && (
              <tspan x={anchorX} dy="1.35em" className="callout-sub">
                {n.label2}
              </tspan>
            )}
          </text>
        </>
      )}

      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke="var(--color-trace)"
          strokeWidth={1.5}
        />
      ))}

      <rect
        x={n.x}
        y={n.y}
        width={n.w}
        height={n.h}
        rx={isEndpoint ? 3 : 4}
        fill={isEndpoint ? "var(--color-board-deep)" : "transparent"}
        stroke="var(--color-silk-soft)"
        strokeWidth={1.25}
      />
      {n.kind === "agent" && (
        <circle cx={n.x + 9} cy={n.y + 9} r={2.4} fill="var(--color-silk-soft)" />
      )}
      {fingers.map((fx, i) => (
        <line
          key={i}
          x1={fx}
          y1={n.y + 6}
          x2={fx}
          y2={n.y + n.h - 6}
          stroke="var(--color-trace)"
          strokeWidth={2}
        />
      ))}

      <text
        x={cx}
        y={compact ? cy + 5 : cy - 1}
        textAnchor="middle"
        className={compact ? "pkg-ref pkg-ref--lg" : "pkg-ref"}
      >
        {n.ref}
      </text>
      {!compact && (
        <text x={cx} y={cy + 12} textAnchor="middle" className="pkg-kind">
          {KIND_TAG[n.kind]}
        </text>
      )}
    </g>
  );
}

function BoardSvg({
  workflow,
  variant,
  animate,
}: {
  workflow: Workflow;
  variant: Variant;
  animate: boolean;
}) {
  const compact = variant === "compact";
  const L = layoutBoard(workflow, { callouts: !compact });
  const showCallout = !compact;
  const showPulse = variant === "hero" || variant === "full";
  const dim = compact;

  return (
    <svg
      viewBox={`0 0 ${L.width} ${L.height}`}
      className="board-svg"
      role="img"
      aria-label={`${workflow.title}: ${workflow.nodes
        .map((n) => n.label)
        .join(" then ")}`}
    >
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {L.edges.map((e, i) => {
          const st = e.state;
          return (
            <g key={i}>
              <path
                d={e.d}
                pathLength={1}
                className={st ? undefined : "board-trace"}
                stroke={st ? STATE_COLOR[st] : "var(--color-trace)"}
                strokeWidth={2}
                strokeDasharray={st === "retrying" ? "6 5" : undefined}
              />
              <circle cx={e.bx} cy={e.by} r={3} fill="var(--color-solder)" />
            </g>
          );
        })}

        {workflow.status === "passing" && !dim && (
          <path
            d={L.spine}
            stroke="var(--color-trace-lit)"
            strokeWidth={2}
            opacity={0.9}
          />
        )}
        {showPulse && workflow.status === "passing" && (
          <path
            d={L.spine}
            stroke="var(--color-pass)"
            strokeWidth={3}
            className="trace-pulse"
            style={{ "--pulse-len": L.spineLen + 60 } as React.CSSProperties}
          />
        )}
      </g>

      {L.nodes.map((n) => (
        <Package
          key={n.id}
          n={n}
          showCallout={showCallout}
          compact={compact}
          animate={animate}
        />
      ))}
    </svg>
  );
}

function NotesBlock({ workflow }: { workflow: Workflow }) {
  const outDegree = new Map<string, number>();
  for (const e of workflow.edges) {
    outDegree.set(e.from, (outDegree.get(e.from) ?? 0) + 1);
  }
  const branches = [...outDegree.values()].filter((d) => d > 1).length;
  const rows: [string, string][] = [
    ["Parts", String(workflow.nodes.length)],
    ["Branches", String(branches)],
    ["Runtime", "Self-hosted n8n"],
    ["Rev", `${workflow.rev} · ${workflow.date}`],
  ];
  return (
    <dl className="notes-block">
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt className="field-key">{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function TitleBlock({
  workflow,
  variant,
}: {
  workflow: Workflow;
  variant: Variant;
}) {
  return (
    <div className="title-block">
      <div className="tb-name stamp">{workflow.title}</div>
      <dl className="tb-fields">
        <div>
          <dt className="field-key">Trigger</dt>
          <dd>{workflow.trigger}</dd>
        </div>
        {variant !== "compact" && (
          <div>
            <dt className="field-key">Stack</dt>
            <dd>{workflow.stack.join(" · ")}</dd>
          </div>
        )}
        <div>
          <dt className="field-key">Status</dt>
          <dd>
            <span className={`state-dot state-${workflow.status}`} aria-hidden />
            {STATE_LABEL[workflow.status]}
          </dd>
        </div>
      </dl>

      {workflow.synthetic && (
        <p className="synthetic-stamp">
          Synthetic — sample build, not a client project
        </p>
      )}

      {(variant === "hero" || variant === "full") && (
        <a
          href="mailto:markryanbaricuatro@gmail.com?subject=Start%20a%20project"
          className="pad-button"
        >
          Start a project
        </a>
      )}
    </div>
  );
}

function Legend({ status }: { status: RunState }) {
  const states: RunState[] = ["passing", "retrying", "failed"];
  return (
    <div className="board-legend legend">
      {states.map((s) => (
        <span key={s} className={`legend-item ${s === status ? "is-active" : ""}`}>
          <span className={`legend-swatch state-${s}`} aria-hidden />
          {STATE_LABEL[s]}
        </span>
      ))}
    </div>
  );
}

export function Board({
  workflow,
  variant = "hero",
  animate = false,
}: {
  workflow: Workflow;
  variant?: Variant;
  animate?: boolean;
}) {
  const withNotes = variant === "hero" || variant === "full";
  const inner = (
    <div className={`board on-board board-${variant} ${animate ? "deploy" : ""}`}>
      <div className="board-header">
        <TitleBlock workflow={workflow} variant={variant} />
        {withNotes && <NotesBlock workflow={workflow} />}
      </div>
      <div className="board-scroll">
        <BoardSvg workflow={workflow} variant={variant} animate={animate} />
      </div>
      {variant !== "compact" ? (
        <Legend status={workflow.status} />
      ) : (
        <p className="board-summary">{workflow.summary}</p>
      )}
    </div>
  );

  if (variant === "compact") {
    return (
      <Link
        href={`/work/${workflow.slug}`}
        className="board-link"
        aria-label={`Open case study: ${workflow.title}`}
      >
        {inner}
      </Link>
    );
  }
  return inner;
}
