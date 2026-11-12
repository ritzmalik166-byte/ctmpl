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
          <nav aria-label="Quick actions" className="flex items-center gap-4">
            {/* paper crumple on hover, turning into a white pill */}
            <ButtonLink
              href={siteConfig.contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with us on WhatsApp"
              variant="whatsapp"
            >
              <span className="flex items-center gap-2">
                <Image src={whatsappIcon} alt="" width={24} height={24} unoptimized />
                <span className="hidden md:inline">WhatsApp</span>
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
