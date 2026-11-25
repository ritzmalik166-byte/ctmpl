import instagram from "@/public/icons/social/instagram.svg";
import linkedin from "@/public/icons/social/linkedin.svg";
import youtube from "@/public/icons/social/youtube.svg";
import facebook from "@/public/icons/social/facebook.svg";
import x from "@/public/icons/social/x.svg";

/** Footer content (Figma 75:1251). Links point to "#" until the pages exist. */
export const footerContent = {
  about: "A full-service creative and advertising agency in Noida, working across Delhi NCR since 2008. The lights on the fourth floor are usually ours.",
  social: [
    { label: "Instagram", icon: instagram, href: "https://www.instagram.com/ritzmediaworld" },
    { label: "LinkedIn", icon: linkedin, href: "https://www.linkedin.com/company/ritzmediaworld" },
    { label: "YouTube", icon: youtube, href: "https://www.youtube.com/c/RitzMediaWorldCreativeThinksMedia" },
    { label: "Facebook", icon: facebook, href: "https://www.facebook.com/ritzmediaworld" },
    { label: "X (Twitter)", icon: x, href: "https://x.com/ritzmediaworld" },
  ],
  columns: [
    {
      heading: "Company",
      links: ["About us", "Clients", "Portfolio", "Blog", "Careers", "Contact us"],
    },
    {
      heading: "What we make",
      links: ["Digital marketing", "Artist management", "Event management", "Radio advertising", "Print advertising", "AI creatives", "Reels", "Brand films"],
    },
    {
      heading: "Read and listen",
      links: ["Blog", "E-books", "Podcasts", "Company video", "Company profile"],
    },
  ],
  /** The pinboard footer (Figma 211:1226): the "Find us online" note and the contact note. */
  findUs: "Find us online",
  followUs: "follow us",
  contact: {
    call: { label: "Call us on", numbers: [{ text: "+91 72900 02168", href: "tel:+917290002168" }, { text: "+91 98119 65550", href: "tel:+919811965550" }] },
    mail: { label: "Mail us on", email: "ritz@creativethinksmedia.com" },
    visit: {
      label: "Visit",
      lines: ["402–404, 4th Floor, Corporate Park,", "Tower A1, Sector 142, Noida 201305"],
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Corporate%20Park%2C%20Tower%20A1%2C%20Sector%20142%2C%20Noida%20201305",
    },
  },
  copyright: "© 2008–2026 Creative Thinks Media. All rights reserved.",
  privacy: "Privacy policy",
};
