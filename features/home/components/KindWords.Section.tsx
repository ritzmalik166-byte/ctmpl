"use client";

import { useLayoutEffect } from "react";
import Image from "next/image";
import SectionLabel from "@/components/website/shared/SectionLabel";
import { kindWordsCopy } from "../constants/kindWords.constants";
import { WaterCooler } from "./KindWords.WaterCooler";
import { useScrollReveal } from "@/lib/animations/scrollReveal";
import paperWall from "@/public/images/website/home/who-we-are/paper-wall.jpg";

/**
 * "Kind words": client testimonials, told by Arjun at the office water cooler.
 *  - xl (1280+): the Figma layout (node 75:286), the 1440 frame
 *    centred: heading and intro side by side, then the water cooler corner
 *    (the section ends with its floor, 1108 tall);
 *    wider than 1440 the heading stays in place (centred like the page's
 *    content) while everything under it grows with the screen, so the room
 *    always runs edge to edge (see useWideScale);
 *  - smaller screens: heading, intro, Arjun's speech bubble, the room scaled to
 *    the screen.
 */

/**
 * Wider than 1440: sets `--kw-s` on the section to the screen width / 1440,
 * which scales the scene under the heading (about its top centre: y 316 of the
 * 1440 frame, just above the speech bubble) and grows the section to
 * match (316 + 792 × scale, down to the room's floor). 1 up to 1440.
 */
function useWideScale(ref: React.RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => el.style.setProperty("--kw-s", String(Math.max(1, document.documentElement.clientWidth / 1440)));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [ref]);
}

function KindWordsSection() {
  const ref = useScrollReveal();
  useWideScale(ref);
  return (
    <section
      ref={ref}
      id="kind-words"
      className="relative isolate overflow-hidden pt-12 [--kw-s:1] md:pt-16 xl:h-[calc(316px_+_792px*var(--kw-s))] xl:p-0"
    >
      {/* paper wall, washed cool grey-blue (under the floor; above it the room's own wall runs up behind the heading, see WaterCooler) */}
      <Image src={paperWall} alt="" fill sizes="100vw" className="-z-10 object-cover object-[50%_92%]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[rgba(217,226,230,0.6)]" />

      <div className="xl:absolute xl:top-0 xl:left-1/2 xl:h-full xl:w-[1440px] xl:-translate-x-1/2">
        {/* heading + intro */}
        <div className="max-xl:site-container relative z-20 flex flex-col gap-5 xl:absolute xl:top-[107px] xl:left-[136px] xl:flex-row xl:items-center xl:gap-[49px]">
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

        {/* the scene under the heading: wider than 1440 it grows with the screen (from its top, y 316) */}
        <div className="xl:absolute xl:inset-0 xl:origin-[50%_316px] xl:scale-(--kw-s)">
          <WaterCooler />
        </div>
      </div>
    </section>
  );
}

export default KindWordsSection;
