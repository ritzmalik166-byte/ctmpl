import instagram from "@/public/icons/social/instagram.svg";
import linkedin from "@/public/icons/social/linkedin.svg";
import youtube from "@/public/icons/social/youtube.svg";
import facebook from "@/public/icons/social/facebook.svg";
import x from "@/public/icons/social/x.svg";

/** Footer content (Figma 75:1251). Links point to "#" until the pages exist. */
export const footerContent = {
  about: "A full-service creative and advertising agency in Noida, working across Delhi NCR since 2008. The lights on the seventh floor are usually ours.",
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
  /**
   * Desktop (lg+): the note that's written out beside a link as it's hovered, a
   * line on what's behind it. By column ("social" for "Find us online"), then link.
   */
  hoverNotes: {
    social: {
      Instagram: "Creative reels, inspiring campaigns, fresh ideas and exclusive behind-the-scenes moments from our ever-evolving creative studio.",
      LinkedIn: "Industry insights, creative strategies, agency updates and fresh perspectives on the ideas shaping brands and businesses.",
      YouTube: "Explore brand films, campaigns and studio stories bringing creative ideas to life through powerful visuals.",
      Facebook: "Follow our latest campaigns, event highlights and behind-the-scenes moments from the Creative Thinks Media team.",
      "X (Twitter)": "Fresh takes on brands, bold ideas and trending conversations. Stay inspired, stay curious and stay ahead.",
    },
    Company: {
      "About us": "A creative agency in Noida, shaping brands through thoughtful ideas and impactful campaigns across Delhi NCR since 2008.",
      Clients: "Meet the brands that have trusted us with their stories, campaigns and creative journeys over the years.",
      Portfolio: "Explore the campaigns, films and brand experiences we've created to help businesses stand out and connect.",
      Blog: "Ideas, insights and inspiration from the world of advertising, branding and marketing. Straight from our creative studio.",
      Careers: "Big ideas, creative minds and room to grow. Join our team and help create work that makes brands stand out.",
      "Contact us": "Have a project in mind or an idea taking shape? Let's talk, explore possibilities and create something memorable together.",
    },
    "What we make": {
      "Digital marketing": "From search to social, we create digital campaigns that reach the right people and turn engagement into business growth.",
      "Artist management": "We connect brands with the right talent and manage every detail, from artist collaborations to impactful campaigns.",
      "Event management": "From corporate events to brand launches, we bring ideas to life with seamless planning and memorable experiences.",
      "Radio advertising": "From catchy jingles to impactful radio campaigns, we create memorable audio ads that connect brands with listeners.",
      "Print advertising": "Make your brand impossible to miss with creative newspaper, magazine and outdoor advertising campaigns that capture attention and stay memorable.",
      "AI creatives": "Ideas powered by AI, refined by human creativity, delivering fresh visuals, faster workflows and memorable brand experiences.",
      Reels: "Short, scroll-stopping videos for Instagram and beyond, hooked in the very first second.",
      "Brand films": "Stories on screen that show people who you are, from the first script to the final cut.",
    },
    map: {
      visit: "Corporate Park, Sector 142, Noida: take the lift to the 7th floor of Tower A2 and follow the buzz.",
    },
    "Read and listen": {
      Blog: "Fresh reads on marketing, advertising and brand building, from the people who do it every day.",
      "E-books": "Handy guides to download and keep: deeper dives into marketing that actually works.",
      Podcasts: "Conversations with makers, marketers and founders. Plug in on your commute.",
      "Company video": "Meet the studio in a few minutes: our people, our floor and the work we make.",
      "Company profile": "All about us on a few pages: what we do, who we do it for and how. Ready to download.",
    },
  } as Record<string, Record<string, string>>,
  /** The pinboard footer (Figma 211:1226): the "Find us online" note and the contact note. */
  findUs: "Find us online",
  followUs: "follow us",
  contact: {
    call: {
      label: "Call us on",
      /** Desktop: the "While you were out" message slip shown as a number is hovered (FooterHoverNote). */
      note: {
        heading: "While you were out",
        sub: "an important message",
        for: "You (yes, you!)",
        from: "Creative Thinks Media",
        boxes: ["Telephoned", "Please call", "Wants a brief", "Will call again"],
        ticked: [1, 2],
        message: "Got an idea brewing? Ring us: a real person from the studio picks up.",
        takenBy: "taken by: the studio",
      },
      numbers: [{ text: "+91 72900 02168", href: "tel:+917290002168" }, { text: "+91 98119 65550", href: "tel:+919811965550" }] },
    mail: {
      label: "Mail us on",
      email: "ritz@creativethinksmedia.com",
      /** Desktop: the letter rising out of an airmail envelope as the email is hovered (FooterHoverNote). */
      note: { title: "Write to us", message: "Briefs, ideas or a quick hello: every letter lands on a real desk.", sign: "the CTM team", airmail: "Par avion · Air mail" },
    },
    visit: {
      label: "Visit",
      lines: ["7th Floor, Tower A2, Corporate Park,", "Sector 142, Noida, Uttar Pradesh, India"],
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Creative%20Thinks%20Media%2C%20Tower%20A2%2C%20Corporate%20Park%2C%20Sector%20142%2C%20Noida",
      /** Desktop: the note shown as the address is hovered (FooterHoverNote): the office photo and this map. */
      noteTitle: "Come say hi!",
      photoCaption: "the 7th floor, on a busy day",
      mapTitle: "Creative Thinks Media on Google Maps",
      mapEmbed:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.22059770138!2d77.411435!3d28.50301!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce45f27594419%3A0x77b8ce8d435dfbd1!2sCreative%20Thinks%20Media!5e0!3m2!1sen!2sin!4v1795676220933!5m2!1sen!2sin",
    },
  },
  copyright: "© 2008–2026 Creative Thinks Media. All rights reserved.",
  privacy: "Privacy policy",
};
