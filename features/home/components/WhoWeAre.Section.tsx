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

      <Container className="relative pt-10 pb-10 md:pt-12 md:pb-12 xl:pt-[37px] xl:pb-4">
        <WhoWeAreHeader />
      </Container>

      {/* xl+: the whiteboard room, a little way under the header */}
      <div className="xl:mt-14">
        <WhiteboardScene />
        <WhiteboardMobile />
      </div>
    </section>
  );
}

export default WhoWeAreSection;
