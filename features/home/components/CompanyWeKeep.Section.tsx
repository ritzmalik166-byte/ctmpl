import Image from "next/image";
import SectionLabel from "@/components/website/shared/SectionLabel";
import { companyWeKeepCopy } from "../constants/companyWeKeep.constants";
import { PassBoard } from "./CompanyWeKeep.PassBoard";
import paperWall from "@/public/images/website/home/who-we-are/paper-wall.jpg";
import paperAirplane from "@/public/images/website/home/who-we-are/paper-airplane.png";

/**
 * "The company we keep": reception's board of visitor passes. Every client
 * brand hangs on a lanyard from one of two wooden rails; the passes swing
 * (CompanyWeKeep.Passes).
 *
 *  - xl (1280+): the Figma desktop layout (node 75:385, rails 75:453 / 75:774),
 *    1298 tall (its paper wall runs on to where Kind Words begins): heading and intro side by side, both rails in full.
 *  - smaller screens: heading, intro, then each rail as a slider (swipe, or grab
 *    and drag), the passes at full size.
 */
function CompanyWeKeepSection() {
  return (
    // -mt-[3px]: in Figma this section starts 3px into the filing room's paper wall
    <section id="company-we-keep" className="relative isolate -mt-[3px] overflow-hidden pt-12 pb-10 md:pt-16 md:pb-14 xl:h-[1298px] xl:pt-[37px] xl:pb-0">
      {/* plain paper wall */}
      <Image src={paperWall} alt="" fill sizes="100vw" className="-z-10 object-cover object-[50%_85%]" />

      {/* heading + intro (side by side on desktop, as in Figma) */}
      <div className="site-container flex flex-col gap-5 xl:h-[220px] xl:flex-row xl:items-center xl:gap-[49px]">
        <div className="flex flex-col gap-4 xl:w-[613px] xl:shrink-0">
          <SectionLabel className="font-bold!">{companyWeKeepCopy.label}</SectionLabel>
          <h2 className="text-[clamp(2rem,1.45rem+2.35vw,3rem)] leading-tight font-bold text-ink-soft xl:leading-[normal]">{companyWeKeepCopy.heading}</h2>
        </div>
        <p className="max-w-[575px] font-inter text-lg leading-8 tracking-[-0.3px] text-stone md:text-xl md:leading-9 xl:w-[575px] xl:shrink-0 xl:pt-[100px] xl:text-2xl xl:leading-10">
          {companyWeKeepCopy.intro}
        </p>
        {/* the paper airplane (on desktop it sits under the heading, beside the board) */}
        <Image src={paperAirplane} alt="" width={154} height={90} className="pointer-events-none -my-1 w-[110px] sm:w-[130px] xl:hidden" />
      </div>

      {/* the two rails of visitor passes */}
      <PassBoard />
    </section>
  );
}

export default CompanyWeKeepSection;
