"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import SectionLabel from "@/components/website/shared/SectionLabel";
import { cn } from "@/lib/utils/cn";
import { newspaperCopy } from "../constants/newspaper.constants";
import { useNewspaperUnfold } from "../animations/Newspaper.Unfold";
import { PaperFold, compactFold, desktopFold } from "./Newspaper.Fold";
import { FrontPage } from "./Newspaper.FrontPage";
import { CompactPage } from "./Newspaper.CompactPage";
import { CompactDeskItems, DeskItems } from "./Newspaper.DeskItems";
import { NewspaperStage } from "./Newspaper.Stage";
import paperWall from "@/public/images/website/home/who-we-are/paper-wall.jpg";

/** The desktop page is printed at the sheet's -3° turn; inside the turned fold, undo it. */
function UprightFrontPage() {
  return (
    <div className="absolute inset-0" style={{ rotate: "3deg", transformOrigin: desktopFold.origin }}>
      <FrontPage />
    </div>
  );
}

/** Label + heading, centred. */
function Heading({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <SectionLabel>{newspaperCopy.label}</SectionLabel>
      <h2 className="text-center leading-tight font-bold text-ink-soft capitalize xl:text-5xl xl:leading-[normal]">{newspaperCopy.heading}</h2>
    </div>
  );
}

/**
 * "Fresh from our minds": the latest articles as the front page of The CTM
 * Times, lying on the desk. The paper lies folded until the section scrolls
 * into view, then opens; the mug, glasses and pen follow (useNewspaperUnfold).
 *  - xl (1280+): the Figma layout (node 75:1209, 1440 × 1440), scaled to fit
 *    below 1440 (see NewspaperStage);
 *  - smaller screens: the heading, then the paper laid out to fit the screen
 *    (see CompactPage) with the mug, glasses and pen around it.
 */
function NewspaperSection() {
  const desktopRef = useNewspaperUnfold();
  const compactRef = useNewspaperUnfold();
  return (
    <section id="fresh-from-our-minds" className="relative isolate overflow-hidden">
      {/* paper desk, washed warm */}
      <Image src={paperWall} alt="" fill sizes="100vw" className="-z-10 object-cover" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[rgba(201,176,142,0.4)]" />

      <NewspaperStage>
        <div ref={desktopRef} className="absolute inset-0">
          <Heading className="absolute top-[93px] left-1/2 w-[1027px] -translate-x-1/2" />
          <PaperFold geometry={desktopFold} page={() => <UprightFrontPage />} />
          <DeskItems />
        </div>
      </NewspaperStage>

      <Compact>
        <Heading className="site-container [&_h2]:text-[clamp(2rem,1.45rem+2.35vw,3rem)]" />
        <div ref={compactRef} className="site-container relative mt-20 sm:mt-24 lg:mt-28">
          <PaperFold geometry={compactFold} flow page={() => <CompactPage />} />
          <CompactDeskItems />
        </div>
      </Compact>
    </section>
  );
}

/** Below xl: the compact layout, with room under the paper for the glasses and pen. */
function Compact({ children }: { children: ReactNode }) {
  return <div className="pt-12 pb-20 sm:pb-24 md:pt-16 xl:hidden">{children}</div>;
}

export default NewspaperSection;
