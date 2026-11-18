"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils/cn";
import { useCheeringMan, usePresentingMeera } from "../animations/WhoWeAre.Characters";
import { Joint, Layer } from "./Puppet";
// cut from new_woman_creative.png / new_man_creative.png
import meeraBody from "@/public/images/website/home/who-we-are/rig/woman-body.png";
import meeraArm from "@/public/images/website/home/who-we-are/rig/woman-arm.png";
// her head as drawn (her open smile), and her other mouth shapes: her own mouth with its rows remapped (cheeks and chin untouched)
import meeraHead from "@/public/images/website/home/who-we-are/rig/woman-head.png";
import mouthClosed from "@/public/images/website/home/who-we-are/rig/woman-lips-closed.png";
import mouthParted from "@/public/images/website/home/who-we-are/rig/woman-lips-parted.png";
import mouthHalf from "@/public/images/website/home/who-we-are/rig/woman-lips-half.png";
import mouthWide from "@/public/images/website/home/who-we-are/rig/woman-lips-wide.png";
import mouthRound from "@/public/images/website/home/who-we-are/rig/woman-lips-round.png";
import meeraEyesOpen from "@/public/images/website/home/who-we-are/rig/woman-eyes-open.png";
import manBody from "@/public/images/website/home/who-we-are/rig/man2-body.png";
import manArmLeft from "@/public/images/website/home/who-we-are/rig/man2-arm-left.png";
import manArmRight from "@/public/images/website/home/who-we-are/rig/man2-arm-right.png";
import manHead from "@/public/images/website/home/who-we-are/rig/man2-head.png";
import manLegs from "@/public/images/website/home/who-we-are/rig/man2-legs.png";
import manEyesOpen from "@/public/images/website/home/who-we-are/rig/man2-eyes-open.png";

/**
 * The two paper-art characters by the whiteboard, as puppets (see ./Puppet).
 * Layers are cut from the artwork (new_woman_creative / new_man_creative):
 * under the open eyes the head has them painted shut, so blinking just hides
 * the open-eyes layer for a moment. Meera's mouth shapes are her own mouth
 * with its rows remapped like a real mouth (the upper lip down a touch, the
 * lower lip up at its painted thickness, the gap closing or opening; nothing
 * outside the mouth changes): closed, parted, half open, wider and round,
 * laid over her open smile as drawn; talking shows them in turn. Pivots are %
 * of each artwork.
 */

type PuppetProps = { className?: string; style?: CSSProperties; sizes: string };

/** Meera (345 × 611): presents the board and points at the active stat. */
export function PresentingMeera({ activeStat, className, style, sizes }: PuppetProps & { activeStat?: number }) {
  const ref = usePresentingMeera(activeStat);
  return (
    <div ref={ref} data-reveal="character" className={cn("absolute aspect-[345/611]", className)} style={style}>
      <Joint part="figure" pivot="58.26% 99.02%">
        {/* pointing arm, pinned at the shoulder, behind the jacket */}
        <Joint part="arm-aim" pivot="49.28% 18.33%">
          <Joint part="arm" pivot="49.28% 18.33%">
            <Layer src={meeraArm} sizes={sizes} />
          </Joint>
        </Joint>
        <Layer src={meeraBody} sizes={sizes} />
        <Joint part="head" pivot="62.61% 14.4%">
          <Layer src={meeraHead} sizes={sizes} />
          {/* her mouth shapes over her open smile, one at a time as she talks (closed when she isn't) */}
          <Layer src={mouthClosed} sizes={sizes} part="mouth-closed" />
          <Layer src={mouthParted} sizes={sizes} part="mouth-parted" hidden />
          <Layer src={mouthHalf} sizes={sizes} part="mouth-half" hidden />
          <Layer src={mouthWide} sizes={sizes} part="mouth-wide" hidden />
          <Layer src={mouthRound} sizes={sizes} part="mouth-round" hidden />
          <Layer src={meeraEyesOpen} sizes={sizes} part="eyes" />
        </Joint>
      </Joint>
    </div>
  );
}

/** The cheering colleague (316 × 604): dances along, fists up. */
export function CheeringMan({ className, style, sizes }: PuppetProps) {
  const ref = useCheeringMan();
  return (
    <div ref={ref} data-reveal="character" className={cn("absolute aspect-[316/604]", className)} style={style}>
      <Joint part="figure" pivot="51.58% 99.5%">
        {/* legs and arms sit behind the jacket, pinned at hips and shoulders */}
        <Joint part="legs" pivot="50% 49.01%">
          <Layer src={manLegs} sizes={sizes} />
        </Joint>
        <Joint part="arm-left" pivot="28.48% 24.17%">
          <Layer src={manArmLeft} sizes={sizes} />
        </Joint>
        <Joint part="arm-right" pivot="71.52% 26.66%">
          <Layer src={manArmRight} sizes={sizes} />
        </Joint>
        <Layer src={manBody} sizes={sizes} />
        <Joint part="head" pivot="53.16% 20.03%">
          <Layer src={manHead} sizes={sizes} />
          <Layer src={manEyesOpen} sizes={sizes} part="eyes" />
        </Joint>
      </Joint>
    </div>
  );
}
