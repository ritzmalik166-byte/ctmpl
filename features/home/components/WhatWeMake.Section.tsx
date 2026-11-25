"use client";

import Image from "next/image";
import SectionLabel from "@/components/website/shared/SectionLabel";
import ButtonLink from "@/components/ui/ButtonLink";
import { whatWeMakeCopy } from "../constants/whatWeMake.constants";
import { WhatWeMakeLobby } from "./WhatWeMake.Lobby";
import { useWhatWeMakeReveal } from "../animations/WhatWeMake.Reveal";
import paperWall from "@/public/images/website/home/who-we-are/paper-wall.jpg";

/**
 * "What we make": eight floors, one service on each. Pick one in the building
 * directory and the lift rides up to it, its doors opening on that floor's
 * studio, while the floor's details show beside it.
 *
 *  - xl (1280+): the Figma desktop frame ("Eight floors", 1440 wide, 1135 tall so the space
 *    under "Talk to us" matches the 110px over the heading), to its
 *    coordinates, centred: heading, then the directory, the floor's details and
 *    the lift side by side;
 *  - below xl it all fits on one screen (100svh, the panel taking what the
 *    heading leaves): lg the directory, details and lift side by side, scaled
 *    to the screen's height; md the directory and details stacked, the lift
 *    beside them; phones a dropdown of the floors, the lift, its details.
 * The lift scales as one piece (everything in it is placed in % of its artwork).
 * It all makes an entrance as it scrolls into view (see useWhatWeMakeReveal).
 */
/** The heading's two sentences, each on its own line. */
const [headingFirst, headingRest] = (() => {
  const at = whatWeMakeCopy.heading.indexOf(". ") + 1;
  return [whatWeMakeCopy.heading.slice(0, at), whatWeMakeCopy.heading.slice(at + 1)];
})();

function WhatWeMakeSection() {
  const ref = useWhatWeMakeReveal();
  return (
    <section ref={ref} id="what-we-make" className="relative isolate flex h-svh min-h-[600px] flex-col overflow-hidden py-[clamp(1.5rem,5svh,3.5rem)] md:min-h-[620px] xl:block xl:h-[1135px] xl:min-h-0 xl:py-0">
      {/* paper, washed almost white */}
      <Image src={paperWall} alt="" fill sizes="100vw" className="-z-10 object-cover" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[rgba(250,247,242,0.84)]" />

      <div className="site-container flex min-h-0 flex-1 flex-col xl:absolute xl:top-0 xl:left-1/2 xl:h-full xl:w-[1440px] xl:max-w-none xl:-translate-x-1/2 xl:px-0">
        {/* heading */}
        <div className="flex shrink-0 flex-col items-start xl:absolute xl:top-[110px] xl:left-[100px]">
          <div data-wwm="label">
            <SectionLabel>{whatWeMakeCopy.label}</SectionLabel>
          </div>
          <h2
            data-wwm="heading"
            className="mt-[clamp(0.75rem,2svh,1.25rem)] max-w-[640px] text-[min(clamp(1.9rem,1.1rem+3.6vw,4rem),6svh)] leading-[1.02] font-bold tracking-[-0.027em] text-[#2d2c27] xl:mt-[14px] xl:w-[900px] xl:max-w-none xl:text-[64px] xl:leading-[65px]"
          >
            {/* two lines: "Eight floors." / "One lift. Press any button." */}
            {headingFirst}
            <br />
            {headingRest}
          </h2>
          <p className="mt-[clamp(0.5rem,1.6svh,1rem)] font-inter text-[15px] max-md:[@media(max-height:700px)]:hidden leading-snug text-stone md:text-[clamp(15px,2.2svh,18px)] xl:mt-[19px] xl:text-lg">{whatWeMakeCopy.intro}</p>
        </div>

        {/* the lobby: directory, the floor's details, the lift */}
        <div
          data-wwm="panel"
          className="mt-[clamp(1rem,3.5svh,2.5rem)] flex min-h-0 flex-1 flex-col gap-[clamp(0.75rem,2.2svh,1.5rem)] md:flex-row md:gap-8 lg:gap-[clamp(2rem,4vw,3.5rem)] xl:absolute xl:inset-0 xl:mt-0 xl:block"
        >
          <WhatWeMakeLobby />
        </div>

        {/* not sure? down to the contact form */}
        <div className="mt-[clamp(0.75rem,2.5svh,2rem)] flex shrink-0 flex-wrap items-center gap-x-5 gap-y-2.5 xl:absolute xl:top-[985px] xl:left-[101px] xl:mt-0 xl:gap-x-6">
          <p className="font-inter text-[15px] leading-snug text-[#4e4943] md:text-[clamp(15px,2.2svh,18px)] xl:text-lg">{whatWeMakeCopy.closing}</p>
          <ButtonLink href={whatWeMakeCopy.cta.href}>{whatWeMakeCopy.cta.label}</ButtonLink>
        </div>
      </div>
    </section>
  );
}

export default WhatWeMakeSection;
