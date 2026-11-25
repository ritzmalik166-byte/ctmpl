import type { StaticImageData } from "next/image";
import award1 from "@/public/images/website/home/awards/award1.avif";
import award2 from "@/public/images/website/home/awards/award2.avif";
import award3 from "@/public/images/website/home/awards/award3.avif";
import award4 from "@/public/images/website/home/awards/award4.avif";
import award5 from "@/public/images/website/home/awards/award5.avif";
import award6 from "@/public/images/website/home/awards/award6.avif";
import award7 from "@/public/images/website/home/awards/award7.avif";
import award8 from "@/public/images/website/home/awards/award8.avif";
import award9 from "@/public/images/website/home/awards/award9.avif";
import award10 from "@/public/images/website/home/awards/award10.avif";
import award11 from "@/public/images/website/home/awards/award11.avif";

export const awardsCopy = {
  label: "Our wall of fame",
  hint: "Hover a frame to read about it",
  hintTouch: "Tap a frame to read about it",
} as const;

export type Award = {
  image: StaticImageData;
  /** On the note that slides out of the frame. */
  title: string;
  text: string;
};

/**
 * The awards on the café wall, left to right. Titles and notes are written from
 * what's legible on each award; please check names, years and wording (and
 * fill in #8, whose plaque can't be read in the photo).
 */
export const awards: Award[] = [
  { image: award1, title: "BIG Dream Makers Award", text: "A certificate from the BIG Dream Makers awards, presented to Ritz Media World." },
  { image: award2, title: "Feverlive Award", text: "A studio-microphone trophy from Feverlive, presented to our founder, Ritesh Malik." },
  { image: award3, title: "ET Young Industry Leaders 2025", text: "The Economic Times honoured Ritesh Malik for Excellence in Integrated Advertising Solutions." },
  { image: award4, title: "AdAura Awards", text: "Generative AI Campaign of the Year, in the AI & Innovation Excellence category, awarded to Ritz Media World." },
  { image: award5, title: "Hindustan Times", text: "Hindustan Times featured our story and our work." },
  { image: award6, title: "Hindustan Times feature", text: "Another Hindustan Times feature on our work, kept in pride of place." },
  { image: award7, title: "My Property Fact", text: "Recognised on stage at a My Property Fact event." },
  { image: award8, title: "Gold trophy", text: "A gold trophy from our shelf. (Add the award's name and year here.)" },
  { image: award9, title: "Dainik Jagran Gaurav Ratna", text: "A Certificate of Excellence from Dainik Jagran, awarded to Ritesh Malik, Managing Director." },
  { image: award10, title: "ET Excellence Leadership", text: "Featured by The Economic Times for excellence and leadership, a shout-out to the whole Ritz Media World team." },
  { image: award11, title: "Red FM 93.5 Special Achievement Award", text: "Retail Category, Delhi, presented to Creative Thinks Media at its National Sales Meet in Goa, 2011." },
];
