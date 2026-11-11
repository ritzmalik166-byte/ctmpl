/**
 * The site menu (the "CTM Times" menu edition, see SiteMenu): pages, services,
 * latest blogs and the quick contact form. Links point to "#" until the pages
 * exist (Home and Contact Us already work).
 */
export const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "#" },
  { label: "Portfolio", href: "#" },
  { label: "Clients", href: "#" },
  { label: "E-Books", href: "#" },
  { label: "Podcasts", href: "#" },
  { label: "Careers", href: "#" },
  { label: "About Us", href: "#" },
  { label: "Contact Us", href: "/#start-a-conversation" },
];

export const navigationServices = [
  { title: "Print", text: "Press ads, brochures and hoardings: everything that has to look good on paper.", href: "#" },
  { title: "Radio", text: "Jingles, spots and on-air campaigns people hum on the way to work.", href: "#" },
  { title: "Production", text: "Films, ad shoots and reels, from the first storyboard to the final cut.", href: "#" },
  { title: "Event Management", text: "Launches, activations and stage shows, planned down to the last cue.", href: "#" },
  { title: "Artist Management", text: "The right faces and voices for your brand, booked and looked after.", href: "#" },
  { title: "Digital Marketing", text: "Social, search and performance campaigns that turn scrolls into calls.", href: "#" },
  { title: "Creative Agency", text: "Ideas, identities and campaigns, all made in-house in Noida.", href: "#" },
];

export const navigationBlogs = [
  { tag: "Real estate · 01 Nov 2026", title: "Creative marketing for real estate", href: "#" },
  { tag: "Agency · 24 Oct 2026", title: "How to find the right creative digital marketing agency", href: "#" },
  { tag: "Radio · 17 Oct 2026", title: "Why a good jingle still beats a big budget", href: "#" },
  { tag: "Events · 09 Oct 2026", title: "What makes a product launch worth showing up for", href: "#" },
  { tag: "Digital · 02 Oct 2026", title: "Reels that sell: short videos for local brands", href: "#" },
];

/** Ways to reach the studio, printed at the foot of the menu. */
export const navigationContacts = [
  {
    label: "Call",
    links: [
      { text: "+91 72900 02168", href: "tel:+917290002168" },
      { text: "+91 98118 69950", href: "tel:+919811869950" },
    ],
  },
  { label: "Write", links: [{ text: "info@creativethinksmedia.com", href: "mailto:info@creativethinksmedia.com" }] },
  { label: "Chat", links: [{ text: "WhatsApp Us", href: "https://wa.me/917290002168", external: true }] },
];

export const navigationCopy = {
  edition: "Menu edition",
  place: "Noida",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  close: "Close",
  pages: "Inside this edition",
  services: "Services",
  learnMore: "Learn more",
  blogs: "Latest from the blog",
  formTitle: "Letters to the editor",
  formIntro: "Tell us what you're making. We write back within a working day.",
  fields: [
    { name: "name", label: "Name", type: "text", autoComplete: "name", placeholder: "Your name" },
    { name: "email", label: "Email", type: "email", autoComplete: "email", placeholder: "you@company.com" },
    { name: "phone", label: "Phone", type: "tel", autoComplete: "tel", placeholder: "+91" },
  ],
  messageLabel: "Message",
  messagePlaceholder: "A few lines about your idea",
  send: "Send it in",
  sending: "Sending…",
  sent: { title: "Letter Sent!", text: "Thank you. Our team will contact you shortly." },
  imprint: "Creative Thinks Media · Sector 142, Noida · Since 2008",
};
