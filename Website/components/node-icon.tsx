/* Monochrome silkscreen glyphs for board nodes — one stroke weight,
   drawn on a 24×24 grid, centred and scaled into the node box. */

type Glyph = { d?: string[]; c?: [number, number, number][]; fill?: string[] };

const GLYPHS: Record<string, Glyph> = {
  bolt: {
    d: ["M13 2 L5 14 h6 l-1 8 L19 9 h-6 z"],
  },
  slack: {
    d: [
      "M9.5 3 v18 M14.5 3 v18 M3 9.5 h18 M3 14.5 h18",
    ],
  },
  drive: {
    d: ["M3 8 a2 2 0 0 1 2-2 h4 l2 2 h6 a2 2 0 0 1 2 2 v7 a2 2 0 0 1-2 2 H5 a2 2 0 0 1-2-2 z"],
  },
  error: {
    c: [[12, 12, 9]],
    d: ["M9 9 l6 6 M15 9 l-6 6"],
  },
  branch: {
    d: [
      "M3 12 h5",
      "M8 12 C 12 12 12 6 16 6",
      "M8 12 C 12 12 12 18 16 18",
    ],
    c: [
      [17, 6, 1.6],
      [17, 18, 1.6],
    ],
  },
  code: {
    d: [
      "M9 4 C 6.5 4 7.5 10 4.5 12 C 7.5 14 6.5 20 9 20",
      "M15 4 C 17.5 4 16.5 10 19.5 12 C 16.5 14 17.5 20 15 20",
    ],
  },
  edit: {
    d: ["M4 20 l1.2-4.2 L15 6 l3 3 L8.2 18.8 z", "M13 8 l3 3"],
  },
  http: {
    c: [[12, 12, 9]],
    d: ["M3 12 h18", "M12 3 a13 13 0 0 1 0 18 a13 13 0 0 1 0-18"],
  },
  spark: {
    d: [
      "M12 2 L13.6 9.4 L21 11 L13.6 12.6 L12 20 L10.4 12.6 L3 11 L10.4 9.4 Z",
      "M18.5 3.5 L19.2 6 L21.5 6.7 L19.2 7.4 L18.5 10 L17.8 7.4 L15.5 6.7 L17.8 6 Z",
    ],
  },
  airtable: {
    d: [
      "M4 6.5 a2 2 0 0 1 2-2 h12 a2 2 0 0 1 2 2 v0 a2 2 0 0 1-2 2 H6 a2 2 0 0 1-2-2 z",
      "M4 12 a2 2 0 0 1 2-2 h12 a2 2 0 0 1 2 2 a2 2 0 0 1-2 2 H6 a2 2 0 0 1-2-2 z",
      "M4 17.5 a2 2 0 0 1 2-2 h12 a2 2 0 0 1 2 2 a2 2 0 0 1-2 2 H6 a2 2 0 0 1-2-2 z",
    ],
  },
  merge: {
    d: [
      "M3 6 C 9 6 9 12 14 12",
      "M3 18 C 9 18 9 12 14 12",
      "M14 12 h7",
    ],
  },
  target: {
    c: [
      [12, 12, 8],
      [12, 12, 3.4],
    ],
    fill: ["M12 11 a1 1 0 0 0 0 2 a1 1 0 0 0 0-2"],
  },
  chip: {
    d: [
      "M7 7 h10 v10 h-10 z",
      "M9.5 4 v3 M14.5 4 v3 M9.5 17 v3 M14.5 17 v3",
      "M4 9.5 h3 M4 14.5 h3 M17 9.5 h3 M17 14.5 h3",
    ],
    c: [[9.5, 9.5, 0.6]],
  },
};

export function iconForType(n8nType: string): string {
  const t = n8nType
    .replace("n8n-nodes-base.", "")
    .replace("@n8n/n8n-nodes-langchain.", "");
  if (t === "slackTrigger" || t === "slack") return "slack";
  if (t === "googleDriveTrigger" || t === "googleDrive") return "drive";
  if (t === "errorTrigger") return "error";
  if (t === "if" || t === "switch" || t === "filter") return "branch";
  if (t === "code") return "code";
  if (t === "set" || t === "editImage") return "edit";
  if (t === "airtable") return "airtable";
  if (t === "merge") return "merge";
  if (t === "httpRequest") return "http";
  if (/trigger$/i.test(t) || t === "webhook") return "bolt";
  return "";
}

export function NodeIcon({
  name,
  x,
  y,
  size = 16,
}: {
  name: string;
  x: number;
  y: number;
  size?: number;
}) {
  const g = GLYPHS[name];
  if (!g) return null;
  const s = size / 24;
  return (
    <g
      transform={`translate(${x - size / 2} ${y - size / 2}) scale(${s})`}
      fill="none"
      stroke="var(--color-silk-soft)"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {g.c?.map((c, i) => (
        <circle key={`c${i}`} cx={c[0]} cy={c[1]} r={c[2]} />
      ))}
      {g.d?.map((d, i) => (
        <path key={`d${i}`} d={d} />
      ))}
      {g.fill?.map((d, i) => (
        <path key={`f${i}`} d={d} fill="var(--color-silk-soft)" stroke="none" />
      ))}
    </g>
  );
}

/** kind → icon, when there's no specific n8n type */
export const ICON_BY_KIND: Record<string, string> = {
  trigger: "bolt",
  agent: "spark",
  logic: "branch",
  tool: "chip",
  outcome: "target",
};
