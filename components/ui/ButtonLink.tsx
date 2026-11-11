"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";
import { useCrumpleHover } from "@/lib/animations/crumpleHover";

const base =
  "relative inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full capitalize transition-[scale] duration-150 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal-blue";

type Variant = {
  className: string;
  /** Paper crumple hover: colours of the chunks it sheds (omit = no crumple). */
  crumple?: readonly string[];
};

/**
 * Hover looks are styled with `data-flipped:` — the crumple effect sets that
 * attribute at the moment the paper is most crushed, so colours change mid-crumple.
 */
const variants = {
  /** Blue pill: header "Start a project" */
  primary: {
    className:
      "bg-royal-blue px-10 py-2.5 font-inter text-sm leading-[19.5px] font-bold tracking-[-0.325px] text-white shadow-lg transition-[scale,filter] hover:brightness-110",
  },
  /** Soft paper pill: hero "Take the office tour" → clay with white text */
  soft: {
    className:
      "bg-[radial-gradient(closest-side,var(--color-blush),var(--color-paper))] px-[21px] py-3 text-[15px] leading-[normal] font-bold text-ink data-flipped:bg-clay data-flipped:bg-none data-flipped:text-white",
    crumple: ["var(--color-ivory)", "var(--color-clay)", "var(--color-blush)"],
  },
  /** Terracotta pill: hero "See our work" → cream with dark text */
  brand: {
    className:
      "bg-terracotta px-[33px] py-3 text-[15px] leading-[normal] font-bold text-white data-flipped:bg-paper-cream data-flipped:text-ink-soft",
    crumple: ["var(--color-terracotta)", "var(--color-paper-cream)", "var(--color-clay)"],
  },
  /** Orange pill with a folded corner: filing room "View all projects" → cream with dark text */
  folded: {
    className:
      "bg-[#d16a42] bg-[url(/images/website/home/creative-playground/folded-accent.svg)] bg-size-[119px_69px] bg-position-[112.6%_0] bg-no-repeat px-[29px] py-[18px] font-inter text-xl leading-[normal] font-bold tracking-[-0.4px] text-[#faf6ef] shadow-[0_3px_5px_0_rgba(131,80,49,0.09)] data-flipped:bg-paper-cream data-flipped:bg-none data-flipped:text-ink-soft",
    crumple: ["#d16a42", "var(--color-paper-cream)", "#b95534"],
  },
} satisfies Record<string, Variant>;

export type ButtonVariant = keyof typeof variants;

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
};

/** A link styled as one of the design system's pill buttons. */
function ButtonLink({ variant = "primary", className, children, ...props }: ButtonLinkProps) {
  const style: Variant = variants[variant];
  const hasCrumple = Boolean(style.crumple);
  const { ref, filterId } = useCrumpleHover<HTMLAnchorElement>({ enabled: hasCrumple, chunkColors: style.crumple });

  return (
    <Link ref={ref} className={cn(base, style.className, className)} {...props}>
      {hasCrumple && (
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
      )}
      <span className="relative">{children}</span>
    </Link>
  );
}

export default ButtonLink;
