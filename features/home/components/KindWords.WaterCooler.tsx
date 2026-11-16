"use client";

import Image from "next/image";
import { kindWordsCopy, testimonialClients, testimonials } from "../constants/kindWords.constants";
import { TESTIMONIAL_SECONDS, useTestimonialCycle } from "../animations/KindWords.Testimonials";
import { ProjectControls } from "./CreativePlayground.ProjectControls";
import { SpeechBubble } from "./KindWords.SpeechBubble";
import { ArjunPuppet } from "./KindWords.Arjun";
import { RobotPuppet } from "./KindWords.Robot";
import { StickyNotes } from "./KindWords.StickyNotes";
import { WaterBubbles } from "./KindWords.WaterBubbles";
import { RoomStage } from "./KindWords.Stage";
import { scrollToRange } from "@/lib/scroll/smoothScroll";
import waterCoolerRoom from "@/public/images/website/home/kind-words/water-cooler-room.png";
import noticeBoard from "@/public/images/website/home/kind-words/notice-board-bare.png";

/**
 * The water cooler corner: the room (water cooler with rising bubbles, notice
 * board with swinging sticky notes, the cardboard robot behind it) and Arjun, telling the story in his speech
 * bubble, then the client selector. Every 5 s Arjun tells the next
 * testimonial, its bubble coming out of his mouth; click him (or pick a client)
 * to hear another one at once.
 *
 *  - xl: the Figma layout (frame 75:286 plus page layers 75:1095–75:1098), in px
 *    of the 1440 frame: the room at y 377, the bubble at (462, 391) (82% size), the
 *    selector at y 1170;
 *  - smaller screens: the bubble (readable size) above the room, the room
 *    scaled to the screen (see RoomStage), then the selector (on phones the
 *    names slide, like the creative playground's).
 */
/** Room kept clear at the top for the site header when checking that the scene shows (px). */
const HEADER_SPACE = 90;
/** After the page starts gliding up to the scene, how long before the next story comes out (ms). */
const CHANGE_DELAY = 450;

export function WaterCooler() {
  const { scene, bubble, shown, selected, told, goTo } = useTestimonialCycle(testimonials.length);
  const next = () => goTo((selected + 1) % testimonials.length);

  // from the client selector: if Arjun's bubble or the room is off screen, glide them into view first, then tell it
  const pick = (index: number) => {
    if (index === selected) return;
    const fig = bubble.current?.getBoundingClientRect();
    const room = scene.current?.querySelector("[data-sr]")?.getBoundingClientRect();
    if (!fig || !room) return goTo(index);
    const top = Math.min(fig.top, room.top);
    if (top >= HEADER_SPACE && room.bottom <= window.innerHeight) return goTo(index);
    scrollToRange(top + window.scrollY, room.bottom + window.scrollY, HEADER_SPACE);
    window.setTimeout(() => goTo(index), CHANGE_DELAY);
  };

  return (
    <div ref={scene} className="mt-8 md:mt-12 xl:absolute xl:inset-0 xl:mt-0">
      {/* the bubble; below xl it keeps the height of the longest quote, so nothing below it jumps */}
      <div className="max-xl:site-container relative z-10 flex min-h-[260px] items-end max-xl:-mb-8 sm:min-h-[236px] sm:max-xl:-mb-16 md:min-h-[220px] md:max-xl:-mb-24 xl:static xl:block xl:min-h-0">
        <SpeechBubble ref={bubble} testimonial={testimonials[shown]} className="w-full max-w-[480px] md:ml-[12%] xl:top-[391px] xl:left-[462px] xl:z-10 xl:ml-0 xl:max-w-none" />
      </div>

      <RoomStage sr="rise">
        <Image src={waterCoolerRoom} alt="" fill sizes="(min-width: 1280px) 1440px, 100vw" className="object-cover" />
        {/* the cardboard robot (Figma 175:1062), behind the notice board: it watches Arjun, then talks to itself */}
        <RobotPuppet signal={told} seconds={TESTIMONIAL_SECONDS - 0.5} />
        <Image src={noticeBoard} alt="" fill sizes="(min-width: 1280px) 1440px, 100vw" className="pointer-events-none object-cover" />
        <WaterBubbles />
        <StickyNotes />
        <ArjunPuppet speechSignal={told} speechSeconds={TESTIMONIAL_SECONDS - 0.5} label={kindWordsCopy.askArjun} onClick={next} />
      </RoomStage>

      <div data-sr="rise" className="max-xl:site-container mt-8 flex justify-center md:mt-12 xl:absolute xl:top-[1170px] xl:left-1/2 xl:mt-0 xl:-translate-x-1/2">
        <ProjectControls clients={testimonialClients} active={selected} onSelect={pick} labels={kindWordsCopy} crumple />
      </div>
    </div>
  );
}
