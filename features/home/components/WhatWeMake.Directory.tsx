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
    <li className="border-b border-dashed border-[rgba(116,96,68,0.33)] last:border-b-0">
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
    <div className="flex min-h-[127px] w-full flex-col gap-[9px] overflow-clip rounded-[5px] bg-card-cream py-5 pr-[22px] pl-[23px]">
      {/* key: re-mounts on each floor, so the new text fades in */}
      <div key={floorNumber} className="flex animate-[service-in_0.45s_ease-out] flex-col gap-[9px] motion-reduce:animate-none">
        <div className="flex items-center gap-2.5">
          <h3 className="font-inter text-xl leading-[normal] font-bold whitespace-nowrap text-ink sm:text-2xl">{floor.name}</h3>
          {floor.aiPowered && (
            <span className="rounded-[3px] bg-signal-strong px-[9px] py-1 font-inter text-[10px] leading-[normal] font-bold tracking-[1.2px] whitespace-nowrap text-white uppercase">
              {whatWeMakeCopy.aiTag}
            </span>
          )}
        </div>
        {floor.description && <p className="font-inter text-[15px] leading-6 text-ink sm:text-base sm:leading-[25px]">{floor.description}</p>}
      </div>
    </div>
  );
}
