import type { StaticImageData } from "next/image";
import { navigationBlogs } from "@/config/navigation";
// placeholder photos (stock, from Lorem Picsum) until the blog's own images exist: swap these files for the real ones
import blog1 from "@/public/images/website/home/pinboard/blogs/dummy-1.jpg";
import blog2 from "@/public/images/website/home/pinboard/blogs/dummy-2.jpg";
import blog3 from "@/public/images/website/home/pinboard/blogs/dummy-3.jpg";
import blog4 from "@/public/images/website/home/pinboard/blogs/dummy-4.jpg";
import blog5 from "@/public/images/website/home/pinboard/blogs/dummy-5.jpg";
import blog6 from "@/public/images/website/home/pinboard/blogs/dummy-6.jpg";
import blog7 from "@/public/images/website/home/pinboard/blogs/dummy-7.jpg";
import blog8 from "@/public/images/website/home/pinboard/blogs/dummy-8.jpg";

export const pinboardCopy = {
  label: "Fresh from our minds",
  // Title Case written out (not CSS `capitalize`), ready for the word wave
  heading: "Notes Pinned Up This Week.",
  readBlog: "Read the blog",
  readNote: "read the note",
  /** On the article's card, under the rolled-up note. */
  readArticle: "Read the article",
} as const;

/** Three more articles for the board (placeholders until the blog is live). */
const moreNotes = [
  { tag: "Print · 25 Sep 2026", title: "Why print ads still earn their place on the table", href: "#" },
  { tag: "Artists · 18 Sep 2026", title: "Working with artists on a brand campaign", href: "#" },
  { tag: "Production · 11 Sep 2026", title: "Inside a one-day brand film shoot", href: "#" },
];

/** How each note is pinned: its paper colour, its tilt (deg) and its pin's colour. */
const noteLooks = [
  { paper: "#f3d6c9", tilt: -2, pin: "#d9533f" },
  { paper: "#d8e3ea", tilt: 1.5, pin: "#4f6d82" },
  { paper: "#f6e6c2", tilt: -1, pin: "#5b7a62" },
  { paper: "#dce6d1", tilt: 2, pin: "#d9533f" },
  { paper: "#f6e6c2", tilt: 1.2, pin: "#d9533f" },
  { paper: "#dce6d1", tilt: -1.8, pin: "#4f6d82" },
  { paper: "#f3d6c9", tilt: 2.2, pin: "#5b7a62" },
  { paper: "#d8e3ea", tilt: -1.2, pin: "#d9533f" },
] as const;

/** Each article's image, shown when its note's paper peels back (in the order of the notes). */
const noteImages: StaticImageData[] = [blog1, blog2, blog3, blog4, blog5, blog6, blog7, blog8];

/** The eight latest articles (the menu's five, then three more), each as a pinned note. */
export const pinboardNotes = [...navigationBlogs, ...moreNotes].slice(0, 8).map((blog, i) => ({ ...blog, ...noteLooks[i], image: noteImages[i] }));
