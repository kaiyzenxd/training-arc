"use client";

import { useState, type ReactNode } from "react";

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlight(json: string) {
  return esc(json).replace(
    /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|(-?\d+\.?\d*(?:e[+-]?\d+)?)/gi,
    (m, str, colon, kw, num) => {
      if (str) {
        return colon
          ? `<span class="j-key">${str}</span>${colon}`
          : `<span class="j-str">${str}</span>`;
      }
      if (kw) return `<span class="j-kw">${kw}</span>`;
      if (num) return `<span class="j-num">${num}</span>`;
      return m;
    },
  );
}

export function BoardPanel({
  board,
  json,
  download,
}: {
  board: ReactNode;
  json: string;
  download?: string;
}) {
  const [tab, setTab] = useState<"board" | "json">("board");
  return (
    <div className="board-panel">
      <div className="board-tabs legend" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "board"}
          data-active={tab === "board"}
          onClick={() => setTab("board")}
        >
          Board
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "json"}
          data-active={tab === "json"}
          onClick={() => setTab("json")}
        >
          JSON
        </button>
        {download && (
          <a href={download} download className="board-tabs-dl">
            Download
          </a>
        )}
      </div>

      <div hidden={tab !== "board"}>{board}</div>

      {tab === "json" && (
        <div className="json-view on-board">
          <pre
            dangerouslySetInnerHTML={{ __html: highlight(json) }}
          />
        </div>
      )}
    </div>
  );
}
