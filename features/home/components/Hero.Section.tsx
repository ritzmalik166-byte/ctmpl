import Image from "next/image";
import Container from "@/components/ui/Container";
import ButtonLink from "@/components/ui/ButtonLink";
import { heroActions, heroHeadline, heroScene } from "../constants/hero.constants";
// (the office without anyone in it: the reception is drawn on top, see HeroReception)
import officeBackground from "@/public/images/website/home/hero/office-background-empty.png";
import HeroClock from "./Hero.Clock";
import { HeroReception } from "./Hero.Characters";
import { HeroRotatingLine } from "./Hero.RotatingLine";

function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex flex-col overflow-hidden bg-cream md:block md:min-h-auto md:aspect-[1440/809] xl:aspect-auto xl:h-svh xl:min-h-[600px] xl:[container-type:size]"
    >
      <Container className="relative z-10 pt-28 sm:pt-36 md:absolute md:inset-x-0 md:top-0 md:pt-[15.486vw] xl:pt-[calc(100cqh_-_0.7243*min(100cqh,56.18cqw))]">
      
        <div className="md:-translate-x-[max(0px,calc(9.097vw-131.5px))]">
          <h1 className="text-ink capitalize md:w-[36.25vw] md:max-w-[522px]">
            <span className="block h-[1.0575em] text-hero-xl leading-[1.382] font-semibold md:text-hero-xl-scene">
              {heroHeadline.lead}
            </span>
            <HeroRotatingLine />
          </h1>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-[19px] md:mt-[calc(clamp(0.75rem,1.111vw,1rem)+20px)] md:max-lg:mt-[calc(clamp(0.75rem,1.111vw,1rem)+27.8px)] md:max-lg:[zoom:0.72]">
            {heroActions.map((action) => (
              <ButtonLink key={action.href} href={action.href} variant={action.variant} className="max-sm:w-full">
                {action.label}
              </ButtonLink>
            ))}
          </div>
        </div>
      </Container>

      <HeroScene />
    </section>
  );
}

function HeroScene() {
  return (
    <div
      aria-hidden="true"
      className="relative -mt-2 h-[calc(100vw*809/900)] w-full [mask-image:linear-gradient(to_bottom,transparent,black_12%)] md:absolute md:inset-0 md:mt-0 md:h-auto md:[mask-image:none]"
    >
      <div
        // floor line (93% down the scene) where the gateway's paper ball lands
        data-gateway-floor="0.93"
        className="@container absolute top-0 right-0 aspect-[1440/809] h-full md:left-0 md:aspect-auto md:w-full xl:top-auto xl:bottom-0 xl:left-auto xl:aspect-[1440/809] xl:h-auto xl:w-[min(100cqw,calc(100cqh*1440/809))]"
      >
        {/* the wall carrying on to the left (seen when the screen is wider than the picture) */}
        <span className="absolute inset-y-0 right-full w-screen bg-[url(/images/website/home/hero/office-wall-tile.webp)] bg-size-[auto_100%] bg-right bg-repeat-x md:hidden xl:block" />
        {/* ...and up to the ceiling (seen when it's taller), lamp cords and all */}
        <span className="absolute inset-x-0 bottom-full hidden h-screen bg-[url(/images/website/home/hero/office-top-strip.webp)] bg-size-[100%_auto] bg-bottom bg-repeat-y xl:block" />
        <Image
          src={officeBackground}
          alt="The reception of the Creative Thinks Media office, with a receptionist on the phone and two colleagues welcoming you in."
          fill
          sizes="(min-width: 768px) 100vw, 160vw"
          quality={90}
          loading="eager"
          fetchPriority="high"
          className="object-cover"
        />

        {/* Clock: the face is part of the background; the hands run on live IST */}
        <span className="absolute bg-clock-face" style={heroScene.clockLabelPatch} />
        <span
          className="absolute -translate-x-1/2 font-inter text-[0.694cqw] leading-[normal] font-bold whitespace-nowrap text-terracotta-deep"
          style={heroScene.clockLabel}
        >
          CTM
        </span>
        <HeroClock style={heroScene.clock} />

        {/* The reception: she reads, the receptionist takes a call at the desk, he leans on it */}
        <HeroReception style={heroScene.reception} />
      </div>
    </div>
  );
}

export default HeroSection;
