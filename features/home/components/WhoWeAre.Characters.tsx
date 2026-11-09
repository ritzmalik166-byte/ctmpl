"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils/cn";
import { useCheeringMan, usePresentingMeera } from "../animations/WhoWeAre.Characters";
import { Joint, Layer } from "./Puppet";
import meeraBody from "@/public/images/website/home/who-we-are/rig/meera-body.png";
import meeraArm from "@/public/images/website/home/who-we-are/rig/meera-arm.png";
import meeraHead from "@/public/images/website/home/who-we-are/rig/meera-head.png";
import meeraEyesOpen from "@/public/images/website/home/who-we-are/rig/meera-eyes-open.png";
import meeraMouthClosed from "@/public/images/website/home/who-we-are/rig/meera-mouth-closed.png";
import manBody from "@/public/images/website/home/who-we-are/rig/man-body.png";
import manArmLeft from "@/public/images/website/home/who-we-are/rig/man-arm-left.png";
import manArmRight from "@/public/images/website/home/who-we-are/rig/man-arm-right.png";
import manHead from "@/public/images/website/home/who-we-are/rig/man-head.png";
import manLegs from "@/public/images/website/home/who-we-are/rig/man-legs.png";
import manEyesOpen from "@/public/images/website/home/who-we-are/rig/man-eyes-open.png";

/**
 * The two paper-art characters by the whiteboard, as puppets (see ./Puppet).
 * Layers are cut from the Figma artwork; the open eyes and Meera's closed
 * mouth are painted to match (the artwork has closed eyes, so blinking just
 * hides the open-eyes layer for a moment). Pivots are % of each artwork.
 */

type PuppetProps = { className?: string; style?: CSSProperties; sizes: string };

/** Meera (830 × 1100): presents the board and points at the active stat. */
export function PresentingMeera({ activeStat, className, style, sizes }: PuppetProps & { activeStat?: number }) {
  const ref = usePresentingMeera(activeStat);
  return (
    <div ref={ref} className={cn("absolute aspect-[830/1100]", className)} style={style}>
      <Joint part="figure" pivot="62.65% 99.1%">
        {/* pointing arm, pinned at the shoulder, behind the jacket */}
        <Joint part="arm-aim" pivot="53.61% 19.55%">
          <Joint part="arm" pivot="53.61% 19.55%">
            <Layer src={meeraArm} sizes={sizes} />
          </Joint>
        </Joint>
        <Layer src={meeraBody} sizes={sizes} />
        <Joint part="head" pivot="62.65% 16.18%">
          <Layer src={meeraHead} sizes={sizes} />
          <Layer src={meeraEyesOpen} sizes={sizes} part="eyes" />
          <Layer src={meeraMouthClosed} sizes={sizes} part="mouth-closed" hidden />
        </Joint>
      </Joint>
    </div>
  );
}

/** The cheering colleague (457 × 1292): dances along, arms up. */
export function CheeringMan({ className, style, sizes }: PuppetProps) {
  const ref = useCheeringMan();
  return (
    <div ref={ref} className={cn("absolute aspect-[457/1292]", className)} style={style}>
      <Joint part="figure" pivot="49.23% 99.46%">
        {/* legs and arms sit behind the jacket, pinned at hips and shoulders */}
        <Joint part="legs" pivot="49.23% 61.92%">
          <Layer src={manLegs} sizes={sizes} />
        </Joint>
        <Joint part="arm-left" pivot="30.63% 32.12%">
          <Layer src={manArmLeft} sizes={sizes} />
        </Joint>
        <Joint part="arm-right" pivot="68.93% 32.12%">
          <Layer src={manArmRight} sizes={sizes} />
        </Joint>
        <Layer src={manBody} sizes={sizes} />
        <Joint part="head" pivot="49.23% 27.24%">
          <Layer src={manHead} sizes={sizes} />
          <Layer src={manEyesOpen} sizes={sizes} part="eyes" />
        </Joint>
      </Joint>
    </div>
  );
}
