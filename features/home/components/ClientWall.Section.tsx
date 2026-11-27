"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import SectionLabel from "@/components/website/shared/SectionLabel";
import { useScrollReveal } from "@/lib/animations/scrollReveal";
import { useClientWall } from "../animations/ClientWall";
import { clientWallCopy, frameStyles, wallLights, wallRows, type WallClient } from "../constants/clientWall.constants";
import paperWall from "@/public/images/website/home/who-we-are/paper-wall.jpg";

/** Paper grain, laid over a coloured sheet. */
const GRAIN = "bg-[url(/images/website/menu/paper-45.webp)] bg-cover mix-blend-multiply";
/** A deckled (hand-torn) edge for the cream mat, and a rougher one for the kraft labels. */
const DECKLE =
  "polygon(0% 2%,6% 0%,14% 1.5%,23% 0%,33% 1.2%,44% 0%,55% 1.4%,66% 0%,77% 1.3%,88% 0%,96% 1.5%,100% 0%,99% 12%,100% 25%,98.8% 38%,100% 50%,99% 63%,100% 76%,98.8% 88%,100% 100%,92% 98.6%,81% 100%,70% 98.8%,59% 100%,48% 98.5%,37% 100%,26% 98.8%,15% 100%,5% 98.6%,0% 100%,1% 88%,0% 75%,1.2% 62%,0% 50%,1% 37%,0% 24%,1.2% 12%)";
const TORN = "polygon(3% 0%,97% 4%,100% 50%,96% 100%,4% 96%,0% 48%)";

/**
 * One client, its logo printed on cream paper, mounted on a coloured card
 * frame and stuck up on the wall with a strip of washi tape, a torn kraft label
 * with its name typed under it. Hovered (or focused), the frame lifts off the
 * wall and straightens, its shadow growing, the tape lifting a touch.
 */
function Frame({ client, n, copy }: { client: WallClient; n: number; copy: boolean }) {
  const style = frameStyles[n % frameStyles.length];
  return (
    <li data-frame aria-hidden={copy || undefined} className="group relative shrink-0 list-none pt-[14px]" style={{ "--tilt": `${style.tilt}deg` } as CSSProperties}>
      <div className="relative rotate-(--tilt) transition-[rotate,translate,scale] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-2 group-hover:scale-[1.05] group-hover:rotate-0">
        {/* the card frame: coloured paper, its grain, and the shadow it casts on the wall */}
        <div
          className="relative p-[9px] shadow-[1px_2px_0_rgba(60,40,20,0.18),3px_10px_14px_-6px_rgba(60,40,20,0.4)] transition-shadow duration-500 group-hover:shadow-[2px_3px_0_rgba(60,40,20,0.14),6px_22px_26px_-10px_rgba(60,40,20,0.45)] md:p-[11px]"
          style={{ backgroundColor: style.card }}
        >
          <span aria-hidden="true" className={`absolute inset-0 opacity-70 ${GRAIN}`} />
          {/* the cream mat, its edges torn by hand, and the logo printed on it */}
          <div className="relative flex aspect-[4/3] w-[112px] items-center justify-center bg-[#fbf7ee] p-[13%] md:w-[140px] xl:w-[158px]" style={{ clipPath: DECKLE }}>
            <span aria-hidden="true" className={`absolute inset-0 opacity-40 ${GRAIN}`} />
            <span className="relative block size-full">
              <Image src={client.logo} alt={copy ? "" : client.name || "Client logo"} fill sizes="(min-width: 1280px) 125px, (min-width: 768px) 110px, 90px" className="object-contain mix-blend-multiply" />
            </span>
          </div>
        </div>
        {/* the washi tape holding it up */}
        <span
          aria-hidden="true"
          className="absolute -top-[10px] left-1/2 block h-[20px] w-[58px] -translate-x-1/2 -rotate-3 shadow-[0_1px_1px_rgba(60,40,20,0.12)] transition-[rotate,translate] duration-500 group-hover:-translate-y-[2px] group-hover:-rotate-6 md:w-[66px]"
          style={{ backgroundColor: style.tape, clipPath: "polygon(2% 8%,98% 0%,100% 92%,0% 100%)" }}
        />
      </div>

      {/* the label: torn kraft paper, the name typed on it */}
      {client.name && (
        <p
          className="relative mx-auto mt-[12px] w-fit max-w-full rotate-1 bg-[#d8b98a] px-[10px] py-[4px] text-center font-typewriter text-[9px] leading-[11px] font-bold tracking-[0.1em] whitespace-nowrap text-[#4a3520] uppercase transition-[rotate,translate] duration-500 group-hover:translate-y-[2px] group-hover:-rotate-2 md:text-[10px]"
          style={{ clipPath: TORN }}
        >
          <span aria-hidden="true" className={`absolute inset-0 opacity-60 ${GRAIN}`} />
          <span className="relative">{client.name}</span>
        </p>
      )}
    </li>
  );
}

/** A lamp on the track, cut from paper: its stem and shade, and the beam it throws (a sheet of translucent paper). */
function Lamp({ left, hideOnPhones }: { left: number; hideOnPhones: boolean }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute top-[6px] -translate-x-1/2 ${hideOnPhones ? "max-md:hidden" : ""}`} style={{ left: `${left}%` }}>
      <span className="relative z-[1] mx-auto block h-[10px] w-[5px] bg-[#3d3026]" />
      <span className="relative z-[1] mx-auto block h-[18px] w-[26px] bg-[#3d3026]" style={{ clipPath: "polygon(22% 0,78% 0,100% 100%,0 100%)" }}>
        <span className="absolute inset-x-0 top-0 h-[40%] bg-[#5a4636]" />
      </span>
      {/* the bulb, lit (glowing), and the beam it throws: always on (they flicker as the wall comes into view) */}
      <span data-light className="absolute top-[24px] left-1/2 z-[1] block h-[9px] w-[18px] -translate-x-1/2 rounded-b-full bg-[#fffbe8] shadow-[0_0_6px_2px_rgba(255,236,170,0.95),0_0_18px_8px_rgba(255,222,140,0.55)]" />
      <span
        data-light
        className="absolute top-[28px] left-1/2 block h-[240px] w-[230px] -translate-x-1/2 md:h-[300px] md:w-[300px]"
        style={{ clipPath: "polygon(44% 0,56% 0,100% 100%,0 100%)", background: "linear-gradient(180deg,rgba(255,243,205,0.75),rgba(255,243,205,0.12) 85%,transparent)" }}
      />
    </div>
  );
}

/**
 * "Next stop: the reception wall", the end of the tour: everyone else the
 * studio works with (after the main clients in the filing room), their logos
 * mounted on paper frames and taped up in two rows along the reception's paper
 * wall, under a track of paper lamps; a paper notice pinned up by the heading
 * ("30+ brands & counting"), and kraft panelling along the bottom. The rows
 * glide slowly past under the lamps (a scroll hurries them; pointing at one
 * stops it), and the lamps flicker on as you walk up (see useClientWall).
 */
function ClientWallSection() {
  const ref = useScrollReveal();
  useClientWall(ref);
  return (
    <section ref={ref} id="our-clients" className="relative isolate overflow-hidden pt-16 md:pt-24 xl:pt-[110px]">
      {/* the reception's wall: paper, washed a warm cream */}
      <Image src={paperWall} alt="" fill sizes="100vw" className="-z-10 object-cover" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[rgba(236,224,203,0.72)]" />

      <div className="site-container flex flex-wrap items-end justify-between gap-x-10 gap-y-8">
        <div className="flex max-w-[660px] flex-col gap-4">
          <div data-sr="label" data-sr-flight="left">
            <SectionLabel>{clientWallCopy.label}</SectionLabel>
          </div>
          <h2 data-sr="words" className="text-[clamp(2rem,1.45rem+2.35vw,3rem)] leading-tight font-bold text-ink-soft xl:leading-[normal]">
            {clientWallCopy.heading}
          </h2>
          <p data-sr="rise" className="text-[17px] leading-[1.6] text-stone md:text-lg">
            {clientWallCopy.intro}
          </p>
        </div>
        {/* the notice: a sheet pinned to the wall, "30+" cut from terracotta paper */}
        <div data-sign className="relative -rotate-2 bg-[#fbf5e8] px-6 pt-6 pb-4 shadow-[1px_2px_0_rgba(60,40,20,0.15),4px_14px_18px_-8px_rgba(60,40,20,0.4)] md:px-7">
          <span aria-hidden="true" className={`absolute inset-0 opacity-50 ${GRAIN}`} />
          {["left-[14px]", "right-[14px]"].map((at, i) => (
            <span
              key={at}
              aria-hidden="true"
              className={`absolute top-[7px] ${at} block size-[12px] rounded-full shadow-[1px_2px_2px_rgba(40,25,10,0.35)]`}
              style={{ background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.7) 0 1.5px, transparent 2.5px), ${i ? "#1f57a5" : "#c0392b"}` }}
            />
          ))}
          <p className="relative flex items-center gap-3">
            <span className="relative bg-[#c8714f] px-[10px] py-[2px] font-instrument text-[40px] leading-none font-bold text-[#fbf5e8] shadow-[1px_2px_0_rgba(60,40,20,0.2)] md:text-[48px]" style={{ clipPath: TORN }}>
              {clientWallCopy.sign.count}
            </span>
            <span className="max-w-[110px] font-typewriter text-[12px] leading-[1.35] font-bold tracking-[0.12em] text-ink-soft uppercase md:text-[13px]">{clientWallCopy.sign.text}</span>
          </p>
        </div>
      </div>

      {/* the gallery: the track of paper lamps, and the rows of frames under them */}
      <div className="relative mt-12 md:mt-16">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[8px] bg-[#3d3026] shadow-[0_2px_0_rgba(60,40,20,0.15)]">
          <span className={`absolute inset-0 opacity-50 ${GRAIN}`} />
        </div>
        {wallLights.map((left, i) => (
          <Lamp key={left} left={left} hideOnPhones={i % 2 === 1} />
        ))}

        <div className="relative flex flex-col gap-7 pt-[64px] pb-12 md:gap-9 md:pt-[78px] md:pb-16" role="region" aria-label={clientWallCopy.listLabel}>
          {wallRows.map(({ clients, direction }, r) => (
            <div key={r} data-row data-direction={direction} data-sr={direction < 0 ? "slide-left" : "slide-right"} className="overflow-hidden pt-2 pb-1">
              <ul data-track className="flex w-max items-start gap-[30px] px-[15px] will-change-transform md:gap-[44px] md:px-[22px] xl:gap-[52px] xl:px-[26px]">
                {[false, true].flatMap((copy) => clients.map((client, i) => <Frame key={`${copy}-${i}`} client={client} n={i * 2 + r} copy={copy} />))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* the panelling along the bottom: kraft paper, its top edge torn, strips laid side by side */}
      <div aria-hidden="true" className="relative h-[64px] md:h-[88px]">
        <div className="absolute inset-x-0 top-0 bottom-0 bg-[#c49a6c] bg-[url(/images/website/menu/kraft-70.webp)] bg-size-[180px] bg-blend-multiply shadow-[0_-2px_4px_rgba(60,40,20,0.18)]" style={{ clipPath: "polygon(0 14%,4% 6%,9% 12%,15% 4%,22% 11%,28% 5%,35% 12%,42% 6%,49% 13%,56% 5%,63% 11%,70% 4%,77% 12%,84% 6%,91% 13%,96% 5%,100% 10%,100% 100%,0 100%)" }}>
          <span className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0_138px,rgba(70,45,20,0.2)_138px_140px,rgba(255,240,215,0.25)_140px_141px)]" />
        </div>
      </div>
    </section>
  );
}

export default ClientWallSection;
