import instagram from "@/public/icons/social/instagram.svg";
import linkedin from "@/public/icons/social/linkedin.svg";
import youtube from "@/public/icons/social/youtube.svg";
import facebook from "@/public/icons/social/facebook.svg";
import x from "@/public/icons/social/x.svg";

/** Footer content (Figma 75:1251). Links point to "#" until the pages exist. */
export const footerContent = {
  about: "A full-service creative and advertising agency in Noida. The lights on the fourth floor are usually ours.",
  social: [
    { label: "Instagram", icon: instagram, href: "#" },
    { label: "LinkedIn", icon: linkedin, href: "#" },
    { label: "YouTube", icon: youtube, href: "#" },
    { label: "Facebook", icon: facebook, href: "#" },
    { label: "X (Twitter)", icon: x, href: "#" },
  ],
  columns: [
    {
      heading: "Company",
      links: ["About us", "Clients", "Portfolio", "Careers", "Contact us"],
    },
    {
      heading: "Services",
      links: ["Print", "Radio", "Production", "Event Management", "Artist Management", "Digital Marketing"],
    },
    {
      heading: "Read and listen",
      links: ["Print", "Radio", "Production", "Event Management", "Artist Management", "Digital Marketing"],
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
