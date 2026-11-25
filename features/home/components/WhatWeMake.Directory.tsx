import { cn } from "@/lib/utils/cn";
import { floorByNumber, floors, whatWeMakeCopy, type Floor } from "../constants/whatWeMake.constants";

/**
 * Round brass floor button, like the ones in an old lift. The floor the lift is
 * at glows; a floor that was just pressed pulses while the lift travels there.
 */
function FloorButton({ number, current, pending }: { number: number; current: boolean; pending: boolean }) {
  return (
    <span
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full font-inter text-[15px] leading-none font-bold text-[#3a2e1c] transition-[box-shadow,filter] duration-300 md:size-[clamp(26px,4.2svh,34px)] md:text-[clamp(12px,1.8svh,14px)] xl:size-10 xl:text-[15px]",
        current || pending
          ? "bg-[radial-gradient(circle_at_50%_30%,#ffe98f,#f6c93e_55%,#dca523)] shadow-[0_2px_4px_rgba(90,60,10,0.3),0_0_16px_rgba(246,196,60,0.55)]"
          : "bg-linear-to-b from-[#f1d798] via-[#d9b56c] to-[#b48d48] shadow-[0_2px_4px_rgba(60,40,10,0.28)] group-hover:brightness-110",
        pending && "animate-pulse"
      )}
    >
      {number}
    </span>
  );
}

/** The "AI-POWERED" tag: small, tracked out, in the brand red. */
function AiTag({ className }: { className?: string }) {
  return <span className={cn("shrink-0 font-inter text-[10px] leading-none font-semibold tracking-[0.13em] whitespace-nowrap text-[#b84530] uppercase md:text-[11px]", className)}>{whatWeMakeCopy.aiTag}</span>;
}

type FloorRowProps = { floor: Floor; current: boolean; pending: boolean; onSelect: (floor: number) => void };

/**
 * One floor of the directory: its brass button, its name and (for floors that
 * work with AI) the AI tag. The floor the lift is at is lit: a warm band, a red
 * bar down its left edge and an arrow.
 */
function FloorRow({ floor, current, pending, onSelect }: FloorRowProps) {
  return (
    <li data-wwm="floor" className="border-b border-[rgba(70,58,44,0.13)] md:max-xl:flex md:max-xl:min-h-0 md:max-xl:shrink md:max-xl:basis-[60px]">
      <button
        type="button"
        onClick={() => onSelect(floor.number)}
        aria-current={current ? "true" : undefined}
        aria-label={`Ride to floor ${floor.number}: ${floor.name}`}
        className={cn(
          "group relative flex h-14 w-full cursor-pointer items-center gap-4 rounded-[4px] pr-[15px] pl-3 text-left outline-none transition-colors duration-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#b84530] md:h-full md:gap-[clamp(10px,1.6vw,16px)] md:pl-[15px] xl:h-[63px] xl:gap-[19px]",
          current ? "bg-[#eee2ca]" : pending ? "bg-[#eee2ca]/55" : "hover:bg-[#eee2ca]/45"
        )}
      >
        {/* the lit floor's red bar */}
        <span aria-hidden="true" className={cn("absolute inset-y-0 left-0 w-[3px] rounded-l-[4px] bg-[#b84530] transition-opacity duration-300", current ? "opacity-100" : "opacity-0")} />
        <FloorButton number={floor.number} current={current} pending={pending} />
        <span className="min-w-0 flex-1 truncate text-lg leading-none font-semibold tracking-[-0.01em] text-[#2d2c28] md:text-[clamp(15px,2.4svh,18px)] xl:text-[22px]">{floor.name}</span>
        {/* (only on the floor the lift is at) */}
        {floor.aiPowered && current && <AiTag className="mr-[9px]" />}
        {/* the lit floor's arrow */}
        {current && (
          <svg aria-hidden="true" viewBox="0 0 16 14" className="h-3.5 w-[15px] shrink-0 animate-[service-in_0.45s_ease-out] text-[#b84530] motion-reduce:animate-none">
            <path d="M1 7h13M8.5 1.5 14 7l-5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    </li>
  );
}

type DirectoryProps = {
  /** Floor the lift is at. */
  current: number;
  /** Floor the visitor pressed (may differ while the lift is on its way). */
  requested: number;
  onSelect: (floor: number) => void;
  className?: string;
};

/** The building directory: every floor, top floor first; press one and the lift rides up to it. */
export function BuildingDirectory({ current, requested, onSelect, className }: DirectoryProps) {
  return (
    <nav data-wwm="directory" aria-label={whatWeMakeCopy.directoryTitle} className={cn("flex w-full flex-col", className)}>
      <div className="flex shrink-0 items-baseline justify-between border-b border-[rgba(60,50,40,0.6)] pb-4 md:max-xl:pb-[clamp(0.5rem,1.6svh,1rem)] font-inter text-[11px] leading-none font-medium tracking-[0.2em] text-[#898077] uppercase md:text-xs">
        <h3>{whatWeMakeCopy.directoryTitle}</h3>
        <span>{whatWeMakeCopy.floorCount(floors.length)}</span>
      </div>
      <ol className="flex min-h-0 flex-1 flex-col">
        {floors.map((floor) => (
          <FloorRow key={floor.number} floor={floor} current={floor.number === current} pending={floor.number === requested && requested !== current} onSelect={onSelect} />
        ))}
      </ol>
    </nav>
  );
}

/**
 * What the floor the lift is at makes: "Floor 01 · Now showing", its name (and
 * the AI badge), a line about it, and a link up to the next floor (from the top
 * floor, back down to the first). Fades in afresh on each floor.
 */
export function FloorDetails({ floor: floorNumber, onSelect, className }: { floor: number; onSelect: (floor: number) => void; className?: string }) {
  const floor = floorByNumber(floorNumber);
  const nextNumber = floorNumber === floors.length ? 1 : floorNumber + 1;
  const next = floorByNumber(nextNumber);
  const up = nextNumber > floorNumber;
  return (
    <div className={cn("w-full", className)}>
      {/* key: re-mounts on each floor, so the new text fades in */}
      <div key={floorNumber} className="flex animate-[service-in_0.45s_ease-out] flex-col items-start motion-reduce:animate-none">
        <p className="font-inter text-[11px] leading-none font-semibold tracking-[0.165em] text-[#ba4531] uppercase xl:text-xs">{whatWeMakeCopy.nowShowing(floorNumber)}</p>
        {/* the name, and its AI badge beside it (under it on desktop) */}
        <div className="mt-[clamp(0.5rem,1.6svh,1rem)] flex flex-wrap items-center gap-x-3 gap-y-2 xl:mt-[17px] xl:flex-col xl:items-start xl:gap-[15px]">
          <h3 className="text-[clamp(26px,4.2svh,34px)] leading-none font-bold tracking-[-0.025em] text-[#2d2c27] lg:text-[clamp(26px,4.4svh,38px)] xl:text-[52px]">{floor.name}</h3>
          {floor.aiPowered && (
            <span className="rounded-[3px] bg-[#b84530] px-[9px] py-[5px] font-inter text-[10px] leading-none font-bold tracking-[0.1em] text-white uppercase xl:px-2.5 xl:py-[6px] xl:text-[11px]">
              {whatWeMakeCopy.aiTag}
            </span>
          )}
        </div>
        {floor.description && <p className="mt-[clamp(0.5rem,1.6svh,1.1rem)] font-inter text-[clamp(14px,2.1svh,16px)] leading-[1.55] text-[#4e4943] xl:mt-[18px] xl:text-xl xl:leading-8">{floor.description}</p>}
        <button
          type="button"
          onClick={() => onSelect(nextNumber)}
          className="group mt-[clamp(0.75rem,2.6svh,1.75rem)] inline-flex max-md:hidden cursor-pointer items-center gap-2 border-b-2 border-[#b84530] pb-[5px] font-inter text-[13px] leading-none font-medium text-[#2d2c27] transition-colors hover:text-[#b84530] md:text-sm xl:mt-[35px]"
        >
          <svg aria-hidden="true" viewBox="0 0 12 14" className={cn("h-3.5 w-3 transition-transform duration-300", up ? "group-hover:-translate-y-0.5" : "rotate-180 group-hover:translate-y-0.5")}>
            <path d="M6 13V1.5M1.5 6 6 1.5 10.5 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {whatWeMakeCopy.nextFloor}: {nextNumber} · {next.name}
        </button>
      </div>
    </div>
  );
}

/**
 * Phones: the building directory as one dropdown above the lift (the full list
 * of floors needs more room than a phone has). Picking a floor sends the lift
 * there, like pressing its button.
 */
export function FloorSelect({ requested, onSelect, className }: { requested: number; onSelect: (floor: number) => void; className?: string }) {
  return (
    <label className={cn("relative block w-full", className)}>
      <span className="sr-only">{whatWeMakeCopy.directoryTitle}</span>
      <select
        value={requested}
        onChange={(e) => onSelect(Number(e.target.value))}
        className="h-12 w-full cursor-pointer appearance-none rounded-[6px] border border-[rgba(60,50,40,0.35)] bg-[#fbf7ef] pr-12 pl-4 font-inter text-[15px] font-semibold text-[#2d2c28] shadow-[0_2px_6px_rgba(60,45,30,0.08)] outline-none focus-visible:ring-2 focus-visible:ring-[#b84530]"
      >
        {floors.map((floor) => (
          <option key={floor.number} value={floor.number}>
            {`Floor ${floor.number} · ${floor.name}${floor.aiPowered ? ` (${whatWeMakeCopy.aiTag})` : ""}`}
          </option>
        ))}
      </select>
      <svg aria-hidden="true" viewBox="0 0 12 8" className="pointer-events-none absolute top-1/2 right-4 h-2 w-3 -translate-y-1/2 text-[#b84530]">
        <path d="M1 1.5 6 6.5 11 1.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </label>
  );
}
