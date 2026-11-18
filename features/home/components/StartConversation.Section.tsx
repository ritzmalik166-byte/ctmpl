"use client";

import Image from "next/image";
import SectionLabel from "@/components/website/shared/SectionLabel";
import { startConversationCopy } from "../constants/startConversation.constants";
import { MeetingRoom } from "./StartConversation.MeetingRoom";
import { Cafe } from "./StartConversation.Cafe";
import { useScrollReveal } from "@/lib/animations/scrollReveal";
import paperWall from "@/public/images/website/home/who-we-are/paper-wall.jpg";

/**
 * "Start a conversation": book the meeting room.
 *  - xl (1280+): the Figma layout (node 75:315) in a 1440 frame, centred:
 *    heading and intro side by side, the meeting room door beside the booking
 *    clipboard; then the café counter, full width;
 *  - lg (1024–1279): heading and intro stacked, the door (smaller) beside the
 *    clipboard, then the café; the booking animation as on desktop;
 *  - below lg: heading, intro, just the clipboard (full-size form, no door;
 *    a sent request is torn off the board), then the café.
 * See MeetingRoom and Cafe.
 */
function StartConversationSection() {
  const ref = useScrollReveal();
  return (
    <section ref={ref} id="start-a-conversation" className="relative isolate overflow-hidden pt-12 md:pt-16 xl:p-0">
      {/* paper wall, washed cool grey-blue */}
      <Image src={paperWall} alt="" fill sizes="100vw" className="-z-10 object-cover object-[50%_99%]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[rgba(217,226,230,0.6)]" />

      <div className="xl:relative xl:left-1/2 xl:h-[1110px] xl:w-[1440px] xl:-translate-x-1/2">
        {/* heading + intro */}
        <div className="max-xl:site-container flex flex-col gap-5 xl:absolute xl:top-[107px] xl:left-[136px] xl:h-[180px] xl:flex-row xl:items-center xl:gap-[49px]">
          <div className="flex flex-col gap-4 xl:w-[545px]">
            <div data-sr="label">
              <SectionLabel>{startConversationCopy.label}</SectionLabel>
            </div>
            <h2 data-sr="words" className="text-[clamp(2rem,1.45rem+2.35vw,3rem)] leading-tight font-bold text-ink-soft capitalize xl:leading-[normal]">{startConversationCopy.heading}</h2>
          </div>
          <p data-sr="words" className="max-w-[575px] font-inter text-lg leading-8 tracking-[-0.3px] text-stone md:text-xl md:leading-9 xl:w-[575px] xl:pt-[60px] xl:text-2xl xl:leading-10">
            {startConversationCopy.intro}
          </p>
        </div>

        {/* the meeting room door and the booking clipboard (sending a request plays out between them) */}
        <MeetingRoom className="max-xl:mt-10 md:max-xl:mt-14" />

      </div>

      {/* the café counter: our barista, and the chalkboard with the studio's social handles */}
      <Cafe className="mt-12 pb-10 md:mt-16 md:pb-0 xl:mt-0" />
    </section>
  );
}

export default StartConversationSection;
