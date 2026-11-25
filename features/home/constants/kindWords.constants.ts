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

/** One testimonial per client button. */
export const testimonials: Testimonial[] = [
  {
    client: "Mahagun",
    quote: "The team at Creative Thinks Media literally cannot do any more justice to the name of their company. I have been nothing other than astounded by their out-of-the-box ideas and superb creative thinking.",
    name: "Mahagun",
    role: "Marketing Head",
  },
  {
    client: "Escorts Tractor",
    quote: "I must admit that CTM and its team of professionals are always on my favourite list. They have always delivered the best services to me, even if they had to put in extra effort, and their team has always been available for extensive support.",
    name: "Escorts Tractor",
    role: "Chief Communication Officer",
  },
  {
    client: "Bullmen Realty",
    quote: "They not only make sure that they deliver on their promises, but also educate you on what exactly needs to be done for your brand, preventing you from under- or overspending your precious money.",
    name: "Bullmen Realty",
    role: "Managing Director",
  },
  {
    client: "Madhusudan Ghee",
    quote: "To me, advertising my brand was merely a means to ensure my elongated presence in the market. Thanks to Creative Thinks Media, my advertisements not only ensured my brand's sustenance but have also got me a great number of quality leads.",
    name: "Madhusudan Ghee",
    role: "Managing Director",
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
