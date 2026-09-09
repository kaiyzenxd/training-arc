"use client";

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type View = { s: number; x: number; y: number };

/** Pan (drag) + zoom (buttons) around a wide board SVG. */
export function BoardViewport({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>({ s: 1, x: 0, y: 0 });
  const [fitS, setFitS] = useState(0.3);
  const [vh, setVh] = useState<number | undefined>(undefined);
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
    setFitS(s);
    setVh(h);
    setView({
      s,
      x: Math.max(16, (wrap.clientWidth - nat.w * s) / 2),
      y: (h - nat.h * s) / 2,
    });
  }, []);

  useLayoutEffect(() => {
    doFit();
    // re-fit if fonts/layout settle late
    const id = setTimeout(doFit, 250);
    return () => clearTimeout(id);
  }, [doFit]);

  const zoom = (factor: number) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    setView((v) => {
      const s = Math.min(2.6, Math.max(fitS * 0.9, v.s * factor));
      const cx = wrap.clientWidth / 2;
      const cy = wrap.clientHeight / 2;
      // keep the viewport centre fixed
      return {
        s,
        x: cx - ((cx - v.x) / v.s) * s,
        y: cy - ((cy - v.y) / v.s) * s,
      };
    });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button, a")) return;
    drag.current = { px: e.clientX, py: e.clientY, x: view.x, y: view.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
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
      <div className="board-viewport-ctl legend">
        <button type="button" onClick={() => zoom(1.4)} aria-label="Zoom in">
          +
        </button>
        <button type="button" onClick={() => zoom(1 / 1.4)} aria-label="Zoom out">
          &minus;
        </button>
        <button type="button" onClick={doFit} aria-label="Fit to view">
          Fit
        </button>
      </div>
      <p className="board-viewport-hint legend" aria-hidden>
        drag to pan
      </p>
    </div>
  );
}
