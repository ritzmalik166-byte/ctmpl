"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

/** The filing room is drawn on the 1440-wide Figma frame; its scene spans y 339–1183 of it. */
export const STAGE = { width: 1440, top: 339, height: 844 } as const;

/**
 * The filing room's stage. Everything in the room (cabinet, case file, Neha)
 * is placed in px of the 1440 Figma frame and animated in those px; the stage
 * scales that whole frame to the screen's width as one piece (down on smaller
 * screens, up on wider ones, so the room always runs edge to edge), and the
 * layout and every animation stay exactly as designed on any screen.
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

  const scale = width / STAGE.width;

  return (
    <div ref={ref} className="relative w-full overflow-hidden" style={{ height: STAGE.height * scale }}>
      <div
        className="absolute top-0 w-[1440px] origin-top-left"
        style={{ left: 0, height: STAGE.top + STAGE.height, transform: `scale(${scale}) translateY(${-STAGE.top}px)` }}
      >
        {children}
      </div>
    </div>
  );
}
