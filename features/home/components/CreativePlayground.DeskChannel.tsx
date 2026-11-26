"use client";

import { useEffect, useRef, type PointerEvent, type Ref } from "react";
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
/** Until a drawer's been opened: how long after each move along the middle drawer peeks out at a tapping hand (ms). */
const NUDGE_AFTER = 2400;

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

/** A pointing hand (a paper cut-out), its fingertip at the top middle. */
function TapHand() {
  return (
    <svg viewBox="0 0 40 48" className="block size-full drop-shadow-[2px_4px_3px_rgba(70,50,25,0.35)]">
      <path
        d="M16 4.5a3.5 3.5 0 0 1 7 0V21l1.6-.6a3.3 3.3 0 0 1 4.2 2l.3.9 1.4-.4a3.3 3.3 0 0 1 4 2.3l.3 1a3.3 3.3 0 0 1 3.4 3.2l.1 5.1c.1 6.6-4.6 12.3-11.1 12.9l-2.6.2c-4.3.3-8.4-1.8-10.6-5.5L6.3 33a3.4 3.4 0 0 1 5.6-3.8l4.1 4.4Z"
        fill="#fbf4e2"
        stroke="#5b4520"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M23 21v7.5M28.9 23.3v6M34.2 27v4.5" fill="none" stroke="#5b4520" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/** The note saying the drawers open: on the desk's top edge (desk), or over the strip (phones), with an arrow down at them. */
function DrawerHint({ variant, shown, ref }: { variant: keyof typeof LAYOUT; shown: boolean; ref: Ref<HTMLDivElement> }) {
  const desk = variant === "desk";
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        "group/hint pointer-events-none absolute z-[3] flex items-start transition-[opacity,translate] data-gone:-translate-y-2! data-gone:opacity-0! duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        desk ? "-top-[66px] left-[4px]" : "inset-x-0 -top-[42px] justify-center",
        shown ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
      )}
    >
      <p className="relative -rotate-2 rounded-[2px] bg-[#fbf4e2] px-3 pt-[6px] pb-[5px] font-caveat text-[20px] leading-none font-bold whitespace-nowrap text-[#5b4520] shadow-[0_6px_10px_-4px_rgba(70,50,25,0.4),0_1px_2px_rgba(70,50,25,0.15)]">
        <span className="absolute -top-[7px] left-1/2 block h-[12px] w-[44px] -translate-x-1/2 rotate-3 bg-[#e9d9b4]/85" />
        {desk ? creativePlaygroundCopy.deskHint : creativePlaygroundCopy.stripHint}
      </p>
      {/* the arrow, curling down at the drawers */}
      <svg viewBox="0 0 44 40" className={cn("ml-1 block h-[40px] w-[44px] text-[#b96245]", shown && "animate-[almirah-hint-bob_0.9s_ease-in-out_infinite]")}>
        <path d="M3 8 C 20 2, 34 10, 32 30" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M24 23 L32 33 L39 22" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
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
 *
 * Until one of them has been opened (so newcomers can tell they open): a note
 * on the desk says so (DrawerHint), and a little after each move along the
 * drawer in the middle peeks out at a paper hand tapping it.
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
  /** One of these drawers has been opened (or the drawers slid by hand): no more hints (the note is told straight off). */
  const triedRef = useRef(false);
  const hint = useRef<HTMLDivElement>(null);
  const hand = useRef<HTMLDivElement>(null);
  const markTried = () => {
    triedRef.current = true;
    hint.current?.setAttribute("data-gone", "");
  };
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

  /** The drawer in the middle of the view peeks out a little as a hand taps it (see NUDGE_AFTER). */
  const peek = () => {
    const vp = viewport.current;
    const el = track.current;
    const finger = hand.current;
    if (!vp || !el || !finger || triedRef.current || deskOpen.current || drag.current) return;
    const p = Math.round(pos.current + (vp.offsetWidth - drawer) / 2 / step);
    const front = el.children[p]?.firstElementChild;
    if (!front) return;
    const x = (p - pos.current) * step + drawer * 0.56;
    gsap
      .timeline()
      .set(finger, { x, y: height * 0.62 + 40, rotation: -12, scale: 1, autoAlpha: 0 })
      .to(finger, { y: height * 0.62, rotation: -4, autoAlpha: 1, duration: 0.45, ease: "power3.out" })
      // tap: the hand presses, the drawer slides out towards us a little and back
      .to(finger, { scale: 0.86, duration: 0.12, ease: "power2.in", yoyo: true, repeat: 1 })
      .to(front, { y: "7%", scale: 1.04, duration: 0.28, ease: "power2.out", yoyo: true, repeat: 1, transformOrigin: "50% 100%" }, "<0.1")
      .to(finger, { scale: 0.86, duration: 0.12, ease: "power2.in", yoyo: true, repeat: 1 }, ">-0.1")
      .to(finger, { y: "+=34", rotation: -14, autoAlpha: 0, duration: 0.4, ease: "power2.in" }, ">0.25");
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
    let nudge = 0;
    const timer = window.setInterval(() => {
      if (reduced || !visible || deskOpen.current || drag.current || document.hidden || Date.now() - lastMove.current < AUTOPLAY - 100) return;
      glideTo(Math.round(pos.current) + 1);
      // not opened one yet: once it's settled, the middle drawer peeks out at a tapping hand
      if (!triedRef.current) nudge = window.setTimeout(peek, NUDGE_AFTER);
    }, AUTOPLAY);
    const first = reduced ? 0 : window.setTimeout(() => visible && peek(), 1800);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(nudge);
      window.clearTimeout(first);
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
      // (slid by hand: they've found the drawers)
      triedRef.current = true;
      hint.current?.setAttribute("data-gone", "");
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
      {/* until a drawer's been opened: the note that says they open */}
      <DrawerHint ref={hint} variant={variant} shown={!DESK_CASES.includes(active)} />

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
                  markTried();
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
        {/* the tapping hand (see peek) */}
        <div ref={hand} aria-hidden="true" className="pointer-events-none invisible absolute top-[34px] left-0 z-[3] h-[46px] w-[38px] -translate-x-1/2 opacity-0">
          <TapHand />
        </div>
      </div>
    </div>
  );
}
