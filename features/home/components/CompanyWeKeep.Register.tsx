"use client";

import Image from "next/image";
import { Fragment, type CSSProperties } from "react";
import SectionLabel from "@/components/website/shared/SectionLabel";
import { useScrollReveal } from "@/lib/animations/scrollReveal";
import { registerEntries, visitorRegisterCopy as copy } from "../constants/companyWeKeep.constants";
import { useSignatureInk } from "../animations/CompanyWeKeep.Ink";
import paperWall from "@/public/images/website/home/who-we-are/paper-wall.jpg";
import lamp from "@/public/images/website/home/visitor-register/lamp.webp";
import plant from "@/public/images/website/home/visitor-register/plant.webp";

const SIG_HEIGHT = 52;

/**
 * A visitor's signature, as a pen line: an opening loop, a run of waves (as
 * high as they scrawled them) and a flourish that swings back under the lot.
 */
function signaturePath(width: number, waves: readonly number[]) {
  const base = 24;
  const start = 17;
  const end = width - 16;
  const step = (end - start) / waves.length;
  const r = (n: number) => Math.round(n * 10) / 10;
  let d = `M3 ${base + 8}C1 12 5 2 10 2C16 2 17 12 17 ${base - 1}C17 ${base + 1} 17 ${base} ${start} ${base}`;
  waves.forEach((a, i) => {
    const x = start + i * step;
    d += `C${r(x + step * 0.3)} ${base} ${r(x + step * 0.22)} ${base - a} ${r(x + step * 0.5)} ${base - a}S${r(x + step * 0.72)} ${base} ${r(x + step)} ${base}`;
  });
  d += `C${r(end + 8)} ${base - 2} ${width - 2} ${base - 10} ${width - 3} ${base - 6}`;
  d += `C${width - 4} ${base + 8} ${width - 22} ${base + 10} ${width - 40} ${base + 10}`;
  d += `C${r(width * 0.5)} ${base + 11} 30 ${base + 20} 12 ${base + 26}`;
  return d;
}

/** A visitor's pass colour, as a small two-tone tag: the colour, folded over in a lighter shade. */
function PassTag({ color }: { color: string }) {
  return (
    <span
      aria-hidden="true"
      style={{ "--tag": color } as CSSProperties}
      className="size-3 shrink-0 bg-[linear-gradient(135deg,var(--tag)_50%,color-mix(in_srgb,var(--tag),white_42%)_50%)] sm:size-[14px] xl:size-4 xl:-translate-y-[5px]"
    />
  );
}

/**
 * The register's columns. xl: as in the design (150 | 760 | 232 | 58 of 1200);
 * smaller screens close them up, and on phones the signature goes under the name.
 */
const ROW_GRID =
  "grid grid-cols-[54px_minmax(0,1fr)_auto] items-center gap-x-2 sm:grid-cols-[72px_minmax(0,1fr)_170px_56px] sm:gap-x-0 md:grid-cols-[96px_minmax(0,1fr)_200px_58px] xl:grid-cols-[150px_minmax(0,1fr)_231.7px_58.3px]";

/** How everything rolls on hover: a slow-in, slow-out swing. */
const ROLL = "transition-[translate,opacity] duration-[600ms] ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none";
/** Each letter of a name sets off this much (ms) after the one before it. */
const LETTER_STAGGER = 22;

/**
 * A name as single letters, each rolling on its own when the row's hovered:
 * the front's letters roll up out of sight one after another while the back's
 * roll up into their place from below (each word clipped to its line, so they
 * vanish into it rather than over the row). Words stay whole when it wraps.
 */
function RollingLetters({ text, face }: { text: string; face: "front" | "back" }) {
  let n = 0;
  const motion = face === "front" ? "group-hover:-translate-y-[130%]" : "translate-y-[130%] group-hover:translate-y-0";
  return text.split(" ").map((word, w) => (
    <Fragment key={w}>
      {w > 0 && " "}
      <span className="inline-block whitespace-nowrap [clip-path:inset(-0.08em_-0.12em_-0.24em)]">
        {Array.from(word).map((letter) => {
          const delay = n++ * LETTER_STAGGER;
          return (
            <span key={delay} className={`inline-block ${ROLL} ${motion}`} style={{ transitionDelay: `${delay}ms` }}>
              {letter}
            </span>
          );
        })}
      </span>
    </Fragment>
  ));
}

type Entry = (typeof registerEntries)[number];

/**
 * One face of a register line: pass number, the visitor's colour and name,
 * their signature and "Visitor". The front is the register as printed (its
 * signature inks itself in as it scrolls into view); the back is the same line
 * in cream on the visitor's colour, the one that rolls into view on hover.
 */
function RowFace({ entry, face }: { entry: Entry; face: "front" | "back" }) {
  const { width, waves } = entry.signature;
  const back = face === "back";
  const out = back ? "translate-y-[130%] group-hover:translate-y-0" : "group-hover:-translate-y-[130%]";
  return (
    <div aria-hidden={back || undefined} className={`${ROW_GRID} py-4 sm:h-full sm:py-0 ${back ? "absolute inset-0 text-[#fbf3e6]" : "relative"}`}>
      <span className="[clip-path:inset(-0.1em_-0.2em_-0.3em)]">
        <span className={`block font-inter text-[14px] leading-none tracking-[0.02em] sm:text-[16px] xl:translate-y-[1.5px] xl:text-[18.5px] ${ROLL} ${out} ${back ? "text-[#fbf3e6]/75" : "text-[#8a837c]"}`}>{entry.number}</span>
      </span>
      <span className="flex min-w-0 items-center gap-2.5 sm:gap-3 xl:gap-[14px]">
        {/* the tag turns over with the line: the colour one shrinks away, a cream one pops up in its place */}
        <span
          className={`flex shrink-0 transition-[scale,opacity,rotate] duration-[450ms] ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none ${back ? "scale-0 -rotate-90 opacity-0 group-hover:scale-100 group-hover:rotate-0 group-hover:opacity-100 group-hover:delay-150" : "group-hover:scale-0 group-hover:rotate-90 group-hover:opacity-0"}`}
        >
          <PassTag color={back ? "#fbf3e6" : entry.color} />
        </span>
        <span className={`font-instrument text-[26px] leading-[1.1] font-bold tracking-[-0.03em] sm:text-[clamp(28px,4.4vw,44px)] xl:text-[58.5px] xl:leading-none ${back ? "" : "text-[#2b2825]"}`}>
          {back ? null : <span className="sr-only">{entry.brand}</span>}
          <span aria-hidden="true">
            <RollingLetters text={entry.brand} face={face} />
          </span>
        </span>
      </span>
      {/* phones: the signature and "Visitor" go on a line of their own, under the name */}
      <span className="col-span-full col-start-2 mt-2 flex items-center justify-between gap-4 sm:col-span-1 sm:col-start-auto sm:mt-0 sm:contents">
        <svg
          role={back ? undefined : "img"}
          aria-label={back ? undefined : copy.signedBy(entry.brand)}
          viewBox={`0 0 ${width} ${SIG_HEIGHT}`}
          style={{ width: `calc(${width}px * var(--sig-scale))` }}
          className={`h-auto overflow-visible [--sig-scale:0.62] sm:ml-2 sm:[--sig-scale:0.72] md:[--sig-scale:0.84] xl:ml-[8.7px] xl:-translate-y-[3px] xl:[--sig-scale:1] ${back ? "" : "transition-opacity duration-300 group-hover:opacity-0 motion-reduce:transition-none"}`}
        >
          {back ? (
            // signed again, in cream, as the line rolls round
            <path
              d={signaturePath(width, waves)}
              pathLength={1}
              fill="none"
              stroke="#fbf3e6"
              strokeWidth={1.9}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              className="[stroke-dasharray:1] [stroke-dashoffset:1] transition-[stroke-dashoffset] duration-500 ease-in group-hover:[stroke-dashoffset:0] group-hover:duration-[900ms] group-hover:delay-[280ms] group-hover:ease-out motion-reduce:transition-none"
            />
          ) : (
            <path data-ink d={signaturePath(width, waves)} pathLength={1} fill="none" stroke={entry.color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          )}
        </svg>
        <span className="[clip-path:inset(-0.1em_-0.2em_-0.3em)]">
          <span
            className={`block font-serif-italic text-[16px] leading-none sm:text-[17px] xl:text-[18px] ${ROLL} ${out} ${back ? "text-[#fbf3e6]/85" : "text-[#8f8780]"}`}
            style={{ transitionDelay: `${entry.brand.length * LETTER_STAGGER * 0.6}ms` }}
          >
            {copy.visitor}
          </span>
        </span>
      </span>
    </div>
  );
}

/**
 * One line of the register. Hover it and it rolls over: a band in the
 * visitor's colour unrolls down over the line like a blind, the name's letters
 * roll up one after another and come back round in cream, the pass number and
 * "Visitor" roll with them, and the signature is signed again in cream ink.
 * Off it, it all rolls back. (Only with a mouse: touch screens keep the line as printed.)
 */
function RegisterRow({ entry }: { entry: Entry }) {
  return (
    <li
      data-sr="rise"
      className="group relative border-b border-[rgba(45,44,39,0.1)] [clip-path:inset(0_-0.75rem)] sm:h-[88px] md:h-[96px] xl:h-[104px] xl:[clip-path:inset(0_-1.25rem)]"
    >
      {/* the band: hinged along the top of the line, it swings down into place */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -inset-x-3 origin-top rounded-[3px] transition-transform duration-[650ms] ease-[cubic-bezier(0.65,0,0.35,1)] [transform:perspective(700px)_rotateX(-92deg)] group-hover:[transform:perspective(700px)_rotateX(0deg)] motion-reduce:transition-none xl:-inset-x-5"
        style={{
          backgroundImage: `linear-gradient(180deg, color-mix(in srgb, ${entry.color}, white 12%), color-mix(in srgb, ${entry.color}, black 16%))`,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -10px 18px -12px rgba(0,0,0,0.35)",
        }}
      />
      <RowFace entry={entry} face="front" />
      <RowFace entry={entry} face="back" />
    </li>
  );
}

/**
 * "The company we keep" as the reception's visitor register: a heading and a
 * line about it, then every client signed in, one to a line, with their pass
 * number, their colour and their signature (which inks itself in as the line
 * comes into view). Paper-cut decorations as in the design: a lamp hanging
 * over the intro, a plant in the corner, folds of paper at the edges.
 *
 *  - xl (1280+): the 1440 design, to its coordinates (as tall as its register);
 *  - smaller screens: the same register, its columns closed up; on phones the
 *    intro goes under the heading and each signature under its name.
 */
function CompanyWeKeepRegister() {
  const ref = useScrollReveal<HTMLElement>();
  useSignatureInk(ref);
  return (
    <section ref={ref} id="company-we-keep" className="relative isolate -mt-[3px] overflow-hidden pt-14 pb-36 md:pt-20 md:pb-44 xl:px-0 xl:pt-0 xl:pb-[120px]">
      {/* paper, washed nearly white */}
      <Image src={paperWall} alt="" fill sizes="100vw" className="-z-20 object-cover" />
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-[rgba(247,244,239,0.82)]" />

      {/* paper folds: the top left corner, and the bottom corners */}
      <svg aria-hidden="true" viewBox="0 0 240 160" className="absolute top-0 left-0 -z-10 w-[150px] sm:w-[200px] xl:w-[240px]">
        <polygon points="0,0 115,0 0,100" fill="#efe8dc" opacity="0.7" />
        <polygon points="115,0 215,0 0,160 0,100" fill="#e6ddcd" opacity="0.75" />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 230 95" className="absolute bottom-0 left-0 -z-10 w-[150px] sm:w-[190px] xl:w-[230px]">
        <polygon points="85,2 160,0 150,95 56,95" fill="#efe7da" />
        <polygon points="160,0 230,95 150,95" fill="#e5dccb" />
        <polygon points="20,44 80,95 0,95 0,59" fill="#88a081" />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 380 560" preserveAspectRatio="xMaxYMax meet" className="absolute right-0 bottom-0 -z-10 h-[300px] sm:h-[420px] xl:h-[560px]">
        <polygon points="380,0 380,560 0,560" fill="#e4dac8" opacity="0.85" />
        <polygon points="380,60 380,560 190,560" fill="#ece3d4" opacity="0.8" />
      </svg>

      {/* the lamp over the intro, its warm light on the paper */}
      <div aria-hidden="true" className="pointer-events-none absolute top-0 right-[6%] -z-10 hidden w-[112px] origin-top animate-[lamp-sway_7s_ease-in-out_infinite] motion-reduce:animate-none md:block xl:right-auto xl:left-[calc(50%+486.3px)]">
        <span className="absolute top-[150px] left-1/2 size-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,241,205,0.75),rgba(255,241,205,0))]" />
        <span className="absolute top-0 left-[55.7px] h-[105px] w-px bg-[#8a7a66]" />
        <Image src={lamp} alt="" sizes="112px" className="relative mt-[104.3px] h-auto w-full" />
      </div>

      {/* the plant in the corner */}
      <Image src={plant} alt="" sizes="155px" className="pointer-events-none absolute right-0 bottom-0 -z-10 h-auto w-[64px] sm:w-[76px] xl:bottom-[40px] xl:w-[154.7px]" />

      <div className="site-container relative xl:ml-[calc(50%-620px)] xl:w-[1200px] xl:max-w-none">
        {/* heading, and the line about it */}
        <div className="flex flex-col gap-6 md:gap-8 xl:h-[471px] xl:flex-row xl:items-start xl:justify-between xl:gap-0 xl:pt-[110px]">
          <div className="flex flex-col items-start">
            <div data-sr="label" data-sr-flight="left">
              <SectionLabel className="font-bold!">{copy.label}</SectionLabel>
            </div>
            <h2 className="mt-5 text-[#343330] xl:mt-[19px]">
              <span data-sr="words" className="block text-[clamp(2rem,1.05rem+3.9vw,4rem)] leading-[1.06] font-bold tracking-[-0.03em] xl:text-[72px] xl:leading-[72px]">
                {copy.headingFirst}
              </span>
              <span data-sr="words" className="-ml-[0.09em] block font-serif-italic text-[clamp(2.4rem,1.2rem+4.9vw,5rem)] leading-[1.06] font-normal tracking-[-0.01em] text-[#bf5d3a] xl:mt-[3px] xl:text-[81px] xl:leading-[80px]">
                {copy.headingSecond}
              </span>
            </h2>
          </div>
          <p data-sr="rise" className="max-w-[420px] font-inter text-[17px] leading-[29px] tracking-[0.01em] text-[#5f5a54] md:text-[19px] md:leading-8 xl:mt-[122px] xl:w-[370px] xl:text-[20px] xl:tracking-normal">
            {copy.intro}
          </p>
        </div>

        {/* the register */}
        <div className="mt-12 md:mt-16 xl:mt-0">
          <div className={`${ROW_GRID} border-b border-[#c1bfbb] pb-3 font-inter text-[10px] leading-none font-semibold tracking-[0.12em] whitespace-nowrap text-[#7e7770] uppercase sm:tracking-[0.16em] sm:pb-[16px] xl:text-[11px]`}>
            <span>{copy.columns.pass}</span>
            <span className="sm:pl-[26px] xl:pl-[30.7px]">{copy.columns.client}</span>
            <span className="max-sm:hidden">{copy.columns.signedIn}</span>
          </div>
          <ol>
            {registerEntries.map((entry) => (
              <RegisterRow key={entry.number} entry={entry} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export default CompanyWeKeepRegister;
