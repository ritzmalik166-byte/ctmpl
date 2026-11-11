/** "Kind words" (Figma 75:286): what clients say, overheard at the water cooler. */
export const kindWordsCopy = {
  label: "Kind words",
  heading: "Overheard at the water cooler.",
  intro: "Arjun has the stories. Even our cardboard colleague from accounts stops to listen.",
  previous: "Previous testimonial",
  next: "Next testimonial",
  askArjun: "Ask Arjun for the next story",
  viewAll: "View all projects",
};

export type Testimonial = {
  /** The name on the client button. */
  client: string;
  quote: string;
  name: string;
  role: string;
};

/** One testimonial per client button. Only Sanskar's is real copy; the rest are placeholders. */
export const testimonials: Testimonial[] = [
  {
    client: "Sanskar",
    quote: "I have been nothing other than astound with their out of the box ideas and superb creative thinking.",
    name: "Sanskar",
    role: "Marketing Head",
  },
  {
    client: "Client_Two",
    quote: "They turned a tight brief into a campaign our whole team still talks about. Fast, sharp and always on brand.",
    name: "Client Two",
    role: "Brand Manager",
  },
  {
    client: "Client_Three",
    quote: "Every idea came with a reason behind it. Working with CTM felt like having a creative team in the next room.",
    name: "Client Three",
    role: "Founder",
  },
  {
    client: "Client_Four",
    quote: "From the first sketch to the final print, they made the whole process simple, and the results spoke for themselves.",
    name: "Client Four",
    role: "Head of Communications",
  },
  {
    client: "Client_Five",
    quote: "Bold ideas, delivered on time, every time. Our launch would not have landed the way it did without them.",
    name: "Client Five",
    role: "Marketing Director",
  },
];

export const testimonialClients = testimonials.map(({ client }) => client);

/**
 * The sticky notes on the notice board, cut from it so they can swing from
 * their top edge (px in the 1440 × 731 room).
 */
export const stickyNotes = [
  { color: "yellow", left: 865.13, top: 572.06, width: 86.63, height: 87.19, pivot: "50% 11.6%" },
  { color: "pink", left: 944.44, top: 584.44, width: 85.5, height: 86.06, pivot: "50% 11.1%" },
  { color: "green", left: 1023.75, top: 568.13, width: 84.94, height: 84.94, pivot: "50% 11.3%" },
] as const;
