"use client";

import Image from "next/image";
import Link from "next/link";
import { footerContent } from "@/config/footer";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";
import { CARDBOARD, HangingSign } from "./Footer.HangingSign";
import { CounterNotes } from "./StartConversation.CounterNotes";
import { SocialMenu } from "./StartConversation.Cafe";
import ctmLogo from "@/public/images/website/brand/ctm-logo.png";

/** Brushed silver: light running round the frame's moulding, catching on the corners. */
const SILVER =
  "bg-[linear-gradient(135deg,#f7f8f9_0%,#b4b8bd_18%,#eef0f2_38%,#9a9fa5_58%,#e4e6e9_78%,#a7abb1_100%)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.75),inset_0_-2px_3px_rgba(60,64,70,0.35),0_14px_24px_-10px_rgba(40,30,25,0.55),0_2px_4px_rgba(40,30,25,0.25)]";

/**
 * A frontier sign's frame: rough dark timber, its grain running along it, the
 * edges catching a little light, and a heavy shadow on the counter.
 */
const TIMBER =
  "p-[9px] rounded-[3px] bg-[repeating-linear-gradient(90deg,rgba(255,215,160,0.07)_0_2px,transparent_2px_6px,rgba(30,12,2,0.12)_6px_7px,transparent_7px_11px),linear-gradient(180deg,#7b4a26,#4c2c15)] shadow-[inset_0_0_0_1px_rgba(25,10,2,0.65),inset_0_1px_0_rgba(255,205,145,0.35),inset_0_-2px_0_rgba(20,8,0,0.35),0_16px_24px_-12px_rgba(35,15,3,0.7),0_2px_4px_rgba(35,15,3,0.35)]";

/** Each wooden sign: how far it hangs below its nail (px) and how it swings, so no two hang or sway alike. */
const LINK_SIGNS = [
  { drop: 34, sway: 6.4, swing: 0.9 },
  { drop: 20, sway: 7.3, swing: 0.7 },
  { drop: 28, sway: 5.8, swing: 1 },
] as const;

/** An iron nail hammered into a corner of the frame. */
function Nail({ at }: { at: string }) {
  return <span aria-hidden="true" className={cn("absolute size-[7px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#b9b2a6,#4a4440_50%,#1d1916)] shadow-[0_1px_1px_rgba(0,0,0,0.5)]", at)} />;
}

/**
 * The studio's sign: our logo in a silver frame, hung on a fine wire from a
 * screw in the counter, the light sliding across its glass when hovered; and
 * under it, hung from the frame on two short strings, a cardboard card with a
 * line about the studio.
 */
function BrandSign() {
  return (
    <div className="flex w-full max-w-[290px] flex-col">
      <HangingSign drop={26} sway={7.8} swing={0.6} metal="silver" className={cn("p-2", SILVER)}>
        <Link href="/" aria-label={siteConfig.name} className="group/logo relative block overflow-hidden rounded-[2px] bg-[#fbf8f1] px-6 pt-5 pb-4 shadow-[inset_0_2px_5px_rgba(40,30,25,0.28),inset_0_0_0_1px_rgba(120,124,130,0.35)]">
          <Image src={ctmLogo} alt={siteConfig.name} sizes="200px" className="mx-auto h-auto w-full max-w-[190px]" />
          {/* the glass: a soft sheen, sliding across when hovered */}
          <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-[20deg] bg-linear-to-r from-transparent via-white/60 to-transparent transition-[translate] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/logo:translate-x-[460%]" />
        </Link>
      </HangingSign>
      <HangingSign drop={16} sway={7.8} swing={0.6} hook={false} sr={null} className={cn("px-4 pt-6 pb-3.5", CARDBOARD)}>
        <p className="font-inter text-[13px] leading-[1.5] font-medium text-[#4a3220]">{footerContent.about}</p>
      </HangingSign>
    </div>
  );
}

/**
 * A sign of links (Company, Services, Read and listen), like one outside a
 * frontier saloon: weathered planks in a rough timber frame, nailed at the
 * corners and hung on rope from an iron nail; the heading burned in, in a
 * Western face, between two stars, and the links stamped under it.
 */
function LinkSign({ heading, links, look }: { heading: string; links: readonly string[]; look: (typeof LINK_SIGNS)[number] }) {
  return (
    <HangingSign {...look} metal="rope" className={TIMBER}>
      <Nail at="top-[1px] left-[1px]" />
      <Nail at="top-[1px] right-[1px]" />
      <Nail at="bottom-[1px] left-[1px]" />
      <Nail at="right-[1px] bottom-[1px]" />
      {/* the planks: sun-bleached pine, the seams between them dark, the edges scorched */}
      <div className="relative overflow-hidden rounded-[2px] bg-[#c08b55] bg-[url(/images/website/home/who-we-are/paper-wall.jpg)] bg-size-[300px] px-1.5 pt-4 pb-3.5 text-center sm:px-4 bg-blend-multiply shadow-[inset_0_0_18px_rgba(80,38,10,0.6),inset_0_0_3px_rgba(60,25,5,0.5)]">
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(180deg,transparent_0_44px,rgba(70,35,12,0.5)_44px_46px),repeating-linear-gradient(90deg,rgba(90,48,18,0.06)_0_1px,transparent_1px_5px)]" />
        <h2 className="relative flex items-center justify-center gap-1.5 font-western whitespace-nowrap text-[14px] leading-tight min-[400px]:text-[15px] sm:gap-2 sm:text-[17px] text-[#3a1f0c] [text-shadow:0_1px_0_rgba(255,226,180,0.35)]">
          <span aria-hidden="true" className="text-[10px] text-[#8a3a1c] max-sm:hidden">★</span>
          {heading}
          <span aria-hidden="true" className="text-[10px] text-[#8a3a1c] max-sm:hidden">★</span>
        </h2>
        <span aria-hidden="true" className="relative mx-auto mt-1.5 mb-2 block h-[3px] w-4/5 bg-[repeating-linear-gradient(90deg,#5b3519_0_6px,transparent_6px_9px)] opacity-60" />
        <ul className="relative flex flex-col">
          {links.map((label) => (
            <li key={label}>
              <Link href="#" className="group/link inline-flex items-center gap-1 font-typewriter text-[11px] leading-[21px] font-bold whitespace-nowrap min-[400px]:text-[12px] sm:text-[14px] sm:leading-[23px] text-[#2e1a0b] transition-colors hover:text-[#8e2a17]">
                <span aria-hidden="true" className="opacity-0 transition-opacity duration-300 group-hover/link:opacity-100">
                  ›
                </span>
                {label}
                <span aria-hidden="true" className="opacity-0 transition-opacity duration-300 group-hover/link:opacity-100">
                  ‹
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </HangingSign>
  );
}

/**
 * The front of the café counter, run on down as the site footer: the studio's
 * silver-framed sign and its links hung on the counter (the links on wooden
 * frontier signs, on rope, each swinging gently on its own nail), our numbers,
 * email and address pinned up under them as paper notes, and the small print
 * burned into the skirting. On phones the café's "Find us online" board hangs
 * here too (in the scene it's too small to read).
 *
 * It starts at the counter's top edge in the scene above (72.7% of the
 * 2560 × 1300 picture's height, so its margin is that much of the width: 13.86%),
 * so the first row of signs hangs right off the counter's edge.
 */
export function FooterCounter() {
  const { columns, copyright, privacy } = footerContent;
  return (
    <div className="relative bg-[url(/images/website/home/start-conversation/cafe/counter-front-tile.webp)] bg-size-[100%_auto] bg-top bg-repeat-y">
      <div className="relative z-30 mx-auto -mt-[13.86%] max-w-[1440px] px-5 sm:px-8 xl:px-[88px]">
        {/* the signs: the studio's, then its links */}
        <nav aria-label="Footer" className="grid items-start justify-items-center gap-x-6 gap-y-10 lg:grid-cols-[270px_1fr] xl:grid-cols-[290px_1fr] xl:gap-x-10">
          <BrandSign />
          <div className="grid w-full grid-cols-2 items-start gap-x-3 gap-y-7 max-sm:[&>*:last-child]:col-span-2 max-sm:[&>*:last-child]:mx-auto max-sm:[&>*:last-child]:w-[calc(50%-6px)] sm:grid-cols-3 sm:gap-x-6 xl:gap-x-8">
            {columns.map(({ heading, links }, i) => (
              <LinkSign key={heading} heading={heading} links={links} look={LINK_SIGNS[i % LINK_SIGNS.length]} />
            ))}
          </div>
        </nav>

        {/* our numbers, email and address, pinned to the counter */}
        <CounterNotes size="compact" className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-6 xl:gap-10" />

        {/* phones: "Find us online", on a chalkboard of its own */}
        <SocialMenu className="mt-8 rounded-[4px] border-[10px] border-[#8a6a5a] bg-[#4e5e56] p-5 shadow-[0_10px_20px_-8px_rgba(40,30,20,0.4)] md:hidden" />
      </div>

      {/* the skirting along the counter's foot, the small print burned into it */}
      <div className="mt-8 border-t-[3px] border-[#7d5039] bg-[#9c6a52] bg-[url(/images/website/home/who-we-are/paper-wall.jpg)] bg-size-[380px] bg-blend-multiply shadow-[inset_0_2px_0_rgba(255,220,200,0.22),inset_0_-6px_10px_rgba(40,20,10,0.25)]">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-1.5 px-5 py-3 text-center font-inter text-[12.5px] leading-[18px] text-[#f6e4d6] [text-shadow:0_1px_0_rgba(50,22,10,0.55)] sm:flex-row sm:justify-between sm:px-8 sm:text-left xl:px-[88px]">
          <p>{copyright}</p>
          <Link href="#" className="font-semibold underline underline-offset-2 transition-colors hover:text-white">
            {privacy}
          </Link>
        </div>
      </div>
    </div>
  );
}
