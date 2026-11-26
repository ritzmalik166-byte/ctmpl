"use client";

import { createContext, useContext, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { navigationCopy } from "@/config/navigation";
import { CrumpleButton } from "@/components/ui/CrumpleButton";
import { cn } from "@/lib/utils/cn";

/** How long sending takes (s; stands in for the real request for now). */
const SENDING_SECONDS = 1.6;

type Status = "idle" | "sending" | "sent";
const PadStatus = createContext<Status>("idle");

/**
 * "Letters to the editor": the spiral letter pad in the menu is the quick
 * contact form (name, email, phone, message). Sending takes a moment, then a
 * SENT! stamp lands on the pad with a thank-you. Nothing is sent anywhere yet.
 */
export function LetterPad({ className, style, children }: { className?: string; style?: CSSProperties; children: ReactNode }) {
  const [status, setStatus] = useState<Status>("idle");
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status !== "idle") return;
    setStatus("sending");
    await new Promise((done) => setTimeout(done, SENDING_SECONDS * 1000)); // TODO: send the letter here
    setStatus("sent");
  };
  return (
    <PadStatus.Provider value={status}>
      <form onSubmit={submit} noValidate aria-label={navigationCopy.formTitle} className={className} style={style}>
        <fieldset disabled={status !== "idle"} className="contents">
          {children}
        </fieldset>
        {status === "sent" && (
          <div role="status" className="absolute inset-x-[18px] top-[96px] bottom-[18px] flex animate-[service-in_0.45s_ease-out] flex-col items-center justify-center gap-3 bg-[#fffdf6] text-center">
            <span className="-rotate-6 rounded-sm border-[3px] border-[#d16a42] px-3 py-1 font-typewriter text-[22px] leading-none font-bold tracking-[0.2em] text-[#d16a42] uppercase">Sent!</span>
            <p className="font-instrument text-[20px] leading-tight font-bold text-[#2b2825]">{navigationCopy.sent.title}</p>
            <p className="max-w-[220px] font-caveat text-[20px] leading-[1.15] font-bold text-[#3b3a6b]">{navigationCopy.sent.text}</p>
          </div>
        )}
      </form>
    </PadStatus.Provider>
  );
}

/** A line on the pad you write on: the placeholder in pencil-grey hand, what you write in ink. */
export function PadField({ name, placeholder, multiline, style }: { name: string; placeholder: string; multiline: boolean; style: CSSProperties }) {
  const field =
    "absolute left-[2px] w-[calc(100%-2px)] resize-none bg-transparent text-[#2b2825] outline-none placeholder:text-(--ph) focus:placeholder:opacity-60";
  const { color, ...type } = style;
  const vars = { ...type, "--ph": color } as CSSProperties;
  const kind = name === "email" ? "email" : name === "phone" ? "tel" : "text";
  const autoComplete = name === "email" ? "email" : name === "phone" ? "tel" : name === "name" ? "name" : undefined;
  return multiline ? (
    <textarea name={name} aria-label={name} placeholder={placeholder} rows={3} className={`${field} top-[1.6px] h-[92px] leading-[30px]`} style={vars} />
  ) : (
    <input name={name} aria-label={name} type={kind} autoComplete={autoComplete} placeholder={placeholder} className={`${field} top-[4px] h-[26px] leading-[25.2px]`} style={vars} />
  );
}

/**
 * "Send it in": the pad's button, with the paper crumple hover of the site's
 * other buttons (as on the meeting request form's): crushed, it flips to cream
 * with an orange edge and dark text, shedding paper bits; it pulses while
 * sending. (Its Figma look comes in inline styles, so the flipped look overrides
 * them with !important.)
 */
export function PadSubmit({ className, style, children }: { className?: string; style?: CSSProperties; children: ReactNode }) {
  const status = useContext(PadStatus);
  return (
    <CrumpleButton
      type="submit"
      aria-busy={status === "sending"}
      crumple={status === "idle"}
      chunkColors={["#d16a42", "var(--color-paper-cream)", "#b95534"]}
      className={cn(
        className,
        "cursor-pointer overflow-clip p-0 transition-[scale,translate] duration-200 hover:-translate-y-0.5 active:scale-[0.99] disabled:cursor-wait",
        "data-flipped:bg-paper-cream! data-flipped:bg-none! data-flipped:shadow-[inset_0_0_0_1.5px_#d16a42]! data-flipped:[&_p]:text-ink-soft! data-flipped:[&_path]:fill-[#d16a42]",
        // (its label and plane are placed from the button's top left: the wrapper round them fills the button)
        "[&>span:last-child]:absolute [&>span:last-child]:inset-0 [&>span:last-child]:block",
        status === "sending" && "animate-pulse"
      )}
      style={style}
    >
      {children}
    </CrumpleButton>
  );
}
