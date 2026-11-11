import localFont from "next/font/local";

/**
 * Self-hosted variable fonts (files live in /public/fonts).
 * Each font exposes a CSS variable that globals.css maps to a Tailwind
 * utility: `font-instrument`, `font-inter`, `font-caveat`, `font-typewriter`
 * and `font-jakarta`.
 */

export const instrumentSans = localFont({
  src: "../public/fonts/instrument-sans/InstrumentSans-Variable.woff2",
  weight: "400 700",
  style: "normal",
  display: "swap",
  variable: "--font-instrument-sans-face",
});

export const inter = localFont({
  src: "../public/fonts/inter/Inter-Variable.woff2",
  weight: "100 900", // the variable file covers the full range (visitor passes use 800)
  style: "normal",
  display: "swap",
  variable: "--font-inter-face",
});

/** Handwriting, used for whiteboard and marker text. */
export const caveat = localFont({
  src: "../public/fonts/caveat/Caveat-Variable.woff2",
  weight: "400 700",
  style: "normal",
  display: "swap",
  variable: "--font-caveat-face",
});

/** Typewriter, used for typed paperwork (the filing room's case files). */
export const courierPrime = localFont({
  src: [
    { path: "../public/fonts/courier-prime/CourierPrime-400.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/courier-prime/CourierPrime-700.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-courier-prime-face",
});

/** Plus Jakarta Sans (latin), used for form labels (the meeting request). */
export const plusJakartaSans = localFont({
  src: "../public/fonts/plus-jakarta-sans/PlusJakartaSans-Variable.woff2",
  weight: "200 800",
  style: "normal",
  display: "swap",
  variable: "--font-plus-jakarta-sans-face",
});

/** Class string that registers every font variable on <html>. */
export const fontVariables = `${instrumentSans.variable} ${inter.variable} ${caveat.variable} ${courierPrime.variable} ${plusJakartaSans.variable}`;
