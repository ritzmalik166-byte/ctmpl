import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import type { Box } from "../constants/newspaper.constants";

/**
 * A piece of the newspaper (or a thing on the desk) turned by `angle` degrees,
 * as Figma places it: `box` is its rotated bounds, the piece sits centred in it.
 * The page is turned -3°, so is everything printed on it. `anim` names it for
 * the animations (`data-anim`).
 */
export function Tilted({ box, angle = -3, anim, className, children }: { box: Box; angle?: number; anim?: string; className?: string; children: ReactNode }) {
  return (
    <div data-anim={anim} className={cn("absolute flex items-center justify-center", className)} style={box}>
      <div className="flex-none" style={{ rotate: `${angle}deg` }}>
        {children}
      </div>
    </div>
  );
}
