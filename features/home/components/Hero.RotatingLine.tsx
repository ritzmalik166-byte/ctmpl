"use client";

import { heroHeadline } from "../constants/hero.constants";
import { useRotatingLine } from "../animations/Hero.RotatingLine";

const lg = "text-hero-lg leading-[1.382] font-semibold lg:text-hero-lg-scene";
/** The red word: larger on phones and tablets (tighter leading keeps the line box); on desktop the
 * whole changing line is one size, 65px at 1440. */
const xl = "text-hero-xl leading-[1.3] font-semibold text-brand-red lg:text-hero-lg-scene lg:leading-[1.382]";

/** A piece of text as single letters, so it can be written out (and erased) one at a time. */
function Letters({ text, className }: { text: string; className: string }) {
  return (
    <span className={className}>
      {Array.from(text).map((letter, i) => (
        <span key={i} data-letter>
          {letter}
        </span>
      ))}
    </span>
  );
}

/**
 * The headline's second line ("The ideas are already at work."), which
 * changes every few seconds: it's erased letter by letter and the next one
 * written in with a caret (see useRotatingLine). All the lines sit stacked in
 * one place, only the current one showing, so the space always fits the
 * longest and nothing below moves. Screen readers get the first line, once.
 */
export function HeroRotatingLine() {
  const { ref, current } = useRotatingLine(heroHeadline.lines.length);
  const [first] = heroHeadline.lines;
  return (
    <>
      <span className="sr-only">{`${first.before}${first.word}${first.after}`}</span>
      <span ref={ref} aria-hidden="true" className="grid">
        {heroHeadline.lines.map(({ before, word, after }, i) => (
          <span key={word} data-line={i} className="block text-[0px] leading-[0] [grid-area:1/1]" style={{ visibility: i === current ? "visible" : "hidden" }}>
            <Letters text={before} className={lg} />
            <Letters text={word} className={xl} />
            <Letters text={after} className={lg} />
            {/* the writing caret (only while writing) */}
            <span className={lg}>
              <span
                data-caret
                className="invisible ml-[0.04em] inline-block h-[0.9em] w-[0.06em] animate-[caret-blink_0.9s_steps(1)_infinite] bg-ink align-[-0.1em]"
              />
            </span>
          </span>
        ))}
      </span>
    </>
  );
}
