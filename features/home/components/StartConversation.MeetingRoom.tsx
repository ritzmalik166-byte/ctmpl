"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { useBookingSequence } from "../animations/StartConversation.Booking";
import { BookingForm, type BookingStatus } from "./StartConversation.BookingForm";
import { MeetingRoomDoor } from "./StartConversation.Door";
import { ReachingArm } from "./StartConversation.ReachingArm";

/** How long the request takes to send (s; stands in for the real request for now). */
const SENDING_SECONDS = 1.8;

/**
 * The meeting room and its booking clipboard (Figma 75:325 / 75:326, px of the
 * 1440 section). Sending a request: the button shows paper-craft loading,
 * then (from lg up) the door opens a little, a hand reaches out from behind
 * it and tears the request off the board, takes it inside and the door
 * closes; below lg there's no door, the request is just torn off the board; a "room booked" note is clipped
 * on (see useBookingSequence). The note can be taken off to send another.
 * There's no checking of the fields yet, and nothing is sent anywhere.
 */
export function MeetingRoom({ className }: { className?: string }) {
  const { scene, takeRequest, showBooked, clearBooked } = useBookingSequence();
  const [status, setStatus] = useState<BookingStatus>("idle");
  const [sheetKey, setSheetKey] = useState(0);
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const send = async () => {
    setStatus("sending");
    await new Promise((done) => setTimeout(done, SENDING_SECONDS * 1000)); // TODO: send the request here
    if (!alive.current) return;
    setStatus("taking");
    await takeRequest();
    if (!alive.current) return;
    showBooked();
    setStatus("booked");
  };

  const another = async () => {
    await clearBooked();
    if (!alive.current) return;
    setSheetKey((k) => k + 1); // a fresh form on the board
    setStatus("idle");
  };

  return (
    // the scene: below lg just the board (as wide as the screen allows, up to
    // its 580.67; no door), lg the door and board side by side, xl the Figma layout
    <div ref={scene} className={cn("relative mx-auto h-[547px] w-full max-w-[580.67px] lg:h-[523px] lg:max-w-none lg:w-[949px] xl:absolute xl:inset-0 xl:h-auto xl:w-auto", className)}>
      <MeetingRoomDoor>
        <ReachingArm />
      </MeetingRoomDoor>
      <BookingForm status={status} sheetKey={sheetKey} onSubmit={send} onAnother={another} className="absolute top-[15px] left-0 w-full lg:top-0 lg:left-[367.9px] lg:w-[580.67px] xl:top-[489px] xl:left-[749px]" />
    </div>
  );
}
