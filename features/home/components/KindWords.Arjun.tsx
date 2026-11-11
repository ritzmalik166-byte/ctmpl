"use client";

import { useArjunPuppet, useArjunSpeech } from "../animations/KindWords.Arjun";
import { Layer } from "./Puppet";
import body from "@/public/images/website/home/kind-words/arjun/body.png";
import head from "@/public/images/website/home/kind-words/arjun/head.png";
import arm from "@/public/images/website/home/kind-words/arjun/arm.png";
import eyesHalf from "@/public/images/website/home/kind-words/arjun/eyes-half.png";
import eyesClosed from "@/public/images/website/home/kind-words/arjun/eyes-closed.png";
import mouthSmall from "@/public/images/website/home/kind-words/arjun/mouth-small.png";
import mouthWide from "@/public/images/website/home/kind-words/arjun/mouth-wide.png";

/** Arjun's artwork is 605 × 1107; he is drawn 259 wide at (182, 218) of the room (y 595 of the section). */
const sizes = "259px";

/**
 * Arjun, telling the stories: a paper puppet cut from his Figma artwork. His
 * head nods, his raised right arm moves from the shoulder and his lips follow
 * the words each time `speechSignal` changes (a new testimonial); in between he
 * blinks, breathes and sways. Click him for the next testimonial.
 */
export function ArjunPuppet({ speechSignal, speechSeconds, label, onClick }: {
  speechSignal: number;
  speechSeconds: number;
  label: string;
  onClick: () => void;
}) {
  const idleRef = useArjunPuppet();
  const speechRef = useArjunSpeech(speechSignal, speechSeconds);
  return (
    <button type="button" aria-label={label} onClick={onClick} className="absolute top-[218px] left-[182px] h-[474px] w-[259px] cursor-pointer">
      <div ref={idleRef} className="absolute inset-0">
        <div ref={speechRef} data-part="arjun" className="absolute inset-0" style={{ transformOrigin: "66% 99.4%" }}>
          <Layer src={body} sizes={sizes} />
          {/* head: nods from the chin */}
          <div data-part="head" className="absolute inset-0" style={{ transformOrigin: "68.1% 17.34%" }}>
            <Layer src={head} sizes={sizes} />
            <Layer src={eyesHalf} sizes={sizes} part="eyes-half" hidden />
            <Layer src={eyesClosed} sizes={sizes} part="eyes-closed" hidden />
            <Layer src={mouthSmall} sizes={sizes} part="mouth-small" hidden />
            <Layer src={mouthWide} sizes={sizes} part="mouth-wide" hidden />
          </div>
          {/* where the words come out (the speech bubble grows from here) */}
          <span data-mouth className="absolute top-[15.54%] left-[68.1%] size-0" />
          {/* raised right arm: turns at the shoulder */}
          <div data-part="arm" className="absolute inset-0" style={{ transformOrigin: "50.08% 21.14%" }}>
            <Layer src={arm} sizes={sizes} />
          </div>
        </div>
      </div>
    </button>
  );
}
