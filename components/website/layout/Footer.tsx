import Image from "next/image";
import Link from "next/link";
import { footerContent } from "@/config/footer";
import { siteConfig } from "@/config/site";
import { FooterSkyline } from "./FooterSkyline";
import ctmLogoLight from "@/public/images/website/brand/ctm-logo-light.png";

/**
 * The site footer (Figma 75:1250 + 75:1251): the office at night (the CTM
 * building among the city's lit windows, 1440 × 507; the sky goes round from
 * night to day and back, see FooterSkyline), then the dark footer:
 * logo, a line about the studio and social links on the left; Company,
 * Services and Read-and-listen links on the right; the legal line below.
 * Desktop as in Figma (88px sides); on smaller screens the columns stack.
 */
function Footer() {
  const { about, social, columns, copyright, privacy } = footerContent;
  return (
    <footer>
      {/* the office, night turning to day and back: always its full picture (height grows with
          the width, 507 at 1440), except on narrow screens where it keeps 240px and trims the sides */}
      <FooterSkyline />

      <div className="bg-[#181a27]">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 xl:px-[88px]">
          <div className="flex flex-col gap-12 py-12 lg:flex-row lg:items-center lg:justify-between xl:py-14">
            {/* the studio */}
            <div className="flex max-w-[316px] flex-col items-start gap-6 lg:w-[316px] lg:shrink-0">
              <Link href="/" aria-label={siteConfig.name}>
                <Image src={ctmLogoLight} alt={siteConfig.name} sizes="170px" className="h-auto w-[170px]" />
              </Link>
              <p className="font-inter text-base leading-[23.5px] text-white/60">{about}</p>
              <ul className="flex gap-4">
                {social.map(({ label, icon, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      aria-label={label}
                      className="flex h-10 w-[39px] items-center justify-center rounded-[5px] bg-white transition-colors hover:bg-[#f8c316]"
                    >
                      <Image src={icon} alt="" width={24} height={24} unoptimized />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* links */}
            <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 xl:flex xl:justify-end xl:gap-[43px]">
              {columns.map(({ heading, links }) => (
                <div key={heading} className="flex flex-col items-start gap-4 xl:w-[240px]">
                  <h2 className="font-inter text-base leading-[normal] font-semibold whitespace-nowrap text-[#f8c316] uppercase">{heading}</h2>
                  <ul className="flex flex-col gap-2.5 font-inter text-base leading-6 text-white/60">
                    {links.map((label) => (
                      <li key={label}>
                        <Link href="#" className="transition-colors hover:text-white">
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          {/* legal */}
          <div className="flex flex-col gap-3 border-t border-[#3d3f4e] pt-6 pb-[39px] font-inter text-[13px] leading-[18px] text-[#cbcde0] sm:flex-row sm:items-center sm:justify-between">
            <p>{copyright}</p>
            <Link href="#" className="underline transition-colors hover:text-white">
              {privacy}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
