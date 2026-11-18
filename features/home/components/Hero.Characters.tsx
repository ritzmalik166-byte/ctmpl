"use client";

import { useReception } from "../animations/Hero.Characters";
import { Layer, type Placement } from "./Puppet";
import clerk from "@/public/images/website/home/hero/reception/clerk.png";
import desk from "@/public/images/website/home/hero/reception/desk.png";
import woman from "@/public/images/website/home/hero/reception/woman.png";
import man from "@/public/images/website/home/hero/reception/man.png";
import mouthClosed from "@/public/images/website/home/hero/reception/clerk-mouth-closed.png";
import mouthSmall from "@/public/images/website/home/hero/reception/clerk-mouth-small.png";
import mouthWide from "@/public/images/website/home/hero/reception/clerk-mouth-wide.png";
import mouthRound from "@/public/images/website/home/hero/reception/clerk-mouth-round.png";
import womanSmall from "@/public/images/website/home/hero/reception/woman-mouth-small.png";
import womanMid from "@/public/images/website/home/hero/reception/woman-mouth-mid.png";
import womanWide from "@/public/images/website/home/hero/reception/woman-mouth-wide.png";
import womanRound from "@/public/images/website/home/hero/reception/woman-mouth-round.png";
import manSmile from "@/public/images/website/home/hero/reception/man-smile.png";
// closed eyes, laid over each face for a blink
import clerkShut from "@/public/images/website/home/hero/reception/clerk-eyes-closed.png";
import womanShut from "@/public/images/website/home/hero/reception/woman-eyes-closed.png";
import manShut from "@/public/images/website/home/hero/reception/man-eyes-closed.png";

/**
 * The reception: a woman reading from her book, the receptionist on the phone
 * behind the desk, and a man leaning on it. Cut from one picture (612 × 408)
 * into full-size layers that line up exactly, so each can move on its own;
 * at rest they make the original picture. Pivots are % of the picture.
 */

const SIZES = "(min-width: 768px) 63vw, 100vw";

export function HeroReception({ style }: { style: Placement }) {
  const ref = useReception();
  return (
    <div ref={ref} className="absolute aspect-[612/408]" style={style}>
      {/* behind the desk, on the phone (the laptop and the desk are in front of her) */}
      <div data-part="clerk" className="absolute inset-0 origin-[50.7%_54.9%]">
        <Layer src={clerk} sizes={SIZES} />
        {/* her mouth shapes as she talks (her own, a half-open smile, is the one in between) */}
        <Layer src={mouthClosed} sizes={SIZES} part="mouth-closed" hidden />
        <Layer src={mouthSmall} sizes={SIZES} part="mouth-small" hidden />
        <Layer src={mouthWide} sizes={SIZES} part="mouth-wide" hidden />
        <Layer src={mouthRound} sizes={SIZES} part="mouth-round" hidden />
        <Layer src={clerkShut} sizes={SIZES} part="clerk-eyes" hidden />
      </div>
      <Layer src={desk} sizes={SIZES} />
      <div data-part="woman" className="absolute inset-0 origin-[24.2%_98.3%]">
        <Layer src={woman} sizes={SIZES} />
        {/* her mouth shapes as she talks (her own, a closed smile, is the one at rest) */}
        <Layer src={womanSmall} sizes={SIZES} part="woman-mouth-small" hidden />
        <Layer src={womanMid} sizes={SIZES} part="woman-mouth-mid" hidden />
        <Layer src={womanWide} sizes={SIZES} part="woman-mouth-wide" hidden />
        <Layer src={womanRound} sizes={SIZES} part="woman-mouth-round" hidden />
        <Layer src={womanShut} sizes={SIZES} part="woman-eyes" hidden />
      </div>
      {/* in front of the desk, his hand resting on it */}
      <div data-part="man" className="absolute inset-0 origin-[77.1%_97.5%]">
        <Layer src={man} sizes={SIZES} />
        {/* a broad, closed-lip smile he breaks into now and then */}
        <Layer src={manSmile} sizes={SIZES} part="man-smile" hidden />
        <Layer src={manShut} sizes={SIZES} part="man-eyes" hidden />
      </div>
    </div>
  );
}
