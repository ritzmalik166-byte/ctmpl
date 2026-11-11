"use client";

import { useWaterBubbles } from "../animations/KindWords.WaterBubbles";

/**
 * The water cooler bottle's inside, traced from the room artwork (room px:
 * x 637–747, y 209–394), as a clip so bubbles only ever show in the water.
 */
const BOTTLE_SHAPE =
  "polygon(40px 2px, 70px 2px, 70px 24px, 93px 40px, 105px 56px, 107px 117px, 105px 182px, 7px 182px, 3px 140px, 4px 106px, 6px 56px, 17px 40px, 40px 24px)";

/** Bubbles rising in the water cooler (see useWaterBubbles). */
export function WaterBubbles() {
  const ref = useWaterBubbles();
  return <div ref={ref} aria-hidden="true" className="pointer-events-none absolute top-[209px] left-[637px] h-[185px] w-[110px]" style={{ clipPath: BOTTLE_SHAPE }} />;
}
