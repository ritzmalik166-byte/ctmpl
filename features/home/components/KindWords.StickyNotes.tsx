"use client";

import Image from "next/image";
import { stickyNotes } from "../constants/kindWords.constants";
import { useSwingingNotes } from "../animations/KindWords.StickyNotes";
import noteYellow from "@/public/images/website/home/kind-words/note-yellow.png";
import notePink from "@/public/images/website/home/kind-words/note-pink.png";
import noteGreen from "@/public/images/website/home/kind-words/note-green.png";

const art = { yellow: noteYellow, pink: notePink, green: noteGreen };

/**
 * The three sticky notes (yellow, red, green) on the notice board, each with
 * its soft shadow, swinging slowly from its top edge (see useSwingingNotes).
 */
export function StickyNotes() {
  const ref = useSwingingNotes();
  return (
    <div ref={ref} className="pointer-events-none absolute inset-0">
      {stickyNotes.map(({ color, left, top, width, height, pivot }) => (
        <Image
          key={color}
          src={art[color]}
          alt=""
          data-part="note"
          sizes={`${Math.ceil(width)}px`}
          className="absolute max-w-none"
          style={{ left, top, width, height, transformOrigin: pivot }}
        />
      ))}
    </div>
  );
}
