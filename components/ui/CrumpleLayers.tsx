/**
 * The extra layers the paper crumple hover needs inside its element (see
 * useCrumpleHover): the edge-buckling SVG filter and the crease facets.
 */
export function CrumpleLayers({ filterId }: { filterId: string }) {
  return (
    <>
      {/* Edge-buckling filter, applied only while the crumple plays */}
      <svg aria-hidden="true" className="absolute size-0">
        <filter id={filterId} x="-10%" y="-50%" width="120%" height="200%">
          <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="2" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      {/* Crease facets: invisible at rest, flash on crumple, faint while hovered */}
      <span
        data-crumple-creases
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[url(/textures/paper-crumple.svg)] bg-size-[100%_100%] opacity-0 mix-blend-soft-light"
      />
    </>
  );
}
