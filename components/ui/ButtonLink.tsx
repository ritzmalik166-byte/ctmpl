"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";
import { useCrumpleHover } from "@/lib/animations/crumpleHover";
import { CrumpleLayers } from "./CrumpleLayers";
import { BUTTON_HEIGHT, BUTTON_SIZE } from "./buttonSize";

/**
 * The two-tone fill of "View all projects": burnt orange with a darker folded half,
 * split down the middle at the fold's slant (as its folded-accent artwork).
 */
const FOLDED_FILL = "bg-[linear-gradient(100deg,#d16a42_50%,#b95534_50.3%)]";

const base =
  "relative inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full capitalize transition-[scale] duration-150 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal-blue";

type Variant = {
  className: string;
  /** Paper crumple hover: colours of the chunks it sheds (omit = no crumple). */
  crumple?: readonly string[];
  /** Its size (default BUTTON_SIZE, the header "Start a project"'s). */
  size?: string;
};

/**
 * Hover looks are styled with `data-flipped:` — the crumple effect sets that
 * attribute at the moment the paper is most crushed, so colours change mid-crumple.
 */
const variants = {
  /** Two-tone burnt-orange pill (as "View all projects"): header "Start a project" → paper cream with dark text */
  primary: {
    className:
      FOLDED_FILL +
      " text-white shadow-lg data-flipped:bg-paper-cream data-flipped:bg-none data-flipped:text-ink-soft",
    crumple: ["#d16a42", "var(--color-paper-cream)", "#b95534"],
  },
  /** Plain icon + label: header "WhatsApp" → a white pill (the same height; narrower sides, as on phones it's just the icon) */
  whatsapp: {
    className:
      "gap-2 px-3 font-semibold text-ink-strong data-flipped:bg-white data-flipped:shadow-[0_3px_10px_rgba(60,40,20,0.14)]",
    crumple: ["#ffffff", "#25d366", "var(--color-paper-cream)"],
    size: BUTTON_HEIGHT,
  },
  /**
   * Soft paper pill: hero "Take the office tour" → paper cream with dark text.
   * On phones it's a dark espresso pill instead (there it sits on the hero's light wall, so it needs the contrast).
   */
  soft: {
    className:
      "bg-[radial-gradient(closest-side,var(--color-blush),var(--color-paper))] text-ink max-sm:bg-[linear-gradient(100deg,#3a2d26_50%,#2e2420_50.3%)] max-sm:text-paper-cream max-sm:shadow-[0_3px_8px_rgba(46,36,32,0.25)] data-flipped:bg-paper-cream data-flipped:bg-none data-flipped:text-ink-soft",
    crumple: ["var(--color-ivory)", "var(--color-clay)", "var(--color-blush)"],
  },
  /** Two-tone burnt-orange pill (as "View all projects"): hero "See our work" → cream with dark text */
  brand: {
    className:
      FOLDED_FILL +
      " text-white data-flipped:bg-paper-cream data-flipped:bg-none data-flipped:text-ink-soft",
    crumple: ["#d16a42", "var(--color-paper-cream)", "#b95534"],
  },
  /** Orange pill with a folded corner: filing room "View all projects" → cream with dark text */
  folded: {
    className:
      "bg-[#d16a42] bg-[url(/images/website/home/creative-playground/folded-accent.svg)] bg-size-[119px_69px] bg-position-[112.6%_0] bg-no-repeat text-[#faf6ef] shadow-[0_3px_5px_0_rgba(131,80,49,0.09)] data-flipped:bg-paper-cream data-flipped:bg-none data-flipped:text-ink-soft",
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
    <Link ref={ref} className={cn(base, style.size ?? BUTTON_SIZE, style.className, className)} {...props}>
      {hasCrumple && <CrumpleLayers filterId={filterId} />}
      <span className="relative">{children}</span>
    </Link>
  );
}

export default ButtonLink;
