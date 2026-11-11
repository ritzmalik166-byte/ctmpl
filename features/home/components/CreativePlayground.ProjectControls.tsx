"use client";

import Image from "next/image";
import ButtonLink from "@/components/ui/ButtonLink";
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
};

const arrowClass = "size-9 shrink-0 cursor-pointer rounded-full sm:size-11 lg:size-[52px] xl:size-[65px]";

/**
 * Project selector under the filing room: round previous / next arrows round
 * the client names, and "View all projects" (used by the creative playground
 * and Kind Words).
 * Phones get an endless sliding strip of names (see ClientSlider); from md up
 * the names are one plain row. The arrows wrap round: after the last, the first.
 */
export function ProjectControls({ clients, active, onSelect, labels = creativePlaygroundCopy }: ProjectControlsProps) {
  const count = clients.length;
  const step = (by: number) => onSelect((active + by + count) % count);

  return (
    <div className="flex w-full flex-col items-center gap-5 md:w-auto md:gap-6 xl:flex-row xl:gap-7">
      <div className="flex w-full items-center gap-2 sm:gap-2.5 md:w-auto lg:gap-[15px] xl:h-[69px]">
        <button type="button" aria-label={labels.previous} onClick={() => step(-1)} className={arrowClass}>
          <Image src={arrowPrevious} alt="" width={65} height={65} className="size-full" />
        </button>

        {/* phones: the endless slider */}
        <div className="flex min-w-0 flex-1 md:hidden">
          <ClientSlider clients={clients} active={active} onSelect={onSelect} />
        </div>

        {/* md up: one plain row of names */}
        <div className="hidden gap-2 md:flex lg:gap-[15px]">
          {clients.map((client, i) => {
            const isActive = i === active;
            return (
              <button
                key={client}
                type="button"
                aria-pressed={isActive}
                onClick={() => onSelect(i)}
                className={cn(
                  "flex h-11 shrink-0 cursor-pointer items-center justify-center rounded-[5px] font-inter text-base leading-[normal] tracking-[-0.35px] whitespace-nowrap transition-colors duration-300 lg:h-[52px] lg:text-lg xl:h-[58px] xl:text-xl",
                  isActive
                    ? "bg-[#2c2826] px-3 font-bold text-[#faf6ef] lg:px-4 xl:px-[19.5px]"
                    : "border border-[#aa9986] px-2 font-medium text-[#2c2826] hover:bg-[#2c2826]/5 lg:px-2.5"
                )}
              >
                {client}
              </button>
            );
          })}
        </div>

        <button type="button" aria-label={labels.next} onClick={() => step(1)} className={arrowClass}>
          <Image src={arrowNext} alt="" width={65} height={65} className="size-full" />
        </button>
      </div>

      {/* paper crumple on hover, like the hero buttons */}
      <ButtonLink href="#" variant="folded" className="max-md:px-5 max-md:py-3 max-md:text-base md:max-xl:px-6 md:max-xl:py-3.5 md:max-xl:text-lg">
        {/* the button capitalises words; this label stays in sentence case */}
        <span className="normal-case">{labels.viewAll}</span>
      </ButtonLink>
    </div>
  );
}
