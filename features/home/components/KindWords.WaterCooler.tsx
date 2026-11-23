"use client";

import Image from "next/image";
import { kindWordsCopy, testimonials } from "../constants/kindWords.constants";
import { TESTIMONIAL_SECONDS, useTestimonialCycle } from "../animations/KindWords.Testimonials";
import { SpeechBubble } from "./KindWords.SpeechBubble";
import { ArjunPuppet } from "./KindWords.Arjun";
import { RobotPuppet } from "./KindWords.Robot";
import { StickyNotes } from "./KindWords.StickyNotes";
import { WaterBubbles } from "./KindWords.WaterBubbles";
import { RoomStage } from "./KindWords.Stage";
import waterCoolerRoom from "@/public/images/website/home/kind-words/water-cooler-room.png";
import noticeBoard from "@/public/images/website/home/kind-words/notice-board-bare.png";
import roomWall from "@/public/images/website/home/kind-words/water-cooler-wall.webp";

/**
 * The water cooler corner: the room (water cooler with rising bubbles, notice
 * board with swinging sticky notes, the cardboard robot behind it) and Arjun,
 * telling the story in his speech bubble. Every 5 s Arjun tells the next
 * testimonial, its bubble coming out of his mouth; click him to hear another
 * one at once. The room's wall runs on up behind the heading.
 *
 *  - xl: the Figma layout (frame 75:286 plus page layers 75:1095–75:1098), in px
 *    of the 1440 frame: the room at y 377 (the section ends with its floor, y 1108),
 *    the bubble at (462, 391) (82% size);
 *  - smaller screens: the bubble (readable size) above the room, the room
 *    scaled to the screen (see RoomStage).
 */
export function WaterCooler() {
  const { scene, bubble, shown, selected, told, goTo } = useTestimonialCycle(testimonials.length);
  const next = () => goTo((selected + 1) % testimonials.length);

  return (
    <div ref={scene} className="mt-8 md:mt-12 xl:absolute xl:inset-0 xl:mt-0">
      {/* the bubble; below xl it keeps the height of the longest quote, so nothing below it jumps */}
      <div className="max-xl:site-container relative z-10 flex min-h-[260px] items-end max-xl:-mb-8 sm:min-h-[236px] sm:max-xl:-mb-16 md:min-h-[220px] md:max-xl:-mb-24 xl:static xl:block xl:min-h-0">
        <SpeechBubble ref={bubble} testimonial={testimonials[shown]} className="w-full max-w-[480px] md:ml-[12%] xl:top-[391px] xl:left-[462px] xl:z-10 xl:ml-0 xl:max-w-none" />
      </div>

      <RoomStage
        sr="rise"
        backdrop={
          <>
            {/* the room's wall runs on up behind the heading (the same striped paper, 1350 px more of it, then its plain colour), so heading and room are one wall */}
            <div aria-hidden="true" className="absolute bottom-full left-0 h-[4000px] w-full bg-[#dddccc]">
              <Image src={roomWall} alt="" sizes="(min-width: 1280px) 1440px, 100vw" className="absolute bottom-0 left-0 h-[1350px] w-full [mask-image:linear-gradient(to_bottom,transparent,black_240px)]" />
            </div>
            <Image src={waterCoolerRoom} alt="" fill sizes="(min-width: 1280px) 1440px, 100vw" className="object-cover" />
          </>
        }
      >
        {/* the cardboard robot (Figma 175:1062), behind the notice board: it watches Arjun, then talks to itself */}
        <RobotPuppet signal={told} seconds={TESTIMONIAL_SECONDS - 0.5} />
        <Image src={noticeBoard} alt="" fill sizes="(min-width: 1280px) 1440px, 100vw" className="pointer-events-none object-cover" />
        <WaterBubbles />
        <StickyNotes />
        <ArjunPuppet speechSignal={told} speechSeconds={TESTIMONIAL_SECONDS - 0.5} label={kindWordsCopy.askArjun} onClick={next} />
      </RoomStage>

    </div>
  );
}
