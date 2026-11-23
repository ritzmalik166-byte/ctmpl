"use client";

import { cn } from "@/lib/utils/cn";

/**
 * A paper note pinned over the almirah's drawers: "Click a drawer to open its
 * case file", with an arrow bobbing down at them. Shown for a few seconds as
 * the almirah scrolls into view (see useAlmirahHint); in px of the room's 1440 frame.
 */
export function AlmirahHint({ show, text }: { show: boolean; text: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-none absolute top-[408px] left-[150px] z-[4] w-[236px] origin-bottom transition-[opacity,translate,scale,rotate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        show ? "translate-y-0 scale-100 -rotate-2 opacity-100" : "translate-y-3 scale-90 rotate-1 opacity-0"
      )}
    >
      {show && <span className="sr-only">{text}</span>}
      {/* the note: cream paper, a strip of tape holding it up */}
      <div aria-hidden="true" className="relative rounded-[3px] bg-[#fbf4e2] px-5 pt-5 pb-4 shadow-[0_10px_18px_-6px_rgba(70,50,25,0.4),0_2px_4px_rgba(70,50,25,0.15)]">
        <span className="absolute -top-2.5 left-1/2 block h-5 w-16 -translate-x-1/2 rotate-[3deg] bg-[#e9d9b4]/80 shadow-[0_1px_2px_rgba(70,50,25,0.15)]" />
        {/* faint ruled lines, like a page torn from a notepad */}
        <span className="absolute inset-x-3 top-[44px] block h-px bg-[#e6d6b6]" />
        <span className="absolute inset-x-3 top-[72px] block h-px bg-[#e6d6b6]" />
        <p className="relative text-center font-caveat text-[25px] leading-[28px] font-bold text-[#5b4520]">{text}</p>
      </div>
      {/* the arrow, bobbing down at the drawers */}
      <svg
        aria-hidden="true"
        viewBox="0 0 40 46"
        className={cn("mx-auto mt-1.5 block h-[46px] w-10 text-[#b96245]", show && "animate-[almirah-hint-bob_0.9s_ease-in-out_infinite]")}
      >
        <path d="M20 3 C 18 14, 22 24, 20 36" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M10 27 L20 40 L30 27" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
