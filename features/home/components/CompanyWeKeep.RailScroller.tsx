"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils/cn";

/**
 * One rail of passes as a horizontal slider (below xl, where 1280px of rail
 * doesn't fit): swipe it on touch screens (native scrolling), or grab and drag
 * it with the mouse, with a little momentum on release. From xl up the rail
 * fits and simply sits in place. The scrolling is what the passes feel too:
 * sliding the rail makes them swing (see useSwingingPasses).
 */
export function RailScroller({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; scroll: number; lastX: number; lastT: number; velocity: number } | null>(null);

  const scrollable = () => {
    const el = ref.current;
    return !!el && el.scrollWidth > el.clientWidth + 1;
  };

  return (
    <div
      ref={ref}
      data-rail-scroller
      className={cn(
        "overflow-x-auto overflow-y-hidden [scrollbar-width:none] select-none xl:overflow-visible [&::-webkit-scrollbar]:hidden",
        "cursor-grab active:cursor-grabbing xl:cursor-auto xl:active:cursor-auto",
        className
      )}
      onPointerDown={(e) => {
        if (e.pointerType !== "mouse" || e.button !== 0 || !scrollable()) return; // touch scrolls natively
        const el = ref.current!;
        gsap.killTweensOf(el);
        drag.current = { x: e.clientX, scroll: el.scrollLeft, lastX: e.clientX, lastT: performance.now(), velocity: 0 };
        el.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        const el = ref.current;
        if (!d || !el) return;
        el.scrollLeft = d.scroll - (e.clientX - d.x);
        const now = performance.now();
        d.velocity = (e.clientX - d.lastX) / Math.max(now - d.lastT, 1); // px per ms
        d.lastX = e.clientX;
        d.lastT = now;
      }}
      onPointerUp={(e) => {
        const d = drag.current;
        const el = ref.current;
        drag.current = null;
        if (!d || !el) return;
        el.releasePointerCapture(e.pointerId);
        // a flick carries on a little and eases to a stop
        gsap.to(el, { scrollLeft: el.scrollLeft - d.velocity * 220, duration: 0.7, ease: "power3.out" });
      }}
      onPointerCancel={() => (drag.current = null)}
    >
      {children}
    </div>
  );
}
