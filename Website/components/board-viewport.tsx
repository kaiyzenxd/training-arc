"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type View = { s: number; x: number; y: number };

const MIN_FACTOR = 0.9; // allow zooming a little past "fit"
const MAX_SCALE = 2.8;

/** Pan (drag) + zoom (wheel / buttons) around a wide board SVG. */
export function BoardViewport({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>({ s: 1, x: 0, y: 0 });
  const [vh, setVh] = useState<number | undefined>(undefined);
  const fitSRef = useRef(0.3);
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(
    null,
  );

  const natSize = () => {
    const svg = contentRef.current?.querySelector("svg");
    if (!svg) return null;
    const cs = getComputedStyle(svg);
    return { w: parseFloat(cs.width), h: parseFloat(cs.height) };
  };

  const doFit = useCallback(() => {
    const wrap = wrapRef.current;
    const nat = natSize();
    if (!wrap || !nat) return;
    const s = Math.min(1, (wrap.clientWidth - 32) / nat.w);
    const h = Math.max(280, Math.min(560, nat.h * s + 36));
    fitSRef.current = s;
    setVh(h);
    setView({
      s,
      x: Math.max(16, (wrap.clientWidth - nat.w * s) / 2),
      y: (h - nat.h * s) / 2,
    });
  }, []);

  useLayoutEffect(() => {
    doFit();
    const id = setTimeout(doFit, 250);
    return () => clearTimeout(id);
  }, [doFit]);

  /** zoom by `factor`, keeping the point (px,py) in the wrap fixed */
  const zoomAt = useCallback((factor: number, px: number, py: number) => {
    setView((v) => {
      const s = Math.min(
        MAX_SCALE,
        Math.max(fitSRef.current * MIN_FACTOR, v.s * factor),
      );
      if (s === v.s) return v;
      return {
        s,
        x: px - ((px - v.x) / v.s) * s,
        y: py - ((py - v.y) / v.s) * s,
      };
    });
  }, []);

  const zoomCentre = (factor: number) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    zoomAt(factor, wrap.clientWidth / 2, wrap.clientHeight / 2);
  };

  // wheel zoom — needs a non-passive listener to preventDefault the page scroll
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = wrap.getBoundingClientRect();
      const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
      zoomAt(factor, e.clientX - r.left, e.clientY - r.top);
    };
    wrap.addEventListener("wheel", onWheel, { passive: false });
    return () => wrap.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button, a")) return;
    const { clientX, clientY, pointerId } = e;
    const el = e.currentTarget as HTMLElement;
    setView((v) => {
      drag.current = { px: clientX, py: clientY, x: v.x, y: v.y };
      return v;
    });
    el.setPointerCapture(pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    setView((v) => ({
      ...v,
      x: d.x + (e.clientX - d.px),
      y: d.y + (e.clientY - d.py),
    }));
  };
  const onPointerUp = (e: React.PointerEvent) => {
    drag.current = null;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  return (
    <div
      className="board-viewport"
      ref={wrapRef}
      style={vh ? { height: `${vh}px` } : undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div
        className="board-viewport-inner"
        ref={contentRef}
        style={{
          transform: `translate(${view.x}px, ${view.y}px) scale(${view.s})`,
        }}
      >
        {children}
      </div>
      <div className="board-viewport-ctl">
        <button type="button" onClick={() => zoomCentre(1.4)} aria-label="Zoom in">
          <svg viewBox="0 0 16 16" aria-hidden>
            <path d="M8 3.5v9M3.5 8h9" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => zoomCentre(1 / 1.4)}
          aria-label="Zoom out"
        >
          <svg viewBox="0 0 16 16" aria-hidden>
            <path d="M3.5 8h9" />
          </svg>
        </button>
        <button type="button" onClick={doFit} aria-label="Fit to view">
          <svg viewBox="0 0 16 16" aria-hidden>
            <path d="M3 6V3h3M13 6V3h-3M3 10v3h3M13 10v3h-3" />
          </svg>
        </button>
      </div>
      <p className="board-viewport-hint legend" aria-hidden>
        scroll to zoom · drag to pan
      </p>
    </div>
  );
}
