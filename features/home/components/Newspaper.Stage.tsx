"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/** The desktop newspaper is drawn on Figma's 1440 × 1440 frame. */
const FRAME = 1440;

/**
 * Desktop (xl, 1280+) stage for the newspaper: the 1440 frame scaled down to
 * the screen's width as one piece (never up), so between 1280 and 1440 the
 * paper, mug, glasses and pen all stay on screen, nothing cut; from 1440 up
 * it is drawn 1:1, centred. Hidden below xl (the compact layout shows there).
 */
export function NewspaperStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(FRAME);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth || FRAME);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scale = Math.min(1, width / FRAME);
  const vars = {
    "--np-h": `${FRAME * scale}px`,
    "--np-left": `${Math.max(0, (width - FRAME) / 2)}px`,
    "--np-t": `scale(${scale})`,
  } as CSSProperties;

  return (
    <div ref={ref} style={vars} className="relative hidden h-(--np-h) w-full overflow-hidden xl:block">
      <div className="absolute top-0 left-(--np-left) h-[1440px] w-[1440px] origin-top-left transform-(--np-t)">{children}</div>
    </div>
  );
}
