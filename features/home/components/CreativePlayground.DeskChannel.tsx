"use client";

import { useEffect, useRef, type PointerEvent } from "react";
import Image from "next/image";
import gsap from "gsap";
import { cn } from "@/lib/utils/cn";
import { cabinetTabs, creativePlaygroundCopy, DESK_CASES, playgroundCases } from "../constants/creativePlayground.constants";

/** How often the drawers move along by one on their own (ms), and how long a move takes (s). */
const AUTOPLAY = 5000;
const GLIDE = 0.8;
/** A press that moves less than this (px on screen) is a click, not a drag. */
const CLICK = 6;
/** The drawers are laid out three times over, so the channel can run on forever either way. */
const COPIES = 3;

/**
 * Sizes, px: "desk" is in the room's 1440 frame (the channel replaces the desk's
 * three painted drawers: x, top, width and height of the desk front), "strip" is
 * the phones' strip under the case file.
 */
const LAYOUT = {
  desk: { drawer: 205, height: 124, gap: 6, frame: { left: 553, top: 953, width: 627, height: 124 } },
  strip: { drawer: 136, height: 88, gap: 8, frame: null },
} as const;

type DeskChannelProps = {
  /** The case on the desk: its drawer (wherever it is along the channel) stands pulled out. */
  active: number;
  onOpen: (index: number) => void;
  variant?: keyof typeof LAYOUT;
};

/** One drawer front: the desk's tan paper, a cream label holder with the client's logo, and a pull. */
function DrawerFront({ index, open }: { index: number; open: boolean }) {
  const { logo } = playgroundCases[index];
  return (
    <span className={cn("absolute inset-0 block origin-bottom transition-[translate,scale] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]", open ? "translate-y-[8%] scale-[1.07]" : "group-hover:translate-y-[2%] group-hover:scale-[1.015]")}>
      {/* inside the drawer: its dark box and the coloured file tabs, seen above the front once it's out */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-[2%] top-0 block h-[18%] overflow-hidden rounded-t-[2px] bg-[#8a6a43] transition-[translate,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "-translate-y-[90%] opacity-100" : "translate-y-0 opacity-0"
        )}
      >
        {cabinetTabs.slice(0, 3).map(({ color }, t) => (
          <span
            key={color}
            className={cn("absolute bottom-0 block h-[70%] w-[26%] rounded-t-[3px] transition-[translate] delay-150 duration-500", open ? "translate-y-0" : "translate-y-full")}
            style={{ left: `${8 + t * 30}%`, backgroundColor: color }}
          />
        ))}
      </span>

      {/* the front: tan paper, a slightly lighter face inside a fine edge */}
      <span
        className={cn(
          "absolute inset-0 block rounded-[2px] bg-linear-to-b from-[#e6cda5] to-[#d9bb8f] shadow-[inset_0_0_0_1px_rgba(150,115,70,0.35),inset_0_2px_0_rgba(255,248,230,0.45)] transition-[box-shadow,filter] duration-500 group-hover:brightness-[1.03] group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-[#2c2826]",
          open && "shadow-[inset_0_0_0_1px_rgba(150,115,70,0.35),inset_0_2px_0_rgba(255,248,230,0.45),0_16px_22px_-6px_rgba(70,50,25,0.45)]"
        )}
      >
        {/* label holder, with the client's logo */}
        <span className="absolute top-[13%] left-1/2 block h-[36%] w-[68%] -translate-x-1/2 border border-[#cdb58c] bg-[#f6efdc] shadow-[0_1px_2px_rgba(98,74,40,0.18)]">
          <span className="absolute inset-[9%_8%] block">
            {/* (loaded straight away: the channel's copies come into view in a jump, as it wraps round) */}
            <Image src={logo} alt="" fill sizes="(min-width: 768px) 10vw, 90px" loading="eager" draggable={false} className="pointer-events-none object-contain select-none" />
          </span>
        </span>
        {/* the pull */}
        <span className="absolute top-[59%] left-1/2 block h-[9%] w-[46%] -translate-x-1/2 rounded-[2px] bg-[#b38f5c] shadow-[inset_0_1px_0_rgba(255,240,210,0.5),0_2px_2px_rgba(90,65,35,0.3)]" />
        {/* the paper's folded lower edge */}
        <span className="absolute inset-x-[2.5%] bottom-[5%] block h-px bg-[rgba(150,115,70,0.35)]" />
      </span>
    </span>
  );
}

/**
 * The desk's drawers on a channel: every client after the cabinet's three has
 * a drawer (its logo on the label), and they slide along a channel in the
 * desk front, three in view. Every 5 s they move along one to the left on
 * their own (not while one of them is open); grab them with the cursor (or a finger) and slide them either
 * way, and they settle on the nearest drawer (a flick carries on a little).
 * The channel runs on forever both ways. Press a drawer and it glides to the
 * middle (clear of the faded ends) and slides out towards us, its coloured file tabs showing, and that client's file goes on
 * the desk. On phones (`strip`) it sits under the case file.
 */
export function DeskChannel({ active, onOpen, variant = "desk" }: DeskChannelProps) {
  const { drawer, height, gap, frame } = LAYOUT[variant];
  const step = drawer + gap;
  const n = DESK_CASES.length;
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  /** Where the channel is, in drawers (the first of the middle copy is at `n`). */
  const pos = useRef(n);
  const drag = useRef<{ x: number; pos: number; t: number; v: number; moved: boolean } | null>(null);
  /** The last press was a drag: its click doesn't open a drawer. */
  const dragged = useRef(false);
  const lastMove = useRef(0);
  /** A desk drawer is open: the drawers stay put (no sliding on their own) until another file is picked. */
  const deskOpen = useRef(DESK_CASES.includes(active));
  useEffect(() => {
    deskOpen.current = DESK_CASES.includes(active);
  }, [active]);

  /** Back into the middle copy without a visible jump (the copies are identical). */
  const wrap = () => {
    const el = track.current;
    if (!el) return;
    if (pos.current >= 2 * n) pos.current -= n;
    else if (pos.current < n) pos.current += n;
    gsap.set(el, { x: -pos.current * step });
  };

  /** Slide the channel to drawer `target` (eased), then wrap. */
  const glideTo = (target: number, duration = GLIDE) => {
    const el = track.current;
    if (!el) return;
    const state = { p: pos.current };
    gsap.killTweensOf(state);
    gsap.killTweensOf(el);
    gsap.to(state, {
      p: target,
      duration,
      ease: "power3.out",
      onUpdate: () => {
        pos.current = state.p;
        gsap.set(el, { x: -state.p * step });
      },
      onComplete: wrap,
    });
  };

  useEffect(() => {
    const el = track.current;
    const vp = viewport.current;
    if (!el || !vp) return;
    gsap.set(el, { x: -pos.current * step });
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    observer.observe(vp);
    // on their own: one along to the left every 5 s (not while held, and not straight after being moved by hand)
    const timer = window.setInterval(() => {
      if (reduced || !visible || deskOpen.current || drag.current || document.hidden || Date.now() - lastMove.current < AUTOPLAY - 100) return;
      glideTo(Math.round(pos.current) + 1);
    }, AUTOPLAY);
    return () => {
      window.clearInterval(timer);
      observer.disconnect();
      gsap.killTweensOf(el);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- set up once per size; glideTo only reads refs
  }, [step]);

  /** Screen px per channel px (the room is drawn scaled to the screen). */
  const scale = () => {
    const vp = viewport.current;
    return vp ? vp.getBoundingClientRect().width / vp.offsetWidth : 1;
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    gsap.killTweensOf(track.current);
    drag.current = { x: e.clientX, pos: pos.current, t: performance.now(), v: 0, moved: false };
    dragged.current = false;
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const el = track.current;
    if (!d || !el) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) < CLICK) return;
    if (!d.moved) {
      d.moved = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    const now = performance.now();
    const next = d.pos - dx / scale() / step;
    // (its speed, in drawers per second, for a flick on letting go)
    d.v = 0.8 * ((next - pos.current) / Math.max(1, now - d.t)) * 1000 + 0.2 * d.v;
    d.t = now;
    pos.current = next;
    gsap.set(el, { x: -next * step });
  };
  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    if (!d?.moved) return;
    dragged.current = true;
    lastMove.current = Date.now();
    // settle on the nearest drawer, carried on a little by a flick
    glideTo(Math.round(pos.current + gsap.utils.clamp(-3, 3, d.v * 0.18)), 0.6);
  };

  const drawers = Array.from({ length: n * COPIES }, (_, p) => ({ p, index: DESK_CASES[p % n], copy: p < n || p >= 2 * n }));

  return (
    <div
      className={cn(frame ? "pointer-events-auto absolute" : "relative mx-auto w-full max-w-[440px]")}
      style={frame ? { left: frame.left, top: frame.top, width: frame.width, height: frame.height } : { height }}
      role="group"
      aria-roledescription="carousel"
      aria-label={creativePlaygroundCopy.deskRail}
    >
      {/* the channel: a recessed slot in the desk front, with a rail along its top and bottom */}
      <span aria-hidden="true" className={cn("absolute block rounded-[3px] bg-linear-to-b from-[#a8875a] to-[#bf9d6e] shadow-[inset_0_3px_6px_rgba(70,48,22,0.45),inset_0_-1px_0_rgba(255,240,210,0.35)]", frame ? "-inset-x-[6px] -inset-y-[5px]" : "inset-x-0 -inset-y-[6px]")} />
      <span aria-hidden="true" className="absolute inset-x-0 -top-[3px] block h-[3px] rounded-full bg-linear-to-b from-[#d9c3a0] to-[#9c7a4c] opacity-80" />
      <span aria-hidden="true" className="absolute inset-x-0 -bottom-[3px] block h-[3px] rounded-full bg-linear-to-b from-[#9c7a4c] to-[#d9c3a0] opacity-80" />

      {/* the drawers (room above and below for a pulled-out drawer and its tabs; faded out at the ends) */}
      <div
        ref={viewport}
        className="absolute inset-x-0 -top-[34px] -bottom-[26px] cursor-grab touch-pan-y overflow-hidden select-none active:cursor-grabbing [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={(e) => drag.current && !e.currentTarget.hasPointerCapture(e.pointerId) && onPointerUp()}
      >
        <div ref={track} className="absolute top-[34px] left-0 flex will-change-transform" style={{ gap, height }}>
          {drawers.map(({ p, index, copy }) => {
            const open = index === active;
            const { client } = playgroundCases[index];
            return (
              <button
                key={p}
                type="button"
                aria-pressed={open}
                aria-label={`Open the ${client} case file`}
                aria-hidden={copy || undefined}
                tabIndex={copy ? -1 : undefined}
                draggable={false}
                onClick={() => {
                  if (dragged.current) return void (dragged.current = false);
                  // brought to the middle, clear of the faded ends, as it slides out
                  lastMove.current = Date.now();
                  const width = viewport.current?.offsetWidth ?? 3 * step;
                  glideTo(p - (width - drawer) / 2 / step);
                  onOpen(index);
                }}
                // (reached with the keyboard: brought into view)
                onFocus={(e) => !copy && e.currentTarget.matches(":focus-visible") && glideTo(Math.max(n, p - 1))}
                className="group relative shrink-0 cursor-[inherit] outline-none"
                style={{ width: drawer, height, zIndex: open ? 2 : 1 }}
              >
                <DrawerFront index={index} open={open} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
