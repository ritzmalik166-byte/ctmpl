"use client";

import { useReadingWoman, useWelcomingMan } from "../animations/Hero.Characters";
import { Layer, Overlay, type Placement } from "./Puppet";
import manBody from "@/public/images/website/home/hero/rig/man-body.png";
import manArm from "@/public/images/website/home/hero/rig/man-arm.png";
import manHead from "@/public/images/website/home/hero/rig/man-head.png";
import womanBody from "@/public/images/website/home/hero/rig/woman-body.png";
import womanHead from "@/public/images/website/home/hero/rig/woman-head.png";
import womanBook from "@/public/images/website/home/hero/rig/woman-book.png";
import womanHands from "@/public/images/website/home/hero/rig/woman-hands.png";

/**
 * The hero's two paper-art characters as paper puppets (see ./Puppet).
 * Pivot and overlay positions are % of each character's artwork.
 */

/* --- Man (302 × 541): welcomes visitors with a sweep of his arm ------------ */

const MAN_SIZES = "(min-width: 1024px) 21vw, 34vw";

export function WelcomingMan({ style }: { style: Placement }) {
  const ref = useWelcomingMan();
  return (
    <div ref={ref} className="absolute aspect-[302/541]" style={style}>
      {/* whole figure leans from the feet */}
      <div data-part="figure" className="absolute inset-0 origin-[54.6%_98.9%]">
        {/* arm sits behind the jacket, pinned at the shoulder */}
        <div data-part="arm" className="absolute inset-0 origin-[37.75%_24.4%]">
          <Layer src={manArm} sizes={MAN_SIZES} />
        </div>
        <Layer src={manBody} sizes={MAN_SIZES} />
        <div data-part="head" className="absolute inset-0 origin-[54.64%_18.11%]">
          <Layer src={manHead} sizes={MAN_SIZES} />
          <Overlay part="mouth" className="origin-top rounded-b-full bg-[#6e2f22]" style={{ left: "53.8%", top: "14.9%", width: "2%", height: "0.6%" }} />
          <Overlay part="lid" className="origin-top border-b border-[#3a2a20] bg-[#efbb88]" style={{ left: "48.9%", top: "9.4%", width: "3.7%", height: "1.7%" }} />
          <Overlay part="lid" className="origin-top border-b border-[#3a2a20] bg-[#e0b07e]" style={{ left: "56.9%", top: "9.4%", width: "4%", height: "1.7%" }} />
        </div>
      </div>
    </div>
  );
}

/* --- Woman (213 × 523): reads from her book, then tells you about it ------- */

const WOMAN_SIZES = "(min-width: 1024px) 15vw, 24vw";

export function ReadingWoman({ style }: { style: Placement }) {
  const ref = useReadingWoman();
  return (
    <div ref={ref} className="absolute aspect-[213/523]" style={style}>
      <div data-part="figure" className="absolute inset-0 origin-[49.8%_99.4%]">
        <Layer src={womanBody} sizes={WOMAN_SIZES} />
        {/* book + hands move together; a page turns between the two */}
        <div data-part="book" className="absolute inset-0 origin-[48.83%_36.33%]">
          <Layer src={womanBook} sizes={WOMAN_SIZES} />
          <div className="absolute perspective-[90px]" style={{ left: "49.3%", top: "31.6%", width: "16.4%", height: "9%" }}>
            <span
              data-part="page"
              className="absolute inset-0 origin-left bg-[repeating-linear-gradient(to_bottom,#f4e7cf_0_18%,#a99c86_18%_21%)] opacity-0 [clip-path:polygon(0_17%,100%_2%,100%_86%,0_100%)]"
            />
          </div>
          <Layer src={womanHands} sizes={WOMAN_SIZES} />
        </div>
        <div data-part="head" className="absolute inset-0 origin-[47.89%_17.21%]">
          <Layer src={womanHead} sizes={WOMAN_SIZES} />
          <Overlay part="mouth" className="origin-top rounded-b-full bg-[#7a2f2a]" style={{ left: "46.5%", top: "14.5%", width: "2.4%", height: "0.6%" }} />
        </div>
      </div>
    </div>
  );
}
