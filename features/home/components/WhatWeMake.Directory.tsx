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
        "flex size-[38px] shrink-0 items-center justify-center overflow-clip rounded-full font-inter text-base leading-[normal] font-bold text-[#25272a] transition-[box-shadow,filter] duration-300",
        current || pending
          ? "border-3 border-[#b89847] bg-linear-to-b from-[#ffe88d] via-[#ffd867] via-50% to-[#e3ac32] shadow-[0_3px_4px_rgba(0,0,0,0.33),0_0_15px_rgba(234,197,83,0.4)]"
          : "bg-linear-to-b from-[#f7e2aa] via-[#d8bd7e] via-50% to-[#ad8b49] shadow-[0_2px_4px_rgba(0,0,0,0.33)] group-hover:brightness-110",
        pending && "animate-pulse"
      )}
    >
      {number}
    </span>
  );
}

type FloorRowProps = { floor: Floor; current: boolean; pending: boolean; onSelect: (floor: number) => void };

function FloorRow({ floor, current, pending, onSelect }: FloorRowProps) {
  return (
    <li data-wwm="floor" className="border-b border-dashed border-[rgba(116,96,68,0.33)] last:border-b-0">
      <button
        type="button"
        onClick={() => onSelect(floor.number)}
        aria-current={current ? "true" : undefined}
        aria-label={`Ride to floor ${floor.number}: ${floor.name}`}
        className="group flex h-[51.4px] w-full cursor-pointer items-center gap-3 px-1.5 text-left sm:gap-[17px] sm:px-2.5 outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brass"
      >
        <FloorButton number={floor.number} current={current} pending={pending} />
        <span className="min-w-px flex-1 truncate font-inter text-[15px] leading-[normal] font-medium text-chalk sm:text-base transition-colors group-hover:text-white">
          {floor.name}
        </span>
        {floor.aiPowered && (
          <span className="shrink-0 font-inter text-[9px] leading-[normal] font-medium tracking-[0.4px] whitespace-nowrap text-signal uppercase sm:text-[10px] sm:tracking-[1.1px]">
            {whatWeMakeCopy.aiTag}
          </span>
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
};

/** The lobby's building directory: press a floor and the lift rides up to it. */
export function BuildingDirectory({ current, requested, onSelect }: DirectoryProps) {
  return (
    <nav
      data-wwm="directory"
      aria-label={whatWeMakeCopy.directoryTitle}
      className="relative flex h-[478px] w-full flex-col gap-[11px] overflow-clip rounded-[5px] border-[1.5px] border-brass bg-linear-to-b from-[#2d2a2c] to-[#252325] px-3 pt-[18px] pb-[22px] sm:px-[21px]"
    >
      {/* fine inner rule, like an engraved brass plate */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-[6px] border border-[rgba(182,154,86,0.33)]" />
      <h3 className="text-center text-xs leading-4 font-bold tracking-[2.7px] text-brass uppercase">{whatWeMakeCopy.directoryTitle}</h3>
      <ol className="relative flex w-full flex-col">
        {floors.map((floor) => (
          <FloorRow
            key={floor.number}
            floor={floor}
            current={floor.number === current}
            pending={floor.number === requested && requested !== current}
            onSelect={onSelect}
          />
        ))}
      </ol>
    </nav>
  );
}

/** Card describing the floor the lift has arrived at. */
export function SelectedService({ floor: floorNumber }: { floor: number }) {
  const floor = floorByNumber(floorNumber);
  return (
    <div className="flex min-h-[104px] w-full flex-col gap-[9px] overflow-clip rounded-[5px] bg-card-cream px-4 py-3.5 sm:min-h-[127px] sm:py-5 sm:pr-[22px] sm:pl-[23px] md:min-h-[127px]">
      {/* key: re-mounts on each floor, so the new text fades in */}
      <div key={floorNumber} className="flex animate-[service-in_0.45s_ease-out] flex-col gap-1.5 motion-reduce:animate-none sm:gap-[9px]">
        <div className="flex items-center gap-2.5">
          <h3 className="font-inter text-lg leading-[normal] font-bold whitespace-nowrap text-ink sm:text-2xl">{floor.name}</h3>
          {floor.aiPowered && (
            <span className="rounded-[3px] bg-signal-strong px-[9px] py-1 font-inter text-[10px] leading-[normal] font-bold tracking-[1.2px] whitespace-nowrap text-white uppercase">
              {whatWeMakeCopy.aiTag}
            </span>
          )}
        </div>
        {floor.description && <p className="font-inter text-sm leading-[22px] text-ink sm:text-base sm:leading-[25px]">{floor.description}</p>}
      </div>
    </div>
  );
}

/**
 * Phones: the building directory as one brass dropdown above the lift (the
 * full list of floors needs more room than a phone has). Picking a floor sends
 * the lift there, like pressing its button.
 */
export function FloorSelect({ requested, onSelect, className }: { requested: number; onSelect: (floor: number) => void; className?: string }) {
  return (
    <label className={cn("relative block w-full", className)}>
      <span className="sr-only">{whatWeMakeCopy.directoryTitle}</span>
      <select
        value={requested}
        onChange={(e) => onSelect(Number(e.target.value))}
        className="h-11 w-full cursor-pointer appearance-none rounded-[5px] border-[1.5px] border-brass bg-linear-to-b from-[#2d2a2c] to-[#252325] pr-11 pl-4 font-inter text-[15px] font-medium text-chalk outline-none focus-visible:ring-2 focus-visible:ring-brass [&>option]:bg-[#252325] [&>option]:text-chalk"
      >
        {floors.map((floor) => (
          <option key={floor.number} value={floor.number}>
            {`${floor.number} · ${floor.name}${floor.aiPowered ? ` (${whatWeMakeCopy.aiTag})` : ""}`}
          </option>
        ))}
      </select>
      {/* brass chevron */}
      <svg aria-hidden="true" viewBox="0 0 12 8" className="pointer-events-none absolute top-1/2 right-4 h-2 w-3 -translate-y-1/2 text-brass">
        <path d="M1 1.5 6 6.5 11 1.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </label>
  );
}
