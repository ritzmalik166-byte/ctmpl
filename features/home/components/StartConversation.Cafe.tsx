"use client";

import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { footerContent } from "@/config/footer";
import { startConversationCopy } from "../constants/startConversation.constants";
// the café without its painted light cones (the lights draw their own beams, only while they're on), and
// without the cup shelves on the right: that wall is where the awards hang
import counter from "@/public/images/website/home/start-conversation/cafe/counter-unlit-awards.webp";
import { useCafeBarista, useCafeLights } from "../animations/StartConversation.Cafe";
import { Layer, Overlay } from "./Puppet";
import { CounterNotes } from "./StartConversation.CounterNotes";
import { AwardsGrid, AwardsOnWall } from "./StartConversation.AwardsWall";
import baristaBody from "@/public/images/website/home/start-conversation/cafe/barista-body.png";
import baristaHead from "@/public/images/website/home/start-conversation/cafe/barista-head.png";
import baristaHands from "@/public/images/website/home/start-conversation/cafe/barista-hands.png";
import baristaBlink from "@/public/images/website/home/start-conversation/cafe/barista-blink.webp";
import paperPlane from "@/public/icons/paper-plane-accent.svg";

/** The chalkboard's list: the studio's social handles, in chalk. */
function SocialMenu({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col font-caveat text-[#f4eedd]", className)}>
      <h3 className="text-center text-[clamp(20px,2.4cqw,38px)] leading-none font-bold">{startConversationCopy.cafe.boardTitle}</h3>
      <ul className="mt-[clamp(4px,1cqw,16px)] flex flex-col">
        {footerContent.social.map(({ label, href }) => (
          <li key={label} className="border-b-[1.5px] border-dashed border-[rgba(244,238,221,0.35)] last:border-b-0">
            <a
              href={href}
              className="group flex items-baseline justify-between gap-3 py-[clamp(2px,0.55cqw,9px)] text-[clamp(14px,1.6cqw,24px)] leading-[1.15] transition-colors hover:text-white"
            >
              <b className="font-bold text-[#f2d58a]">{label}</b>
              <span className="flex items-center gap-1.5">
                {startConversationCopy.cafe.follow}
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The three ceiling lights, centred on their shades in the picture (x, % of its width). */
const LAMPS = [35.16, 50, 64.84];

/** One ceiling light switched on: a warm glow round the shade and a soft beam falling from it (see useCafeLights). */
function LampLight({ x }: { x: number }) {
  return (
    <div data-lamp aria-hidden="true" className="pointer-events-none absolute inset-0 mix-blend-screen">
      {/* the beam */}
      <span
        className="absolute top-[20%] h-[26%] w-[12%] -translate-x-1/2 bg-linear-to-b from-[rgba(255,226,160,0.55)] via-[rgba(255,226,160,0.22)] to-transparent [clip-path:polygon(28%_0,72%_0,100%_100%,0_100%)]"
        style={{ left: `${x}%` }}
      />
      {/* the glow round the shade, and the lit underside */}
      <span
        className="absolute top-[19.4%] aspect-square w-[10%] -translate-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,214,130,0.8),rgba(255,200,110,0.3)_45%,transparent)]"
        style={{ left: `${x}%` }}
      />
      <span className="absolute top-[19.6%] h-[1.2%] w-[4.4%] -translate-1/2 rounded-[50%] bg-[rgba(255,246,214,0.95)] blur-[1px]" style={{ left: `${x}%` }} />
    </div>
  );
}

/** The barista as a paper puppet (900 × 1250 art): body, the cup in her hands, and her head (it nods; her mouth moves; she blinks). */
function Barista() {
  const ref = useCafeBarista();
  const sizes = "20vw";
  return (
    <div ref={ref} className="absolute bottom-[19.6%] left-[40%] aspect-[900/1250] w-[20%]">
      <div data-part="figure" className="absolute inset-0" style={{ transformOrigin: "50% 100%" }}>
        <Layer src={baristaBody} sizes={sizes} />
        {/* the cup in both hands: comes forward when she serves it */}
        <div data-part="hands" className="absolute inset-0" style={{ transformOrigin: "50% 79%" }}>
          <Layer src={baristaHands} sizes={sizes} />
        </div>
        {/* her head: nods from the neck as she talks; the blink is a frame laid over it */}
        <div data-part="head" className="absolute inset-0" style={{ transformOrigin: "50% 41.6%" }}>
          <Layer src={baristaHead} sizes={sizes} />
          <Image src={baristaBlink} alt="" fill sizes={sizes} className="pointer-events-none animate-[cafe-blink_5.4s_linear_infinite] opacity-0 [animation-delay:-2s] motion-reduce:animate-none" />
          <Overlay part="mouth" className="origin-top rounded-b-full bg-[#6e2a37]" style={{ left: "48.6%", top: "35.1%", width: "2.9%", height: "1.1%" }} />
        </div>
      </div>
      <span className="sr-only">{startConversationCopy.cafe.baristaAlt}</span>
    </div>
  );
}

/**
 * The café counter under the meeting room: our barista behind the counter
 * (she talks to you and serves the coffee, see useCafeBarista), the three
 * ceiling lights blinking in turn and a paper plane flying through now and then
 * (useCafeLights), the
 * chalkboard on the wall listing the studio's social handles, and our numbers,
 * email and address pinned to the counter as paper notes (CounterNotes). The scene scales
 * with the screen's width; from md the list is chalked onto the board in the
 * picture, on phones (too small to read there) it hangs below the scene as a
 * chalkboard of its own.
 */
export function Cafe({ className }: { className?: string }) {
  const lightsRef = useCafeLights();
  return (
    <div className={className}>
      <div ref={lightsRef} data-sr="rise" className="@container relative aspect-[2560/1300] w-full overflow-hidden">
        <Image src={counter} alt="" fill sizes="100vw" className="object-cover" />
        {/* tablets up: the awards, framed and hung on the wall (above the chalkboard, and on the right) */}
        <AwardsOnWall className="hidden md:block" />
        {LAMPS.map((x) => (
          <LampLight key={x} x={x} />
        ))}
        <Barista />
        {/* the counter's front edge, in front of her */}
        <Image src={counter} alt="" fill sizes="100vw" className="pointer-events-none object-cover [clip-path:inset(70.6%_0_0_0)]" />
        {/* the little orange paper plane (the eyebrows' one), flying across the café now and then (see useCafeLights) */}
        <div data-cafe-plane aria-hidden="true" className="pointer-events-none absolute top-0 left-0 z-[25] w-[3.2%] opacity-0 will-change-transform">
          {/* rolls about the flight's direction, in 3D */}
          <div data-cafe-roll className="transform-3d">
            {/* the picture's nose points 40° up: turned level here, so the plane lies along its flight */}
            <Image src={paperPlane} alt="" unoptimized className="h-auto w-full rotate-[40deg] drop-shadow-[0_2px_2px_rgba(60,40,20,0.25)]" />
          </div>
        </div>
        {/* md up: the social handles, chalked on the board in the picture */}
        <SocialMenu className="absolute top-[23.8%] left-[5.1%] hidden h-[43%] w-[24.2%] p-[1.6cqw] md:flex" />
        {/* lg up: our numbers, email and address, pinned to the front of the counter */}
        <CounterNotes size="counter" className="absolute inset-x-[7%] top-[74%] z-30 hidden grid-cols-3 items-start gap-[5cqw] lg:grid" />
      </div>
      {/* phones: the awards, hung two across under the scene */}
      <AwardsGrid className="md:hidden" />
      {/* smaller screens: the same notes, under the scene */}
      <CounterNotes size="card" className="site-container mt-8 grid gap-5 sm:grid-cols-3 sm:gap-4 lg:hidden" />
      {/* phones: the same list on a chalkboard of its own */}
      <SocialMenu className="site-container mt-6 rounded-[4px] border-[10px] border-[#8a6a5a] bg-[#4e5e56] p-5 shadow-[0_10px_20px_-8px_rgba(40,30,20,0.4)] md:hidden" />
    </div>
  );
}
