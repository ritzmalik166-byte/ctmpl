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

      <Container className="relative pt-14 pb-14 md:pt-16 md:pb-16 xl:pt-[60px] xl:pb-0">
        <WhoWeAreHeader />
      </Container>

      {/* the whiteboard room: as far under the header as the header is under the top of the section (xl: 60px) */}
      <div className="xl:mt-[60px]">
        <WhiteboardScene />
        <WhiteboardMobile />
      </div>
    </section>
  );
}

export default WhoWeAreSection;
