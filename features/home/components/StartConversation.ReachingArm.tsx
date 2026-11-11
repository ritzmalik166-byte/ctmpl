import Image from "next/image";
import reachingArm from "@/public/images/website/home/start-conversation/reaching-arm.png";

/**
 * The hand that reaches out of the meeting room to take the request: the
 * singer's arm from the lift's floor 6, mirrored (399 × 265, palm at 351, 216).
 * Placed inside the door (px of the door; it sits at 161, 390 of the section),
 * between the frame and the door itself, so it comes from behind the door,
 * out through the gap by the handle, and reaches over the jamb to the board.
 * It only shows from inside the doorway rightwards, fading into the dark room.
 * Hidden until the request is sent (see useBookingSequence); at rest its palm
 * is on the form paper (790, 700 of the section).
 */
export function ReachingArm() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -top-2.5 left-[49.5px] h-[700px] w-[1000px] overflow-hidden [mask-image:linear-gradient(to_right,transparent_150px,black_340px)]"
    >
      <Image data-anim="arm" src={reachingArm} alt="" width={399} height={265} sizes="399px" className="invisible absolute top-[104px] left-[228.5px] max-w-none opacity-0" />
    </div>
  );
}
