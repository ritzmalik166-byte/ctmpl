"use client";

import Image from "next/image";
import SectionLabel from "@/components/website/shared/SectionLabel";
import { whoWeAreCopy } from "../constants/whoWeAre.constants";
import { useWhoWeAreIntro } from "../animations/WhoWeAre.Intro";
import paperAirplane from "@/public/images/website/home/who-we-are/paper-airplane.png";

/**
 * "Who we are" heading, intro and paper airplane. On scroll the label, heading
 * and intro rise up word by word in a wave, all together, and the airplane
 * glides in from the bottom left to its place (see useWhoWeAreIntro).
 */
function WhoWeAreHeader() {
  const ref = useWhoWeAreIntro();

  return (
    <div ref={ref}>
      {/* xl+: side by side; columns keep Figma's 613 : 575 split (exact at 1440) */}
      <div className="xl:flex xl:items-center xl:gap-[49px]">
        <div className="flex flex-col gap-4 xl:flex-[613_1_0%]">
          <div data-anim="label">
            <SectionLabel>{whoWeAreCopy.label}</SectionLabel>
          </div>
          <h2
            data-anim="heading"
            className="relative text-[clamp(2rem,1.45rem+2.35vw,3rem)] leading-[normal] font-bold text-ink-soft"
          >
            {whoWeAreCopy.heading}
          </h2>
        </div>
        <p
          data-anim="intro"
          className="relative mt-5 max-w-[720px] font-inter text-lg leading-[1.7] tracking-[-0.3px] text-stone md:text-[22px] xl:mt-0 xl:max-w-none xl:flex-[575_1_0%] xl:pt-[100px] xl:text-2xl xl:leading-10"
        >
          {whoWeAreCopy.intro}
        </p>
      </div>

      <Image
        data-anim="plane"
        src={paperAirplane}
        alt=""
        className="mt-8 w-[110px] md:w-[130px] xl:absolute xl:top-[278px] xl:-left-[43px] xl:mt-0 xl:w-[154px]"
      />
    </div>
  );
}

export default WhoWeAreHeader;
