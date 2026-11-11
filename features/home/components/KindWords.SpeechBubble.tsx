import Image from "next/image";
import type { Ref } from "react";
import { cn } from "@/lib/utils/cn";
import type { Testimonial } from "../constants/kindWords.constants";
import speechBubble from "@/public/images/website/home/kind-words/speech-bubble.svg";

/**
 * Arjun's paper speech bubble: a quote mark, the client's words, and who said
 * them (initial, name, role). Starts hidden: it grows out of Arjun's mouth
 * (see useTestimonialCycle).
 *  - xl: the Figma bubble (75:1098, 629 × 307, the svg with its tail and shadow);
 *  - smaller screens: the same paper bubble drawn in CSS, as wide as the screen
 *    allows and as tall as its text, its tail pointing down at Arjun.
 */
export function SpeechBubble({ testimonial, className, ref }: { testimonial: Testimonial; className?: string; ref?: Ref<HTMLElement> }) {
  const { quote, name, role } = testimonial;
  return (
    <figure
      ref={ref}
      aria-live="polite"
      className={cn(
        "relative rounded-[28px] bg-[#faf7ef] px-6 pt-4 pb-6 opacity-0 shadow-[0_14px_24px_rgba(64,54,38,0.14)] sm:px-9 sm:pt-6 sm:pb-8",
        "xl:absolute xl:h-[307px] xl:w-[629px] xl:rounded-none xl:bg-transparent xl:p-0 xl:shadow-none",
        className
      )}
    >
      {/* desktop: the Figma bubble, its tail pointing down-left at Arjun (the svg includes its soft shadow) */}
      <Image src={speechBubble} alt="" width={707} height={355} unoptimized className="pointer-events-none absolute top-[-10px] left-[-54px] hidden max-w-none xl:block" />
      {/* smaller screens: the tail, pointing down at Arjun */}
      <span aria-hidden="true" className="absolute -bottom-2.5 left-[18%] size-6 rotate-45 rounded-br-[4px] bg-[#faf7ef] xl:hidden" />

      <div className="relative flex flex-col gap-2.5 font-inter xl:absolute xl:top-[61px] xl:left-[51px] xl:w-[527px]">
        <span aria-hidden="true" className="h-9 w-[30px] text-[64px] leading-[60px] font-medium text-[#b96245] xl:h-[43px] xl:text-[76px] xl:leading-[70px]">
          “
        </span>
        <blockquote className="text-base leading-6 text-[#3d3a35] sm:text-lg">{quote}</blockquote>
        <figcaption className="flex items-center gap-4 pt-3.5">
          <span aria-hidden="true" className="flex size-[52px] shrink-0 items-center justify-center rounded-[28px] bg-[#b96245] text-sm leading-[normal] font-bold tracking-[0.4px] text-[#faf7ef]">
            {name.charAt(0)}
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-1.5 leading-[normal]">
            <span className="text-base font-semibold text-[#3d3a35]">{name}</span>
            <span className="text-sm text-[#7b756b]">{role}</span>
          </span>
        </figcaption>
      </div>
    </figure>
  );
}
