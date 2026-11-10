"use client";

import Image from "next/image";
import { useNehaPuppet, useNehaStamp } from "../animations/CreativePlayground.Neha";
import { Layer } from "./Puppet";
import nehaBody from "@/public/images/website/home/creative-playground/neha/body.png";
import nehaHead from "@/public/images/website/home/creative-playground/neha/head.png";
import nehaArm from "@/public/images/website/home/creative-playground/neha/arm.png";
import nehaEyesOpen from "@/public/images/website/home/creative-playground/neha/eyes-open.png";
import nehaEyesHalf from "@/public/images/website/home/creative-playground/neha/eyes-half.png";
import nehaMouthSmall from "@/public/images/website/home/creative-playground/neha/mouth-open-small.png";
import nehaMouthWide from "@/public/images/website/home/creative-playground/neha/mouth-open-wide.png";

/**
 * Neha, ready with her stamp: a paper puppet cut from her Figma artwork
 * (613 × 1102), drawn 310px wide where Figma places her (right edge, y 573).
 * Each time `stampSignal` changes she brings her stamp down on the new file.
 */
export function NehaPuppet({ stampSignal }: { stampSignal: number }) {
  const ref = useNehaPuppet();
  const pressRef = useNehaStamp(stampSignal);
  const sizes = "310px";
  return (
    <div ref={ref} className="pointer-events-none absolute right-0 w-[310px]" style={{ top: 572.35 }}>
      <div data-part="neha" className="relative aspect-[613/1102] w-full" style={{ transformOrigin: "44.05% 98%" }}>
        <Image src={nehaBody} alt="" fill sizes={sizes} className="pointer-events-none" />
        <div data-part="head" className="absolute inset-0" style={{ transformOrigin: "43.39% 17.79%" }}>
          <Image src={nehaHead} alt="" fill sizes={sizes} className="pointer-events-none" />
          {/* her artwork has closed eyes (the "closed" frame); open and half-closed eyes are painted on */}
          <Layer src={nehaEyesOpen} sizes={sizes} part="eyes" />
          <Layer src={nehaEyesHalf} sizes={sizes} part="eyes-half" hidden />
          <Layer src={nehaMouthSmall} sizes={sizes} part="mouth-small" hidden />
          <Layer src={nehaMouthWide} sizes={sizes} part="mouth-wide" hidden />
        </div>
        {/* the arm holding the stamp, from the shoulder: an outer joint for stamping, an inner one for her gestures */}
        <div ref={pressRef} className="absolute inset-0" style={{ transformOrigin: "61.66% 21.05%" }}>
          <div data-part="arm" className="absolute inset-0" style={{ transformOrigin: "61.66% 21.05%" }}>
            <Image src={nehaArm} alt="" fill sizes={sizes} className="pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
