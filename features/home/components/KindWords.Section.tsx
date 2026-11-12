"use client";

import Image from "next/image";
import SectionLabel from "@/components/website/shared/SectionLabel";
import { kindWordsCopy } from "../constants/kindWords.constants";
import { WaterCooler } from "./KindWords.WaterCooler";
import { useScrollReveal } from "@/lib/animations/scrollReveal";
import paperWall from "@/public/images/website/home/who-we-are/paper-wall.jpg";

/**
 * "Kind words": client testimonials, told by Arjun at the office water cooler.
 *  - xl (1280+): the Figma layout (node 75:286, 1440 × 1308), the 1440 frame
 *    centred: heading and intro side by side, the water cooler corner, then
 *    the client selector;
 *  - smaller screens: heading, intro, Arjun's speech bubble, the room scaled to
 *    the screen, then the client selector.
 */
function KindWordsSection() {
  const ref = useScrollReveal();
  return (
    <section ref={ref} id="kind-words" className="relative isolate overflow-hidden pt-12 pb-14 md:pt-16 md:pb-20 xl:h-[1308px] xl:p-0">
      {/* paper wall, washed cool grey-blue */}
      <Image src={paperWall} alt="" fill sizes="100vw" className="-z-10 object-cover object-[50%_92%]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[rgba(217,226,230,0.6)]" />

      <div className="xl:absolute xl:top-0 xl:left-1/2 xl:h-full xl:w-[1440px] xl:-translate-x-1/2">
        {/* heading + intro */}
        <div className="max-xl:site-container flex flex-col gap-5 xl:absolute xl:top-[107px] xl:left-[136px] xl:flex-row xl:items-center xl:gap-[49px]">
          <div className="flex flex-col gap-4 xl:w-[545px]">
            <div data-sr="label">
              <SectionLabel>{kindWordsCopy.label}</SectionLabel>
            </div>
            <h2 data-sr="words" className="text-[clamp(2rem,1.45rem+2.35vw,3rem)] leading-tight font-bold text-ink-soft capitalize xl:leading-[normal]">{kindWordsCopy.heading}</h2>
          </div>
          <p data-sr="words" className="max-w-[575px] font-inter text-lg leading-8 tracking-[-0.3px] text-stone md:text-xl md:leading-9 xl:w-[575px] xl:pt-[60px] xl:text-2xl xl:leading-10">
            {kindWordsCopy.intro}
          </p>
        </div>

        <WaterCooler />
      </div>
    </section>
  );
}

export default KindWordsSection;
