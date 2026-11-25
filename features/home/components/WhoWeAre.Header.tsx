"use client";

import Image from "next/image";
import SectionLabel from "@/components/website/shared/SectionLabel";
import { whoWeAreCopy } from "../constants/whoWeAre.constants";
import { useWhoWeAreIntro } from "../animations/WhoWeAre.Intro";
import paperAirplane from "@/public/images/website/home/who-we-are/paper-airplane-clean.png";

/** The three notes: paper colour, tilt, and where the tape sits. */
const NOTE_STYLES = [
  { paper: "bg-[#fbe7a1]", fold: "from-[#efd27a]", tilt: "-rotate-3", tape: "-rotate-6 left-1/2" },
  { paper: "bg-[#f7cfc0]", fold: "from-[#e8b29f]", tilt: "rotate-2", tape: "rotate-3 left-[42%]" },
  { paper: "bg-[#cfe3c6]", fold: "from-[#b3cfa6]", tilt: "-rotate-1", tape: "-rotate-2 left-[56%]" },
] as const;

/**
 * The three notes stuck up by the whiteboard: square paper notes in marker
 * hand, each taped up at a slight tilt with its corner curling, nudging
 * straight when hovered.
 */
function WhiteboardNotes({ className }: { className?: string }) {
  return (
    <ul data-anim="notes" className={className}>
      {whoWeAreCopy.notes.map((note, i) => {
        const style = NOTE_STYLES[i];
        return (
          <li
            key={note}
            className={`relative flex aspect-square items-center justify-center px-2.5 pt-3 pb-2 text-center font-caveat text-[17px] leading-[1.1] font-bold text-marker-navy shadow-[0_6px_10px_-6px_rgba(60,45,30,0.45),0_1px_2px_rgba(60,45,30,0.15)] transition-[rotate,translate] duration-300 hover:-translate-y-1 hover:rotate-0 sm:text-[21px] md:px-4 xl:text-[22px] ${style.paper} ${style.tilt}`}
          >
            {/* the tape across its top */}
            <span aria-hidden="true" className={`absolute -top-2.5 h-5 w-14 -translate-x-1/2 bg-white/55 shadow-[0_1px_1px_rgba(0,0,0,0.08)] backdrop-blur-[1px] ${style.tape}`} />
            {/* its bottom corner curling up */}
            <span aria-hidden="true" className={`absolute right-0 bottom-0 size-5 bg-linear-to-tl ${style.fold} to-transparent [clip-path:polygon(100%_0,0_100%,100%_100%)]`} />
            {note}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * "Who we are" heading, intro and paper airplane, and the three notes. On
 * scroll the label, heading and intro rise up word by word in a wave, all
 * together, the label's little red plane flies in on a curve, and the airplane
 * glides in from the bottom left to its place (see useWhoWeAreIntro).
 */
function WhoWeAreHeader() {
  const ref = useWhoWeAreIntro();

  return (
    <div ref={ref}>
      {/* xl+: side by side; columns keep Figma's 613 : 575 split (exact at 1440) */}
      <div className="xl:flex xl:items-start xl:gap-[49px]">
        <div className="flex flex-col gap-4 xl:flex-[613_1_0%]">
          <div data-anim="label">
            <SectionLabel>{whoWeAreCopy.label}</SectionLabel>
          </div>
          <h2 data-anim="heading" className="relative text-[clamp(2rem,1.45rem+2.35vw,3rem)] leading-[normal] font-bold text-ink-soft">
            {whoWeAreCopy.heading}
          </h2>
          {/* xl: the notes under the heading, clear of the paper airplane */}
          <WhiteboardNotes className="mt-8 hidden w-[456px] grid-cols-3 gap-6 self-end xl:grid" />
        </div>
        {/* the intro as one paragraph, running on */}
        <p
          data-anim="intro"
          className="relative mt-5 max-w-[720px] font-inter text-[17px] leading-[1.5] tracking-[-0.2px] text-stone md:text-[19px] xl:mt-0 xl:max-w-none xl:flex-[575_1_0%] xl:pt-[52px] xl:text-[19px] xl:leading-[1.55]"
        >
          {whoWeAreCopy.intro.join(" ")}
        </p>
      </div>

      {/* below xl: the notes under the intro */}
      <WhiteboardNotes className="mt-7 grid max-w-[560px] grid-cols-3 gap-3 sm:gap-5 xl:hidden" />

      <Image
        data-anim="plane"
        src={paperAirplane}
        alt=""
        className="mt-5 block w-[90px] md:w-[110px] xl:absolute xl:top-[278px] xl:-left-[43px] xl:mt-0 xl:w-[154px]"
      />
    </div>
  );
}

export default WhoWeAreHeader;
