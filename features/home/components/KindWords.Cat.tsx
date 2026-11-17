"use client";

import { KW_CAT, useKindWordsCat } from "../animations/KindWords.Cat";
import { PaperCat } from "./PaperCat";

/**
 * The paper cat in the water cooler corner: it sits with Arjun and, once the
 * room scrolls into view, goes and knocks the robot over, grins at you and runs
 * off for good (see useKindWordsCat). Drawn over the room, in px of it.
 */
export function KindWordsCat() {
  const ref = useKindWordsCat();
  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0">
      <PaperCat width={KW_CAT.width} height={KW_CAT.height} visible />
    </div>
  );
}
