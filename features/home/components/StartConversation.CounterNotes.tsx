"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { startConversationCopy } from "../constants/startConversation.constants";

const { call, mail, visit } = startConversationCopy.cafe;
const mapQuery = encodeURIComponent(`Creative Thinks Media, Tower A2, Corporate Park, Sector 142, Noida`);

type Size = "counter" | "card" | "compact";

/** Sizes: on the counter in the scene they scale with it (cqw); otherwise ordinary cards (`compact`: the footer's, tighter). */
const text = {
  counter: { label: "text-[clamp(14px,1.5cqw,22px)]", body: "text-[clamp(11px,1.02cqw,15px)]", pad: "px-[1.4cqw] pt-[2cqw] pb-[1.2cqw]" },
  card: { label: "text-xl", body: "text-sm", pad: "px-5 pt-8 pb-4" },
  /** In the footer: the same, packed a little tighter. */
  compact: { label: "text-lg", body: "text-[13px]", pad: "px-4 pt-6 pb-3" },
};

/** A paper note pinned to the counter: pastel paper, a push pin at the top, a slight tilt; straightens and lifts on hover. */
function PinnedNote({ paper, tilt, pin, size, className, children, ...rest }: {
  paper: string;
  tilt: number;
  pin: string;
  size: Size;
  className?: string;
  children: ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={cn(
        "group relative flex flex-col gap-[0.4em] rounded-[3px] bg-(color:--paper) bg-[url(/images/website/home/who-we-are/paper-wall.jpg)] bg-size-[420px] bg-blend-multiply text-ink-soft shadow-[0_1px_1px_rgba(58,42,48,0.1),0_8px_14px_-6px_rgba(58,42,48,0.3)] transition-[rotate,translate,box-shadow] duration-300 ease-out rotate-(--tilt) hover:-translate-y-1.5 hover:rotate-0 hover:shadow-[0_2px_2px_rgba(58,42,48,0.1),0_14px_22px_-8px_rgba(58,42,48,0.36)] focus-within:-translate-y-1.5 focus-within:rotate-0",
        text[size].pad,
        className
      )}
      style={{ "--paper": paper, "--tilt": `${tilt}deg` } as CSSProperties}
    >
      <span
        aria-hidden="true"
        className="absolute top-[0.45em] left-1/2 -ml-[7px] size-3.5 rounded-full bg-(color:--pin) bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.55),transparent_45%)] shadow-[0_3px_4px_rgba(58,42,48,0.35)] transition-[translate] duration-300 group-hover:-translate-y-1"
        style={{ "--pin": pin } as CSSProperties}
      />
      {children}
    </div>
  );
}

/** The address note: hover it (or tap it) and a little map of the office opens above it. */
function VisitNote({ size }: { size: Size }) {
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(false); // the map loads the first time it's wanted, not with the page
  const show = (on: boolean) => {
    setOpen(on);
    if (on) setSeen(true);
  };
  return (
    <PinnedNote
      paper="#dce6d1"
      tilt={1.6}
      pin="#5b7a62"
      size={size}
      onMouseEnter={() => show(true)}
      onMouseLeave={() => show(false)}
      onFocus={() => show(true)}
      onBlur={() => show(false)}
      onClick={() => show(!open)}
    >
      <p className={cn("font-caveat leading-none font-bold text-[#b96245]", text[size].label)}>
        {visit.label} <span className="font-normal text-stone">· {visit.hint}</span>
      </p>
      <address className={cn("font-inter leading-snug font-semibold not-italic", text[size].body)}>{visit.address}</address>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cn("font-inter font-medium text-[#b96245] underline-offset-2 hover:underline", text[size].body)}
        onClick={(e) => e.stopPropagation()}
      >
        {visit.openMap} ↗
      </a>
      {/* the map, pinned up above the note */}
      <div
        className={cn(
          "pointer-events-none absolute bottom-[calc(100%+14px)] left-1/2 z-20 w-[min(320px,80vw)] -translate-x-1/2 origin-bottom overflow-hidden rounded-md border-4 border-white bg-white shadow-[0_14px_30px_-10px_rgba(40,30,20,0.45)] transition-[opacity,scale] duration-300 ease-out",
          open ? "pointer-events-auto scale-100 opacity-100" : "scale-90 opacity-0"
        )}
      >
        {seen && (
          <iframe
            title={visit.address}
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            className="block aspect-[16/10] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        )}
      </div>
    </PinnedNote>
  );
}

/**
 * The studio's numbers, email and address as three paper notes pinned to the
 * café counter (Call, Mail, Visit; hover Visit for a map). `size`: "counter"
 * when they're on the counter in the scene (lg up), "card" when they sit under
 * it (smaller screens).
 */
export function CounterNotes({ size, className }: { size: Size; className?: string }) {
  return (
    <div className={className}>
      <PinnedNote paper="#f3d6c9" tilt={-2.2} pin="#d9533f" size={size}>
        <p className={cn("font-caveat leading-none font-bold text-[#b96245]", text[size].label)}>{call.label}</p>
        {call.numbers.map(({ text: number, href }) => (
          <a key={href} href={href} className={cn("font-inter font-bold tracking-[0.02em] whitespace-nowrap hover:text-[#b96245]", text[size].body)}>
            {number}
          </a>
        ))}
      </PinnedNote>
      <PinnedNote paper="#f6e6c2" tilt={1.2} pin="#4f6d82" size={size}>
        <p className={cn("font-caveat leading-none font-bold text-[#b96245]", text[size].label)}>{mail.label}</p>
        <a href={`mailto:${mail.email}`} className={cn("font-inter font-bold break-all hover:text-[#b96245]", text[size].body)}>
          {mail.email}
        </a>
      </PinnedNote>
      <VisitNote size={size} />
    </div>
  );
}
