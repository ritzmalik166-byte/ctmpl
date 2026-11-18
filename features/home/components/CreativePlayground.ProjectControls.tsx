"use client";

import Image from "next/image";
import ButtonLink from "@/components/ui/ButtonLink";
import { CrumpleButton } from "@/components/ui/CrumpleButton";
import { cn } from "@/lib/utils/cn";
import { creativePlaygroundCopy } from "../constants/creativePlayground.constants";
import { ClientSlider } from "./CreativePlayground.ClientSlider";
import arrowPrevious from "@/public/images/website/home/creative-playground/arrow-previous.svg";
import arrowNext from "@/public/images/website/home/creative-playground/arrow-next.svg";

type ProjectControlsProps = {
  /** The client names, in order. */
  clients: string[];
  /** The chosen client (its button is dark). */
  active: number;
  onSelect: (index: number) => void;
  /** Button labels (default: the creative playground's). */
  labels?: { previous: string; next: string; viewAll: string };
  /** Give the arrows and client names the paper crumple hover of "View all projects". */
  crumple?: boolean;
};

/** Paper bits shed by the crumpling selector buttons: ink, cream and the outline's tan. */
const CHUNKS = ["#2c2826", "#faf6ef", "#aa9986"] as const;

/** The most client names that share one row from md up (more and they slide, as on phones). */
const MAX_ROW = 6;

const arrowClass = "size-9 shrink-0 cursor-pointer rounded-full sm:size-10 lg:size-11 xl:size-[50px]";

/**
 * Project selector under the filing room: round previous / next arrows round
 * the client names, and "View all projects" (used by the creative playground
 * and Kind Words, the same size in both).
 * Phones get an endless sliding strip of names (see ClientSlider); from md up
 * the names are one row sharing a fixed width equally (640 / 760, and 1000
 * with "View all projects" beside them from xl), so the selector is the same
 * size however many clients there are. The arrows wrap round: after the last,
 * the first.
 * With `crumple`, hovering an arrow or a name crumples it like "View all
 * projects": an outlined name turns dark at peak crush (the chosen one stays dark).
 */
export function ProjectControls({ clients, active, onSelect, labels = creativePlaygroundCopy, crumple = false }: ProjectControlsProps) {
  const count = clients.length;
  /** More names than fit one row (from 7): the sliding strip on every screen, not only phones. */
  const slide = count > MAX_ROW;
  const step = (by: number) => onSelect((active + by + count) % count);

  return (
    <div className="flex w-full flex-col items-center gap-5 md:w-[640px] md:gap-6 lg:w-[760px] xl:w-[1000px] xl:flex-row xl:gap-5">
      <div className="flex w-full min-w-0 items-center gap-2 sm:gap-2.5 lg:gap-3 xl:flex-1">
        <CrumpleButton type="button" aria-label={labels.previous} onClick={() => step(-1)} crumple={crumple} chunkColors={CHUNKS} className={cn(arrowClass, "[&>span:last-child]:size-full")}>
          <Image src={arrowPrevious} alt="" width={65} height={65} className="size-full" />
        </CrumpleButton>

        {/* phones (and any screen with too many names for a row): the endless slider */}
        <div className={cn("flex min-w-0 flex-1", !slide && "md:hidden")}>
          <ClientSlider clients={clients} active={active} onSelect={onSelect} crumple={crumple} />
        </div>

        {/* md up: one row of names, sharing the width equally */}
        <div className={cn("hidden min-w-0 flex-1 gap-2 lg:gap-3", !slide && "md:flex")}>
          {clients.map((client, i) => {
            const isActive = i === active;
            return (
              <CrumpleButton
                key={client}
                type="button"
                aria-pressed={isActive}
                onClick={() => onSelect(i)}
                crumple={crumple}
                chunkColors={CHUNKS}
                className={cn(
                  "flex h-10 min-w-0 flex-1 cursor-pointer items-center justify-center rounded-[5px] px-2 font-inter text-sm leading-[normal] tracking-[-0.35px] whitespace-nowrap transition-colors duration-300 lg:h-11 lg:text-base xl:h-[46px] xl:text-[17px]",
                  isActive
                    ? "bg-[#2c2826] font-bold text-[#faf6ef]"
                    : cn("border border-[#aa9986] font-medium text-[#2c2826]", !crumple && "hover:bg-[#2c2826]/5"),
                  // crumpled (hovered): an outlined name turns dark, so clicking it lands straight on the chosen look
                  !isActive && "data-flipped:border-[#2c2826] data-flipped:bg-[#2c2826] data-flipped:text-[#faf6ef]"
                )}
              >
                {client}
              </CrumpleButton>
            );
          })}
        </div>

        <CrumpleButton type="button" aria-label={labels.next} onClick={() => step(1)} crumple={crumple} chunkColors={CHUNKS} className={cn(arrowClass, "[&>span:last-child]:size-full")}>
          <Image src={arrowNext} alt="" width={65} height={65} className="size-full" />
        </CrumpleButton>
      </div>

      {/* paper crumple on hover, like the hero buttons */}
      <ButtonLink
        href="#"
        variant="folded"
        className="shrink-0"
      >
        {/* the button capitalises words; this label stays in sentence case */}
        <span className="normal-case">{labels.viewAll}</span>
      </ButtonLink>
    </div>
  );
}
