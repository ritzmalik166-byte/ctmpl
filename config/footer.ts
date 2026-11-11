import instagram from "@/public/icons/social/instagram.svg";
import linkedin from "@/public/icons/social/linkedin.svg";
import youtube from "@/public/icons/social/youtube.svg";
import facebook from "@/public/icons/social/facebook.svg";

/** Footer content (Figma 75:1251). Links point to "#" until the pages exist. */
export const footerContent = {
  about: "A full-service creative and advertising agency in Noida. The lights on the fourth floor are usually ours.",
  social: [
    { label: "Instagram", icon: instagram, href: "#" },
    { label: "LinkedIn", icon: linkedin, href: "#" },
    { label: "YouTube", icon: youtube, href: "#" },
    { label: "Facebook", icon: facebook, href: "#" },
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
  copyright: "© 2008–2026 Creative Thinks Media. All rights reserved.",
  privacy: "Privacy policy",
};
