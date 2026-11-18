"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils/cn";
import { awards, awardsCopy, type Award } from "../constants/awards.constants";

/** Each frame hangs a little askew (deg), like a real wall of frames. */
const TILT = [-1.4, 0.9, -0.6, 1.3, -1, 0.6, 1.5, -0.8, 1, -1.3, 0.7];
/** Each frame's paper: the café's pastels (its cups' peach, butter, lilac, sage, powder blue, and cream). */
const PAPER = ["#f1cbb8", "#f2e2a8", "#e2cde4", "#cfe0c6", "#cbdbe6", "#efe4d2"];
/** Each push pin's colour (it holds the frame's string up). */
const PIN = ["#e0846c", "#d9b24f", "#a98bb3", "#7fa37a", "#7d9db4", "#c9a27a"];

/**
 * Where the awards hang in the café (tablets up), as rows of frames (award
 * numbers, 0-based), each row centred at `x` (% of the scene's width) with its
 * pins at `top` (% of its height), or standing on the counter (`desk`, its foot
 * at `bottom`). A row's notes open on `side`, always onto empty wall, the board
 * or the counter, never over another frame:
 *  - above the "Find us online" chalkboard (it spans 4-30% across, from 22%
 *    down): three, notes opening below, over the board;
 *  - one between each pair of ceiling lights (35% | 50% | 65%), and one just
 *    below the third light (between the barista and the right-hand wall):
 *    notes opening below them (the two between the lights angled apart, so
 *    neither lands on a frame);
 *  - between the chalkboard and the barista (40%): one, its note opening to
 *    the left, over the board;
 *  - the right-hand wall (where the cup shelves were, under the plaque): an
 *    upside-down triangle, two then one, notes opening just under it;
 *  - and a desk frame standing on the right of the counter (its top is 70.6%
 *    down), its note opening to the left, over the pastry tray.
 */
type Side = "left" | "below" | "below-right" | "below-left";
/** `note`: where its notes open instead, in % of the scene (for rows hemmed in by frames on every side). */
type Row = { items: readonly number[]; x: number; side: Side; note?: { left: number; top: number } } & ({ top: number; desk?: false } | { bottom: number; desk: true });
const ROWS: Row[] = [
  { items: [0, 1, 3], x: 17, top: 2.6, side: "below" },
  { items: [9], x: 42.6, top: 1.2, side: "below-right" },
  { items: [10], x: 57.4, top: 1.2, side: "below-left" },
  { items: [5], x: 35.1, top: 22.5, side: "left" },
  // just below the third light (65%), between the barista and the right-hand wall
  { items: [7], x: 64.9, top: 23, side: "below" },
  // (their notes open just under the triangle, over the pastry tray: every side of it has frames)
  { items: [4, 8], x: 81.5, top: 9, side: "left", note: { left: 66.5, top: 48.5 } },
  { items: [2], x: 81.5, top: 29.5, side: "left", note: { left: 66.5, top: 48.5 } },
  { items: [6], x: 90.5, bottom: 29.4, side: "left", desk: true },
];

/** A note fading in (slipping down a touch) and out; it's always there, so switching frames never re-draws it. */
const SHOW = "transition-[opacity,transform] duration-300 ease-out";
const ON = "opacity-100 [transform:none]";
const OFF = "opacity-0 [transform:translateY(-6px)]";

/** The frame's photo height in the scene (cqw: % of the scene's width), on the wall and on the desk. */
const PHOTO_H = "4.9cqw";
const DESK_H = "8.2cqw";

/**
 * A frame, cut and folded from pastel paper like the café itself: a soft
 * bevel (the top and left catching the light, the right and bottom a shade
 * deeper, mitred at the corners), a white mat, and the photo, softened a touch
 * to sit lightly on the mint wall. It hangs from a push pin on a light string
 * ("wall", "grid"), or stands on its fold-out paper stand ("desk").
 */
function FrameArt({ award, index, active, size }: { award: Award; index: number; active: boolean; size: "wall" | "grid" | "desk" }) {
  const { image, title } = award;
  const wall = size !== "grid";
  const desk = size === "desk";
  const vars = {
    "--tilt": `${TILT[index % TILT.length]}deg`,
    "--ar": `${image.width} / ${image.height}`,
    "--r": (image.width / image.height).toFixed(4),
    "--paper": PAPER[index % PAPER.length],
    "--pin": PIN[index % PIN.length],
  } as CSSProperties;
  return (
    <span className={cn("relative block", desk ? "" : wall ? "pt-[2.2cqw]" : "pt-8")} style={vars}>
      {desk && (
        <>
          {/* its leg: a slim strut angled back from behind it to the counter (only a sliver shows past its edge) */}
          <span aria-hidden="true" className="absolute right-[6%] bottom-0 h-[62%] w-[0.42cqw] origin-bottom rotate-[13deg] rounded-t-[1px] bg-[color-mix(in_srgb,var(--paper)_62%,#5e4632)]" />
          {/* where it stands on the counter: a soft shadow, deeper right under it */}
          <span aria-hidden="true" className="absolute -right-[10%] -bottom-[0.25cqw] -left-[3%] h-[0.7cqw] rounded-[50%] bg-[radial-gradient(closest-side,rgba(60,70,62,0.3),transparent)]" />
        </>
      )}
      {!desk && (
        <>
          {/* the push pin, and the light string down to the frame's top corners */}
          <span
            aria-hidden="true"
            className={cn(
              "absolute top-0 left-1/2 z-10 rounded-full bg-(--pin) bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.55),transparent_50%)] shadow-[0_1px_2px_rgba(40,50,45,0.3)]",
              wall ? "-ml-[0.32cqw] size-[0.64cqw]" : "-ml-1.5 size-3"
            )}
          />
          <svg aria-hidden="true" viewBox="0 0 100 32" preserveAspectRatio="none" className={cn("absolute left-0 w-full overflow-visible", wall ? "top-[0.32cqw] h-[1.88cqw]" : "top-1.5 h-6.5")}>
            <polyline points="20,32 50,0 80,32" fill="none" stroke="#b7a68f" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          </svg>
        </>
      )}

      {/* the frame: swings straight and lifts a touch, and shines, when hovered */}
      <span
        className={cn(
          "relative block transition-[rotate,translate,filter] duration-500 ease-out group-hover:-translate-y-[0.2cqw] group-hover:rotate-0 group-hover:brightness-[1.04]",
          desk ? "origin-bottom [transform:perspective(40cqw)_rotateX(6deg)]" : "origin-[50%_-2cqw] rotate-(--tilt)",
          active && "-translate-y-[0.2cqw] rotate-0 brightness-[1.04]"
        )}
      >
        <span
          className={cn(
            // the folded paper bevel: four faces, each a step lighter or deeper than the paper
            "relative block border-t-[color-mix(in_srgb,var(--paper)_62%,white)] border-r-[color-mix(in_srgb,var(--paper)_90%,#6b5642)] border-b-[color-mix(in_srgb,var(--paper)_84%,#6b5642)] border-l-[color-mix(in_srgb,var(--paper)_80%,white)] bg-white shadow-[0_4px_8px_-4px_rgba(52,72,64,0.28),0_12px_18px_-14px_rgba(52,72,64,0.3)] group-focus-visible:ring-2 group-focus-visible:ring-[#b96245] group-focus-visible:ring-offset-2",
            wall ? "border-[0.5cqw] p-[0.38cqw]" : "border-[7px] p-[5px]"
          )}
        >
          {desk && (
            // its depth: the frame's thin right-hand edge, seen as it stands
            <span aria-hidden="true" className="absolute top-[0.15cqw] -right-[0.85cqw] bottom-[-0.5cqw] w-[0.35cqw] origin-left skew-y-[30deg] bg-[color-mix(in_srgb,var(--paper)_74%,#5e4632)]" />
          )}
          {/* paper grain over the frame and mat */}
          <span aria-hidden="true" className="pointer-events-none absolute -inset-[0.6cqw] bg-[url(/images/website/home/who-we-are/paper-wall.jpg)] bg-size-[260px] opacity-30 mix-blend-multiply" />
          {/* the white mat's cut edge, then the photo (softened to sit lightly on the wall) */}
          <span className="relative block shadow-[0_0_0_1px_color-mix(in_srgb,var(--paper)_70%,#6b5642)]">
            <span
              className={cn("relative block aspect-(--ar)", wall ? "h-(--h) w-[calc(var(--h)*var(--r))]" : "w-full")}
              style={wall ? ({ "--h": desk ? DESK_H : PHOTO_H } as CSSProperties) : undefined}
            >
              <Image src={image} alt={title} fill sizes={wall ? "(min-width: 768px) 12vw, 1px" : "45vw"} className="object-cover brightness-[1.08] contrast-[0.9] saturate-[0.92]" />
              <span aria-hidden="true" className="absolute inset-0 bg-[rgba(250,244,232,0.12)]" />
            </span>
          </span>
          {/* the shine: a band of light sweeping across the glass */}
          <span aria-hidden="true" className="pointer-events-none absolute -inset-[0.6cqw] overflow-hidden">
            <span
              className={cn(
                "absolute inset-y-0 left-0 w-1/2 -translate-x-[160%] skew-x-[-18deg] bg-linear-to-r from-transparent via-[rgba(255,255,255,0.7)] to-transparent transition-transform duration-[900ms] ease-out group-hover:translate-x-[320%]",
                active && "translate-x-[320%]"
              )}
            />
          </span>
        </span>
      </span>
    </span>
  );
}

/** The paper note about an award: taped up, its title in the hand-written face, then a line about it. */
function Note({ award, className, style }: { award: Award; className?: string; style?: CSSProperties }) {
  return (
    <div role="note" style={style} className={cn("pointer-events-none rotate-[-1deg] rounded-[2px] bg-[#fbf5e6] bg-[url(/images/website/home/who-we-are/paper-wall.jpg)] bg-size-[380px] px-4 pt-5 pb-4 text-left bg-blend-multiply shadow-[0_1px_1px_rgba(58,42,48,0.12),0_12px_20px_-8px_rgba(58,42,48,0.4)]", className)}>
      <span aria-hidden="true" className="absolute -top-2 left-1/2 h-4 w-14 -translate-x-1/2 rotate-[-3deg] bg-[rgba(233,201,140,0.75)] shadow-[0_1px_1px_rgba(0,0,0,0.08)]" />
      <p className="font-caveat text-[clamp(18px,1.5cqw,22px)] leading-none font-bold text-[#b96245]">{award.title}</p>
      <p className="mt-2 font-inter text-[clamp(12px,0.95cqw,14px)] leading-[1.45] text-ink-soft">{award.text}</p>
    </div>
  );
}

/** The paper plaque naming the wall. */
function Plaque({ className, hint }: { className?: string; hint: string }) {
  return (
    <p className={cn("rounded-[3px] bg-[#f6efe0] bg-[url(/images/website/home/who-we-are/paper-wall.jpg)] bg-size-[380px] text-center font-caveat leading-tight font-bold text-[#5a4632] bg-blend-multiply shadow-[0_1px_0_rgba(255,255,255,0.5)_inset,0_6px_12px_-6px_rgba(38,52,46,0.45)]", className)}>
      {awardsCopy.label}
      <span className="block font-inter text-[0.42em] font-medium tracking-[0.08em] text-stone uppercase">{hint}</span>
    </p>
  );
}

/**
 * The studio's awards hung on the café wall itself (tablets up; drawn in the
 * scene, sized with it): above the chalkboard, between the lights, beside the
 * barista, an upside-down triangle of three on the right-hand wall, and a desk frame on
 * the counter (see ROWS), under the "Our wall of fame" plaque (see ROWS). Hover (or
 * focus, or tap) a frame and it straightens, lifts and shines, and a paper
 * note with what the award is opens beside its row, clear of the other frames.
 */
export function AwardsOnWall({ className }: { className?: string }) {
  const [active, setActive] = useState<number | null>(null);
  // each row's note stays in place and keeps the last award it showed, fading out with its words still on it
  const [last, setLast] = useState<Record<number, number>>({});
  // moving from one frame to the next: the note waits a moment before closing, so it doesn't flicker shut in the gap
  const closing = useRef<number | undefined>(undefined);
  const open = (i: number) => {
    window.clearTimeout(closing.current);
    setActive(i);
    const row = ROWS.findIndex((r) => r.items.includes(i));
    setLast((l) => (l[row] === i ? l : { ...l, [row]: i }));
  };
  const close = (i: number) => {
    window.clearTimeout(closing.current);
    closing.current = window.setTimeout(() => setActive((a) => (a === i ? null : a)), 140);
  };
  return (
    <div className={cn("pointer-events-none absolute inset-0 z-20", className)}>
      <Plaque hint={awardsCopy.hint} className="absolute top-[1.1%] left-[82%] -translate-x-1/2 px-[1.2cqw] py-[0.25cqw] text-[1.55cqw]" />
      {ROWS.map((row, r) => {
        const on = active !== null && row.items.includes(active);
        const shown = on ? active! : (last[r] ?? row.items[0]);
        return (
          <div
            key={row.items.join()}
            className={cn("absolute flex -translate-x-1/2 gap-[1.4cqw]", row.desk ? "items-end" : "items-start")}
            style={row.desk ? { left: `${row.x}%`, bottom: `${row.bottom}%` } : { left: `${row.x}%`, top: `${row.top}%` }}
          >
            {row.items.map((i) => (
              <button
                key={i}
                type="button"
                aria-label={`${awards[i].title}: read about it`}
                aria-expanded={active === i}
                onMouseEnter={() => open(i)}
                onMouseLeave={() => close(i)}
                onFocus={() => open(i)}
                onBlur={() => close(i)}
                onClick={() => setActive((a) => (a === i ? null : i))}
                className="group pointer-events-auto cursor-pointer outline-none"
              >
                <FrameArt award={awards[i]} index={i} active={active === i} size={row.desk ? "desk" : "wall"} />
              </button>
            ))}
            {/* the note: beside the row, never over a frame (always there; it fades in and out) */}
            {!row.note && (
              <Note
                award={awards[shown]}
                className={cn(
                  "absolute w-[clamp(190px,15cqw,250px)] max-lg:hidden",
                  SHOW,
                  on ? ON : OFF,
                  row.side === "left" && "top-[1.4cqw] right-[calc(100%+1.6cqw)]",
                  row.side === "below" && "top-[calc(100%+1.2cqw)] left-1/2 -translate-x-1/2",
                  row.side === "below-right" && "top-[calc(100%+1.2cqw)] left-1/2",
                  row.side === "below-left" && "top-[calc(100%+1.2cqw)] right-1/2"
                )}
              />
            )}
          </div>
        );
      })}
      {ROWS.map((row, r) => {
        if (!row.note) return null;
        const on = active !== null && row.items.includes(active);
        const shown = on ? active! : (last[r] ?? row.items[0]);
        return (
          <Note
            key={row.items.join()}
            award={awards[shown]}
            className={cn("absolute w-[clamp(190px,15cqw,250px)] max-lg:hidden", SHOW, on ? ON : OFF)}
            style={{ left: `${row.note.left}%`, top: `${row.note.top}%` }}
          />
        );
      })}
      {/* tablets: the note opens across the counter front instead (empty at this size), clear of every frame */}
      <Note
        award={awards[active ?? Object.values(last).pop() ?? 0]}
        className={cn("absolute top-[74%] left-1/2 w-[clamp(240px,42cqw,360px)] -translate-x-1/2 lg:hidden", SHOW, active !== null ? ON : OFF)}
      />
    </div>
  );
}

/**
 * Phones: the same awards, framed and hung two across under the café scene
 * (in the scene they'd be too small to see), on a stretch of the café's wall.
 * Tap a frame for its note, opened just under it.
 */
export function AwardsGrid({ className }: { className?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className={cn("relative bg-[url(/images/website/home/start-conversation/cafe/wall-strip.webp)] bg-size-[100%_auto] bg-repeat-y pt-6 pb-10", className)}>
      <div className="flex justify-center px-4">
        <Plaque hint={awardsCopy.hintTouch} className="px-5 py-1.5 text-[24px]" />
      </div>
      <ul className="site-container mt-4 grid grid-cols-2 items-start gap-x-5 gap-y-6 sm:gap-x-8">
        {awards.map((award, i) => (
          <li key={award.title} className="flex flex-col">
            <button type="button" aria-expanded={open === i} aria-label={`${award.title}: read about it`} onClick={() => setOpen(open === i ? null : i)} className="group cursor-pointer outline-none">
              <FrameArt award={award} index={i} active={open === i} size="grid" />
            </button>
            <div className={cn("grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out", open === i ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
              <div className="min-h-0 overflow-hidden px-1 pb-2">
                <Note award={award} className="relative" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
