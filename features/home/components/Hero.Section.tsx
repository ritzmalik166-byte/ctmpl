import Image from "next/image";
import Container from "@/components/ui/Container";
import ButtonLink from "@/components/ui/ButtonLink";
import { heroActions, heroHeadline, heroScene } from "../constants/hero.constants";
import officeBackground from "@/public/images/website/home/hero/office-background.png";
import HeroClock from "./Hero.Clock";
import { ReadingWoman, WelcomingMan } from "./Hero.Characters";
import { HeroRotatingLine } from "./Hero.RotatingLine";

/**
 * "Come in." The reception of the CTM office.
 *
 * Tablets and up (md+): the illustrated office fills the section at the
 * Figma ratio (1440×809) and the headline sits on top of it, on the left.
 * Phones (below md): the headline stacks above a cropped view of the scene
 * (reception desk and characters) so the art stays legible.
 *
 * Exactly one screen tall on phones and from xl up (md–xl keeps the Figma ratio):
 *  - on phones the scene takes the height left under the headline (never more
 *    than its usual crop), so everything shows without scrolling;
 *  - from xl the whole scene fits the screen, held to the bottom right; on a
 *    wider screen the wall carries on to the left, on a taller one up to the
 *    ceiling (see HeroScene), and the headline keeps its place on the wall.
 */
function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-svh flex-col justify-between overflow-hidden bg-cream md:block md:min-h-auto md:aspect-[1440/809] xl:aspect-auto xl:h-svh xl:min-h-[600px] xl:[container-type:size]"
    >
      {/* from xl: the scene is min(screen height, 56.18% of the width) tall, sitting at the bottom;
          the copy starts 27.57% of the way down it, as in the 1440 × 809 frame */}
      <Container className="relative z-10 pt-28 sm:pt-36 md:absolute md:inset-x-0 md:top-0 md:pt-[15.486vw] xl:pt-[calc(100cqh_-_0.7243*min(100cqh,56.18cqw))]">
        {/*
          The scene keeps scaling past 1440px but the container does not, so on
          wide screens nudge the copy left just enough to keep Figma's 487px gap
          to the woman. Resolves to 0 at 1440px and below.
        */}
        <div className="md:-translate-x-[max(0px,calc(9.097vw-131.5px))]">
          <h1 className="text-ink capitalize md:w-[36.25vw] md:max-w-[522px]">
            <span className="block h-[1.0575em] text-hero-xl leading-[1.382] font-semibold md:text-hero-xl-scene">
              {heroHeadline.lead}
            </span>
            {/* the line after it changes every few seconds, written out (see HeroRotatingLine) */}
            <HeroRotatingLine />
          </h1>

          {/* Phones: full-width stacked buttons. From 400px: inline, as in Figma; on tablets a little
              smaller, so they stay clear of the reading woman */}
          <div className="mt-7 flex flex-col gap-3 min-[400px]:flex-row min-[400px]:flex-wrap min-[400px]:items-center min-[400px]:gap-[19px] md:mt-[clamp(1.5rem,2.361vw,2.125rem)] md:max-lg:[zoom:0.72]">
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

/**
 * The illustrated office. Layers are kept separate so they can animate later.
 * The picture (1440 × 809) is held to the bottom right: on phones it is as tall
 * as the space it has (at most 0.9 of the width, the usual crop of the desk),
 * from xl it fits the screen. Where it doesn't reach, the wall carries on:
 * to the left a mirrored strip of its own left edge, upward its top rows.
 */
function HeroScene() {
  return (
    <div
      aria-hidden="true"
      className="relative mt-4 min-h-[200px] w-full flex-1 [mask-image:linear-gradient(to_bottom,transparent,black_16%)] max-md:max-h-[calc(100vw*809/900)] sm:mt-0 md:absolute md:inset-0 md:mt-0 md:min-h-0 md:[mask-image:none]"
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
          alt=""
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

        {/* Paper puppets: she reads and talks, he welcomes you in */}
        <ReadingWoman style={heroScene.woman} />
        <WelcomingMan style={heroScene.man} />
      </div>
    </div>
  );
}

export default HeroSection;
