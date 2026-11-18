import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import ButtonLink from "@/components/ui/ButtonLink";
import { siteConfig } from "@/config/site";
import ctmLogo from "@/public/images/website/brand/ctm-logo.png";
import whatsappIcon from "@/public/icons/whatsapp-fill.svg";
import { HeaderShell } from "./HeaderShell";
import { SiteMenu } from "./SiteMenu";

/**
 * Site header, fixed to the top of the window (see HeaderShell): transparent
 * over the hero, paper-coloured once the page is scrolled; it slides away
 * while scrolling down and comes back when scrolling up.
 * Desktop: logo · WhatsApp · Start a project · menu.
 */
function Navbar() {
  return (
    <HeaderShell>
      <Container className="flex items-center justify-between gap-4">
        <Link href="/" aria-label={`${siteConfig.name} home`} className="shrink-0">
          <Image
            src={ctmLogo}
            alt={siteConfig.name}
            sizes="154px"
            loading="eager"
            className="h-10 w-auto sm:h-[54px]"
          />
        </Link>

        <div className="flex items-center gap-3 sm:gap-6 lg:gap-[46px]">
          {/* (WhatsApp sits close to "Start a project": the pill's own padding is most of the gap) */}
          <nav aria-label="Quick actions" className="flex items-center gap-1">
            {/*
              Just the icon; hovered, the button opens out smoothly to show "WhatsApp" beside it (and the paper still
              crumples into a white pill). The button keeps one size throughout and only its visible part grows,
              opening leftwards, so nothing reflows and the crumple plays on a steady shape; the hover area grows
              with it. Inside, the icon glides to the left end as it opens, the word appearing on its right; the
              contents are clipped to the button's rounded shape, so the word never shows outside it.
            */}
            <ButtonLink
              href={siteConfig.contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with us on WhatsApp"
              variant="whatsapp"
              className="group overflow-hidden [clip-path:inset(-10px_-10px_-10px_calc(100%-58px)_round_999px)] transition-[clip-path,scale]! duration-500! ease-[cubic-bezier(0.22,1,0.36,1)]! hover:[clip-path:inset(-10px_-10px_-10px_-10px_round_999px)] focus-visible:[clip-path:inset(-10px_-10px_-10px_-10px_round_999px)]"
            >
              {/* icon on the left, the word on its right: at rest slid over so the icon sits in the visible end, gliding back as it opens */}
              <span className="flex translate-x-[calc(100%-24px)] items-center transition-[translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-focus-visible:translate-x-0">
                {/* bigger at rest (always, scrolled or not); back to its usual size in the open pill, on hover */}
                <Image
                  src={whatsappIcon}
                  alt=""
                  width={24}
                  height={24}
                  unoptimized
                  className="origin-right scale-[1.34] transition-[scale] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-focus-visible:scale-100"
                />
                <span className="pl-2 whitespace-nowrap opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-hover:delay-100 group-hover:duration-300 group-focus-visible:opacity-100">WhatsApp</span>
              </span>
            </ButtonLink>

            <div className="hidden sm:block">
              <ButtonLink href="#contact" variant="primary">
                Start a project
              </ButtonLink>
            </div>
          </nav>

          {/* the menu: a special edition of The CTM Times (see SiteMenu) */}
          <SiteMenu />
        </div>
      </Container>
    </HeaderShell>
  );
}

export default Navbar;
