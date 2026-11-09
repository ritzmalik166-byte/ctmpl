import Image from "next/image";
import Container from "@/components/ui/Container";
import ButtonLink from "@/components/ui/ButtonLink";
import { heroActions, heroScene } from "../constants/hero.constants";
import officeBackground from "@/public/images/website/home/hero/office-background.png";
import HeroClock from "./Hero.Clock";
import { ReadingWoman, WelcomingMan } from "./Hero.Characters";

/**
 * "Come in." The reception of the CTM office.
 *
 * Desktop (lg+): the illustrated office fills the section at the Figma
 * ratio (1440×809) and the headline sits on top of it, on the left.
 * Below lg: the headline stacks above a cropped view of the scene
 * (reception desk and characters) so the art stays legible.
 */
function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex flex-col overflow-hidden bg-cream lg:block lg:aspect-[1440/809]"
    >
      <Container className="relative z-10 pt-28 sm:pt-36 lg:absolute lg:inset-x-0 lg:top-0 lg:pt-[15.486vw]">
        {/*
          The scene keeps scaling past 1440px but the container does not, so on
          wide screens nudge the copy left just enough to keep Figma's 487px gap
          to the woman. Resolves to 0 at 1440px and below.
        */}
        <div className="lg:-translate-x-[max(0px,calc(9.097vw-131.5px))]">
          <h1 className="text-ink capitalize lg:w-[36.25vw] lg:max-w-[522px]">
            <span className="block h-[1.0575em] text-hero-xl leading-[1.382] font-semibold lg:text-hero-xl-scene">
              Come in.
            </span>
            <span className="block text-[0px] leading-[0]">
              <span className="text-hero-lg leading-[1.382] font-semibold lg:text-hero-lg-scene">
                {"The "}
              </span>
              {/* Tighter leading on the large word keeps the line box at Figma's height */}
              <span className="text-hero-xl leading-[1.3] font-semibold text-brand-red lg:text-hero-xl-scene">
                ideas
              </span>
              <span className="text-hero-lg leading-[1.382] font-semibold lg:text-hero-lg-scene">
                {" are already at work."}
              </span>
            </span>
          </h1>

          {/* Phones: full-width stacked buttons. From 400px: inline, as in Figma */}
          <div className="mt-7 flex flex-col gap-3 min-[400px]:flex-row min-[400px]:flex-wrap min-[400px]:items-center min-[400px]:gap-[19px] lg:mt-[clamp(1.5rem,2.361vw,2.125rem)]">
            {heroActions.map((action) => (
              <ButtonLink key={action.href} href={action.href} variant={action.variant}>
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

/** The illustrated office. Layers are kept separate so they can animate later. */
function HeroScene() {
  return (
    <div
      aria-hidden="true"
      // floor line (93% down the scene) where the gateway's paper ball lands
      data-gateway-floor="0.93"
      className="relative mt-4 aspect-[900/809] w-full [mask-image:linear-gradient(to_bottom,transparent,black_16%)] sm:mt-0 lg:absolute lg:inset-0 lg:mt-0 lg:aspect-auto lg:[mask-image:none]"
    >
      {/* Below lg the 1440-wide scene is shifted left to frame the reception desk */}
      <div className="@container absolute inset-y-0 left-[-60%] w-[160%] lg:left-0 lg:w-full">
        <Image
          src={officeBackground}
          alt=""
          fill
          sizes="(min-width: 1024px) 100vw, 160vw"
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

        {/* Paper puppets: she reads and talks, he welcomes you in */}
        <ReadingWoman style={heroScene.woman} />
        <WelcomingMan style={heroScene.man} />
      </div>
    </div>
  );
}

export default HeroSection;
