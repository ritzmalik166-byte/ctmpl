import type { ButtonVariant } from "@/components/ui/ButtonLink";

export const heroActions: ReadonlyArray<{
  label: string;
  href: string;
  variant: ButtonVariant;
}> = [
  { label: "Take the office tour", href: "#who-we-are", variant: "soft" },
  { label: "See our work", href: "#our-work", variant: "brand" },
];

/**
 * The headline: "Come in." stays; the line after it changes every few seconds
 * (written out, see HeroRotatingLine). Each line: a lead-in, the big red word, the rest.
 */
export const heroHeadline = {
  lead: "Come in.",
  lines: [
    { before: "The ", word: "ideas", after: " are already at work." },
    { before: "The ", word: "stories", after: " are already on paper." },
    { before: "The ", word: "magic", after: " is already in the making." },
  ],
} as const;

/**
 * Positions of the scene layers, as % of the 1440×809 Figma frame.
 * Keeping them as percentages lets the whole scene scale as one picture.
 */
export const heroScene = {
  /** 80×80 box centred on the clock face in the background (647.5, 135.5) */
  clock: { left: "42.188%", top: "11.805%", width: "5.556%" },
  clockLabelPatch: { left: "44.236%", top: "18.665%", width: "1.389%", height: "0.865%" },
  clockLabel: { left: "45.069%", top: "18.665%" },
  woman: { left: "40.903%", top: "29.79%", width: "14.792%" },
  man: { left: "70.903%", top: "27.565%", width: "20.972%" },
} as const;
