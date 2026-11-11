import Image from "next/image";
import SectionLabel from "@/components/website/shared/SectionLabel";
import { creativePlaygroundCopy } from "../constants/creativePlayground.constants";
import { FilingRoom } from "./CreativePlayground.FilingRoom";
import paperWall from "@/public/images/website/home/who-we-are/paper-wall.jpg";

/**
 * "Our creative playground": the filing room. Finished campaigns live in the
 * cabinet's drawers; pull one out (or pick a client below) and Neha puts its
 * case file on the desk and stamps it.
 *
 *  - xl (1280+): the Figma desktop layout (node 75:1109): heading and intro side
 *    by side, the room 1:1 from 1440 (scaled down just a touch below that).
 *  - smaller screens: heading, then intro, then the room scaled to the screen's
 *    width as one piece, then the client selector.
 * The room keeps its 1440 layout on every screen, so its animations are unchanged.
 */
function CreativePlaygroundSection() {
  return (
    <section id="creative-playground" className="relative isolate overflow-hidden pt-12 pb-14 md:pt-16 md:pb-20 xl:pb-[89px]">
      {/* paper wall, washed warm */}
      <Image src={paperWall} alt="" fill sizes="100vw" className="-z-10 object-cover object-top" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[rgba(235,211,191,0.55)]" />

      {/* heading + intro (side by side on desktop, as in Figma) */}
      <div className="site-container flex flex-col gap-5 xl:h-[220px] xl:flex-row xl:items-center xl:gap-[49px]">
        <div className="flex flex-col gap-4 xl:w-[613px] xl:shrink-0">
          <SectionLabel>{creativePlaygroundCopy.label}</SectionLabel>
          <h2 className="text-[clamp(2rem,1.45rem+2.35vw,3rem)] leading-tight font-bold text-ink-soft xl:leading-[normal]">{creativePlaygroundCopy.heading}</h2>
        </div>
        <p className="max-w-[575px] font-inter text-lg leading-8 tracking-[-0.3px] text-stone md:text-xl md:leading-9 xl:w-[575px] xl:shrink-0 xl:pt-[100px] xl:text-2xl xl:leading-10">
          {creativePlaygroundCopy.intro}
        </p>
      </div>

      {/* the room and the client selector */}
      <div className="mt-8 md:mt-12 xl:mt-[55px]">
        <FilingRoom />
      </div>
    </section>
  );
}

export default CreativePlaygroundSection;
