"use client";

import { usePathname } from "next/navigation";

/** The thin drawing border + corner registration marks around every page. */
export function DrawingFrame() {
  return (
    <div className="drawing-frame" aria-hidden>
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}

function sheetName(pathname: string): string {
  if (pathname === "/") return "Index";
  if (pathname === "/work") return "Schedule";
  if (pathname.startsWith("/work/")) return "Detail";
  if (pathname === "/about") return "Notes";
  return "404";
}

/** A fab-drawing title block stamped at the foot of every page. */
export function SheetStamp() {
  const pathname = usePathname();
  const fields: [string, string][] = [
    ["Project", "MRB Portfolio"],
    ["Sheet", sheetName(pathname)],
    ["Scale", "1:1"],
    ["Rev", "2026-09"],
  ];
  return (
    <div className="sheet-stamp">
      <dl>
        {fields.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
