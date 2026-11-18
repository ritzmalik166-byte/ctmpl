"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils/cn";
import { CrumpleButton } from "@/components/ui/CrumpleButton";

/** Paper bits shed by a crumpling name: ink, cream and the outline's tan (as the selector's other buttons). */
const CHUNKS = ["#2c2826", "#faf6ef", "#aa9986"] as const;

const COPIES = 3; // the list is laid out three times, so it can slide on forever either way
const SLIDE = { duration: 0.45, ease: "power3.out" };

type ClientSliderProps = {
  /** The client names, in order. */
  clients: string[];
  active: number;
  onSelect: (index: number) => void;
  /** The paper crumple hover of the selector's other buttons (an outlined name turns dark at peak crush). */
  crumple?: boolean;
};

/**
 * Phones (and, from md, any selector with too many names for one row): the
 * client names as an endless sliding strip. The chosen client is
 * always slid to the centre (never cut off); going past the last client carries
 * on into the first one (… 3, 4, 1, 2 …) and the same backwards. The strip is
 * three copies of the list: after each slide it hops, unseen, back to the
 * middle copy, so there is always more strip on both sides. Swipe to step too.
 */
export function ClientSlider({ clients, active, onSelect, crumple = false }: ClientSliderProps) {
  const n = clients.length;
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  /** Which chip (of all copies) is centred. */
  const pos = useRef(n + active);
  const swipeStart = useRef<number | null>(null);

  const chip = (p: number) => track.current?.children[p] as HTMLElement | undefined;
  const xFor = (p: number) => {
    const c = chip(p);
    return c && viewport.current ? viewport.current.clientWidth / 2 - (c.offsetLeft + c.offsetWidth / 2) : 0;
  };
  /** Width of one copy of the list (the strip repeats every this many px). */
  const copyWidth = () => (chip(n)?.offsetLeft ?? 0) - (chip(0)?.offsetLeft ?? 0);

  /** Hop to the same client in the middle copy, without any visible change. */
  const recentre = () => {
    const el = track.current;
    if (!el) return;
    if (pos.current < n) {
      pos.current += n;
      gsap.set(el, { x: (gsap.getProperty(el, "x") as number) - copyWidth() });
    } else if (pos.current >= 2 * n) {
      pos.current -= n;
      gsap.set(el, { x: (gsap.getProperty(el, "x") as number) + copyWidth() });
    }
  };

  /** Slide so chip `p` is centred. */
  const slideTo = (p: number) => {
    const el = track.current;
    if (!el) return;
    pos.current = p;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.to(el, { x: xFor(p), ...SLIDE, duration: reduce ? 0 : SLIDE.duration, overwrite: true, onComplete: () => { recentre(); gsap.set(el, { x: xFor(pos.current) }); } });
  };

  // place the strip on load, and keep the chosen chip centred when the width changes
  useLayoutEffect(() => {
    const el = track.current;
    if (!el || !viewport.current) return;
    gsap.set(el, { x: xFor(pos.current) });
    const observer = new ResizeObserver(() => gsap.set(el, { x: xFor(pos.current) }));
    observer.observe(viewport.current);
    return () => observer.disconnect();
    // xFor reads refs only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // the chosen client changed (arrows, a drawer, a swipe): slide the shortest way round
  useEffect(() => {
    const current = ((pos.current % n) + n) % n;
    if (current === active) return;
    recentre();
    let step = (active - current + n) % n;
    if (step > n / 2) step -= n;
    slideTo(pos.current + step);
    // slideTo reads refs only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, n]);

  return (
    <div
      ref={viewport}
      className="relative min-w-0 flex-1 touch-pan-y overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_14%,black_86%,transparent)]"
      onPointerDown={(e) => (swipeStart.current = e.clientX)}
      onPointerUp={(e) => {
        const start = swipeStart.current;
        swipeStart.current = null;
        if (start === null || Math.abs(e.clientX - start) < 30) return;
        onSelect((active + (e.clientX < start ? 1 : -1) + n) % n);
      }}
      onPointerCancel={() => (swipeStart.current = null)}
    >
      <div ref={track} className="flex w-max gap-2">
        {Array.from({ length: n * COPIES }, (_, p) => {
          const i = p % n;
          const isActive = i === active;
          const isCopy = p < n || p >= 2 * n;
          return (
            <CrumpleButton
              key={p}
              type="button"
              crumple={crumple}
              chunkColors={CHUNKS}
              aria-pressed={isActive}
              aria-hidden={isCopy || undefined}
              tabIndex={isCopy ? -1 : undefined}
              onClick={() => {
                if (i === active) return;
                slideTo(p);
                onSelect(i);
              }}
              className={cn(
                // from md (when there are too many names for a row) the same size as the row's names
                "flex h-8 shrink-0 cursor-pointer items-center justify-center rounded-[5px] px-3 font-inter text-[13px] leading-[normal] tracking-[-0.3px] whitespace-nowrap transition-colors duration-300 md:h-9 lg:h-[38px] lg:px-3.5 lg:text-sm xl:h-10 xl:text-[15px]",
                isActive ? "bg-[#2c2826] font-bold text-[#faf6ef]" : cn("border border-[#aa9986] font-medium text-[#2c2826]", !crumple && "hover:bg-[#2c2826]/5"),
                // crumpled (hovered): an outlined name turns dark, as in the row of names
                !isActive && "data-flipped:border-[#2c2826] data-flipped:bg-[#2c2826] data-flipped:text-[#faf6ef]"
              )}
            >
              {clients[i]}
            </CrumpleButton>
          );
        })}
      </div>
    </div>
  );
}
