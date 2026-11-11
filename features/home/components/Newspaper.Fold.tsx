import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Where the paper folds, in the fold's own box:
 *  - `axis`: "y", folded down the middle (right half over the left), or "x",
 *    folded across (bottom half up over the top);
 *  - `hinge`: where the fold runs (its x for "y", its y for "x");
 *  - `origin`: the point the sheet is turned about (and the 3D view centre);
 *  - `tilt`: the sheet's turn (deg); `shift`: how far right (% of the box) the
 *    folded half sits so it lies centred;
 *  - `back`: the half of the sheet that folds over (the back page shows there, flipped);
 *  - `shadow` / `crease`: the strip by the fold that darkens as the flap lifts,
 *    and the crease left down the middle.
 */
export type FoldGeometry = {
  axis: "x" | "y";
  hinge: string;
  origin: string;
  tilt: number;
  shift: number;
  back: CSSProperties;
  shadow: CSSProperties;
  crease: CSSProperties;
};

/** Desktop: the sheet as Figma places it in the 1440 section (centre 720.83, 750.33; 1202.92 × 891.52; -3°). */
export const desktopFold: FoldGeometry = {
  axis: "y",
  hinge: "720.83px",
  origin: "720.83px 750.33px",
  tilt: -3,
  shift: 20.83, // 300px of the 1440 frame
  back: { left: 720.83, top: 304.57, width: 601.46, height: 891.52 },
  shadow: { left: 500.83, top: 304.57, width: 220, height: 891.52 },
  crease: { left: 717.83, top: 304.57, height: 891.52 },
};

/** Smaller screens: the sheet is the box itself (tall), folded across the middle. */
export const compactFold: FoldGeometry = {
  axis: "x",
  hinge: "50%",
  origin: "50% 50%",
  tilt: 0,
  shift: 0,
  back: { left: 0, top: "50%", width: "100%", height: "50%" },
  shadow: { left: 0, top: "30%", width: "100%", height: "20%" },
  crease: { left: 0, top: "calc(50% - 3px)", width: "100%" },
};

/** The back of the folded paper: plain newsprint with faint columns of type. */
function BackPage({ small }: { small: boolean }) {
  const lines = small
    ? "bg-[repeating-linear-gradient(to_bottom,#e3ded4_0_3px,transparent_3px_9px)]"
    : "bg-[repeating-linear-gradient(to_bottom,#e3ded4_0_5px,transparent_5px_15px)]";
  return (
    <div className={cn("flex size-full flex-col bg-[#fbfaf6]", small ? "gap-3 px-[8%] py-[7%]" : "gap-6 px-12 py-10")}>
      <div
        className={cn(
          "flex items-center justify-between border-b-2 border-[#d8d2c6] font-inter font-semibold text-[#a69f93] uppercase",
          small ? "pb-1.5 text-[8px] tracking-[1.5px]" : "pb-3 text-xs tracking-[3px]"
        )}
      >
        <span>The CTM Times</span>
        <span>Back page</span>
      </div>
      <div className={cn("grid flex-1 grid-cols-2", small ? "gap-3" : "gap-8")}>
        <div className={cn("flex flex-col", small ? "gap-3" : "gap-6")}>
          <div className="h-1/4 rounded-sm bg-[#ebe6dc]" />
          <div className={cn("flex-1", lines)} />
        </div>
        <div className={cn("flex flex-col", small ? "gap-3" : "gap-6")}>
          <div className={cn("h-2/3", lines)} />
          <div className="flex-1 rounded-sm bg-[#ebe6dc]" />
        </div>
      </div>
    </div>
  );
}

/**
 * A newspaper that can be unfolded (see useNewspaperUnfold): `page` is folded
 * in half (see FoldGeometry), one half laid over the other, back page up. The
 * half underneath is the page itself; the flap carries a copy of the other
 * half on its front and the back page on its back, and turns about the fold. Once open
 * the flap is put away and the page is shown whole.
 *  - `flow`: the page sits in the layout (smaller screens) rather than over a
 *    fixed-size frame (desktop).
 */
export function PaperFold({ geometry, flow = false, page }: { geometry: FoldGeometry; flow?: boolean; page: () => ReactNode }) {
  const { axis, hinge, origin, tilt, shift, back, shadow, crease } = geometry;
  const box = flow ? "relative" : "absolute inset-0";
  const across = axis === "x";
  const clip = across
    ? { page: `inset(0 0 calc(100% - ${hinge}) 0)`, flap: `inset(${hinge} 0 0 0)` }
    : { page: `inset(0 calc(100% - ${hinge}) 0 0)`, flap: `inset(0 0 0 ${hinge})` };
  return (
    <div data-anim="paper" data-shift={shift} data-axis={axis} className={box}>
      {/* turned with the sheet, so the fold lies along the paper */}
      <div className={box} style={{ rotate: `${tilt}deg`, transformOrigin: origin, perspective: "2600px", perspectiveOrigin: origin }}>
        {/* the page (only its left half shows until it's open) */}
        <div data-anim="page" className={box} style={{ clipPath: clip.page }}>
          {page()}
        </div>

        {/* the shadow the lifting flap casts by the fold */}
        <span data-anim="fold-shadow" aria-hidden="true" className={cn("pointer-events-none absolute from-transparent to-black/45 opacity-0", across ? "bg-linear-to-b" : "bg-linear-to-r")} style={shadow} />

        {/* the flap: the right half, turning about the fold */}
        <div data-anim="flap" aria-hidden="true" inert className="absolute inset-0 transform-3d" style={{ transformOrigin: origin }}>
          <div className="absolute inset-0 backface-hidden" style={{ clipPath: clip.flap }}>
            {page()}
            <span data-anim="flap-shade" className="absolute bg-black opacity-0" style={back} />
          </div>
          <div className="absolute backface-hidden" style={{ ...back, transform: across ? "rotateX(180deg)" : "rotateY(180deg)" }}>
            <BackPage small={flow} />
          </div>
        </div>

        {/* the crease left down the middle once it's open */}
        <span
          data-anim="crease"
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute from-black/[0.05] via-white/70 to-black/[0.06] opacity-0",
            across ? "h-1.5 bg-linear-to-b" : "w-1.5 bg-linear-to-r"
          )}
          style={crease}
        />
      </div>
    </div>
  );
}
