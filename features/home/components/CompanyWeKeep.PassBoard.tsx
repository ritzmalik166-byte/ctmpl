"use client";

import Image from "next/image";
import { lanyardRails } from "../constants/companyWeKeep.constants";
import { useSwingingPasses } from "../animations/CompanyWeKeep.Passes";
import { cn } from "@/lib/utils/cn";
import { LanyardRail, RailBar } from "./CompanyWeKeep.VisitorPass";
import { RailScroller } from "./CompanyWeKeep.RailScroller";
import paperAirplane from "@/public/images/website/home/who-we-are/paper-airplane.png";

/**
 * The reception board: both rails of visitor passes, swinging (see
 * useSwingingPasses).
 *  - xl (1280+): the Figma layout: the 1440 frame, rails at x 80 / 79, y 434 / 843
 *    of the section, and the paper airplane under the heading;
 *  - smaller screens: each rail is its own slider (swipe, or grab and drag),
 *    the passes at full size so every name reads clearly.
 */
export function PassBoard() {
  const ref = useSwingingPasses();
  return (
    <div ref={ref} className="relative mx-auto mt-8 w-full md:mt-10 xl:mt-[177px] xl:w-[1440px]">
      {/* a paper airplane, landed under the heading (desktop; y 278 of the section) */}
      <Image data-cwk="plane" src={paperAirplane} alt="" width={154} height={90} className="pointer-events-none absolute top-[-156px] left-[58px] hidden xl:block" />

      {lanyardRails.map(({ left }, i) => (
        <div key={left} data-cwk="rail" className={cn("relative", i ? "mt-2 xl:mt-[35px]" : undefined)}>
          {/* smaller screens: the wooden bar stays still behind the slider, 110% wide so its ends
              never show; only the passes slide (on desktop the bar is part of the rail) */}
          <RailBar className="left-[-5%] w-[110%] xl:hidden" />
          <RailScroller className="relative">
            {/* side padding so the first and last pass don't touch the screen edge while sliding;
                on desktop the rail sits at its Figma x (80 / 79 in the 1440 frame) */}
            <div className="w-max px-4 pb-6 sm:px-8 xl:px-0 xl:pb-0">
              <div className={i ? "xl:ml-[79px]" : "xl:ml-[80px]"}>
                <LanyardRail />
              </div>
            </div>
          </RailScroller>
        </div>
      ))}
    </div>
  );
}
