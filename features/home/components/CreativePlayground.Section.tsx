import Image from "next/image";
import SectionLabel from "@/components/website/shared/SectionLabel";
import { creativePlaygroundCopy } from "../constants/creativePlayground.constants";
import { FilingRoom } from "./CreativePlayground.FilingRoom";
import paperWall from "@/public/images/website/home/who-we-are/paper-wall.jpg";
import filingRoom from "@/public/images/website/home/creative-playground/filing-room.png";

/**
 * "Our creative playground": the filing room. Finished campaigns live in the
 * cabinet's drawers; pull one out (or pick a client below) and Neha puts its
 * case file on the desk and stamps it.
 *
 * Desktop layout (1440 frame, 1418 tall), built to the Figma coordinates
 * (node 75:1109); responsive layouts come after the animation pass.
 */
function CreativePlaygroundSection() {
  return (
    <section id="creative-playground" className="relative isolate h-[1418px] overflow-hidden">
      {/* paper wall, washed warm */}
      <Image src={paperWall} alt="" fill sizes="100vw" className="-z-10 object-cover object-top" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[rgba(235,211,191,0.55)]" />

      {/* the 1440 frame, centred */}
      <div className="absolute inset-y-0 left-1/2 w-[1440px] -translate-x-1/2">
        {/* heading + intro */}
        <div className="absolute top-16 left-[calc(50%-0.5px)] flex w-[1237px] -translate-x-1/2 items-center gap-[49px]">
          <div className="flex w-[613px] shrink-0 flex-col gap-4">
            <SectionLabel>{creativePlaygroundCopy.label}</SectionLabel>
            <h2 className="text-5xl leading-[normal] font-bold text-ink-soft">{creativePlaygroundCopy.heading}</h2>
          </div>
          <div className="flex shrink-0 items-center justify-center pt-[100px]">
            <p className="w-[575px] font-inter text-2xl leading-10 tracking-[-0.3px] text-stone">{creativePlaygroundCopy.intro}</p>
          </div>
        </div>

        {/* the filing room */}
        <div className="pointer-events-none absolute top-[339px] left-0 h-[844px] w-[1440px]">
          <Image src={filingRoom} alt="" fill sizes="1440px" className="object-cover" />
        </div>

        {/* cabinet, case file, Neha and the client selector */}
        <FilingRoom />
      </div>
    </section>
  );
}

export default CreativePlaygroundSection;
