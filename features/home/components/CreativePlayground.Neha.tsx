"use client";

import { useNehaPuppet, useNehaStamp } from "../animations/CreativePlayground.Neha";
import { Layer } from "./Puppet";
// Neha (neha-updated: cut from "Confident professional with approval stamp.png", 1024 × 1536; the old neha files are kept)
import nehaBody from "@/public/images/website/home/creative-playground/neha-updated/body.webp";
import nehaHead from "@/public/images/website/home/creative-playground/neha-updated/head.webp";
import nehaArm from "@/public/images/website/home/creative-playground/neha-updated/arm.webp";
import nehaEyeLeft from "@/public/images/website/home/creative-playground/neha-updated/eye-left.webp";
import nehaEyeRight from "@/public/images/website/home/creative-playground/neha-updated/eye-right.webp";
import nehaLowerLip from "@/public/images/website/home/creative-playground/neha-updated/lower-lip.webp";

/**
 * Neha, ready with her stamp: a paper puppet cut from her artwork (1024 × 1536),
 * drawn 366px wide, standing where she always has (her feet on the floor at
 * x 1266, y 1126 of the stage). Her eyes and lower lip are cut out on their
 * own: a blink squashes her eyes shut (her lower lip is a layer of its own too,
 * left still: she doesn't talk). Each time `stampSignal`
 * changes she brings her stamp down on the new file.
 */
export function NehaPuppet({ stampSignal }: { stampSignal: number }) {
  const ref = useNehaPuppet();
  const pressRef = useNehaStamp(stampSignal);
  const sizes = "25.4vw"; // 366 of the 1440 stage
  return (
    <div ref={ref} className="pointer-events-none absolute w-[366px]" style={{ top: 579.5, right: -11 }}>
      <div data-part="neha" className="relative aspect-[1024/1536] w-full" style={{ transformOrigin: "49.51% 99.48%" }}>
        <Layer src={nehaBody} sizes={sizes} />
        <div data-part="head" className="absolute inset-0" style={{ transformOrigin: "49.32% 17.58%" }}>
          <Layer src={nehaHead} sizes={sizes} />
          <div data-part="eye" className="absolute inset-0" style={{ transformOrigin: "45.31% 10.22%" }}>
            <Layer src={nehaEyeLeft} sizes={sizes} />
          </div>
          <div data-part="eye" className="absolute inset-0" style={{ transformOrigin: "52.54% 9.57%" }}>
            <Layer src={nehaEyeRight} sizes={sizes} />
          </div>
          {/* her lower lip (cut out for talking; she doesn't talk, so it stays as drawn) */}
          <div data-part="mouth" className="absolute inset-0">
            <Layer src={nehaLowerLip} sizes={sizes} />
          </div>
        </div>
        {/* the arm holding the stamp, from the shoulder: an outer joint for stamping, an inner one for her gestures */}
        <div ref={pressRef} className="absolute inset-0" style={{ transformOrigin: "63.67% 22.46%" }}>
          <div data-part="arm" className="absolute inset-0" style={{ transformOrigin: "63.67% 22.46%" }}>
            <Layer src={nehaArm} sizes={sizes} />
          </div>
        </div>
      </div>
    </div>
  );
}
