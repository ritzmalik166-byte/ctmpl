import type { CSSProperties, ReactNode } from "react";

/**
 * The stickers the team has stuck on the front of the robot's desk (in px of
 * the 1440 × 731 room, like everything in it, so they scale and crop with the
 * room on every screen): the studio's "since 2008" seal, its motto in a speech
 * bubble and a "House of Ideas" tag with a paper plane.
 *
 * They're made to look stuck on the desk, not floating over the picture: their
 * colours are muted to the room's light, the same soft light and shade as the
 * desk falls across them, the paper's grain shows through, and they sit flat
 * with only a hairline edge of shadow. Two of them have a corner coming
 * unstuck, which flutters now and then in the draught (`sticker-flutter`).
 * Hover one and, smoothly, it brightens as if it caught the light, lifts a
 * hair off the desk, peels up a little further (the seal is glued all round)
 * and a sheen runs across its vinyl.
 */

/** Paper grain, laid over each sticker (multiplied in, so it reads as the surface's texture). */
function Grain() {
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full opacity-[0.22] mix-blend-multiply">
      <filter id="kw-sticker-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.33  0 0 0 0 0.3  0 0 0 0.9 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#kw-sticker-grain)" />
    </svg>
  );
}

/**
 * The room's light on a sticker: a touch brighter towards the top left, falling
 * off to the bottom right like the desk itself, and a sheen that sweeps across
 * the vinyl when it's hovered.
 */
function Light() {
  return (
    <>
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(155deg,rgba(255,250,235,0.16),rgba(255,250,235,0)_45%,rgba(40,48,58,0.2))] mix-blend-multiply" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(105deg,transparent_35%,rgba(255,255,255,0.4)_50%,transparent_65%)] opacity-0 [transition:opacity_0.35s_ease-out,translate_0s_0.35s] group-hover:translate-x-full group-hover:opacity-100 group-hover:[transition:opacity_0.25s_ease-out,translate_1.1s_cubic-bezier(0.22,1,0.36,1)]"
      />
    </>
  );
}

type StickerProps = {
  left: number;
  top: number;
  tilt: number;
  /** What it says, for screen readers (none: it's part of another sticker). */
  label?: string;
  /** Its die-cut shape (the white margin round the print follows it). */
  shape: string;
  /** A corner coming unstuck: its idle size and how far it peels on hover (px), and its draught's beat (s). */
  peel?: { rest: number; hover: number; delay: number };
  children: ReactNode;
  /** A die-cut piece hanging off its edge (the bubble's tail), lit with it but outside its peel. */
  tail?: ReactNode;
};

/**
 * One sticker: flat on the desk at its tilt. With `peel`, its bottom right
 * corner has lifted: the sticker is cut back along a diagonal (`--peel`) and
 * the corner shows folded over, its pale backing up, with a little shadow on the
 * desk under it.
 */
function Sticker({ left, top, tilt, label, shape, peel, children, tail }: StickerProps) {
  // its peel = the idle corner, plus the draught's flutter (animated), plus the hover lift (transitioned), so
  // the two never fight: going on and off hover it glides both ways
  const vars = peel
    ? ({ "--peel-rest": `${peel.rest}px`, "--peel-hover": `${peel.hover - peel.rest}px`, "--peel": "calc(var(--peel-rest) + var(--flutter) + var(--lift))", animationDelay: `${-peel.delay}s` } as CSSProperties)
    : undefined;
  return (
    <div
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className="group pointer-events-auto absolute"
      style={{ left, top, rotate: `${tilt}deg` }}
    >
      {/* (a hairline of shadow round it all, where its edge meets the desk) */}
      <div
        className={`relative [filter:drop-shadow(0_0.6px_0.4px_rgba(20,26,34,0.45))] transition-[--lift,translate,filter] duration-700 ease-[cubic-bezier(0.45,0,0.2,1)] group-hover:-translate-y-px group-hover:[filter:drop-shadow(0_2px_2px_rgba(20,26,34,0.3))] motion-reduce:transition-none ${peel ? "animate-[sticker-flutter_7s_ease-in-out_infinite] group-hover:[--lift:var(--peel-hover)] motion-reduce:animate-none" : ""} `}
        style={vars}
      >
        {/* the sticker itself, muted to the room's light */}
        <div
          className={`relative overflow-hidden saturate-[0.82] transition-[filter] duration-700 ease-[cubic-bezier(0.45,0,0.2,1)] group-hover:brightness-[1.14] group-hover:saturate-[1.05] motion-reduce:transition-none ${shape}`}
          style={peel ? { clipPath: "polygon(0 0, 100% 0, 100% calc(100% - var(--peel)), calc(100% - var(--peel)) 100%, 0 100%)" } : undefined}
        >
          {children}
          <Grain />
          <Light />
        </div>
        {tail && <div className="saturate-[0.82] transition-[filter] duration-700 ease-[cubic-bezier(0.45,0,0.2,1)] group-hover:brightness-[1.14] group-hover:saturate-[1.05] motion-reduce:transition-none">{tail}</div>}
        {peel && (
          <>
            {/* the desk in the gap it's left, shaded where the corner lifts off it */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-0 bottom-0 size-(--peel) bg-[linear-gradient(to_bottom_right,transparent_48%,rgba(20,26,34,0.3)_52%,transparent_85%)] [clip-path:polygon(100%_0,100%_100%,0_100%)]"
            />
            {/* the corner, folded back over the sticker: its pale paper backing, darker along the fold */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-0 bottom-0 size-(--peel) bg-[linear-gradient(to_top_left,#cfc8ba_0%,#ece7dc_40%,#fbf8f2_100%)] [clip-path:polygon(0_0,100%_0,0_100%)]"
            />
          </>
        )}
      </div>
    </div>
  );
}

/** The scalloped seal's outline: 16 bumps round a circle (in a 100 × 100 box). */
const SEAL_PATH = (() => {
  const n = 16;
  let d = "";
  for (let i = 0; i <= n * 2; i++) {
    const a = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 ? 45 : 50;
    d += `${i ? "L" : "M"}${(50 + r * Math.cos(a)).toFixed(2)} ${(50 + r * Math.sin(a)).toFixed(2)}`;
  }
  return d + "Z";
})();

export function DeskStickers() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* the seal: since 2008, Noida (glued all round) */}
      <Sticker left={866} top={590} tilt={-8} label="Sticker: Since 2008, Noida" shape="size-[80px] [clip-path:circle(50%)]">
        <svg viewBox="0 0 100 100" className="absolute inset-0 size-full">
          <path d={SEAL_PATH} fill="#f3ecdd" />
          <path d={SEAL_PATH} fill="#c99a3f" transform="translate(50 50) scale(0.89) translate(-50 -50)" />
          <circle cx="50" cy="50" r="31" fill="none" stroke="#f3ecdd" strokeWidth="1.3" strokeDasharray="2.4 2.4" opacity="0.85" />
        </svg>
        <span className="absolute inset-0 flex flex-col items-center justify-center font-instrument leading-none font-bold text-[#3b2a12]">
          <span className="text-[7.5px] tracking-[0.2em] uppercase">Since</span>
          <span className="mt-[2px] text-[21px] tracking-[-0.02em]">2008</span>
          <span className="mt-[3px] text-[7px] tracking-[0.22em] uppercase">Noida</span>
        </span>
      </Sticker>

      {/* the motto, in a speech bubble (this is the water cooler, after all) */}
      <Sticker
        left={964}
        top={614}
        tilt={4}
        label="Sticker: Best or nothing"
        shape="rounded-[13px] bg-[#f3ecdd] p-[3px]"
        peel={{ rest: 9, hover: 22, delay: 0 }}
        tail={
          <span className="absolute top-[calc(100%-1px)] left-[18px] h-[13px] w-[18px] bg-[#f3ecdd] [clip-path:polygon(0_0,100%_0,10%_100%)]">
            <span className="absolute inset-[0_3px_3px_3px] bg-[#2f5f86] [clip-path:polygon(0_0,100%_0,10%_100%)]" />
          </span>
        }
      >
        <div className="rounded-[10px] bg-[#2f5f86] px-3 pt-[7px] pb-[8px] text-center font-caveat leading-[0.95] font-bold text-[#f3ecdd]">
          <span className="block text-[19px]">Best or</span>
          <span className="block text-[19px] text-[#e9c25a]">nothing.</span>
        </div>
      </Sticker>

      {/* House of Ideas, on a red tag, with its paper plane and the dashed line it flies along */}
      <Sticker
        left={1076}
        top={588}
        tilt={-5}
        label="Sticker: House of Ideas"
        shape="rounded-[5px] bg-[#f3ecdd] p-[3px]"
        peel={{ rest: 7, hover: 20, delay: 3.4 }}
      >
        <div className="relative w-[72px] rounded-[3px] bg-[#b4512f] px-2 pt-[22px] pb-[8px] font-instrument leading-[0.95] font-bold text-[#f3ecdd] uppercase">
          <svg viewBox="0 0 60 16" className="absolute top-[5px] left-[6px] w-[54px]">
            <path d="M2 12 C14 12 18 4 32 6" fill="none" stroke="#f3ecdd" strokeWidth="1.2" strokeDasharray="2 2.4" strokeLinecap="round" opacity="0.65" />
            <path d="M32 8 46 2 41 13 38 10Z" fill="#f3ecdd" />
            <path d="M38 10 41 13 40 9Z" fill="#dba68f" />
          </svg>
          <span className="block text-[13px] tracking-[0.02em]">House</span>
          <span className="block text-[9px] tracking-[0.18em]">of ideas</span>
        </div>
      </Sticker>
    </div>
  );
}
