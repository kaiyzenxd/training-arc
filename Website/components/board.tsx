import Link from "next/link";
import type { Workflow, RunState } from "@/lib/workflows";
import { STATE_LABEL } from "@/lib/workflows";
import { layoutBoard, type PlacedNode } from "@/lib/board-layout";
import { BoardReveal } from "@/components/board-reveal";
import { BoardViewport } from "@/components/board-viewport";
import { NodeIcon, ICON_BY_KIND } from "@/components/node-icon";

type Variant = "hero" | "full" | "compact";

const STATE_COLOR: Record<RunState, string> = {
  passing: "var(--color-pass)",
  retrying: "var(--color-retry)",
  failed: "var(--color-fail)",
};

/** greedily wrap a label to at most `maxLines` lines of ~`per` chars */
function wrapLabel(label: string, per = 18, maxLines = 2): string[] {
  const words = label.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if (cur && (cur + " " + w).length > per) {
      lines.push(cur);
      cur = w;
    } else {
      cur = cur ? `${cur} ${w}` : w;
    }
  }
  if (cur) lines.push(cur);
  if (lines.length <= maxLines) return lines;
  const kept = lines.slice(0, maxLines);
  kept[maxLines - 1] = kept[maxLines - 1].replace(/\s*\S*$/, "…");
  return kept;
}

function Package({
  n,
  showCallout,
  compact,
  nameBelow,
  animate,
  signal,
}: {
  n: PlacedNode;
  showCallout: boolean;
  compact: boolean;
  nameBelow: boolean;
  animate: boolean;
  signal: boolean;
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
      {signal && (
        <rect
          x={n.x}
          y={n.y}
          width={n.w}
          height={n.h}
          rx={isEndpoint ? 3 : 4}
          className="node-ping"
          style={{ "--seg": n.col } as React.CSSProperties}
        />
      )}
      {n.needsCred && nameBelow && (
        <circle
          cx={n.x + n.w - 7}
          cy={n.y + 7}
          r={2.6}
          fill="none"
          stroke="var(--color-silk-faint)"
          strokeWidth={1.2}
        >
          <title>Needs a credential — stripped on publish</title>
        </circle>
      )}
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

      <NodeIcon
        name={n.icon ?? ICON_BY_KIND[n.kind]}
        x={cx}
        y={nameBelow || compact ? cy : cy - 3}
        size={compact ? 16 : nameBelow ? 23 : 21}
      />

      {nameBelow ? (
        <>
          <text
            x={n.kind === "trigger" ? n.x + 16 : n.x + 6}
            y={n.y + 12}
            className="pkg-ref-corner"
          >
            {n.ref}
          </text>
          <text x={cx} y={n.y + n.h + 13} textAnchor="middle" className="pkg-name">
            {wrapLabel(n.label).map((line, i) => (
              <tspan key={i} x={cx} dy={i === 0 ? 0 : "1.15em"}>
                {line}
              </tspan>
            ))}
          </text>
        </>
      ) : compact ? null : (
        <text x={cx} y={cy + 15} textAnchor="middle" className="pkg-ref">
          {n.ref}
        </text>
      )}
    </g>
  );
}

function BoardSvg({
  workflow,
  variant,
  animate,
  signal,
}: {
  workflow: Workflow;
  variant: Variant;
  animate: boolean;
  signal: boolean;
}) {
  const compact = variant === "compact";
  const imported = workflow.layout === "n8n";
  const importedWide = imported && variant === "full";
  const L = layoutBoard(workflow, { callouts: !compact && !imported });
  const showCallout = !compact && !imported;
  const big = variant === "hero" || variant === "full";
  const dim = compact;
  const runSignal = signal && big && workflow.status !== "failed";

  const maxCol = Math.max(1, ...L.nodes.map((n) => n.col));
  const sigStep = maxCol > 8 ? 190 : 280;
  const sigLoop = Math.min(7000, Math.max(4200, maxCol * sigStep + 1900));

  return (
    <svg
      viewBox={`0 0 ${L.width} ${L.height}`}
      className={importedWide ? "board-svg board-svg--wide" : "board-svg"}
      role="img"
      style={
        {
          "--sig-step": `${sigStep}ms`,
          "--sig-loop": `${sigLoop}ms`,
          ...(importedWide ? { width: `${Math.round(L.width)}px` } : {}),
        } as React.CSSProperties
      }
      aria-label={`${workflow.title}: ${workflow.nodes
        .map((n) => n.label)
        .join(" then ")}`}
    >
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {L.edges.map((e, i) => {
          const st = e.state;
          if (e.alt) {
            return (
              <path
                key={i}
                d={e.d}
                stroke="var(--color-silk-faint)"
                strokeWidth={1.25}
                strokeDasharray="3 4"
                opacity={0.7}
              />
            );
          }
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
              <circle cx={e.bx} cy={e.by} r={2.75} fill="var(--color-solder)" />
            </g>
          );
        })}

        {workflow.status === "passing" && !dim && !imported && (
          <path
            d={L.spine}
            stroke="var(--color-trace-lit)"
            strokeWidth={2}
            opacity={0.9}
          />
        )}
      </g>

      {/* signal run — a bright pulse travels the graph node-by-node */}
      {runSignal && (
        <g className="signal" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {L.edges
            .filter((e) => !e.alt)
            .map((e, i) => (
              <path
                key={i}
                d={e.d}
                pathLength={1}
                className="signal-edge"
                style={{ "--seg": e.fromCol } as React.CSSProperties}
              />
            ))}
        </g>
      )}

      {L.nodes.map((n) => (
        <Package
          key={n.id}
          n={n}
          showCallout={showCallout}
          compact={compact}
          nameBelow={importedWide}
          animate={animate}
          signal={runSignal}
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
  featured,
}: {
  workflow: Workflow;
  variant: Variant;
  featured: boolean;
}) {
  const hero = variant === "hero";
  return (
    <div className="title-block">
      {featured && <span className="tb-flag">Featured</span>}
      {hero ? (
        // the whole hero board is already one <Link> (see Board()) — a nested
        // <a> here would be invalid HTML, so this is styled like the link
        // but isn't one itself.
        <div className="tb-name tb-name--link stamp">{workflow.title}</div>
      ) : (
        <div className="tb-name stamp">{workflow.title}</div>
      )}
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

      {hero && <span className="pad-button">Open the case study</span>}
      {variant === "full" && (
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
  featured = false,
  reveal = false,
}: {
  workflow: Workflow;
  variant?: Variant;
  animate?: boolean;
  featured?: boolean;
  reveal?: boolean;
}) {
  const withNotes = variant === "hero" || variant === "full";
  const useViewport = workflow.layout === "n8n" && variant === "full";
  const svg = (
    <BoardSvg
      workflow={workflow}
      variant={variant}
      animate={animate}
      signal={reveal}
    />
  );
  const inner = (
    <div className={`board on-board board-${variant} ${animate ? "deploy" : ""}`}>
      <div className="board-header">
        <TitleBlock workflow={workflow} variant={variant} featured={featured} />
        {withNotes && <NotesBlock workflow={workflow} />}
      </div>
      {useViewport ? (
        <BoardViewport>{svg}</BoardViewport>
      ) : (
        <div className="board-scroll">{svg}</div>
      )}
      {variant !== "compact" ? (
        <Legend status={workflow.status} />
      ) : (
        <p className="board-summary">{workflow.summary}</p>
      )}
    </div>
  );

  const revealed = reveal ? <BoardReveal>{inner}</BoardReveal> : inner;

  if (variant === "compact" || variant === "hero") {
    return (
      <Link
        href={`/work/${workflow.slug}`}
        className="board-link"
        aria-label={`Open case study: ${workflow.title}`}
      >
        {variant === "hero" ? revealed : inner}
      </Link>
    );
  }
  return revealed;
}
