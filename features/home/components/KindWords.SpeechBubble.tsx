import Image from "next/image";
import type { Ref } from "react";
import { cn } from "@/lib/utils/cn";
import type { Testimonial } from "../constants/kindWords.constants";
import speechBubble from "@/public/images/website/home/kind-words/speech-bubble.svg";

export function SpeechBubble({ testimonial, className, ref }: { testimonial: Testimonial; className?: string; ref?: Ref<HTMLElement> }) {
  const { quote, name, role } = testimonial;
  return (
    <figure
      ref={ref}
      aria-live="polite"
      className={cn(
        "relative rounded-[24px] bg-[#faf7ef] px-5 pt-3 pb-5 opacity-0 shadow-[0_14px_24px_rgba(64,54,38,0.14)] sm:px-7 sm:pt-4 sm:pb-6",
        "xl:absolute xl:h-[252px] xl:w-[516px] xl:rounded-none xl:bg-transparent xl:p-0 xl:shadow-none",
        className
      )}
    >
      {/* desktop: the Figma bubble, its tail pointing down-left at Arjun (the svg includes its soft shadow) */}
      <Image src={speechBubble} alt="" width={580} height={291} unoptimized className="pointer-events-none absolute top-[-8px] left-[-44px] hidden max-w-none xl:block" />
      {/* smaller screens: the tail, pointing down at Arjun */}
      <span aria-hidden="true" className="absolute -bottom-2.5 left-[18%] size-6 rotate-45 rounded-br-[4px] bg-[#faf7ef] xl:hidden" />

      <div className="relative flex flex-col gap-2.5 font-inter xl:absolute xl:top-[50px] xl:left-[42px] xl:w-[432px]">
        <span aria-hidden="true" className="h-7 w-[26px] text-[52px] leading-[48px] font-medium text-[#b96245] xl:h-[35px] xl:text-[62px] xl:leading-[57px]">
          “
        </span>
        <blockquote className="text-sm leading-[1.45] text-[#3d3a35] sm:text-base xl:text-[15px]">{quote}</blockquote>
        <figcaption className="flex items-center gap-3 pt-2">
          <span aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#b96245] text-sm leading-[normal] font-bold tracking-[0.4px] text-[#faf7ef]">
            {name.charAt(0)}
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-1 leading-[normal]">
            <span className="text-sm font-semibold text-[#3d3a35] sm:text-[15px]">{name}</span>
            <span className="text-xs text-[#7b756b] sm:text-[13px]">{role}</span>
          </span>
        </figcaption>
      </div>
    </figure>
  );
}
