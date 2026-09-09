"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Adds `is-live` to its child board while it is on screen, so the
 * signal-run trace animation only runs when the board is visible.
 * (Reduced-motion is handled in CSS — the animation is `display:none` there.)
 */
export function BoardReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setLive(entry.isIntersecting),
      { rootMargin: "0px 0px -15% 0px", threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={live ? "board-reveal is-live" : "board-reveal"}>
      {children}
    </div>
  );
}
