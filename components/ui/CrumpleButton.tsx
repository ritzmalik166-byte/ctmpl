"use client";

import { useEffect, type ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";
import { useCrumpleHover } from "@/lib/animations/crumpleHover";
import { CrumpleLayers } from "./CrumpleLayers";

/**
 * A real <button> (e.g. a form's submit) with the same paper crumple hover as
 * the site's link buttons (see ButtonLink): crushed, it flips to its hover
 * colours, styled with `data-flipped:` in `className`, and sheds paper bits in
 * `chunkColors`. `crumple={false}` switches the effect off (e.g. while a form
 * sends and the button is disabled), back in its resting look.
 */
export function CrumpleButton({
  className,
  chunkColors,
  crumple = true,
  children,
  ...props
}: ComponentProps<"button"> & { chunkColors: readonly string[]; crumple?: boolean }) {
  const enabled = crumple && !props.disabled;
  const { ref, filterId } = useCrumpleHover<HTMLButtonElement>({ chunkColors, enabled });
  // switched off mid-hover: back to the resting colours
  useEffect(() => {
    if (!enabled) ref.current?.removeAttribute("data-flipped");
  }, [enabled, ref]);
  return (
    <button ref={ref} className={cn("relative", className)} {...props}>
      <CrumpleLayers filterId={filterId} />
      <span className="relative flex items-center justify-center gap-3">{children}</span>
    </button>
  );
}
