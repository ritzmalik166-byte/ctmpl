import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import {
  barcodeBars,
  companyWeKeepCopy,
  passSlots,
  visitorPasses,
  type VisitorPass,
} from "../constants/companyWeKeep.constants";

/** The pass's barcode: thin dark bars, one every 4.4px, cut off at the barcode's width. */
function Barcode() {
  return (
    <span
      aria-hidden="true"
      className="absolute top-[153px] left-[18px] h-[21px] w-[173px] overflow-clip"
    >
      {barcodeBars.map((width, i) => (
        <span
          key={i}
          className="absolute top-0 h-[21px] bg-[#292624]"
          style={{ left: i * 4.4, width }}
        />
      ))}
    </span>
  );
}

/**
 * One visitor pass hanging from the rail: its coloured lanyard, the paper pass
 * (VISITOR header, the brand, the pass number and a barcode), slightly tilted,
 * and the metal clip that holds it.
 */
export function HangingPass({
  pass,
  left,
}: {
  pass: VisitorPass;
  left: number;
}) {
  const { brand, number, color, labelColor, lanyard, top, clipTop, tilt } =
    pass;
  return (
    // the slot stays put (it is where hover is felt); the pass inside swings from the top of its lanyard
    <div
      data-pass-slot
      data-cwk="pass"
      className="absolute top-[28px] w-[208px] cursor-grab"
      style={{ left, height: top + 188 }}
    >
      <div
        data-pass
        className="absolute inset-0"
        style={{ transformOrigin: `${lanyard.left + 35}px 0px` }}
      >
        <Image
          src={lanyard.src}
          alt=""
          width={70}
          height={lanyard.height}
          className="absolute top-0"
          style={{ left: lanyard.left }}
        />

        <div
          className="absolute left-0 h-[188px] w-[208px] overflow-clip rounded-lg bg-[#faf7f0] shadow-[1px_12px_14px_0_rgba(51,43,37,0.22)]"
          style={{ top, rotate: `${tilt}deg` }}
        >
          <span
            className="absolute top-0 left-0 h-[33px] w-[222px]"
            style={{ backgroundColor: color }}
          />
          <p
            className="absolute top-[9px] left-0 w-[208px] text-center font-inter text-[13px] leading-[normal] font-extrabold tracking-[2.1px] uppercase"
            style={{ color: labelColor }}
          >
            {companyWeKeepCopy.visitor}
          </p>
          <span className="absolute top-[42px] left-[96px] h-[7px] w-[30px] rounded-[4px] bg-[#dcd5c8]" />
          {/* the brand, centred on the pass (one or two lines) */}
          <p className="absolute top-[56px] left-[13px] flex h-[70px] w-[182px] items-center justify-center text-center font-inter text-[21px] leading-[1.13] font-bold tracking-[-0.8px] text-[#292624]">
            {brand}
          </p>
          <p className="absolute top-[126px] left-0 w-[208px] text-center font-inter text-[13px] leading-[normal] font-semibold tracking-[1.5px] text-[#9d948c] uppercase">
            {companyWeKeepCopy.passNumber} {number}
          </p>
          <Barcode />
        </div>

        <span
          className="absolute left-[92px] h-[21px] w-[37px] rounded-[2px] bg-linear-to-b from-[#dedcd2] to-[#b9b6ad]"
          style={{ top: clipTop }}
        />
      </div>
    </div>
  );
}

/** The wooden bar the lanyards hang from (33 tall; width and position set by the caller). */
export function RailBar({ className }: { className?: string }) {
  return (
    <div
      data-cwk="bar"
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute top-0 h-[33px] overflow-clip rounded-[4px] bg-[#a17b57] shadow-[0_9px_10px_0_rgba(59,48,46,0.25)]",
        className
      )}
    >
      <span className="absolute top-[15px] left-0 h-[18px] w-full bg-[#795739]" />
    </div>
  );
}

/**
 * The six visitor passes on their lanyards (1280 × 374). The wooden bar is part
 * of the rail on desktop; on smaller screens it stays fixed behind the slider
 * (see PassBoard), so only the passes slide.
 */
export function LanyardRail() {
  return (
    <div className="relative h-[374px] w-[1280px] shrink-0">
      <RailBar className="left-0 hidden w-[1280px] xl:block" />
      {visitorPasses.map((pass, i) => (
        <HangingPass key={pass.brand} pass={pass} left={passSlots[i]} />
      ))}
    </div>
  );
}
