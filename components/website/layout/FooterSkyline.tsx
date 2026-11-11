"use client";

import Image from "next/image";
import { useSkylineCycle } from "@/lib/animations/footerSkyline";
import { skylineAspect, skylineWindows, windowLight } from "@/config/footerSkyline";
import skylineBuildings from "@/public/images/website/footer/skyline-buildings.png";

/** A tiny seeded random, so the stars are the same on the server and in the browser. */
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
/** Stars over the top 60% of the sky: [left %, top %, size px, twinkle delay s]. */
const STARS = (() => {
  const random = seeded(7);
  return Array.from({ length: 70 }, () => [random() * 100, random() * 60, 1 + random() * 1.8, random() * 4] as const);
})();

/** A small bird: two curved wings (they flap: see useSkylineCycle). */
function Bird({ style }: { style: React.CSSProperties }) {
  return (
    <svg data-sky="bird" viewBox="0 0 24 10" className="absolute w-[9%] min-w-2.5 overflow-visible" style={style} aria-hidden="true">
      <path d="M1 7 Q6 1 12 7 Q18 1 23 7" fill="none" stroke="#2b2d3a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** A flock of small birds (positions within the flock, %). */
function Flock({ name, birds }: { name: string; birds: [number, number][] }) {
  return (
    <div data-sky={name} className="absolute top-0 left-0 h-[30%] w-[16%] opacity-0">
      {birds.map(([left, top]) => (
        <Bird key={`${left}-${top}`} style={{ left: `${left}%`, top: `${top}%` }} />
      ))}
    </div>
  );
}

/**
 * The office at night, alive (Figma 75:1250): the sky goes round from night
 * to day and back (see useSkylineCycle): the moon crosses with the stars, the
 * sun rises after it through morning, noon and evening while small birds fly
 * past, then night again; the city's windows light up and go out.
 *
 * Layers: the sky (a gradient), stars, the glowing moon, the sun and birds,
 * the CTM sign's neon halo, then the buildings
 * (cut from the artwork, sky transparent), a daylight wash over them, and the
 * windows' lights. The picture keeps its proportions (1899 × 668), filling the
 * width and trimmed at the sides on narrow screens, the CTM building centred.
 */
export function FooterSkyline() {
  const ref = useSkylineCycle();
  return (
    <div ref={ref} aria-hidden="true" className="relative h-[max(240px,35.21vw)] overflow-hidden">
      {/* the sky */}
      <div
        data-sky="sky"
        className="absolute inset-0 bg-linear-to-b from-(--sky-top) to-(--sky-bottom) [--sky-bottom:#262a40] [--sky-top:#191b29]"
      />

      {/* the picture: buildings and everything in their sky, at the artwork's proportions */}
      <div className="absolute inset-y-0 left-1/2 min-w-full -translate-x-1/2" style={{ aspectRatio: skylineAspect }}>
        {/* stars (two copies side by side, so they can drift right with the moon and never run out) */}
        <div data-sky="stars" className="absolute top-0 left-[-100%] h-full w-[200%]">
          {[0, 50].map((offset) =>
            STARS.map(([left, top, size, delay], i) => (
              <span
                key={`${offset}-${i}`}
                data-sky="star"
                className="absolute animate-[twinkle_3.6s_ease-in-out_infinite] rounded-full bg-white"
                style={{ left: `${offset + left / 2}%`, top: `${top}%`, width: size, height: size, animationDelay: `${delay}s` }}
              />
            ))
          )}
        </div>

        {/* the moon: a crescent, glowing softly in the night */}
        <div data-sky="moon" className="absolute top-[12%] left-[87%] aspect-square w-[6.3%] -translate-x-1/2 -translate-y-1/2">
          <span
            data-sky="moon-glow"
            className="absolute inset-[-110%] rounded-full bg-[radial-gradient(circle,rgba(250,236,196,0.42)_0%,rgba(250,236,196,0.16)_32%,rgba(250,236,196,0)_62%)]"
          />
          <svg viewBox="0 0 100 100" className="relative size-full overflow-visible drop-shadow-[0_0_6px_rgba(255,244,210,0.75)]">
            <defs>
              <mask id="crescent">
                <rect width="100" height="100" fill="white" />
                <circle cx="66" cy="38" r="40" fill="black" />
              </mask>
              <radialGradient id="moon-face" cx="35%" cy="60%" r="70%">
                <stop offset="0%" stopColor="#fff8e0" />
                <stop offset="100%" stopColor="#ecd9a4" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="url(#moon-face)" mask="url(#crescent)" />
          </svg>
        </div>

        {/* the sun: a plain round sun with a soft glow; its colours (--sun-*) follow the time of day, see useSkylineCycle */}
        <div
          data-sky="sun"
          className="absolute top-[30%] left-[-10%] aspect-square w-[5%] -translate-x-1/2 -translate-y-1/2 opacity-0 [--sun-core:#ffd27a] [--sun-edge:#f08a3c] [--sun-glow:rgba(255,160,80,0.7)]"
        >
          <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_45%_42%,var(--sun-core),var(--sun-edge))] shadow-[0_0_30px_10px_var(--sun-glow)]" />
        </div>

        {/* birds, by day */}
        <Flock name="flock-1" birds={[[0, 30], [22, 10], [40, 42], [60, 22], [78, 50]]} />
        <Flock name="flock-2" birds={[[0, 20], [30, 45], [55, 12]]} />

        {/* the CTM sign's neon glow around the board (behind the buildings, so it shows in the sky round it) */}
        <span
          data-sky="sign-halo"
          className="absolute top-[-6%] left-[38.5%] h-[38%] w-[16%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(255,128,48,0.85),rgba(255,110,40,0.35)_45%,rgba(255,110,40,0)_100%)] blur-[6px]"
        />

        {/* the buildings, the daylight on them, and their windows */}
        <Image src={skylineBuildings} alt="" fill sizes="(max-width: 682px) 682px, 100vw" className="object-cover" />
        {/* the CTM sign lit up: the board glows orange (its letters stay white) */}
        <span
          data-sky="sign-face"
          className="absolute top-[7.934%] left-[41.864%] h-[10.03%] w-[9.373%] rounded-[2px] bg-[radial-gradient(ellipse_at_center,rgba(255,170,90,0.85),rgba(255,120,50,0.55))] shadow-[0_0_14px_4px_rgba(255,120,40,0.55)] mix-blend-screen"
        />
        <div
          data-sky="daylight"
          className="absolute inset-0 bg-[#9cc4ee] opacity-0 mix-blend-screen [mask-image:url(/images/website/footer/skyline-buildings.png)] [mask-size:100%_100%]"
        />
        {skylineWindows.map(([left, top, width, height, lit], i) => (
          <span
            key={i}
            data-sky="window"
            data-lit={lit}
            className="absolute"
            style={{ left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%`, backgroundColor: windowLight, opacity: lit }}
          />
        ))}
      </div>
    </div>
  );
}
