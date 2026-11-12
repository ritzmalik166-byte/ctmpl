import Image from "next/image";
import type { ReactNode } from "react";
import doorFrame from "@/public/images/website/home/start-conversation/door-frame.png";
import doorLeaf from "@/public/images/website/home/start-conversation/door-leaf.png";

/**
 * The meeting room door (Figma 75:325, 495 × 674 at 161, 390 of the section),
 * cut into layers so it can open: the dark room behind, the frame, whatever
 * comes out of the room (`children`, the reaching hand) and, in front, the door
 * itself. It's hinged on its left and swings out toward us, so a hand from the
 * room appears from behind it, through the gap by the handle. At rest the
 * layers recompose the Figma artwork.
 * The doorway (where the door sits) is 396 × 625.5 at 49.5, 49.5 of the door.
 * Drawn above the clipboard, so the hand reaches over the paper.
 *
 * Drawn at full size (the door's own px) and scaled as one piece with its
 * hand: xl 1:1 at its Figma place; lg 65% beside the board. Not shown below
 * lg (there the form is simply filled in and torn off).
 */
export function MeetingRoomDoor({ children }: { children?: ReactNode }) {
  return (
    <div data-sr="slide-left" className="absolute top-[9.5px] left-0 z-10 hidden h-[674px] w-[495px] origin-top-left scale-65 lg:block xl:top-[390px] xl:left-[161px] xl:scale-100">
      {/* the room beyond: dark, a little warm light from inside */}
      <div
        aria-hidden="true"
        className="absolute top-[49.5px] left-[49.5px] h-[625.5px] w-[396px] bg-[radial-gradient(120%_70%_at_70%_35%,#5a4636_0%,#2e2520_55%,#1c1714_100%)]"
      />
      <Image src={doorFrame} alt="" width={495} height={674} sizes="495px" className="pointer-events-none absolute inset-0 size-full max-w-none" />

      {children}

      {/* the door: swings out toward us about its hinge (a nearly flat perspective, so it opens to a gap) */}
      <div className="pointer-events-none absolute top-[49.5px] left-[49.5px] h-[625.5px] w-[396px] perspective-[3000px] perspective-origin-left">
        <div data-anim="leaf" className="relative size-full origin-left transform-3d">
          <Image src={doorLeaf} alt="" width={396} height={626} sizes="396px" className="size-full max-w-none" />
          {/* turning away from the light, the door darkens a little */}
          <span data-anim="leaf-shade" className="absolute inset-0 bg-black opacity-0" />
          {/* its edge, seen as it swings out */}
          <span aria-hidden="true" className="absolute top-0 left-full h-full w-[14px] origin-left rotate-y-90 bg-linear-to-r from-[#8a5a35] to-[#a26f45]" />
        </div>
      </div>
    </div>
  );
}
