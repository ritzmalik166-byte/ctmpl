"use client";

import type { CSSProperties, ReactNode } from "react";
import { CAT_ART, type CatShape } from "../constants/playgroundCat.art";
import { useWindowCat } from "../animations/StartConversation.WindowCat";

/**
 * Things on the meeting room door, in px of the door leaf (396 × 625.5): the
 * paper cat peeking through its window, the room's hanging sign and a few
 * stickers. All of it rides on the leaf, so it swings with the door.
 */

/** The window's glass, in px of the leaf (measured off door-leaf.png). */
const GLASS = { left: 67.5, top: 58.5, width: 260, height: 279 };

function Shapes({ art }: { art: CatShape[] }) {
  return art.map((shape, i) => {
    if ("poly" in shape) return <polygon key={i} points={shape.poly} fill={shape.fill} />;
    if ("ellipse" in shape) {
      const [cx, cy, rx, ry] = shape.ellipse;
      return <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill={shape.fill} />;
    }
    return <path key={i} d={shape.line} stroke={shape.stroke} strokeWidth={shape.width} fill="none" strokeLinecap="round" />;
  });
}

/* the cat's paper, as in playgroundCat.art */
const L = "#eaa86a";
const M = "#da8d50";
const D = "#c2733d";
const S = "#a65d2f";
const C1 = "#f5e6cb";
const C2 = "#e4cca7";
const BEAN = "#e39a93";

/**
 * A front leg raised to the window, its paw pressed flat on the glass (so we
 * see its pink beans): the forearm runs down and in to the shoulder, lit on one
 * fold and shaded on the other, a stripe across it.
 */
function Paw({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})${flip ? " scale(-1 1)" : ""}`}>
      <polygon points="-7,4 0,4 10,78 2,80" fill={L} />
      <polygon points="0,4 7,4 18,77 10,78" fill={D} />
      <polygon points="1,30 9,29 11,35 2,36" fill={S} />
      {/* the paw, pressed on the glass */}
      <polygon points="-11,6 -12,-3 -7,-11 0,-13 7,-11 12,-3 11,6 0,9" fill={C1} />
      <polygon points="0,-13 7,-11 12,-3 11,6 0,9" fill={C2} />
      <ellipse cx={-7} cy={-6} rx={2.2} ry={2} fill={BEAN} />
      <ellipse cx={-2.4} cy={-9.4} rx={2.2} ry={2} fill={BEAN} />
      <ellipse cx={2.4} cy={-9.4} rx={2.2} ry={2} fill={BEAN} />
      <ellipse cx={7} cy={-6} rx={2.2} ry={2} fill={BEAN} />
      <ellipse cx={0} cy={0.8} rx={4.6} ry={3.6} fill={BEAN} />
    </g>
  );
}

/**
 * The paper cat behind the door, up on its back legs, peeking through the
 * window every few seconds (see useWindowCat): it rises into view (head,
 * neck and shoulders), puts its paws up on the glass either side of its face,
 * looks about, blinks, smiles at you and drops back down. Its head is the
 * studio cat's own (playgroundCat.art), a little smaller than life behind the
 * frosted glass.
 */
function WindowCat() {
  const ref = useWindowCat();
  return (
    <svg
      ref={ref}
      aria-hidden="true"
      viewBox={`0 0 ${GLASS.width} ${GLASS.height}`}
      className="absolute overflow-hidden"
      style={{ left: GLASS.left, top: GLASS.top, width: GLASS.width, height: GLASS.height }}
    >
      <defs>
        <linearGradient id="window-cat-frost" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbf8ee" stopOpacity="0.3" />
          <stop offset="0.5" stopColor="#eeebdf" stopOpacity="0.18" />
          <stop offset="1" stopColor="#e5e2d4" stopOpacity="0.26" />
        </linearGradient>
      </defs>
      {/* drawn a little smaller than its own size, standing on the sill */}
      <g data-peek transform="translate(130 279) scale(0.8) translate(-130 -279)">
        <g data-head-bob>
          {/* the body, folded like the cat's own: round shoulders (lit and shaded), tabby stripes, running on down out of sight */}
          <polygon points="76,300 84,264 100,247 130,240 130,300" fill={M} />
          <polygon points="130,240 160,247 176,264 184,300 130,300" fill={D} />
          <polygon points="100,247 130,240 130,247 104,254" fill={L} />
          <polygon points="88,266 97,259 96,270 87,276" fill={S} />
          <polygon points="84,284 92,279 91,289 83,293" fill={S} />
          <polygon points="172,266 163,259 164,270 173,276" fill="#94512a" />
          <polygon points="176,284 168,279 169,289 177,293" fill="#94512a" />
          {/* a short, sturdy neck from under the chin into the shoulders */}
          <polygon points="110,222 130,220 130,250 104,252" fill={M} />
          <polygon points="130,220 150,222 156,252 130,250" fill={D} />
          <polygon points="112,236 121,233 120,240 111,243" fill={S} />
          {/* a fluffy cream bib under the chin */}
          <polygon points="108,246 152,246 148,258 142,253 138,266 130,259 122,266 118,253 112,258" fill={C1} />
          <polygon points="130,246 152,246 148,258 142,253 138,266 130,259" fill={C2} />
          {/* the head, the studio cat's own */}
          <g transform="translate(130 194) scale(1.1) translate(-62 -80)">
            <Shapes art={CAT_ART.head} />
            <g data-eyes>
              <Shapes art={CAT_ART.eyes} />
              {/* the pupils stay inside the eyes, however far it looks */}
              <clipPath id="window-cat-eyes">
                {CAT_ART.eyes.slice(2).map((shape, i) =>
                  "ellipse" in shape ? <ellipse key={i} cx={shape.ellipse[0]} cy={shape.ellipse[1]} rx={shape.ellipse[2]} ry={shape.ellipse[3]} /> : null
                )}
              </clipPath>
              <g clipPath="url(#window-cat-eyes)">
                <g data-gaze>
                  <Shapes art={CAT_ART.pupils} />
                </g>
              </g>
            </g>
            <g data-smile opacity={0}>
              <Shapes art={CAT_ART.smile} />
            </g>
          </g>
        </g>
        <g data-paws>
          <Paw x={80} y={230} />
          <Paw x={180} y={230} flip />
        </g>
      </g>
      {/* the frosted glass in front of it all, and its sheen */}
      <rect width={GLASS.width} height={GLASS.height} fill="url(#window-cat-frost)" />
      <polygon points="0,0 70,0 0,96" fill="#ffffff" opacity="0.1" />
    </svg>
  );
}

/**
 * The room's sign, on a cord from a brass pin on the door: a cream enamel
 * plate with a red rim, "CTM" across it and the room's name under it. It
 * sways a little.
 */
function DoorSign() {
  return (
    <div className="absolute top-[364px] left-1/2 w-[164px] -translate-x-1/2">
      {/* the pin */}
      <span className="absolute top-0 left-1/2 z-10 size-[10px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff3c4,#d9a93e_55%,#8a6418)] shadow-[0_1px_2px_rgba(40,20,0,0.5)]" />
      <div style={{ "--swing": "1.4deg", "--sway": "5.5s" } as CSSProperties} className="origin-top animate-[sign-sway_var(--sway)_ease-in-out_infinite] motion-reduce:animate-none">
        {/* the cord, from the pin to either eyelet */}
        <svg aria-hidden="true" viewBox="0 0 164 28" className="block h-[28px] w-full">
          <path d="M82 5 L24 27 M82 5 L140 27" stroke="#4a3526" strokeWidth={1.5} fill="none" strokeLinecap="round" />
        </svg>
        <div className="relative -mt-[4px] rounded-[7px] bg-[#f6eedd] px-3 pt-[12px] pb-[10px] text-center shadow-[inset_0_0_0_2px_#b84530,inset_0_0_0_5px_#f6eedd,inset_0_0_0_6px_rgba(184,69,48,0.4),0_6px_10px_-4px_rgba(40,20,5,0.55)]">
          {/* the eyelets the cord runs through */}
          <span className="absolute top-[5px] left-[21px] size-[6px] rounded-full bg-[#4a3526] shadow-[0_0_0_1.5px_#c9a04a]" />
          <span className="absolute top-[5px] right-[21px] size-[6px] rounded-full bg-[#4a3526] shadow-[0_0_0_1.5px_#c9a04a]" />
          <p className="pl-[0.16em] font-instrument text-[34px] leading-none font-bold tracking-[0.16em] text-[#2b2420]">CTM</p>
          <p className="mt-[5px] font-instrument text-[12px] leading-none font-semibold tracking-[0.18em] text-[#b84530] uppercase">Meeting room</p>
        </div>
      </div>
    </div>
  );
}

/**
 * A die-cut vinyl sticker: a thin white margin, a little sheen across it and a
 * tight shadow (it's stuck flat on the door), at a slight tilt.
 */
function Sticker({ left, top, tilt, children }: { left: number; top: number; tilt: number; children: ReactNode }) {
  return (
    <div className="absolute drop-shadow-[0_1px_1px_rgba(40,20,5,0.3)]" style={{ left, top, rotate: `${tilt}deg` }}>
      {children}
    </div>
  );
}

/** The few stickers the team's stuck on the door's bottom panel, clear of the window, the sign and the handle. */
function DoorStickers() {
  const sheen = "pointer-events-none absolute inset-0 rounded-[inherit] bg-linear-to-br from-white/35 via-white/0 to-white/0";
  return (
    <>
      {/* the four brand squares */}
      <Sticker left={56} top={478} tilt={-7}>
        <span className="relative grid size-[38px] grid-cols-2 gap-[1.5px] rounded-[5px] bg-white p-[2.5px]">
          <span className="rounded-[2px] bg-[#1f57a5]" />
          <span className="rounded-[2px] bg-[#f28a3a]" />
          <span className="rounded-[2px] bg-[#f4c232]" />
          <span className="rounded-[2px] bg-[#17733f]" />
          <span className={sheen} />
        </span>
      </Sticker>
      {/* a round "Ideas" sticker */}
      <Sticker left={292} top={486} tilt={9}>
        <span className="relative flex size-[50px] rounded-full bg-white p-[2.5px]">
          <span className="flex size-full flex-col items-center justify-center rounded-full bg-[#f4c232] font-instrument leading-none font-bold text-[#2b2420]">
            <span className="text-[14px]">★</span>
            <span className="mt-[1px] text-[11px] tracking-[0.04em] uppercase">Ideas</span>
          </span>
          <span className={sheen} />
        </span>
      </Sticker>
      {/* the studio's paper plane */}
      <Sticker left={178} top={548} tilt={-6}>
        <svg viewBox="0 0 60 40" className="block w-[42px]">
          <path d="M2 21 58 3 40 37 28 26Z" fill="#fff" stroke="#fff" strokeWidth="5" strokeLinejoin="round" />
          <path d="M2 21 58 3 28 26Z" fill="#e8674e" />
          <path d="M58 3 40 37 28 26Z" fill="#c24f38" />
          <path d="M28 26 34 36 40 37Z" fill="#9c3b29" />
        </svg>
      </Sticker>
    </>
  );
}

/** Everything on the door leaf: the cat in the window, the stickers and the sign. */
export function DoorDecor() {
  return (
    <>
      <WindowCat />
      <DoorStickers />
      <DoorSign />
    </>
  );
}
