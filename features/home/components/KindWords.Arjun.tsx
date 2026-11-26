"use client";

import { useArjunPuppet, useArjunSpeech } from "../animations/KindWords.Arjun";
import { Layer } from "./Puppet";
// Arjun (arjun-updated: cut from "Arjun holding an ivory cup.png", 1024 × 1536; the old arjun files are kept)
import body from "@/public/images/website/home/kind-words/arjun-updated/body.webp";
import head from "@/public/images/website/home/kind-words/arjun-updated/head.webp";
import arm from "@/public/images/website/home/kind-words/arjun-updated/arm.webp";
import eyeLeft from "@/public/images/website/home/kind-words/arjun-updated/eye-left.webp";
import eyeRight from "@/public/images/website/home/kind-words/arjun-updated/eye-right.webp";
// his mouth shapes for lip-sync (the old lower-lip.webp is kept, unused)
import mouthS from "@/public/images/website/home/kind-words/arjun-updated/mouth-s.webp";
import mouthE from "@/public/images/website/home/kind-words/arjun-updated/mouth-e.webp";
import mouthAh from "@/public/images/website/home/kind-words/arjun-updated/mouth-ah.webp";
import mouthA from "@/public/images/website/home/kind-words/arjun-updated/mouth-a.webp";
import mouthO from "@/public/images/website/home/kind-words/arjun-updated/mouth-o.webp";

/** His artwork is 1024 × 1536; he is drawn 312 wide at (190, 221) of the room, standing where he always has. */
const sizes = "312px";

/** His mouth shapes, each a layer over his head (closed, his mouth is as drawn). */
const mouths = { s: mouthS, e: mouthE, ah: mouthAh, a: mouthA, o: mouthO };

/**
 * Arjun, telling the stories: a paper puppet cut from his artwork. Each time
 * `speechSignal` changes (a new testimonial) he tells it: his mouth lip-syncs
 * the words (mouth shapes for ah, oh, ee and s, with his teeth, tongue and jaw,
 * switching syllable by syllable), his raised hand moves
 * from the shoulder to mark his points and his head nods along; in between he
 * blinks (his eyes squash shut behind his glasses), breathes and sways. Click
 * him for the next testimonial.
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
    <button type="button" aria-label={label} onClick={onClick} className="absolute top-[221px] left-[190px] h-[468px] w-[312px] cursor-pointer">
      <div ref={idleRef} className="absolute inset-0">
        <div ref={speechRef} data-part="arjun" className="absolute inset-0" style={{ transformOrigin: "52.34% 99.02%" }}>
          <Layer src={body} sizes={sizes} />
          {/* head: nods from the chin */}
          <div data-part="head" className="absolute inset-0" style={{ transformOrigin: "52.73% 18.36%" }}>
            <Layer src={head} sizes={sizes} />
            <div data-part="eye" className="absolute inset-0" style={{ transformOrigin: "48.54% 10.81%" }}>
              <Layer src={eyeLeft} sizes={sizes} />
            </div>
            <div data-part="eye" className="absolute inset-0" style={{ transformOrigin: "55.27% 10.29%" }}>
              <Layer src={eyeRight} sizes={sizes} />
            </div>
            {/* his mouth shapes: one shows at a time as he talks */}
            {Object.entries(mouths).map(([name, src]) => (
              <div key={name} data-viseme={name} className="absolute inset-0 opacity-0">
                <Layer src={src} sizes={sizes} />
              </div>
            ))}
          </div>
          {/* where the words come out (the speech bubble grows from here) */}
          <span data-mouth className="absolute top-[14.2%] left-[52.44%] size-0" />
          {/* raised hand: the arm turns at the shoulder */}
          <div data-part="arm" className="absolute inset-0" style={{ transformOrigin: "38.57% 22.27%" }}>
            <Layer src={arm} sizes={sizes} />
          </div>
        </div>
      </div>
    </button>
  );
}
