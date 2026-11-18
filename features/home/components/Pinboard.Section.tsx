"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import SectionLabel from "@/components/website/shared/SectionLabel";
import ButtonLink from "@/components/ui/ButtonLink";
import { useScrollReveal } from "@/lib/animations/scrollReveal";
import { usePinboardNotes } from "../animations/Pinboard.Notes";
import { pinboardCopy, pinboardNotes } from "../constants/pinboard.constants";
import paperWall from "@/public/images/website/home/who-we-are/paper-wall.jpg";

/** The paper itself: the note's colour over the paper texture. */
const PAPER = "bg-(color:--paper) bg-[url(/images/website/home/who-we-are/paper-wall.jpg)] bg-size-[420px] bg-blend-multiply";
/** How the paper peels back: smooth and unhurried, settling softly. */
const PEEL = "duration-[700ms] ease-[cubic-bezier(0.65,0,0.25,1)]";
/**
 * The peel, as the paper's outline (five points, so it can glide between them): at rest the whole sheet; peeled,
 * its bottom-right corner folded back along a diagonal from 46% down its right edge to 18% along its bottom,
 * below the tag and title. The curl along that fold uses the same line, a few px into the paper.
 */
const SHEET = "[clip-path:polygon(0_0,100%_0,100%_100%,100%_100%,0_100%)]";
const PEELED = "group-hover:[clip-path:polygon(0_0,100%_0,100%_46%,18%_100%,0_100%)] group-focus-visible:[clip-path:polygon(0_0,100%_0,100%_46%,18%_100%,0_100%)]";
const CURL = "[clip-path:polygon(100%_100%,100%_100%,100%_100%,100%_100%)]";
const CURLED =
  "group-hover:[clip-path:polygon(100%_calc(46%-16px),100%_46%,18%_100%,calc(18%-22px)_100%)] group-focus-visible:[clip-path:polygon(100%_calc(46%-16px),100%_46%,18%_100%,calc(18%-22px)_100%)]";

/**
 * One article, as a paper note pinned to the board: tilted, it straightens and
 * lifts when hovered, its pin pulled part-way out, and the sheet peels back
 * from its bottom-right corner, curling over along a diagonal, to show the
 * article's photo behind it (with a "read the note" tag on it); the tag and
 * title, above the fold, stay put.
 * The outer box (`data-note`) and the pin's outer box (`data-pin`) are what the
 * scroll animation moves (GSAP clears an element's CSS rotate / translate /
 * scale), so the tilt and the hover effects live on the elements inside them.
 */
function Note({ tag, title, href, paper, tilt, pin, image }: (typeof pinboardNotes)[number]) {
  return (
    <div data-note className="relative">
      {/* the link is the note's hit area, and it never moves (so the hover can't flicker as the paper lifts) */}
      {/* (its hover area reaches 10px past the paper, so a pointer near an edge stays on it while the note's sway settles) */}
      <a
        href={href}
        className="group relative block h-[250px] text-ink-soft no-underline outline-none before:absolute before:-inset-[10px] before:content-['']"
        style={{ "--paper": paper, "--tilt": `${tilt}deg` } as CSSProperties}
      >
        {/* the paper and all on it: tilted, it straightens and lifts when hovered */}
        <span className="absolute inset-0 rounded-[3px] shadow-[0_1px_1px_rgba(58,42,48,0.1),0_8px_16px_-6px_rgba(58,42,48,0.22),0_24px_40px_-24px_rgba(58,42,48,0.38)] transition-[rotate,translate,box-shadow] duration-300 ease-out rotate-(--tilt) group-hover:-translate-y-2 group-hover:rotate-0 group-hover:shadow-[0_2px_2px_rgba(58,42,48,0.1),0_16px_24px_-8px_rgba(58,42,48,0.28),0_34px_50px_-26px_rgba(58,42,48,0.42)] group-focus-visible:-translate-y-2 group-focus-visible:rotate-0 group-focus-visible:ring-2 group-focus-visible:ring-[#b96245]">
        {/* behind the paper: the article's photo, and a "read the note" tag on it */}
        <span aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-[3px]">
          <Image src={image} alt="" fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
          <span className="absolute right-3 bottom-3 flex rotate-[-2deg] items-center gap-1.5 rounded-[2px] bg-[#fbf5e6] bg-[url(/images/website/home/who-we-are/paper-wall.jpg)] bg-size-[300px] px-2.5 py-1 font-caveat text-lg leading-none text-[#b96245] opacity-0 bg-blend-multiply shadow-[0_3px_6px_-2px_rgba(40,30,25,0.4)] transition-opacity delay-200 duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
            {pinboardCopy.readNote} <span aria-hidden="true">→</span>
          </span>
        </span>

        {/* the paper: one sheet, peeling back from its bottom-right corner */}
        <span className={`absolute inset-0 flex items-end rounded-[3px] px-6 pb-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition-[clip-path] ${PAPER} ${SHEET} ${PEELED} ${PEEL}`}>
          {/* (fades as the corner peels: the photo shows its own) */}
          <span className="flex items-center gap-1.5 font-caveat text-xl leading-none text-[#b96245] transition-opacity duration-200 group-hover:opacity-0 group-focus-visible:opacity-0">
            {pinboardCopy.readNote}
            <span aria-hidden="true">→</span>
          </span>
        </span>
        {/* the curl along the fold: the paper turned over, lit on its rounded edge, casting a shadow on the photo */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 drop-shadow-[2px_3px_3px_rgba(40,30,25,0.4)]">
          <span
            className={`absolute inset-0 bg-(color:--paper) bg-[linear-gradient(135deg,rgba(255,255,255,0.65),rgba(255,255,255,0.15)_55%,rgba(70,50,40,0.22))] transition-[clip-path] ${CURL} ${CURLED} ${PEEL}`}
          />
        </span>

        {/* the tag and title, above the fold */}
        <span className="absolute inset-x-0 top-0 flex h-1/2 flex-col gap-2 px-6 pt-8">
          <span className="font-inter text-[11px] leading-none font-bold tracking-[0.16em] text-stone uppercase">{tag}</span>
          <h3 className="line-clamp-3 text-[19px] leading-[1.18] font-bold text-balance text-ink-soft">{title}</h3>
        </span>

        {/* hover: the hole the pin leaves in the paper as it's pulled up a little */}
        <span aria-hidden="true" className="absolute top-[22px] left-1/2 -ml-[3px] size-1.5 rounded-full bg-[rgba(58,42,48,0.35)] opacity-0 blur-[1px] transition-opacity duration-300 group-hover:opacity-100" />
        {/* the push pin: a glossy head with its shadow on the paper; on hover it's pulled part-way out, its needle showing */}
        <span data-pin aria-hidden="true" className="absolute top-3 left-1/2 -ml-2 size-4">
          <span
            className="absolute inset-0 rounded-full bg-(color:--pin) bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.55),transparent_45%)] shadow-[0_3px_4px_rgba(58,42,48,0.35)] transition-[translate,scale,box-shadow] duration-300 ease-out group-hover:-translate-y-[6px] group-hover:scale-115 group-hover:shadow-[0_10px_9px_rgba(58,42,48,0.3)]"
            style={{ "--pin": pin } as CSSProperties}
          />
          {/* the needle, seen between the head and the paper while it's pulled out */}
          <span className="absolute top-[60%] left-1/2 -z-10 -ml-px h-0 w-[2px] rounded-b-full bg-linear-to-b from-[#d7dadd] to-[#8a8f95] transition-[height,translate] duration-300 ease-out group-hover:h-[9px] group-hover:-translate-y-[2px]" />
        </span>
        </span>
      </a>
    </div>
  );
}

/**
 * "Fresh from our minds": the latest articles pinned to the office board. The
 * heading and "Read the blog" sit above a cork board in a wooden frame, with
 * eight pastel paper notes pinned to it in two rows, each slightly askew (hover
 * one and it straightens and lifts). As it scrolls into view the label's plane
 * flies in, the heading rises in a wave and the empty board rises; then the
 * notes are pinned up one by one and sway in a breeze (see usePinboardNotes).
 * On phones the notes stack, then two across, then four across from lg.
 */
function PinboardSection() {
  const ref = useScrollReveal<HTMLElement>();
  const boardRef = usePinboardNotes();
  return (
    <section ref={ref} id="fresh-from-our-minds" className="relative isolate overflow-hidden py-16 md:py-24 xl:py-[120px]">
      {/* paper wall, washed a soft warm blush */}
      <Image src={paperWall} alt="" fill sizes="100vw" className="-z-10 object-cover" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[rgba(233,220,210,0.62)]" />

      <div className="site-container">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            <div data-sr="label" data-sr-flight="left">
              <SectionLabel>{pinboardCopy.label}</SectionLabel>
            </div>
            <h2 data-sr="words" className="text-[clamp(2rem,1.45rem+2.35vw,3rem)] leading-tight font-bold text-ink-soft xl:leading-[normal]">
              {pinboardCopy.heading}
            </h2>
          </div>
          <div data-sr="rise">
            <ButtonLink href="#" variant="folded">
              {pinboardCopy.readBlog}
            </ButtonLink>
          </div>
        </div>

        {/* the board: cork in a wooden frame */}
        <div
          data-sr="rise"
          className="mt-10 rounded-[10px] border-[12px] border-[#a17b57] bg-[#c4986a] bg-[url(/images/website/home/pinboard/cork.webp)] bg-size-[320px] p-6 shadow-[inset_0_0_0_2px_#795739,inset_0_6px_14px_rgba(60,40,20,0.35),0_18px_34px_-14px_rgba(59,48,46,0.45)] sm:p-8 md:mt-12 md:border-[14px] xl:p-14"
        >
          <div ref={boardRef} className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-[30px] lg:gap-y-10">
            {pinboardNotes.map((note) => (
              <Note key={note.title} {...note} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PinboardSection;
