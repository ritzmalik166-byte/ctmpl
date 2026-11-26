"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type CSSProperties, type ReactNode } from "react";
import { useScrollReveal } from "@/lib/animations/scrollReveal";
import { footerContent } from "@/config/footer";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";
import ctmLogo from "@/public/images/website/brand/ctm-logo.png";
import { FOOTER_PEOPLE, FooterPerson } from "./Footer.People";
import { FooterHoverNote } from "./Footer.HoverNote";
import plant from "@/public/images/website/footer/board/plant.webp";

const ART = "/images/website/footer/board";

/** The pins' and tags' colours: the logo's four. */
const RED = "#a9472b";
const BLUE = "#1f57a5";
const ORANGE = "#f28a3a";
const GREEN = "#17733f";

/** A round push pin, lit from the top left, casting a little shadow on the paper. */
function Pin({ color, className }: { color: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      style={{ "--pin": color } as CSSProperties}
      className={cn(
        "absolute z-10 size-[14px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_34%_30%,rgba(255,255,255,0.85)_0_1.5px,transparent_2.5px),radial-gradient(circle_at_40%_35%,color-mix(in_srgb,var(--pin),white_22%),var(--pin)_55%,color-mix(in_srgb,var(--pin),black_28%))] shadow-[1px_2px_2px_rgba(40,25,10,0.35)]",
        className
      )}
    />
  );
}

type NoteProps = {
  /** Tilt, in degrees (clockwise). */
  tilt: number;
  /** The yellow paper (the contact note), else white. */
  cream?: boolean;
  delay?: number;
  className?: string;
  children: ReactNode;
};

/**
 * A sheet of paper pinned to the cork: a slight tilt and a soft shadow. It
 * straightens and lifts a little when hovered. (The tilt is the CSS `rotate`
 * property, so the entrance, which animates `transform`, leaves it alone.)
 */
function Note({ tilt, cream, delay = 0, className, children }: NoteProps) {
  return (
    <div
      data-sr="drop"
      data-sr-delay={delay}
      style={{ "--tilt": `${tilt}deg` } as CSSProperties}
      className={cn(
        "relative rotate-(--tilt) shadow-[0_1px_1px_rgba(60,40,20,0.16),2px_7px_12px_-4px_rgba(60,40,20,0.38)] transition-[rotate,translate,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:rotate-0 hover:shadow-[0_2px_2px_rgba(60,40,20,0.14),3px_14px_20px_-6px_rgba(60,40,20,0.42)]",
        cream ? "bg-[#fcf3d5]" : "bg-[#f8f4ec]",
        className
      )}
    >
      {children}
    </div>
  );
}

/** "Call us on", "Mail us on", "Visit": handwritten, in the brand red, after a small line icon. */
function ScriptLabel({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <p className="flex items-center gap-[9px] font-caveat text-[21px] leading-none font-bold text-[#a9472b]">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-3 shrink-0 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] lg:size-[13px]">
        {icon}
      </svg>
      {children}
    </p>
  );
}

const ICONS = {
  phone: <path d="M5 3h3l2 5-2.5 1.5a11 11 0 0 0 7 7L16 14l5 2v3a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2Z" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6 8.5-6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
};

/** The contact note: our numbers, email and address, on yellow paper held up by a strip of tape. */
function ContactNote({ className }: { className?: string }) {
  const { call, mail, visit } = footerContent.contact;
  const value = "font-instrument text-[15.5px] leading-[25px] text-[#2a231d] transition-colors hover:text-[#a9472b]";
  return (
    <Note tilt={1} cream delay={0.15} className={cn("pt-[27px] pr-6 pb-4 pl-[22px]", className)}>
      {/* the tape */}
      <span aria-hidden="true" className="absolute -top-[16px] left-1/2 h-[22px] w-[90px] -translate-x-1/2 -rotate-3 bg-[rgba(214,192,152,0.82)] shadow-[0_1px_1px_rgba(90,60,20,0.12)]" />
      <ScriptLabel icon={ICONS.phone}>{call.label}</ScriptLabel>
      <ul className="mt-[2px]">
        {call.numbers.map((n) => (
          <li key={n.href}>
            <a href={n.href} data-note={`call::${n.text}`} className={value}>
              {n.text}
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-[12px]">
        <ScriptLabel icon={ICONS.mail}>{mail.label}</ScriptLabel>
      </div>
      <a href={`mailto:${mail.email}`} data-note={`mail::${mail.email}`} className={cn(value, "mt-[3px] block break-all")}>
        {mail.email}
      </a>
      <div className="mt-[11px]">
        <ScriptLabel icon={ICONS.pin}>{visit.label}</ScriptLabel>
      </div>
      <a href={visit.mapUrl} target="_blank" rel="noopener noreferrer" data-note="map::visit" className={cn(value, "mt-[4px] block leading-[22px]")}>
        {visit.lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </a>
    </Note>
  );
}

/** The social glyphs, line-drawn, on 24 × 24. */
const SOCIAL_GLYPHS: Record<string, ReactNode> = {
  Instagram: (
    <g fill="none" stroke="currentColor" strokeWidth="2.3">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.9" />
      <circle cx="17.3" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </g>
  ),
  LinkedIn: (
    <path
      fill="currentColor"
      d="M6.9 5a1.95 1.95 0 1 1-3.9 0 1.95 1.95 0 0 1 3.9 0ZM7 8.5H3V21h4V8.5Zm6.3 0H9.3V21h4v-6.6c0-3.6 4.8-4 4.8 0V21h3.9v-7.9c0-6.2-7-6-8.7-2.9l.1-1.7Z"
    />
  ),
  YouTube: (
    <g>
      <rect x="2.8" y="5.6" width="18.4" height="12.8" rx="4" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <path d="M10.1 9.1v5.8l5-2.9-5-2.9Z" fill="currentColor" />
    </g>
  ),
  Facebook: (
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      d="M10.4 21V13.4H8V10.2h2.4V7.6c0-2.5 1.4-4 4-4 1 0 1.9.1 2.2.2v2.8h-1.5c-1.2 0-1.5.6-1.5 1.5v2.1h2.9l-.4 3.2h-2.5V21h-3.2Z"
    />
  ),
  "X (Twitter)": (
    <path
      fill="currentColor"
      d="M17.7 3.1h3l-6.6 7.5 7.7 10.2h-6l-4.7-6.2-5.4 6.2H2.6l7-8L2.3 3.1h6.2l4.2 5.6 5-5.6Zm-1 15.9h1.6L7.6 4.8H5.8L16.7 19Z"
    />
  ),
};

/** Each tile is cut by hand: a slightly different eight-sided shape, colour and glyph colour. */
const TILES: Record<string, { bg: string; ink: string; clip: string }> = {
  Instagram: { bg: ORANGE, ink: "#2b2420", clip: "polygon(9% 2%,92% 7%,100% 45%,94% 96%,5% 95%,0% 47%)" },
  LinkedIn: { bg: BLUE, ink: "#ffffff", clip: "polygon(8% 4%,90% 2%,100% 47%,93% 97%,7% 99%,0% 51%)" },
  YouTube: { bg: RED, ink: "#ffffff", clip: "polygon(7% 3%,91% 1%,100% 48%,95% 98%,6% 96%,0% 46%)" },
  Facebook: { bg: GREEN, ink: "#ffffff", clip: "polygon(9% 4%,93% 1%,100% 50%,94% 97%,6% 99%,0% 47%)" },
  "X (Twitter)": { bg: "#f4c232", ink: "#2b2420", clip: "polygon(7% 3%,92% 5%,100% 48%,93% 97%,8% 96%,0% 50%)" },
};

/** "Find us online": the studio's channels, each a paper-cut tile with its name and "follow us". */
function SocialNote({ className }: { className?: string }) {
  return (
    <Note tilt={0.8} delay={0.1} className={cn("px-4 pt-[18px] pb-5 sm:px-[15px] lg:pt-[19px]", className)}>
      <Pin color={BLUE} className="top-[-6px] left-1/2" />
      <h2 className="px-[11px] font-caveat text-[24px] leading-none font-bold text-[#a9472b]">{footerContent.findUs}</h2>
      <ul className="mt-[13px] grid grid-cols-3 gap-y-5 min-[440px]:grid-cols-5 sm:mt-[12px] lg:grid-cols-[repeat(5,92px)]">
        {footerContent.social.map(({ label, href }) => {
          const tile = TILES[label];
          return (
            <li key={label} className="flex justify-center">
              <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label}: ${footerContent.followUs}`} data-note={`social::${label}`} className="group flex flex-col items-center text-center">
                {/* the tile, on its paper shadow */}
                <span className="relative block size-[38px] transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:-rotate-3 lg:size-[42px]">
                  <span aria-hidden="true" className="absolute inset-0 translate-y-[2px] bg-[#d5c6ad]" style={{ clipPath: tile.clip }} />
                  <span className="absolute inset-0 flex items-center justify-center" style={{ clipPath: tile.clip, background: tile.bg, color: tile.ink }}>
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[21px] lg:size-[23px]">
                      {SOCIAL_GLYPHS[label]}
                    </svg>
                  </span>
                </span>
                <span className="mt-[7px] font-instrument text-[13px] leading-[18px] font-semibold whitespace-nowrap text-[#2a231d] lg:text-[14px]">{label}</span>
                <span className="mt-[5px] font-typewriter text-[11px] leading-[14px] text-[#6d625a] lg:text-[12px]">{footerContent.followUs}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </Note>
  );
}

/** A note of links (Company, Services, Read and listen): a typed heading by a coloured tag, the links under it. */
function LinkNote({ heading, links, color, tilt, delay, wide, className }: { heading: string; links: readonly string[]; color: string; tilt: number; delay: number; wide?: boolean; className?: string }) {
  return (
    <Note tilt={tilt} delay={delay} className={cn("pt-6 pr-2 pb-[18px] pl-3.5 sm:pt-[27px] sm:pr-3 sm:pb-[22px] sm:pl-[19px]", className)}>
      <Pin color={color} className="top-[-5px] left-1/2" />
      <h2 className="flex items-center gap-[8px] font-typewriter text-[12.5px] leading-[18px] font-bold tracking-[0.11em] text-[#a9472b] uppercase sm:whitespace-nowrap">
        <span aria-hidden="true" className="size-[11px] shrink-0 -rotate-6" style={{ background: color }} />
        {heading}
      </h2>
      {/* phones: a note across the board lists its links two across */}
      <ul className={cn("mt-2 sm:mt-[10px]", wide && "max-sm:grid max-sm:grid-cols-2 max-sm:gap-x-3")}>
        {links.map((label) => (
          <li key={label}>
            <Link href="#" data-note={`${heading}::${label}`} className="font-instrument text-[13px] leading-[28px] whitespace-nowrap min-[400px]:text-[14px] sm:text-[15.5px] sm:leading-[30px] text-[#2a231d] transition-colors hover:text-[#a9472b]">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </Note>
  );
}

const LINK_NOTES = [
  { color: BLUE, tilt: 1.2 },
  { color: ORANGE, tilt: -0.9 },
  { color: GREEN, tilt: 0.6 },
] as const;

/**
 * The cork board in its wooden frame, with every note pinned to it.
 *  - lg+: as in the design, each note where it was pinned (the cork is 944 × 524);
 *  - sm–md: the logo and contact notes side by side, "Find us online" across,
 *    then the three link notes;
 *  - phones: one note under another, the link notes two across (the third
 *    across the board, its links in two columns).
 * On desktops (lg+) a hovered link gets a note written out beside it (FooterHoverNote).
 */
function Board() {
  const { columns } = footerContent;
  const cork = useRef<HTMLDivElement>(null);
  return (
    <div
      data-sr="rise"
      className="relative mx-auto w-full max-w-[979px] rounded-[2px] bg-[#a17749] p-3 shadow-[inset_0_0_0_1px_rgba(90,55,20,0.25),0_10px_14px_-4px_rgba(70,45,20,0.35)] sm:p-[18px] xl:absolute xl:top-[88px] xl:left-[calc(50%-490px)]"
    >
      <div ref={cork} className="relative grid grid-cols-2 gap-x-3 gap-y-9 bg-[#c4a476] bg-[url(/images/website/footer/board/cork.webp)] bg-size-[320px] px-3 pt-8 pb-9 shadow-[inset_0_2px_7px_rgba(60,35,10,0.4)] min-[400px]:px-4 sm:grid-cols-6 sm:gap-x-5 sm:px-6 sm:pt-9 lg:block lg:h-[524px] lg:p-0">
        {/* the logo */}
        <Note tilt={-1.2} className="px-[27px] pt-[23px] pb-[22px] col-span-2 sm:col-span-3 sm:self-start lg:absolute lg:top-[37px] lg:left-[37px] lg:w-[262px]">
          <Pin color={RED} className="top-[1px] left-1/2" />
          <Link href="/" aria-label={siteConfig.name} className="block">
            <Image src={ctmLogo} alt={siteConfig.name} sizes="210px" className="mx-auto h-auto w-full max-w-[210px]" />
          </Link>
        </Note>

        <SocialNote className="col-span-2 sm:col-span-6 sm:row-start-2 lg:absolute lg:top-[29px] lg:left-[361px] lg:w-[490px]" />
        <ContactNote className="col-span-2 sm:col-span-3 sm:col-start-4 sm:row-start-1 lg:absolute lg:top-[212px] lg:left-[33px] lg:w-[306px]" />

        <nav aria-label="Footer" className="contents">
          {columns.map(({ heading, links }, i) => (
            <LinkNote
              key={heading}
              heading={heading}
              links={links}
              {...LINK_NOTES[i % LINK_NOTES.length]}
              delay={0.2 + i * 0.08}
              wide={i === 2}
              className={cn(
                "sm:col-span-2 lg:absolute lg:w-[182px]",
                i === 0 && "lg:top-[216px] lg:left-[361px]",
                i === 1 && "lg:top-[212px] lg:left-[560px]",
                i === 2 && "max-sm:col-span-2 lg:top-[215px] lg:left-[751px]"
              )}
            />
          ))}
        </nav>

        {/* desktop: the note written out beside a hovered link */}
        <FooterHoverNote board={cork} />
      </div>
    </div>
  );
}

/** A soft shadow on the floor under someone's feet. */
/** The shadow a figure casts where it stands: tight under its shoes, so its feet sit on the floor. */
function FloorShadow({ className }: { className?: string }) {
  return (
    <>
      {/* the shadow pooled right under the shoes (darkest where they touch the floor) */}
      <span aria-hidden="true" className={cn("absolute h-[18px] rounded-[50%] bg-[radial-gradient(closest-side,rgba(55,36,16,0.7),rgba(55,36,16,0.35)_45%,rgba(55,36,16,0)_100%)]", className)} />
      {/* and a longer, fainter one cast across the floor away from the light (from the left) */}
      <span aria-hidden="true" className={cn("absolute h-[14px] rounded-[50%] bg-[radial-gradient(closest-side,rgba(55,36,16,0.28),rgba(55,36,16,0)_100%)] blur-[2px]", className, "ml-[14%] w-[150%]")} />
    </>
  );
}

/**
 * The site footer: the studio's pinboard (Figma 211:1226). A cork board in a
 * wooden frame on a paper wall, our logo, "Find us online", our numbers and
 * address and the link lists all pinned to it; two of the team stand either
 * side (on smaller screens, under it), a faint city behind them; the small
 * print on a dark strip at the foot.
 *
 *  - xl (1280+): the 1440 design to its coordinates, centred;
 *  - below: the board fills the width, the two stand on the floor under it.
 * Everything drops, rises or slides in as it scrolls into view.
 */
export function BoardFooter() {
  const ref = useScrollReveal();
  const { copyright, privacy } = footerContent;
  return (
    <footer ref={ref} className="relative isolate overflow-hidden">
      <div className="relative bg-[#dcc8a7] bg-[url(/images/website/footer/board/wall.webp)] bg-size-[320px] xl:h-[714px]">
        {/* the torn top edge of the paper wall */}
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[46px] bg-size-[720px_46px] bg-repeat-x" style={{ backgroundImage: `url(${ART}/torn-edge.svg)` }} />
        {/* the city, faint, on the floor line; and the floor */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-[56px] h-[110px] bg-size-[704px_110px] bg-bottom bg-repeat-x opacity-60 xl:bottom-[64px] xl:h-[150px] xl:bg-size-[960px_150px] xl:opacity-100" style={{ backgroundImage: `url(${ART}/skyline.svg)` }} />
        {/* the floor they stand on: a warm paper floor, its edge where it meets the city behind */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[56px] border-t border-[rgba(110,80,45,0.28)] bg-[linear-gradient(180deg,rgba(160,128,86,0.5),rgba(178,150,108,0.42)_45%,rgba(190,164,124,0.32))] xl:h-[64px]" />

        <div className="relative px-4 pt-[70px] sm:px-8 sm:pt-[80px] xl:static xl:p-0">
          <Board />
        </div>

        {/* the two of them: either side of the board (xl), else on the floor under it */}
        <div className="relative mx-auto h-[230px] max-w-[979px] sm:h-[270px] xl:static xl:h-auto xl:max-w-none">
          <div data-sr="slide-left" className="absolute bottom-[6px] left-[6%] h-[180px] sm:h-[220px] xl:bottom-[6px] xl:left-[max(8px,calc(50%-649.3px))] xl:h-[415.7px]">
            <FloorShadow className="-bottom-[5px] left-[54%] w-[105%] -translate-x-1/2" />
            <FooterPerson person={FOOTER_PEOPLE.lead} sizes="(min-width: 1280px) 125px, 75px" />
          </div>
          <div data-sr="slide-right" className="absolute right-[12%] bottom-[6px] h-[198px] sm:right-[10%] sm:h-[242px] xl:right-auto xl:bottom-[6px] xl:left-[min(calc(50%+473px),calc(100%-195px))] xl:h-[456.7px]">
            <FloorShadow className="-bottom-[5px] left-[53%] w-[100%] -translate-x-1/2" />
            <FooterPerson person={FOOTER_PEOPLE.producer} sizes="(min-width: 1280px) 141px, 80px" />
            {/* below xl the plant stands at his feet, as in the design */}
            <Image src={plant} alt="" sizes="40px" className="absolute bottom-0 left-[75.4%] h-[22.6%] w-auto xl:hidden" />
          </div>
          <div data-sr="rise" className="absolute bottom-[6px] max-xl:hidden xl:right-auto xl:bottom-[6px] xl:left-[min(calc(50%+617px),calc(100%-80px))] xl:h-[103.3px]">
            <FloorShadow className="-bottom-[5px] left-1/2 w-[90%] -translate-x-1/2" />
            <Image src={plant} alt="" sizes="72px" className="relative h-full w-auto" />
          </div>
        </div>
      </div>

      {/* the small print */}
      <div className="bg-[#2e2420]">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-2 px-5 py-4 text-center font-instrument text-[14px] leading-[19px] text-[#ebe2d8] sm:flex-row sm:justify-between sm:px-8 sm:text-left lg:px-[60px] xl:h-[51px] xl:px-[120px] xl:py-0 xl:text-[13.5px]">
          <p>{copyright}</p>
          <Link href="#" className="underline underline-offset-[3px] transition-colors hover:text-white">
            {privacy}
          </Link>
        </div>
      </div>
    </footer>
  );
}
