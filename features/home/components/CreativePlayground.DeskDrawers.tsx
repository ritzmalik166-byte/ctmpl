"use client";

import { cn } from "@/lib/utils/cn";
import { cabinetTabs, DESK_CASES, playgroundCases } from "../constants/creativePlayground.constants";

/**
 * The three drawers in the front of the desk, over the three panels painted in
 * the room picture (px of the 1440 frame): x of each panel and its width, and
 * the front's top and height.
 */
const DESK = { top: 953, height: 124 } as const;
const PANELS = [
  { left: 553, width: 205 },
  { left: 763, width: 205 },
  { left: 973, width: 207 },
] as const;

type DeskDrawersProps = {
  /** The case on the desk; if it's one of the desk's, its drawer is pulled out. */
  active: number;
  onOpen: (index: number) => void;
};

/**
 * The desk's three drawers: paper drawer fronts in the desk's tan, each with a
 * cream label holder naming its client and a pull. Press one and it slides out
 * towards us (a little larger and lower, casting a shadow, its coloured file
 * tabs showing inside), and that client's file goes on the desk. They hold
 * their own files (5–7), apart from the cabinet's: opening one leaves the
 * cabinet shut, and picking any other file pushes it shut again.
 */
export function DeskDrawers({ active, onOpen }: DeskDrawersProps) {
  return (
    <>
      {PANELS.map(({ left, width }, i) => {
        const index = DESK_CASES[i];
        const { file } = playgroundCases[index];
        const open = index === active;
        return (
          <button
            key={left}
            type="button"
            aria-pressed={open}
            aria-label={`Open the ${file.client} case file`}
            onClick={() => onOpen(index)}
            className="group pointer-events-auto absolute cursor-pointer outline-none"
            style={{ left, top: DESK.top, width, height: DESK.height, zIndex: open ? 2 : 1 }}
          >
            {/* the drawer: pulled out it comes towards us, a little larger and lower */}
            <span
              className={cn(
                "absolute inset-[7px] block origin-bottom transition-[translate,scale] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                open ? "translate-y-[10px] scale-[1.07]" : "group-hover:translate-y-[2px] group-hover:scale-[1.015]"
              )}
            >
              {/* inside the drawer: its dark box and the coloured file tabs, seen above the front once it's out */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-x-[4px] top-0 block h-[22px] overflow-hidden rounded-t-[2px] bg-[#8a6a43] transition-[translate,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  open ? "-translate-y-[20px] opacity-100" : "translate-y-0 opacity-0"
                )}
              >
                {cabinetTabs.slice(0, 3).map(({ color }, t) => (
                  <span
                    key={color}
                    className={cn("absolute bottom-0 block h-[15px] w-[26%] rounded-t-[3px] transition-[translate] delay-150 duration-500", open ? "translate-y-0" : "translate-y-full")}
                    style={{ left: `${8 + t * 30}%`, backgroundColor: color }}
                  />
                ))}
              </span>

              {/* the drawer front: tan paper, a slightly lighter face inside a fine edge */}
              <span
                className={cn(
                  "absolute inset-0 block rounded-[2px] bg-linear-to-b from-[#e6cda5] to-[#d9bb8f] shadow-[inset_0_0_0_1px_rgba(150,115,70,0.35),inset_0_2px_0_rgba(255,248,230,0.45)] transition-[box-shadow,filter] duration-500 group-hover:brightness-[1.03] group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-[#2c2826]",
                  open && "shadow-[inset_0_0_0_1px_rgba(150,115,70,0.35),inset_0_2px_0_rgba(255,248,230,0.45),0_16px_22px_-6px_rgba(70,50,25,0.45)]"
                )}
              >
                {/* label holder, naming the client */}
                <span className="absolute top-[18px] left-1/2 flex h-[34px] w-[62%] -translate-x-1/2 items-center justify-center border border-[#cdb58c] bg-[#f6efdc] shadow-[0_1px_2px_rgba(98,74,40,0.18)]">
                  <span className="truncate px-1.5 font-inter text-[11px] leading-none font-bold tracking-[0.08em] text-[#5b4520] uppercase">{file.client}</span>
                </span>
                {/* the pull */}
                <span className="absolute top-[66px] left-1/2 block h-[11px] w-[46%] -translate-x-1/2 rounded-[2px] bg-[#b38f5c] shadow-[inset_0_1px_0_rgba(255,240,210,0.5),0_2px_2px_rgba(90,65,35,0.3)]" />
                {/* the paper's folded lower edge */}
                <span className="absolute inset-x-[5px] bottom-[6px] block h-px bg-[rgba(150,115,70,0.35)]" />
              </span>
            </span>
          </button>
        );
      })}
    </>
  );
}
