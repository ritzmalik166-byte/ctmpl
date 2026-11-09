import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import ButtonLink from "@/components/ui/ButtonLink";
import { siteConfig } from "@/config/site";
import ctmLogo from "@/public/images/website/brand/ctm-logo.png";
import whatsappIcon from "@/public/icons/whatsapp-fill.svg";

/**
 * Site header. Floats over the top of the page so the hero art shows
 * behind it. Desktop: logo · WhatsApp · Start a project · menu.
 */
function Navbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-50 py-[7px]">
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
            <a
              href={siteConfig.contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with us on WhatsApp"
              className="flex shrink-0 items-center gap-2 font-inter text-sm leading-[19.5px] font-semibold text-ink-strong capitalize transition-opacity hover:opacity-75"
            >
              <Image src={whatsappIcon} alt="" width={24} height={24} unoptimized />
              <span className="hidden md:inline">WhatsApp</span>
            </a>

            <div className="hidden sm:block">
              <ButtonLink href="#contact" variant="primary">
                Start a project
              </ButtonLink>
            </div>
          </nav>

          {/* Menu panel arrives with the next design step; button is wired for it. */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={false}
            className="flex size-12 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-full border border-sand-line bg-white drop-shadow-soft transition-transform hover:scale-105 lg:size-16"
          >
            <span className="h-0.5 w-5 rounded-[1px] bg-ink-strong" />
            <span className="h-0.5 w-5 rounded-[1px] bg-ink-strong" />
            <span className="h-0.5 w-5 rounded-[1px] bg-ink-strong" />
          </button>
        </div>
      </Container>
    </header>
  );
}

export default Navbar;
