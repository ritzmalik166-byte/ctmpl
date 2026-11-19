"use client";

import Image from "next/image";
import { useScrollReveal } from "@/lib/animations/scrollReveal";
import { Cafe } from "@/features/home/components/StartConversation.Cafe";
import { AwardsGrid } from "@/features/home/components/StartConversation.AwardsWall";
import { FooterCounter } from "@/features/home/components/Footer.Counter";
import paperWall from "@/public/images/website/home/who-we-are/paper-wall.jpg";

/**
 * The site footer: the studio's café. On top, the café scene (the barista at
 * the counter, the awards on the wall, "Find us online" chalked on the board;
 * see Cafe); below it the counter runs on down, with the studio's
 * silver-framed sign, its links on cardboard signs, our numbers, email and
 * address and the small print all hung on it (FooterCounter). On phones the
 * awards hang above the scene, two across. Everything rises or drops in as it
 * scrolls into view (useScrollReveal).
 */
function Footer() {
  const ref = useScrollReveal();
  return (
    // overflow-hidden: while things come in they sit a little off; never let that hang below the page
    <footer ref={ref} className="relative isolate overflow-hidden">
      {/* the café's paper wall (seen above the scene on phones), washed cool grey-blue */}
      <Image src={paperWall} alt="" fill sizes="100vw" className="-z-10 object-cover object-top" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[rgba(217,226,230,0.6)]" />

      {/* phones: the awards, hung two across above the scene */}
      <AwardsGrid className="pt-4 pb-10 md:hidden" />
      <Cafe />
      <FooterCounter />
    </footer>
  );
}

export default Footer;
