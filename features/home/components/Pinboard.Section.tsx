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
/** One easing and pace for the whole roll, so the paper, its roll and the lift stay in step. */
const EASE = "cubic-bezier(0.65,0,0.25,1)";
const ROLL_MS = 720;

/*
 * The paper roll (the note is 250 px tall): hovered, the sheet rolls up from its bottom edge to the pin like a
 * blind, the roll travelling up with it and thickening as it gathers paper, and ends tucked under the pin.
 * The sheet is clipped at the roll's middle (from 250 px at rest up to 14 px), so the two always meet.
 */
const SHEET_CLIP = "[clip-path:inset(0_0_0_0)] group-hover:[clip-path:inset(0_0_236px_0)] group-focus-visible:[clip-path:inset(0_0_236px_0)]";
const ROLL_MOVE =
  "translate-y-[239px] scale-y-[0.3] opacity-0 group-hover:translate-y-[3px] group-hover:scale-y-100 group-hover:opacity-100 group-focus-visible:translate-y-[3px] group-focus-visible:scale-y-100 group-focus-visible:opacity-100";
/** The roll shows as soon as it starts rolling up, and fades only once it's back down at the bottom edge. */
const rollTransition = (opacityDelay: number) => `translate ${ROLL_MS}ms ${EASE}, scale ${ROLL_MS}ms ${EASE}, opacity 140ms linear ${opacityDelay}ms`;

/** "Real estate · 01 Nov 2026" → its category and date. */
function splitTag(tag: string) {
  const [category, date = ""] = tag.split(" · ");
  return { category, date };
}

/**
 * One article, as a paper note pinned to the board, tilted. Hovered (or
 * focused), it straightens and grows a little, its pin pulled part-way out,
 * and its paper rolls up to the pin like a blind, showing the article's card
 * pinned beneath it: the photo, its category and date, the title and "Read
 * the article". Moving away, the paper unrolls back down over it.
 *
 * Smoothness: the link is the hit area and never moves or scales (its area
 * already reaches past the grown note), so the pointer can't slip on and off
 * it; the breeze sways only the paper inside it (`data-note`, moved by
 * usePinboardNotes, which also calms the sway while hovered), and the tilt,
 * growth and roll live on elements inside that.
 */
function Note({ tag, title, href, paper, tilt, pin, image }: (typeof pinboardNotes)[number]) {
  const { category, date } = splitTag(tag);
  return (
    <a
      href={href}
      data-note-link
      className="group relative block h-[250px] text-ink-soft no-underline outline-none [transition:z-index_0s_linear_720ms] before:absolute before:-inset-x-4 before:-top-3 before:-bottom-8 before:content-[''] hover:z-10 hover:[transition-delay:0s] focus-visible:z-10 focus-visible:[transition-delay:0s]"
      style={{ "--paper": paper, "--tilt": `${tilt}deg` } as CSSProperties}
    >
      {/* swayed by the breeze (GSAP) */}
      <span data-note className="absolute inset-0 block">
        {/* the note: tilted; hovered, it straightens and grows about its pin */}
        <span className="absolute inset-0 origin-[50%_20px] rounded-[3px] shadow-[0_1px_1px_rgba(58,42,48,0.1),0_8px_16px_-6px_rgba(58,42,48,0.22),0_24px_40px_-24px_rgba(58,42,48,0.38)] transition-[rotate,scale,box-shadow] duration-[720ms] ease-[cubic-bezier(0.65,0,0.25,1)] rotate-(--tilt) will-change-transform group-hover:scale-[1.1] group-hover:rotate-0 group-hover:shadow-[0_2px_3px_rgba(58,42,48,0.12),0_18px_28px_-10px_rgba(58,42,48,0.32),0_40px_60px_-30px_rgba(58,42,48,0.45)] group-focus-visible:scale-[1.1] group-focus-visible:rotate-0 group-focus-visible:ring-2 group-focus-visible:ring-[#b96245] motion-reduce:transition-none">
          {/* beneath the paper: the article's card */}
          <span className="absolute inset-0 flex flex-col overflow-hidden rounded-[3px] bg-[#fbf6ea] bg-[url(/images/website/home/who-we-are/paper-wall.jpg)] bg-size-[360px] px-3 pt-[30px] pb-3 bg-blend-multiply">
            <span className="relative block h-[100px] shrink-0 overflow-hidden rounded-[2px] shadow-[inset_0_0_0_1px_rgba(58,42,48,0.08)]">
              <Image src={image} alt="" fill sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw" className="object-cover" />
            </span>
            <span className="mt-2.5 flex items-center gap-1.5 font-inter text-[10.5px] leading-none font-bold tracking-[0.12em] uppercase">
              <span className="truncate text-[#b96245]">{category}</span>
              {date && (
                <>
                  <span aria-hidden="true" className="text-[#c9b8a6]">•</span>
                  <time className="shrink-0 text-stone">{date}</time>
                </>
              )}
            </span>
            <span className="mt-1.5 line-clamp-2 text-[16px] leading-[1.22] font-bold text-ink-soft">{title}</span>
            <span className="mt-auto flex items-center gap-1.5 font-caveat text-lg leading-none text-[#b96245]">
              {pinboardCopy.readArticle}
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
          </span>

          {/* the paper: its tag, title and "read the note", rolling up to the pin */}
          <span
            className={`absolute inset-0 flex flex-col rounded-[3px] px-6 pt-8 pb-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition-[clip-path] duration-[720ms] ease-[cubic-bezier(0.65,0,0.25,1)] motion-reduce:transition-none ${PAPER} ${SHEET_CLIP}`}
          >
            <span className="font-inter text-[11px] leading-none font-bold tracking-[0.16em] text-stone uppercase">{tag}</span>
            <span className="mt-2 line-clamp-3 text-[19px] leading-[1.18] font-bold text-balance text-ink-soft">{title}</span>
            <span className="mt-auto flex items-center gap-1.5 font-caveat text-xl leading-none text-[#b96245]">
              {pinboardCopy.readNote}
              <span aria-hidden="true">→</span>
            </span>
          </span>
          {/* the roll: the paper wound up, lit along its top, shaded underneath, casting a soft shadow on the card */}
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute inset-x-0 top-0 block h-[22px] origin-center rounded-[11px] bg-(color:--paper) bg-[linear-gradient(to_bottom,rgba(70,50,40,0.28),rgba(255,255,255,0.55)_28%,rgba(255,255,255,0.12)_52%,rgba(70,50,40,0.3)_100%)] shadow-[0_4px_6px_-1px_rgba(40,30,25,0.35)] [transition:var(--roll-out)] group-hover:[transition:var(--roll-in)] group-focus-visible:[transition:var(--roll-in)] motion-reduce:transition-none ${ROLL_MOVE}`}
            style={{ "--roll-in": rollTransition(0), "--roll-out": rollTransition(ROLL_MS - 140) } as CSSProperties}
          />

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
      </span>
    </a>
  );
}

/**
 * "Fresh from our minds": the latest articles pinned to the office board. The
 * heading and "Read the blog" sit above a cork board in a wooden frame, with
 * eight pastel paper notes pinned to it in two rows, each slightly askew (hover
 * one and it straightens, grows and rolls its paper up to show the article's card). As it scrolls into view the label's plane
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
