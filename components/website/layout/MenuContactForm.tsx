"use client";

import { useState, type FormEvent } from "react";
import { navigationCopy } from "@/config/navigation";
import { PaperLoader } from "@/components/ui/PaperLoader";
import { CrumpleButton } from "@/components/ui/CrumpleButton";

/** How long sending takes (s; stands in for the real request for now). */
const SENDING_SECONDS = 1.6;

const field =
  "w-full border-b border-[#cfc6b5] bg-transparent pt-1.5 pb-2 font-inter text-sm text-[#1c1917] outline-none placeholder:text-[#a39a8c] focus:border-[#e05a47] disabled:text-[#78716c]";
const label = "font-jakarta text-[11px] leading-4 font-bold tracking-[0.6px] text-[#44403c] uppercase";

/**
 * "Letters to the editor": the menu's quick contact form (name, email, phone,
 * message). Sending shows paper-craft loading, then a thank-you note. There's
 * no checking of the fields yet, and nothing is sent anywhere.
 */
export function MenuContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const { fields, sent } = navigationCopy;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status !== "idle") return;
    setStatus("sending");
    await new Promise((done) => setTimeout(done, SENDING_SECONDS * 1000)); // TODO: send the letter here
    setStatus("sent");
  };

  if (status === "sent") {
    return (
      <div role="status" className="flex flex-col items-start gap-2 border border-dashed border-[#cfc6b5] bg-[#fffdf8] p-5">
        <span className="rotate-[-4deg] rounded-sm border-2 border-[#e05a47] px-2 py-0.5 font-inter text-xs font-extrabold tracking-[3px] text-[#e05a47] uppercase">Sent!</span>
        <p className="font-inter text-lg font-bold text-[#1c1917]">{sent.title}</p>
        <p className="font-inter text-sm leading-6 text-[#57534e]">{sent.text}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-3">
      <fieldset disabled={status !== "idle"} className="contents">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {fields.map(({ name, label: text, type, autoComplete, placeholder }) => (
            <label key={name} className="flex flex-col">
              <span className={label}>{text}</span>
              <input name={name} type={type} autoComplete={autoComplete} placeholder={placeholder} className={field} />
            </label>
          ))}
        </div>
        <label className="flex flex-col">
          <span className={label}>{navigationCopy.messageLabel}</span>
          <textarea name="message" rows={3} placeholder={navigationCopy.messagePlaceholder} className={`${field} resize-none`} />
        </label>
        {/* paper crumple on hover, like the site's other buttons: two-tone burnt orange (as "View all projects") → paper cream */}
        <CrumpleButton
          type="submit"
          aria-busy={status === "sending"}
          chunkColors={["#d16a42", "var(--color-paper-cream)", "#b95534"]}
          className="mt-1 h-12 w-full cursor-pointer rounded-md bg-[linear-gradient(100deg,#d16a42_50%,#b95534_50.3%)] font-inter text-base font-bold tracking-[-0.3px] whitespace-nowrap text-[#faf6ef] shadow-[0_3px_5px_rgba(131,80,49,0.12)] transition-[scale] active:scale-[0.99] disabled:cursor-wait data-flipped:bg-paper-cream data-flipped:bg-none data-flipped:text-[#d16a42] data-flipped:shadow-[inset_0_0_0_1.5px_#d16a42]"
        >
          {status === "sending" ? (
            <>
              <PaperLoader />
              {navigationCopy.sending}
            </>
          ) : (
            navigationCopy.send
          )}
        </CrumpleButton>
      </fieldset>
    </form>
  );
}
