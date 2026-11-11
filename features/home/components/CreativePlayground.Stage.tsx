"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

/** The filing room is drawn on the 1440-wide Figma frame; its scene spans y 339–1183 of it. */
export const STAGE = { width: 1440, top: 339, height: 844 } as const;

/**
 * The filing room's stage. Everything in the room (cabinet, case file, Neha)
 * is placed in px of the 1440 Figma frame and animated in those px; the stage
 * scales that whole frame down to the screen's width as one piece (never up),
 * so the layout and every animation stay exactly as designed on any screen.
 * From 1440 up it is drawn 1:1, centred.
 */
export function PlaygroundStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(STAGE.width);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scale = Math.min(1, width / STAGE.width);
  const left = Math.max(0, (width - STAGE.width) / 2);

  return (
    <div ref={ref} className="relative w-full overflow-hidden" style={{ height: STAGE.height * scale }}>
      <div
        className="absolute top-0 w-[1440px] origin-top-left"
        style={{ left, height: STAGE.top + STAGE.height, transform: `scale(${scale}) translateY(${-STAGE.top}px)` }}
      >
        {children}
      </div>
    </div>
  );
}
