import localFont from "next/font/local";

/**
 * Self-hosted variable fonts (files live in /public/fonts).
 * Each font exposes a CSS variable that globals.css maps to a Tailwind
 * utility: `font-instrument`, `font-inter` and `font-caveat`.
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
  weight: "400 700",
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

/** Class string that registers every font variable on <html>. */
export const fontVariables = `${instrumentSans.variable} ${inter.variable} ${caveat.variable}`;
