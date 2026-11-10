import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { creativePlaygroundCopy, playgroundCases } from "../constants/creativePlayground.constants";
import arrowPrevious from "@/public/images/website/home/creative-playground/arrow-previous.svg";
import arrowNext from "@/public/images/website/home/creative-playground/arrow-next.svg";
import foldedAccent from "@/public/images/website/home/creative-playground/folded-accent.svg";

type ProjectControlsProps = {
  /** The open case (its client button is dark). */
  active: number;
  onSelect: (index: number) => void;
};

/**
 * Project selector under the filing room: round previous / next arrows round
 * the client names, and "View all projects". Picking a client opens its drawer.
 */
export function ProjectControls({ active, onSelect }: ProjectControlsProps) {
  const count = playgroundCases.length;
  const step = (by: number) => onSelect((active + by + count) % count);

  return (
    <div className="flex items-center gap-7">
      <div className="flex h-[69px] items-center gap-[15px]">
        <button type="button" aria-label={creativePlaygroundCopy.previous} onClick={() => step(-1)} className="size-[65px] shrink-0 cursor-pointer rounded-full">
          <Image src={arrowPrevious} alt="" width={65} height={65} />
        </button>

        {playgroundCases.map(({ client }, i) => {
          const isActive = i === active;
          return (
            <button
              key={client}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelect(i)}
              className={cn(
                "flex h-[58px] shrink-0 cursor-pointer items-center justify-center rounded-[5px] font-inter text-xl leading-[normal] tracking-[-0.35px] whitespace-nowrap transition-colors duration-300",
                isActive ? "bg-[#2c2826] px-[19.5px] font-bold text-[#faf6ef]" : "border border-[#aa9986] px-2.5 font-medium text-[#2c2826] hover:bg-[#2c2826]/5"
              )}
            >
              {client}
            </button>
          );
        })}

        <button type="button" aria-label={creativePlaygroundCopy.next} onClick={() => step(1)} className="size-[65px] shrink-0 cursor-pointer rounded-full">
          <Image src={arrowNext} alt="" width={65} height={65} />
        </button>
      </div>

      <Link
        href="#"
        className="relative flex shrink-0 items-center justify-center overflow-clip rounded-[50px] bg-[#d16a42] px-[29px] py-[18px] shadow-[0_3px_5px_0_rgba(131,80,49,0.09)]"
      >
        <Image src={foldedAccent} alt="" width={119} height={69} className="absolute top-0 left-[107px]" />
        <span className="relative font-inter text-xl leading-[normal] font-bold tracking-[-0.4px] whitespace-nowrap text-[#faf6ef]">
          {creativePlaygroundCopy.viewAll}
        </span>
      </Link>
    </div>
  );
}
