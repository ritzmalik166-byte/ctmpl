"use client";

import type { FormEvent } from "react";
import { cn } from "@/lib/utils/cn";
import { bookingFields, startConversationCopy } from "../constants/startConversation.constants";
import { TORN_STUB } from "../animations/StartConversation.Booking";
import { PaperLoader } from "@/components/ui/PaperLoader";
import { CrumpleButton } from "@/components/ui/CrumpleButton";
import { PadEnvelope, PadStamp } from "./StartConversation.PadEnvelope";

export type BookingStatus = "idle" | "sending" | "taking" | "booked";

/**
 * A sheet of the letter pad (the form, its torn stub, the booked note), styled
 * as the menu's "Letters to the editor" pad: cream paper with a red margin
 * line down its left, a soft shadow under it.
 */
const paper =
  "absolute top-5 right-5 left-5 h-[471px] bg-[#fffdf6] bg-[linear-gradient(90deg,transparent_22px,#e58a80_22px,#e58a80_23.5px,transparent_23.5px)] py-[30px] pr-[30px] pl-[42px] shadow-[0_8px_16px_rgba(64,41,20,0.25)]";

/** The pad's labels, in typewriter caps (as NAME, EMAIL... in the menu). */
const padLabel = "font-typewriter text-[10.5px] leading-[12px] font-bold tracking-[1.6px] text-[#67625e] uppercase";

/** The pad's button (as "Send it in" in the menu): a two-tone burnt-orange pill with a paper plane; crumples on hover. */
const padButton =
  "flex h-12 w-full cursor-pointer items-center justify-center gap-2 overflow-clip rounded-full bg-[linear-gradient(90deg,#d16a42_50%,#b95534_50%)] font-inter text-[15px] font-bold whitespace-nowrap text-white shadow-[0_6px_10px_rgba(64,41,20,0.25)] transition-[scale,translate] duration-200 hover:-translate-y-0.5 active:scale-[0.99] disabled:cursor-wait disabled:brightness-95 data-flipped:bg-paper-cream data-flipped:bg-none data-flipped:text-ink-soft data-flipped:shadow-[inset_0_0_0_1.5px_#d16a42]";

/** The paper plane on the button. */
function PlaneIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 18 18" className="size-[18px]">
      <path d="M16.5 1.5 8.25 9.75M16.5 1.5l-5.25 15-3-6.75-6.75-3 15-5.25Z" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** What's on the paper once the room is booked. */
function BookedNote({ onAnother }: { onAnother: () => void }) {
  const { booked } = startConversationCopy;
  return (
    <div data-anim="booked" role="status" className={cn(paper, "invisible flex flex-col opacity-0")}>
      <span className="font-typewriter text-[12px] leading-[14px] font-bold tracking-[2px] text-[#2b2825] uppercase">{booked.label}</span>
      <h3 className="mt-4 font-instrument text-[26px] leading-[1.1] font-bold text-[#2b2825] sm:text-[34px]">{booked.title}</h3>
      <p className="mt-4 max-w-[400px] font-serif-roman text-[19px] leading-[1.25] text-[#3d3026] sm:text-[21px]">{booked.message}</p>
      <p className="mt-6 font-caveat text-[28px] leading-none font-bold text-[#3b3a6b]">{booked.signature}</p>

      {/* the receptionist's stamp */}
      <span
        data-anim="stamp"
        aria-hidden="true"
        className="absolute right-6 bottom-[100px] rotate-[-9deg] rounded-md border-4 border-[#e05a47] px-4 py-1 font-inter text-xl sm:right-9 sm:bottom-[118px] sm:px-5 sm:py-1.5 sm:text-[28px] leading-none font-extrabold tracking-[4px] text-[#e05a47] uppercase opacity-90 mix-blend-multiply"
      >
        {booked.stamp}
      </span>

      {/* same two-tone fill and paper crumple on hover as "Book The Room" */}
      <CrumpleButton
        type="button"
        onClick={onAnother}
        chunkColors={["#d16a42", "var(--color-paper-cream)", "#b95534"]}
        className={cn(padButton, "mt-auto")}
      >
        {booked.another}
      </CrumpleButton>
    </div>
  );
}

/**
 * The meeting request on a spiral letter pad, styled as the menu's "Letters
 * to the editor" pad (580.67 × 532 here, where the clipboard was): wire rings
 * along its top, a red margin line, typewriter labels over handwritten
 * placeholders on blue rules, and a two-tone pill button with a paper plane.
 *  - sending: the fields and button are disabled, paper-craft loading in the button;
 *  - taking: the hand tears the paper off (see useBookingSequence), leaving a stub;
 *  - booked: a "room booked" note is clipped on, with a way to send another.
 * `sheetKey` gives a fresh form each time (a new sheet on the pad).
 */
export function BookingForm({
  status,
  sheetKey,
  onSubmit,
  onAnother,
  className,
}: {
  status: BookingStatus;
  sheetKey: number;
  onSubmit: () => void;
  onAnother: () => void;
  className?: string;
}) {
  const busy = status !== "idle";
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!busy) onSubmit();
  };

  return (
    <div
      data-sr="drop"
      className={cn("h-[532px]", className)}
    >
      {/* the airmail envelope tucked behind the pad's top right, as on the menu's letter pad */}
      <div aria-hidden="true" className="pointer-events-none absolute top-5 right-5 left-5 h-[471px]">
        <PadEnvelope />
      </div>

      {/* the request: a fresh sheet each time, and the stub left when it's torn off */}
      <div key={sheetKey}>
        <div aria-hidden="true" data-anim="stub" className={cn(paper, "invisible p-0 opacity-0")} style={{ clipPath: TORN_STUB }} />
        <div data-anim="sheet" className={cn(paper, "origin-top lg:origin-[21px_191px]")}>
          <h3 className="font-typewriter text-[12px] leading-[14px] font-bold tracking-[2px] text-[#2b2825] uppercase">{startConversationCopy.formTitle}</h3>

          <form onSubmit={submit} noValidate className="mt-3">
            <fieldset disabled={busy} className="flex flex-col">
              {bookingFields.map(({ name, label, type, placeholder, autoComplete }) => (
                <label key={name} className="flex flex-col pt-[14px]">
                  <span className={padLabel}>{label}</span>
                  <input
                    name={name}
                    type={type}
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    className="h-[38px] w-full border-b-[1.2px] border-[#8fb3d9] bg-transparent pt-[6px] pl-[2px] font-caveat text-[21px] leading-[26px] font-bold text-[#2b2825] outline-none placeholder:text-[#a39a90] focus:border-[#d16a42] disabled:text-[#78716c]"
                  />
                </label>
              ))}

              <div className="pt-[22px]">
                {/* two-tone burnt orange like "View all projects"; paper crumple on hover (not while sending) */}
                <CrumpleButton
                  type="submit"
                  aria-busy={status === "sending"}
                  crumple={!busy}
                  chunkColors={["#d16a42", "var(--color-paper-cream)", "#b95534"]}
                  className={padButton}
                >
                  {status === "sending" ? (
                    <>
                      <PaperLoader />
                      {startConversationCopy.sending}
                    </>
                  ) : (
                    <>
                      {startConversationCopy.submit}
                      <PlaneIcon />
                    </>
                  )}
                </CrumpleButton>
              </div>
            </fieldset>
          </form>
        </div>
      </div>

      <BookedNote onAnother={onAnother} />

      {/* the CTM postage stamp, stuck on over the pad's top right corner */}
      <div aria-hidden="true" className="pointer-events-none absolute top-5 right-5 left-5 h-[471px]">
        <PadStamp />
      </div>

      {/* the pad's wire rings along its top (each through a punched hole) */}
      <span aria-hidden="true" className="pointer-events-none absolute top-2 right-9 left-9 flex justify-between">
        {Array.from({ length: 16 }, (_, i) => (
          <span key={i} className="relative h-[26px] w-3">
            <span className="absolute bottom-0 left-0.5 size-2 rounded-full bg-[#c9a472]" />
            <span className="absolute top-0 left-[3px] h-5 w-1.5 rounded-[3px] border-2 border-[#6b6b6b]" />
          </span>
        ))}
      </span>
    </div>
  );
}
