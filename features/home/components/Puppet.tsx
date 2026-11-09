import Image, { type StaticImageData } from "next/image";
import type { CSSProperties, ReactNode } from "react";

/**
 * Building blocks for the paper-art puppets (hero + whiteboard characters).
 *
 * A puppet is a stack of full-size layers cut from one Figma image, so they
 * line up exactly; joints are wrappers that rotate around a pivot (like a
 * split-pin fastener). At rest the layers recompose the original artwork.
 */

/** Where a puppet sits in its scene, as % of the scene. */
export type Placement = { left: string; top: string; width: string };

/** One full-size layer of a puppet. Pass `part` to make it animatable on its own. */
export function Layer({ src, sizes, part, hidden }: { src: StaticImageData; sizes: string; part?: string; hidden?: boolean }) {
  return (
    <Image
      src={src}
      alt=""
      fill
      sizes={sizes}
      loading="eager"
      data-part={part}
      className="pointer-events-none select-none"
      style={hidden ? { opacity: 0 } : undefined}
    />
  );
}

/** A joint: its children rotate around `pivot` (CSS transform-origin, % of the artwork). */
export function Joint({ part, pivot, children }: { part: string; pivot: string; children: ReactNode }) {
  return (
    <div data-part={part} className="absolute inset-0" style={{ transformOrigin: pivot }}>
      {children}
    </div>
  );
}

/** Small overlay (mouth, eyelid) in % of the artwork; hidden (flattened) until animated. */
export function Overlay({ part, style, className }: { part: string; style: CSSProperties; className: string }) {
  return <span data-part={part} className={`absolute ${className}`} style={{ ...style, transform: "scaleY(0)" }} />;
}
