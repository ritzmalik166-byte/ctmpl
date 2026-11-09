"use client";

import type { CSSProperties } from "react";
import { useIndianClock } from "../animations/Hero.Clock";

/**
 * Hands of the wall clock in the hero scene. The clock face is part of the
 * background art; this layer sits exactly on its centre and shows live IST.
 *
 * Sizes are % of the 80×80 clock box (80px at the 1440px Figma frame), taken
 * from the Figma hands artwork so the look is unchanged.
 */
function HeroClock({ style }: { style: CSSProperties }) {
  const clockRef = useIndianClock();

  return (
    // `invisible` until the hook has set the real time (then fades in)
    <div ref={clockRef} className="invisible absolute aspect-square" style={style}>
      {/* Hour: short, slate */}
      <span
        data-clock-hand="hour"
        className="absolute bottom-1/2 left-1/2 h-[22.75%] w-[3.25%] rounded-full bg-[#3b3a40]"
      />
      {/* Minute: long, near-black */}
      <span
        data-clock-hand="minute"
        className="absolute bottom-1/2 left-1/2 h-[31.5%] w-[3.5%] rounded-full bg-[#2a2626]"
      />
      {/* Second: hairline, terracotta */}
      <span
        data-clock-hand="second"
        className="absolute bottom-1/2 left-1/2 h-[33.25%] w-[max(1px,1.125%)] rounded-full bg-terracotta-deep"
      />
      {/* Centre cap */}
      <span className="absolute top-1/2 left-1/2 size-[7.9%] -translate-1/2 rounded-full bg-terracotta-deep" />
    </div>
  );
}

export default HeroClock;
