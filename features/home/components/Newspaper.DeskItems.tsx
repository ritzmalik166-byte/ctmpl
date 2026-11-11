import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { Tilted } from "./Newspaper.Tilted";
import ctmMug from "@/public/images/website/home/newspaper/ctm-mug.png";
import readingGlasses from "@/public/images/website/home/newspaper/reading-glasses.png";
import pen from "@/public/images/website/home/newspaper/pen.png";

/** Three wisps of steam rising off the coffee (sized to the mug; animated by useNewspaperUnfold). */
function Steam() {
  const wisps = ["M14 88 C4 70 24 60 14 42 S22 14 14 2", "M40 90 C30 72 50 58 40 40 S48 12 40 0", "M66 88 C56 70 76 60 66 42 S74 14 66 2"];
  return (
    <svg data-anim="steam" aria-hidden="true" viewBox="0 0 80 92" className="absolute -top-[34%] left-[24.7%] h-[60%] w-[47%] overflow-visible blur-[1.5px]">
      {wisps.map((d) => (
        <path key={d} data-anim="wisp" d={d} fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" opacity="0" />
      ))}
    </svg>
  );
}

/** The CTM mug (170 × 153 art), with its steam. */
function Mug({ className }: { className: string }) {
  return (
    <div data-anim="mug" className={cn("pointer-events-none absolute aspect-[170/153]", className)}>
      <Steam />
      <Image src={ctmMug} alt="" width={170} height={153} sizes="170px" className="relative size-full max-w-none" />
    </div>
  );
}

/** A ring left by the mug. */
function CoffeeRing({ className }: { className: string }) {
  return (
    <span
      data-anim="ring"
      aria-hidden="true"
      className={cn("pointer-events-none absolute flex aspect-square items-center justify-center rounded-full border-[rgba(139,69,19,0.22)] blur-[0.4px]", className)}
    >
      <span className="size-[80%] rounded-full shadow-[inset_0_0_0_8px_rgba(139,69,19,0.08)]" />
    </span>
  );
}

/**
 * Desktop: things on the desk around the paper, as Figma places them (px of
 * the 1440 section): the CTM mug with steam off its coffee, the ring it left,
 * reading glasses and a pen. They arrive once the paper is open, then rise
 * and fall gently.
 */
export function DeskItems() {
  return (
    <>
      <CoffeeRing className="top-[288px] left-[1067px] w-[102px] border-5 p-[5px]" />
      <Mug className="top-[183px] left-[1138px] w-[170px]" />
      <Tilted anim="glasses" box={{ left: 88, top: 1146, width: 205.42, height: 133.27 }} angle={-17.09} className="pointer-events-none">
        <Image src={readingGlasses} alt="" width={190} height={81} className="max-w-none" />
      </Tilted>
      <Tilted anim="pen" box={{ left: 1142, top: 1095, width: 231.23, height: 119.75 }} angle={-19.93} className="pointer-events-none">
        <Image src={pen} alt="" width={230} height={44} className="max-w-none" />
      </Tilted>
    </>
  );
}

/**
 * Smaller screens: the same things around the paper, sized to the screen and
 * kept within it: the mug at the paper's top-right corner (its ring beside it,
 * from sm up), the glasses at its bottom-left, the pen at its bottom-right.
 */
export function CompactDeskItems() {
  return (
    <>
      {/* beside the mug, clear of the masthead (no room for it on phones) */}
      <CoffeeRing className="top-4 right-[11%] w-16 border-4 max-sm:hidden! lg:right-[12%] lg:w-20" />
      <Mug className="-top-12 right-1 w-[84px] sm:-top-16 sm:w-[110px] lg:-top-20 lg:w-[140px]" />
      <div data-anim="glasses" className="pointer-events-none absolute -bottom-9 left-1 w-[110px] sm:-bottom-12 sm:w-[150px] lg:w-[190px]">
        <Image src={readingGlasses} alt="" width={190} height={81} sizes="190px" className="h-auto w-full -rotate-[17deg]" />
      </div>
      <div data-anim="pen" className="pointer-events-none absolute right-1 -bottom-6 w-[130px] sm:-bottom-8 sm:w-[180px] lg:w-[230px]">
        <Image src={pen} alt="" width={230} height={44} sizes="230px" className="h-auto w-full -rotate-[20deg]" />
      </div>
    </>
  );
}
