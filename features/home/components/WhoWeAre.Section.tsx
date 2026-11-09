import Image from "next/image";
import Container from "@/components/ui/Container";
import WhoWeAreHeader from "./WhoWeAre.Header";
import { WhiteboardMobile, WhiteboardScene } from "./WhoWeAre.Whiteboard";
import paperWall from "@/public/images/website/home/who-we-are/paper-wall.jpg";

/**
 * "Who we are": heading and intro on a paper wall, then the meeting room
 * whiteboard with CTM's numbers written on it.
 */
function WhoWeAreSection() {
  return (
    <section id="who-we-are" className="relative isolate overflow-hidden">
      <Image src={paperWall} alt="" fill sizes="100vw" className="-z-10 object-cover object-top" />

      <Container className="relative pt-12 pb-10 md:pb-14 xl:pt-[37px] xl:pb-0">
        <WhoWeAreHeader />
      </Container>

      {/* xl+: the whiteboard room starts 421px down the section, as in Figma */}
      <div className="xl:mt-[164px]">
        <WhiteboardScene />
        <WhiteboardMobile />
      </div>
    </section>
  );
}

export default WhoWeAreSection;
