"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import gsap from "gsap";
import { footerContent } from "@/config/footer";
import officePhoto from "@/public/office/ctmpl-office.webp";

/** Only on desktops (lg+) with a mouse. */
const DESKTOP = "(min-width: 1024px) and (hover: hover)";
const WIDTH = 252;
/** The office note (the address link, `data-note="map::visit"`): wider, with the photo and the map, and it can be used. */
const MAP_WIDTH = 500;
/** The phone numbers' message slip (`call::<number>`) and the email's letter (`mail::email`). */
const CALL_WIDTH = 272;
const MAIL_WIDTH = 300;
const widthOf = (key: string) => (isMap(key) ? MAP_WIDTH : key.startsWith("call::") ? CALL_WIDTH : key.startsWith("mail::") ? MAIL_WIDTH : WIDTH);
/** How long (s) each letter takes to be written, and the gap before the next. */
const STROKE = 0.07;
const PACE = 0.014;

/** The tape and ink colour per column (the board's link-note colours). */
const INK: Record<string, string> = {
  social: "#1f57a5",
  Company: "#1f57a5",
  "What we make": "#f28a3a",
  "Read and listen": "#17733f",
};
const KICKER: Record<string, string> = {
  social: footerContent.findUs,
  map: footerContent.contact.visit.label,
};
const isMap = (key: string) => key.startsWith("map::");

type Anchor = { key: string; x: number; y: number; w: number; h: number };

/** The pencil, its point on the letter being written (moved there as the writing goes). */
function Pencil() {
  return (
    <svg data-pencil viewBox="0 0 40 40" className="invisible absolute -top-[29px] -left-[26px] z-10 size-[34px] opacity-0 drop-shadow-[1px_2px_1px_rgba(40,25,10,0.3)]">
      <g transform="rotate(-38 20 20)">
        <path d="M18.5 38 L16 31 L24 31 L21.5 38 Z" fill="#f1d3a1" />
        <path d="M19.4 38 L18.6 35.6 L21.4 35.6 L20.6 38 Z" fill="#2b2420" />
        <rect x="16" y="7" width="8" height="24" fill="#f4b733" />
        <rect x="18.6" y="7" width="2.8" height="24" fill="#f9cc5b" />
        <rect x="16" y="3.5" width="8" height="3.5" fill="#b9bcc0" />
        <rect x="16" y="0" width="8" height="3.5" rx="1.5" fill="#e98a9a" />
      </g>
    </svg>
  );
}

/** A quick squiggle under what's just been written (drawn once it's written). */
function Squiggle({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 100 8" preserveAspectRatio="none" className="absolute -bottom-[5px] left-0 h-[7px] w-full overflow-visible">
      <path data-squiggle d="M1 5 C 15 1, 25 8, 40 4 S 70 1, 99 4" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/**
 * The phone numbers: a pink "While you were out" message slip, the kind left on
 * a desk by the office phone, its little phone ringing in the corner: for you,
 * from the studio, the number (underlined), "Please call" and "Wants a brief"
 * ticked, and the message, all filled in by hand as it shows.
 */
function PhoneSlip({ number }: { number: string }) {
  const n = footerContent.contact.call.note;
  const label = "font-typewriter text-[9px] leading-none font-bold tracking-[0.12em] text-[#9b3a46] uppercase";
  const hand = "font-caveat text-[19px] leading-[22px] text-[#24335a]";
  return (
    <div className="relative bg-[#ffdbe0] px-[18px] pt-[16px] pb-[14px] shadow-[0_1px_1px_rgba(60,40,20,0.15),3px_14px_22px_-8px_rgba(60,40,20,0.45)]">
      {/* torn off the pad: a perforated top edge */}
      <span className="absolute inset-x-0 -top-[3px] h-[6px] bg-[radial-gradient(circle_at_4px_0,transparent_2.5px,#ffdbe0_3px)] bg-size-[8px_6px]" />
      {/* the tape */}
      <span className="absolute -top-[12px] left-1/2 h-[22px] w-[74px] -translate-x-1/2 rotate-2 bg-[rgba(236,220,182,0.85)] shadow-[0_1px_1px_rgba(90,60,20,0.12)]" />
      <div data-text className="relative">
        <div className="flex items-center gap-[10px]">
          {/* the office phone, ringing */}
          <svg data-ring viewBox="0 0 32 32" className="size-[30px] shrink-0 text-[#9b3a46]">
            <path d="M7 12c0-3 4-5 9-5s9 2 9 5l-3 1.5c-.6-1.6-1.8-2.5-6-2.5s-5.4.9-6 2.5Z" fill="currentColor" />
            <path d="M9.5 15h13l2.5 9a2 2 0 0 1-2 2.5H9a2 2 0 0 1-2-2.5Z" fill="currentColor" opacity="0.85" />
            <circle cx="16" cy="20" r="3" fill="#ffdbe0" />
            <path d="M4 7.5 6 9.5M28 7.5 26 9.5M16 2v2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <div>
            <p className="font-typewriter text-[12.5px] leading-[14px] font-bold tracking-[0.06em] text-[#9b3a46] uppercase">{n.heading}</p>
            <p className="mt-[3px] font-typewriter text-[9.5px] leading-none tracking-[0.1em] text-[#a8656d] italic">{n.sub}</p>
          </div>
        </div>
        <div className="mt-[10px] border-t border-dashed border-[#d99aa4]" />
        <dl className="mt-[8px] grid grid-cols-[52px_1fr] items-baseline gap-y-[3px]">
          <dt className={label}>For</dt>
          <dd className="border-b border-[#e8aab4]">
            <Written text={n.for} className={hand} />
          </dd>
          <dt className={label}>From</dt>
          <dd className="border-b border-[#e8aab4]">
            <Written text={n.from} className={hand} />
          </dd>
          <dt className={label}>Phone</dt>
          <dd className="border-b border-[#e8aab4]">
            <div data-title className="relative inline-block">
              <Written text={number} className="font-caveat text-[23px] leading-[26px] font-bold text-[#24335a]" />
              <Squiggle color="#c0392b" />
            </div>
          </dd>
        </dl>
        {/* the boxes: two of them ticked */}
        <ul className="mt-[11px] grid grid-cols-2 gap-x-[10px] gap-y-[6px]">
          {n.boxes.map((box, i) => (
            <li key={box} className="flex items-center gap-[6px] font-typewriter text-[9.5px] leading-none tracking-[0.04em] text-[#7d3a43] uppercase">
              <span className="relative size-[12px] shrink-0 border-[1.5px] border-[#9b3a46]">
                {(n.ticked as readonly number[]).includes(i) && (
                  <svg viewBox="0 0 16 16" className="absolute -top-[5px] -left-[2px] size-[18px] overflow-visible">
                    <path data-tick d="M2 9 L6.5 13.5 L15 1.5" fill="none" stroke="#24335a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              {box}
            </li>
          ))}
        </ul>
        <p className={`mt-[11px] ${label}`}>Message</p>
        <Written text={n.message} className={`mt-[2px] ${hand} bg-[repeating-linear-gradient(180deg,transparent_0_21px,#e8aab4_21px_22px)]`} />
        <p className="mt-[8px] text-right font-typewriter text-[9px] leading-none tracking-[0.08em] text-[#a8656d] uppercase">{n.takenBy}</p>
        <Pencil />
      </div>
    </div>
  );
}

/**
 * The email: an airmail envelope, its flap opening and a letter rising out of
 * it, written as it comes: "Write to us" (underlined), the address, a line, and
 * a sign-off; the envelope with its striped airmail edge, a CTM stamp and its
 * postmark.
 */
function MailLetter({ email }: { email: string }) {
  const n = footerContent.contact.mail.note;
  const stripes = "bg-[repeating-linear-gradient(-45deg,#c0392b_0_7px,#fffdf4_7px_12px,#1f57a5_12px_19px,#fffdf4_19px_24px)]";
  return (
    <div className="relative pt-[6px] drop-shadow-[2px_12px_14px_rgba(60,40,20,0.35)]">
      {/* the envelope's back, and its flap standing open behind the letter */}
      <div className="absolute inset-x-0 bottom-0 h-[96px] bg-[#e8d9b8]">
        <span data-flap className="absolute inset-x-0 bottom-full h-[62px] origin-bottom bg-[#e2cfa6] [clip-path:polygon(0_100%,50%_0,100%_100%)]" />
      </div>
      {/* the letter, in a window that ends at the envelope's bottom edge: it can only ever be seen coming out of
          the envelope (the window reaches up past it, for the pencil) */}
      <div className="relative -mt-[44px] overflow-hidden pt-[44px] pb-[38px]">
        <div data-slide className="relative mx-[16px] bg-[#fffdf4] px-[18px] pt-[16px] pb-[86px] shadow-[0_1px_3px_rgba(60,40,20,0.2)]">
          <span className="absolute inset-0 bg-[repeating-linear-gradient(180deg,transparent_0_23px,rgba(110,145,200,0.28)_23px_24px)] bg-position-[0_5px]" />
          <div data-text className="relative">
            <p className="font-typewriter text-[9.5px] leading-none font-bold tracking-[0.14em] text-[#8a7a68] uppercase">{footerContent.contact.mail.label}</p>
            <div data-title className="relative mt-[7px] inline-block">
              <Written text={n.title} className="font-caveat text-[27px] leading-[27px] font-bold" />
              <Squiggle color="#c0392b" />
            </div>
            <Written text={email} className="mt-[9px] font-caveat text-[20px] leading-[24px] font-bold text-[#1f57a5]" />
            <Written text={n.message} className="font-caveat text-[19px] leading-[24px] text-[#24335a]" />
            <Written text={`~ ${n.sign}`} className="text-right font-caveat text-[19px] leading-[24px] text-[#24335a]" />
            <Pencil />
          </div>
        </div>
      </div>
      {/* the envelope's front: its pocket, the airmail stripes, the stamp and its postmark */}
      <div className="absolute inset-x-0 bottom-0 h-[96px]">
        <div className={`absolute inset-0 ${stripes} [clip-path:polygon(0_0,50%_58%,100%_0,100%_100%,0_100%)]`} />
        <div className="absolute inset-[6px] bg-[#f6ebd2] [clip-path:polygon(0_0,50%_57%,100%_0,100%_100%,0_100%)]" />
        <p className="absolute bottom-[14px] left-[16px] font-typewriter text-[9.5px] leading-none font-bold tracking-[0.14em] text-[#1f57a5] uppercase">{n.airmail}</p>
        <div
          data-stamp
          className="absolute right-[18px] bottom-[14px] grid h-[44px] w-[38px] grid-cols-2 gap-[2px] border-[3px] border-dotted border-[#f6ebd2] bg-white p-[4px] outline outline-1 outline-[#d8c7a2]"
        >
          <span className="bg-[#1f57a5]" />
          <span className="bg-[#f28a3a]" />
          <span className="bg-[#f4c232]" />
          <span className="bg-[#17733f]" />
        </div>
        {/* the postmark, over the stamp */}
        <svg data-postmark viewBox="0 0 70 40" className="absolute right-[36px] bottom-[12px] h-[40px] w-[70px] text-[rgba(60,60,80,0.55)]">
          <circle cx="50" cy="20" r="15" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="50" cy="20" r="11" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <text x="50" y="23" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="currentColor">
            NOIDA
          </text>
          <path d="M2 12q4-4 8 0t8 0 8 0 8 0M2 20q4-4 8 0t8 0 8 0 8 0M2 28q4-4 8 0t8 0 8 0 8 0" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </div>
    </div>
  );
}

/** Text split into letters (each one written in turn), the words kept whole so lines break between them. */
function Written({ text, className }: { text: string; className: string }) {
  const words = text.split(" ");
  return (
    <p className={className}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="inline-block whitespace-nowrap">
            {[...word].map((c, j) => (
              <span key={j} data-ch className="inline-block">
                {c}
              </span>
            ))}
          </span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </p>
  );
}

/**
 * Desktop (lg+): hover (or tab to) a link on the board ("Find us online",
 * Company, What we make, Read and listen) and a lined note is pinned up beside
 * it, a strip of tape across its top, and a pencil writes out what's behind
 * the link, letter by letter: its name, underlined with a quick squiggle, then
 * a line about it. Moving to another link slides the note over and writes the
 * new one; moving off the links takes it down. It never takes the pointer
 * (links under it stay hoverable). Links are marked `data-note="column::label"`
 * (see footerContent.hoverNotes); `board` is the cork they're pinned to.
 */
export function FooterHoverNote({ board }: { board: RefObject<HTMLDivElement | null> }) {
  const paper = useRef<HTMLDivElement>(null);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const shown = useRef(false);
  const writing = useRef<gsap.core.Timeline | null>(null);
  const tilt = useRef(-1.5);
  // what the note shows: the hovered link's, kept while it's taken down; and the map, once it's been asked for
  const [key, setKey] = useState("");
  const [mapAsked, setMapAsked] = useState(false);
  if (anchor && anchor.key !== key) setKey(anchor.key);
  if (anchor && isMap(anchor.key) && !mapAsked) setMapAsked(true);
  const current = useRef("");

  // which link is hovered or focused (a short grace period going between links, so the note stays up)
  useEffect(() => {
    const el = board.current;
    if (!el) return;
    const mq = window.matchMedia(DESKTOP);
    let timer = 0;
    const linkOf = (t: EventTarget | null) => {
      const link = t instanceof Element ? t.closest<HTMLElement>("[data-note]") : null;
      return link && el.contains(link) ? link : null;
    };
    const show = (t: EventTarget | null) => {
      const link = linkOf(t);
      if (!link || !mq.matches) return;
      window.clearTimeout(timer);
      const b = el.getBoundingClientRect();
      const r = link.getBoundingClientRect();
      const key = link.dataset.note!;
      setAnchor((a) =>
        a?.key === key
          ? a
          : {
              key,
              x: r.left - b.left,
              y: r.top - b.top,
              w: r.width,
              h: r.height,
            },
      );
    };
    // (the office note stays up while the pointer's on it, so its map can be used)
    const onNote = (t: EventTarget | null) => isMap(current.current) && t instanceof Node && !!paper.current?.contains(t);
    const hide = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setAnchor(null), 180);
    };
    const over = (e: PointerEvent) => {
      if (linkOf(e.target)) show(e.target);
      else if (onNote(e.target)) window.clearTimeout(timer);
      else if (current.current) hide();
    };
    const focusIn = (e: FocusEvent) => show(e.target);
    const focusOut = (e: FocusEvent) => void (!linkOf(e.relatedTarget) && hide());
    document.addEventListener("pointerover", over);
    el.addEventListener("focusin", focusIn);
    el.addEventListener("focusout", focusOut);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("pointerover", over);
      el.removeEventListener("focusin", focusIn);
      el.removeEventListener("focusout", focusOut);
    };
  }, [board]);

  // pin it up (or slide it over) and write it out; or take it down
  useLayoutEffect(() => {
    const note = paper.current;
    const el = board.current;
    if (!note || !el) return;
    writing.current?.kill();
    current.current = anchor?.key ?? "";
    if (!anchor) {
      if (shown.current)
        gsap.to(note, {
          autoAlpha: 0,
          y: "+=10",
          rotation: tilt.current + 4,
          scale: 0.94,
          duration: 0.22,
          ease: "power2.in",
          overwrite: "auto",
        });
      shown.current = false;
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.set(note.querySelectorAll("[data-squiggle], [data-tick]"), {
      strokeDasharray: "none",
      strokeDashoffset: 0,
    });
    // where: above the link (centred on it, kept over the board), or below it when there's no room above
    const h = note.offsetHeight;
    const width = widthOf(anchor.key);
    const x = gsap.utils.clamp(-28, el.clientWidth - width + 28, anchor.x + anchor.w / 2 - width / 2);
    let y = anchor.y - h - 14;
    if (y < -70) y = anchor.y + anchor.h + 12;
    tilt.current = tilt.current < 0 ? gsap.utils.random(0.8, 2.2) : gsap.utils.random(-2.2, -0.8);
    if (!shown.current || reduced) {
      gsap.set(note, {
        x,
        y: y + 14,
        rotation: tilt.current - 7,
        scale: 0.86,
        autoAlpha: 0,
        transformOrigin: "50% 0%",
      });
      gsap.to(note, {
        y,
        rotation: tilt.current,
        scale: 1,
        autoAlpha: 1,
        duration: reduced ? 0.01 : 0.5,
        ease: "back.out(1.7)",
        overwrite: "auto",
      });
    } else {
      gsap.to(note, {
        x,
        y,
        rotation: tilt.current,
        duration: 0.42,
        ease: "power3.out",
        overwrite: "auto",
      });
    }
    shown.current = true;

    // the writing: each letter drawn in from its left, the pencil following the pen point
    const letters = gsap.utils.toArray<HTMLElement>("[data-ch]", note);
    const pencil = note.querySelector<HTMLElement>("[data-pencil]");
    const squiggle = note.querySelector<SVGPathElement>("[data-squiggle]");
    const titleLetters = new Set(note.querySelectorAll("[data-title] [data-ch]"));
    let lastTitle = -1;
    letters.forEach((ch, i) => titleLetters.has(ch) && (lastTitle = i));
    if (reduced) {
      gsap.set(letters, { clipPath: "none" });
      return;
    }
    gsap.set(letters, { clipPath: "inset(-30% 100% -30% -30%)" });
    if (squiggle) gsap.set(squiggle, { strokeDasharray: 200, strokeDashoffset: 200 });
    const tl = (writing.current = gsap.timeline({ delay: 0.12 }));
    const text = note.querySelector<HTMLElement>("[data-text]")!;
    const within = (node: HTMLElement) => {
      let x = 0;
      let y = 0;
      for (let n: HTMLElement | null = node; n && n !== text; n = n.offsetParent as HTMLElement | null) {
        x += n.offsetLeft;
        y += n.offsetTop;
      }
      return { x, y };
    };
    // the letter: the envelope's flap opens and the letter rises out of it before it's written
    const flap = note.querySelector("[data-flap]");
    const slide = note.querySelector("[data-slide]");
    const ring = note.querySelector("[data-ring]");
    let t = 0;
    if (flap) tl.fromTo(flap, { scaleY: 0 }, { scaleY: 1, duration: 0.3, ease: "power2.out" }, 0);
    if (slide) {
      tl.fromTo(slide, { y: (slide as HTMLElement).offsetHeight - 40 }, { y: 0, duration: 0.75, ease: "power3.out" }, 0.18);
      tl.fromTo(
        note.querySelectorAll("[data-stamp], [data-postmark]"),
        { scale: 1.6, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.22,
          ease: "power4.in",
          stagger: 0.12,
        },
        0.1,
      );
      t = 0.7;
    }
    // the slip: its phone rings
    if (ring)
      tl.fromTo(
        ring,
        { rotation: -14 },
        {
          rotation: 14,
          duration: 0.06,
          ease: "sine.inOut",
          yoyo: true,
          repeat: 9,
          transformOrigin: "50% 80%",
        },
        0,
      ).to(ring, { rotation: 0, duration: 0.1 });
    letters.forEach((ch, i) => {
      const at = within(ch);
      tl.to(
        ch,
        {
          clipPath: "inset(-30% -30% -30% -30%)",
          duration: STROKE,
          ease: "none",
        },
        t,
      );
      if (pencil) tl.set(pencil, { x: at.x + ch.offsetWidth, y: at.y + ch.offsetHeight * 0.55 }, t);
      t += titleLetters.has(ch) ? PACE * 1.6 : PACE;
      if (i === lastTitle) {
        // under the name (or the number), a quick squiggle; a breath; then on
        if (squiggle) tl.to(squiggle, { strokeDashoffset: 0, duration: 0.3, ease: "power1.inOut" }, t);
        t += 0.32;
      }
    });
    // the slip's boxes, ticked once it's filled in
    const ticks = note.querySelectorAll<SVGPathElement>("[data-tick]");
    if (ticks.length)
      tl.fromTo(
        ticks,
        { strokeDasharray: 30, strokeDashoffset: 30 },
        {
          strokeDashoffset: 0,
          duration: 0.18,
          ease: "power1.in",
          stagger: 0.22,
        },
        t + 0.05,
      );
    // the office note: its photo and map are put up as the writing starts
    const pops = note.querySelectorAll("[data-pop]");
    if (pops.length)
      tl.fromTo(
        pops,
        { autoAlpha: 0, y: 14, rotation: (i) => (i ? 5 : -7), scale: 0.88 },
        {
          autoAlpha: 1,
          y: 0,
          rotation: 0,
          scale: 1,
          duration: 0.55,
          ease: "back.out(1.5)",
          stagger: 0.14,
        },
        0.05,
      );
    if (pencil) {
      tl.fromTo(pencil, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 }, 0);
      tl.to(
        pencil,
        {
          autoAlpha: 0,
          x: "+=14",
          y: "-=10",
          rotation: 18,
          duration: 0.35,
          ease: "power2.out",
        },
        t + 0.1,
      );
      tl.set(pencil, { rotation: 0 });
    }
  }, [anchor, board]);

  const [column, label] = key ? key.split("::") : ["", ""];
  const line = footerContent.hoverNotes[column]?.[label] ?? "";
  const ink = INK[column] ?? "#1f57a5";
  const map = isMap(key);
  const { visit } = footerContent.contact;
  const title = map ? visit.noteTitle : label === "X (Twitter)" ? "X" : label;

  return (
    <div ref={paper} aria-hidden="true" className="pointer-events-none invisible absolute top-0 left-0 z-40 opacity-0 max-lg:hidden" style={{ width: widthOf(key) }}>
      {column === "call" ? (
        <PhoneSlip key={key} number={label} />
      ) : column === "mail" ? (
        <MailLetter key={key} email={label} />
      ) : (
        <div key={key} className="relative bg-[#fffdf4] pt-[22px] pr-[18px] pb-[18px] pl-[38px] shadow-[0_1px_1px_rgba(60,40,20,0.15),3px_14px_22px_-8px_rgba(60,40,20,0.45)]">
          {/* the ruled lines and the red margin */}
          <span className="absolute inset-0 bg-[repeating-linear-gradient(180deg,transparent_0_23px,rgba(110,145,200,0.3)_23px_24px)] bg-position-[0_1px]" />
          <span className="absolute inset-y-0 left-[28px] w-px bg-[rgba(214,90,80,0.45)]" />
          {/* the tape holding it up, in the column's colour */}
          <span
            className="absolute -top-[11px] left-1/2 h-[22px] w-[78px] -translate-x-1/2 -rotate-3 opacity-80 mix-blend-multiply"
            style={{ background: `color-mix(in srgb, ${ink} 30%, #efe3c4)` }}
          />
          {/* a folded corner */}
          <span className="absolute right-0 bottom-0 size-[18px] bg-[linear-gradient(135deg,#efe6d0_50%,#e2d4b4_50%)] shadow-[-1px_-1px_2px_rgba(60,40,20,0.12)]" />

          <div data-text className="relative">
            <p className="font-typewriter text-[9.5px] leading-none font-bold tracking-[0.14em] text-[#8a7a68] uppercase">{KICKER[column] ?? column}</p>
            <div data-title className="relative mt-[7px] inline-block">
              <Written text={title} className="font-caveat text-[27px] leading-[27px] font-bold" />
              <Squiggle color={ink} />
            </div>
            <Written text={line} className="mt-[9px] font-caveat text-[19.5px] leading-[24px] text-[#24335a]" />
            {map && (
              // the office: a photo of the floor, taped on, and the map (it can be dragged and zoomed)
              <div className="pointer-events-auto mt-[14px] flex items-start gap-[14px]">
                <figure data-pop className="relative w-[205px] shrink-0 -rotate-2 bg-white p-[7px] pb-[26px] shadow-[0_2px_6px_rgba(60,40,20,0.3)]">
                  <span className="absolute -top-[9px] left-1/2 z-10 h-[18px] w-[64px] -translate-x-1/2 rotate-2 bg-[rgba(232,214,170,0.85)]" />
                  <Image src={officePhoto} alt="" sizes="205px" className="block aspect-[4/3] h-auto w-full object-cover" />
                  <figcaption className="absolute inset-x-0 bottom-[5px] text-center font-caveat text-[16px] leading-none text-[#4a3c30]">{visit.photoCaption}</figcaption>
                </figure>
                <div data-pop className="relative h-[178px] flex-1 rotate-1 bg-white p-[5px] shadow-[0_2px_6px_rgba(60,40,20,0.3)]">
                  <span className="absolute inset-[5px] animate-pulse bg-[#ece4d2]" />
                  {mapAsked && (
                    <iframe src={visit.mapEmbed} title={visit.mapTitle} tabIndex={-1} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" className="relative block size-full border-0" />
                  )}
                </div>
              </div>
            )}
            <Pencil />
          </div>
        </div>
      )}
    </div>
  );
}
