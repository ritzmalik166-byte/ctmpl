"use client";

import Image from "next/image";
import SectionLabel from "@/components/website/shared/SectionLabel";
import { creativePlaygroundCopy } from "../constants/creativePlayground.constants";
import { FilingRoom } from "./CreativePlayground.FilingRoom";
import { useCreativePlaygroundReveal } from "../animations/CreativePlayground.Reveal";
import paperWall from "@/public/images/website/home/who-we-are/paper-wall.jpg";

/**
 * "Our creative playground": the filing room. Finished campaigns live in the
 * cabinet's drawers and in the drawers sliding along the desk; pull one out and
 * Neha puts its case file on the desk and stamps it.
 *
 *  - xl (1280+): the Figma desktop layout (node 75:1109): heading and intro side
 *    by side, the room scaled to the screen's width (1:1 at 1440, larger on wider
 *    screens, so it always runs edge to edge); the heading stays in the container.
 * The almirah, the case file and Neha are drawn at 92% of their Figma size.
 *  - smaller screens: heading, then intro, then the room scaled to the screen's
 *    width as one piece, then "View all projects".
 * The room keeps its 1440 layout on every screen, so its animations are unchanged.
 * It all makes an entrance as it scrolls into view (see useCreativePlaygroundReveal).
 */
function CreativePlaygroundSection() {
  const ref = useCreativePlaygroundReveal();
  return (
    <section ref={ref} id="creative-playground" // (no padding under the room: it ends the section; phones keep a little under their "View all projects" button)
      className="relative isolate overflow-hidden pt-12 pb-10 md:pt-16 md:pb-0">
      {/* paper wall, washed the filing room's own peach, so the heading is on the room's wall (one scene, not a band above it) */}
      <Image src={paperWall} alt="" fill sizes="100vw" className="-z-10 object-cover object-top" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[rgba(239,205,170,0.86)]" />

      {/* heading + intro (side by side on desktop, as in Figma) */}
      <div className="site-container flex flex-col gap-5 xl:h-[220px] xl:flex-row xl:items-center xl:gap-[49px]">
        <div className="flex flex-col gap-4 xl:w-[613px] xl:shrink-0">
          <div data-cp="label">
            <SectionLabel>{creativePlaygroundCopy.label}</SectionLabel>
          </div>
          <h2 data-cp="heading" className="text-[clamp(2rem,1.45rem+2.35vw,3rem)] leading-tight font-bold text-ink-soft xl:leading-[normal]">{creativePlaygroundCopy.heading}</h2>
        </div>
        <p data-cp="intro" className="max-w-[575px] font-inter text-lg leading-8 tracking-[-0.3px] text-stone md:text-xl md:leading-9 xl:w-[575px] xl:shrink-0 xl:pt-[100px] xl:text-2xl xl:leading-10">
          {creativePlaygroundCopy.intro}
        </p>
      </div>

      {/* the room and "View all projects" */}
      <div className="mt-8 md:mt-12 xl:mt-[55px]">
        <FilingRoom />
      </div>
    </section>
  );
}

export default CreativePlaygroundSection;
