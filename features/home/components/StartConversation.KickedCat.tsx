"use client";

import Image from "next/image";
import { KICKED_CAT, useKickedCat } from "../animations/StartConversation.KickedCat";
import { PaperCat } from "./PaperCat";
import kickLeg from "@/public/images/website/home/start-conversation/kick-leg.webp";

/**
 * The studio cat, waiting in the dark of the meeting room, and the leg that
 * kicks it out (see useKickedCat). Inside the door (px of the door), between
 * the frame and the door itself, so both come out from behind the door
 * through the gap by the handle. Hidden until the kick.
 */
export function KickedCat() {
  const ref = useKickedCat();
  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/* the leg (a Who We Are trouser leg and shoe, turned to face out), hinged at the hip */}
      <Image
        data-kick-leg
        src={kickLeg}
        alt=""
        sizes="97px"
        className="invisible absolute top-[384px] left-[312px] h-[290px] w-auto max-w-none opacity-0 brightness-75"
      />
      <PaperCat width={KICKED_CAT.width} height={KICKED_CAT.height} />
    </div>
  );
}
