import { navigationBlogs } from "@/config/navigation";

export const pinboardCopy = {
  label: "Fresh from our minds",
  // Title Case written out (not CSS `capitalize`), ready for the word wave
  heading: "Notes Pinned Up This Week.",
  readBlog: "Read the blog",
  readNote: "read the note",
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

/** The eight latest articles (the menu's five, then three more), each as a pinned note. */
export const pinboardNotes = [...navigationBlogs, ...moreNotes].slice(0, 8).map((blog, i) => ({ ...blog, ...noteLooks[i] }));
