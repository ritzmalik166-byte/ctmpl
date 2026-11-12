"use client";

import type { FormEvent } from "react";
import { cn } from "@/lib/utils/cn";
import { bookingFields, startConversationCopy } from "../constants/startConversation.constants";
import { TORN_STUB } from "../animations/StartConversation.Booking";
import { PaperLoader } from "@/components/ui/PaperLoader";
import { CrumpleButton } from "@/components/ui/CrumpleButton";

export type BookingStatus = "idle" | "sending" | "taking" | "booked";

/** A sheet of paper on the clipboard (the form, its torn stub, the booked note). */
const paper = "absolute top-5 right-5 left-5 h-[471px] rounded-lg border border-[#e7e5e4] bg-white p-[32px] drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]";

/** What's on the paper once the room is booked. */
function BookedNote({ onAnother }: { onAnother: () => void }) {
  const { booked } = startConversationCopy;
  return (
    <div data-anim="booked" role="status" className={cn(paper, "invisible flex flex-col opacity-0")}>
      <span className="font-jakarta text-xs leading-4 font-bold tracking-[0.6px] text-[#44403c] uppercase">{booked.label}</span>
      <h3 className="mt-4 font-inter text-[26px] leading-[normal] font-extrabold text-[#1c1917] sm:text-[34px]">{booked.title}</h3>
      <p className="mt-4 max-w-[400px] font-inter text-base leading-6 text-[#44403c] sm:text-lg sm:leading-7">{booked.message}</p>
      <p className="mt-6 font-caveat text-[28px] leading-none text-[#78716c]">{booked.signature}</p>

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
        className="mt-auto h-[52px] w-full cursor-pointer overflow-clip rounded-lg bg-[linear-gradient(100deg,#d16a42_50%,#b95534_50.3%)] font-inter text-lg font-bold tracking-[-0.3px] whitespace-nowrap text-[#faf6ef] shadow-[0_3px_5px_rgba(131,80,49,0.12)] transition-[scale] duration-150 active:scale-[0.99] data-flipped:bg-paper-cream data-flipped:bg-none data-flipped:text-[#d16a42] data-flipped:shadow-[inset_0_0_0_1.5px_#d16a42]"
      >
        {booked.another}
      </CrumpleButton>
    </div>
  );
}

/**
 * The meeting request on its clipboard (Figma 75:326, 580.67 × 532): a
 * wooden board with a metal clip, the white form paper on it, four fields
 * (label above, underlined input) and the "Book The Room" button with its
 * folded corner.
 *  - sending: the fields and button are disabled, paper-craft loading in the button;
 *  - taking: the hand tears the paper off (see useBookingSequence), leaving a stub;
 *  - booked: a "room booked" note is clipped on, with a way to send another.
 * `sheetKey` gives a fresh form each time (a new sheet on the board).
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
      className={cn(
        "h-[532px] rounded-xl bg-[#c49b66] shadow-[0_16px_36px_-6px_rgba(45,35,25,0.18),0_4px_12px_-2px_rgba(45,35,25,0.08)] drop-shadow-[2px_5px_6px_rgba(50,40,30,0.15)]",
        className
      )}
    >
      {/* the request: a fresh sheet each time, and the stub left when it's torn off */}
      <div key={sheetKey}>
        <div aria-hidden="true" data-anim="stub" className={cn(paper, "invisible p-0 opacity-0")} style={{ clipPath: TORN_STUB }} />
        <div data-anim="sheet" className={cn(paper, "origin-top lg:origin-[21px_191px]")}>
          <h3 className="font-inter text-2xl leading-[normal] font-extrabold text-[#1c1917]">{startConversationCopy.formTitle}</h3>

          <form onSubmit={submit} noValidate className="mt-4">
            <fieldset disabled={busy} className="flex flex-col">
              {bookingFields.map(({ name, label, type, placeholder, autoComplete }) => (
                <label key={name} className="flex flex-col gap-1">
                  <span className="pt-2 font-jakarta text-xs leading-4 font-bold tracking-[0.6px] text-[#44403c] uppercase">{label}</span>
                  <input
                    name={name}
                    type={type}
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    className="h-[43px] w-full border-b border-[#d6d3d1] bg-white pt-[18px] pb-2.5 font-inter text-xs leading-[normal] text-[#1c1917] outline-none placeholder:text-[#999] focus:border-[#e05a47] disabled:text-[#78716c]"
                  />
                </label>
              ))}

              <div className="pt-4">
                {/* two-tone burnt orange like "View all projects"; paper crumple on hover (not while sending) */}
                <CrumpleButton
                  type="submit"
                  aria-busy={status === "sending"}
                  crumple={!busy}
                  chunkColors={["#d16a42", "var(--color-paper-cream)", "#b95534"]}
                  className="h-[60px] w-full cursor-pointer overflow-clip rounded-lg bg-[linear-gradient(100deg,#d16a42_50%,#b95534_50.3%)] px-4 py-[18px] font-inter text-base leading-[normal] font-bold tracking-[-0.4px] whitespace-nowrap text-[#faf6ef] shadow-[0_3px_5px_0_rgba(131,80,49,0.09)] transition-[scale] duration-150 active:scale-[0.99] disabled:cursor-wait disabled:brightness-95 disabled:active:scale-100 data-flipped:bg-paper-cream data-flipped:bg-none data-flipped:text-[#d16a42] data-flipped:shadow-[inset_0_0_0_1.5px_#d16a42] sm:px-[29px] sm:text-xl"
                >
                  {status === "sending" ? (
                    <>
                      <PaperLoader />
                      {startConversationCopy.sending}
                    </>
                  ) : (
                    startConversationCopy.submit
                  )}
                </CrumpleButton>
              </div>
            </fieldset>
          </form>
        </div>
      </div>

      <BookedNote onAnother={onAnother} />

      {/* the metal clip */}
      <span aria-hidden="true" className="absolute -top-[15px] left-[calc(50%+9.17px)] h-[35px] w-[115px] -translate-x-1/2 rounded-t-[4px] bg-[#d6d3d1] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]" />
    </div>
  );
}
