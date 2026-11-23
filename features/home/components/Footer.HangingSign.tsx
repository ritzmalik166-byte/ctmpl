"use client";

import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/** Cardboard: kraft brown over the paper grain, its cut edge darker, a soft shadow on the counter behind. */
export const CARDBOARD =
  "bg-[#c99d6c] bg-[url(/images/website/home/who-we-are/paper-wall.jpg)] bg-size-[380px] bg-blend-multiply shadow-[inset_0_0_0_1px_rgba(96,62,30,0.28),inset_0_1px_0_rgba(255,240,215,0.45),inset_0_-3px_0_rgba(96,62,30,0.14),0_12px_20px_-10px_rgba(60,35,15,0.55),0_2px_3px_rgba(60,35,15,0.2)]";

/** What a sign hangs by: brass screw and twine, silver screw and a fine wire, or an iron nail and rope. */
export type Hanger = "brass" | "silver" | "rope";

const HEAD: Record<Hanger, string> = {
  brass: "bg-[radial-gradient(circle_at_35%_30%,#fff6dc,#c9a25e_42%,#7a5a2a)]",
  silver: "bg-[radial-gradient(circle_at_35%_30%,#ffffff,#c3c7cc_42%,#6f747a)]",
  rope: "bg-[radial-gradient(circle_at_35%_30%,#a8a39b,#4a4642_45%,#1f1c1a)]",
};
const RING: Record<Hanger, string> = { brass: "border-[#c9a25e]", silver: "border-[#b9bdc2]", rope: "border-[#3b3733]" };

/** A screw (or nail) in the counter, its head catching the light: what a sign hangs from. */
export function Hook({ metal = "brass", className }: { metal?: Hanger; className?: string }) {
  return (
    <span aria-hidden="true" className={cn("relative z-10 block size-3 rounded-full shadow-[0_2px_3px_rgba(50,30,15,0.45)]", HEAD[metal], className)}>
      {/* a screw's slot across its head (a nail has none) */}
      {metal !== "rope" && <span className="absolute top-1/2 left-[22%] h-px w-[56%] -translate-y-1/2 rotate-[-30deg] bg-black/35" />}
    </span>
  );
}

/** A hole through the sign, ringed with a metal eyelet, where its string is tied. */
function Eyelet({ side, metal }: { side: "left" | "right"; metal: Hanger }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute top-2.5 z-10 size-2.5 rounded-full border-2 bg-[#2a1a10] shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)]",
        RING[metal],
        side === "left" ? "left-[14%] -translate-x-1/2" : "right-[14%] translate-x-1/2"
      )}
    />
  );
}

type HangingSignProps = {
  /** How far below its hook the sign hangs (px): the strings' length. */
  drop: number;
  /** One swing, there and back (s), and how far it swings each way (deg): each sign its own, so they never sway as one. */
  sway?: number;
  swing?: number;
  /** Twine for cardboard, a fine wire for the silver frame, rope for the wooden signs. */
  metal?: Hanger;
  /** Hang it from its own hook (the default), or from whatever is above it (`false`: the strings start at the top). */
  hook?: boolean;
  /** The sign itself (it gets the eyelets; give it its look, e.g. CARDBOARD). */
  className?: string;
  /** Its scroll entrance (see useScrollReveal): it drops in on its strings; `null` for none (e.g. hung from another sign, which brings it in). */
  sr?: string | null;
  children: ReactNode;
};

/**
 * A sign hung on the café counter: a screw in the counter, two strings running
 * down from it to eyelets near the sign's top corners, and the sign swinging
 * gently on them about the screw, each at its own pace (a CSS animation, so
 * it's smooth and costs nothing; still with reduced motion). Hovered, it swings
 * a touch further, as if just brushed.
 */
export function HangingSign({ drop, sway = 6, swing = 0.9, metal = "brass", hook = true, className, sr = "drop", children }: HangingSignProps) {
  const path = hook ? "M50 0 L14 100 M50 0 L86 100" : "M14 0 L14 100 M86 0 L86 100";
  return (
    <div data-sr={sr ?? undefined} className="group/sign relative flex w-full flex-col items-center">
      {hook && <Hook metal={metal} />}
      {/* everything below the screw swings about it */}
      <div
        className={cn("w-full origin-top animate-[sign-sway_var(--sway)_ease-in-out_infinite] motion-reduce:animate-none", hook && "-mt-1.5")}
        style={{ "--sway": `${sway}s`, "--swing": `${swing}deg`, "--swing-out": `${swing * 1.8}deg` } as CSSProperties}
      >
        <div className="origin-top transition-[rotate] duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/sign:rotate-(--swing-out)">
          {/* the strings, from the screw (or the sign above) down to the eyelets */}
          <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="block w-full overflow-visible" style={{ height: drop }}>
            {metal === "rope" ? (
              <>
                {/* rope: a thick cord, its twist picked out in short light strands */}
                <path d={path} fill="none" stroke="#5e4126" strokeWidth={3.4} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                <path d={path} fill="none" stroke="#b08d5f" strokeWidth={2.2} strokeDasharray="2.5 2.5" vectorEffect="non-scaling-stroke" />
              </>
            ) : (
              <path d={path} fill="none" stroke={metal === "brass" ? "#6f5236" : "#8e9399"} strokeWidth={1.6} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            )}
          </svg>
          <div className={cn("relative -mt-[14px] rounded-[4px]", className)}>
            <Eyelet side="left" metal={metal} />
            <Eyelet side="right" metal={metal} />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
