"use client";

import SectionLabel from "@/components/website/shared/SectionLabel";
import { whatWeMakeCopy } from "../constants/whatWeMake.constants";
import { WhatWeMakeLobby } from "./WhatWeMake.Lobby";
import { useWhatWeMakeReveal } from "../animations/WhatWeMake.Reveal";

/**
 * "What we make": the building lobby at night. Each of the eight floors is a
 * service; press one in the brass directory and the lift rides up to it, the
 * doors opening on that floor's studio.
 *
 *  - xl (1280+): the Figma desktop layout (1440 frame, 1063 tall), to its coordinates.
 *  - md–lg: heading, then the lobby panel with the directory and the lift side by side.
 *  - phones: heading, then the lift, the floor's card and the directory, stacked.
 * The lift scales as one piece (everything in it is placed in % of its artwork).
 * It all makes an entrance as it scrolls into view (see useWhatWeMakeReveal).
 */
function WhatWeMakeSection() {
  const ref = useWhatWeMakeReveal();
  return (
    // -mt-px: Figma starts this section 1px into the previous room artwork
    <section ref={ref} id="what-we-make" className="relative -mt-px overflow-hidden bg-night py-14 md:py-20 xl:h-[1063px] xl:py-0">
      <div className="site-container flex flex-col items-center gap-4 xl:absolute xl:top-[97px] xl:left-[calc(50%+0.5px)] xl:w-[613px] xl:-translate-x-1/2">
        <div data-wwm="label">
          <SectionLabel tone="light">{whatWeMakeCopy.label}</SectionLabel>
        </div>
        <h2 data-wwm="heading" className="max-w-[613px] text-center text-[28px] leading-tight font-bold text-white sm:text-4xl xl:text-5xl xl:leading-[normal]">
          {whatWeMakeCopy.heading}
        </h2>
      </div>

      <div data-wwm="panel" className="site-container mt-10 flex flex-col items-center gap-8 bg-night-panel px-3 py-8 sm:px-8 md:mt-14 md:flex-row md:items-center md:justify-center md:gap-6 md:px-6 md:py-12 lg:gap-16 lg:px-12 xl:absolute xl:bottom-0 xl:left-[calc(50%-5.5px)] xl:mt-0 xl:h-[771px] xl:w-[1259px] xl:-translate-x-1/2 xl:gap-[122px] xl:px-[88px] xl:py-0">
        <WhatWeMakeLobby />
      </div>
    </section>
  );
}

export default WhatWeMakeSection;
