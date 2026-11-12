"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef, type Ref } from "react";
import { navigationBlogs, navigationContacts, navigationCopy, navigationLinks, navigationServices } from "@/config/navigation";
import { MenuContactForm } from "./MenuContactForm";
import mastheadTitle from "@/public/images/website/home/newspaper/masthead-title.png";

/** From here up (lg) the menu is a full-screen page that fits without scrolling. */
const DESKTOP = "(min-width: 64rem)";

/** A column's heading, newspaper style: small caps between rules. */
function ColumnHeading({ children }: { children: string }) {
  return (
    <h2 className="border-y-2 border-[#2b2622] py-1.5 font-inter text-xs font-extrabold tracking-[3px] text-[#2b2622] uppercase">{children}</h2>
  );
}

/** Today, as a newspaper dates its edition. */
const today = () => new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

/**
 * Desktop: fit the whole page on screen. If its contents are taller than the
 * paper (short laptop screens), they're zoomed down to fit (CSS zoom, so the
 * text is laid out at the smaller size and stays sharp; the columns keep the
 * paper's width). Elsewhere: left as is.
 */
function useFitToPaper() {
  const paper = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const box = paper.current;
    const inner = content.current;
    if (!box || !inner) return;
    const fit = () => {
      inner.style.zoom = "";
      if (!window.matchMedia(DESKTOP).matches) return;
      const style = getComputedStyle(box);
      const room = (box.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)) * 0.98; // a little breathing room
      const height = () => inner.getBoundingClientRect().height; // as drawn, zoom included
      if (height() <= room) return;
      // zoomed out, the columns get relatively wider and wrap into fewer lines,
      // so zoom and measure again until it settles (only ever shrinking, so it always fits)
      let zoom = room / height();
      for (let i = 0; i < 6; i++) {
        inner.style.zoom = String(zoom);
        const drawn = height();
        if (drawn <= room) break;
        zoom *= room / drawn;
      }
    };
    fit();
    // fit again when the screen changes, or the contents do (the masthead loading in, the form's thank-you…)
    let queued = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(queued);
      queued = requestAnimationFrame(fit);
    });
    observer.observe(box);
    Array.from(inner.children).forEach((part) => observer.observe(part));
    return () => {
      observer.disconnect();
      cancelAnimationFrame(queued);
    };
  }, []);
  return { paper, content };
}

/**
 * The menu, printed as a special edition of The CTM Times: the masthead and
 * dateline, then:
 *  - the pages, as the edition's index;
 *  - the services, each a short article with a "Learn more" link;
 *  - the latest blog posts;
 *  - "Letters to the editor", the contact form;
 * and at the foot, ways to reach the studio (call, write, chat).
 * Desktop (lg): a full-screen page (95% × 95%), four columns side by side, all
 * on screen without scrolling (see useFitToPaper). Tablets and phones: the
 * sections one after another, the paper scrolling.
 * Links close the menu (`onNavigate`).
 */
export function MenuPaper({ onClose, onNavigate, closeRef }: { onClose: () => void; onNavigate: () => void; closeRef: Ref<HTMLButtonElement> }) {
  const { paper, content } = useFitToPaper();
  return (
    <div
      ref={paper}
      data-menu="paper"
      className="relative isolate mx-auto w-full max-w-[1280px] bg-[#fbf8f1] px-5 pt-5 pb-8 shadow-[0_30px_60px_-20px_rgba(40,25,10,0.45)] sm:px-8 sm:pt-6 lg:h-[95vh] lg:w-[95vw] lg:max-w-none lg:overflow-hidden lg:px-10 lg:pt-5 lg:pb-5"
    >
      {/* newsprint: a light paper grain */}
      <span aria-hidden="true" className="absolute inset-0 -z-10 bg-[url(/images/website/home/who-we-are/paper-wall.jpg)] bg-size-[512px] opacity-40 mix-blend-multiply" />

      <div ref={content} className="lg:origin-top-left">
        {/* masthead */}
        <header data-menu="part" className="flex flex-col items-center gap-3 lg:gap-2">
          <div className="flex w-full items-center justify-between gap-4 font-inter text-[10px] font-semibold tracking-[1.5px] text-[#57534e] uppercase sm:text-[11px]">
            <span>
              {navigationCopy.edition} · {navigationCopy.place}
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={navigationCopy.closeMenu}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-[#2b2622] px-3.5 py-1.5 text-[11px] font-bold tracking-[1.5px] text-[#2b2622] transition-colors hover:bg-[#2b2622] hover:text-[#fbf8f1]"
            >
              {navigationCopy.close}
              <span aria-hidden="true" className="text-base leading-none">
                ×
              </span>
            </button>
          </div>
          <Link href="/" onClick={onNavigate} aria-label="The CTM Times: home" className="w-[82%] max-w-[560px] lg:-mt-6 lg:w-[34%] lg:max-w-[440px]">
            <Image src={mastheadTitle} alt="The CTM Times" sizes="560px" className="h-auto w-full" />
          </Link>
          <p suppressHydrationWarning className="w-full border-y border-[#2b2622] py-1 text-center font-inter text-[10px] tracking-[1.5px] text-[#44403c] uppercase sm:text-[11px]">
            {today()}
          </p>
        </header>

        <div className="mt-6 grid gap-8 lg:mt-5 lg:grid-cols-[0.75fr_1.9fr_0.95fr_1.05fr] lg:gap-0">
          {/* the pages */}
          <nav data-menu="part" aria-label="Pages" className="flex flex-col gap-4 lg:gap-3 lg:pr-6">
            <ColumnHeading>{navigationCopy.pages}</ColumnHeading>
            <ol className="grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3 lg:grid-cols-1 lg:gap-y-0">
              {navigationLinks.map(({ label, href }, i) => (
                <li key={label}>
                  <Link href={href} onClick={onNavigate} className="group flex items-baseline gap-2.5 border-b border-dotted border-[#cfc6b5] py-2 font-inter text-[#1c1917] lg:py-[7px]">
                    <span className="font-inter text-[11px] font-bold text-[#e05a47] tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-lg leading-tight font-bold tracking-[-0.3px] transition-colors group-hover:text-[#e05a47] sm:text-xl lg:text-lg">{label}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>

          {/* the services */}
          <section data-menu="part" aria-label={navigationCopy.services} className="flex flex-col gap-4 lg:gap-3 lg:border-l lg:border-[#d8cfbf] lg:px-6">
            <ColumnHeading>{navigationCopy.services}</ColumnHeading>
            <div className="grid gap-x-8 sm:grid-cols-2 lg:gap-x-6">
              {navigationServices.map(({ title, text, href }) => (
                <article key={title} className="flex flex-col items-start gap-1.5 border-b border-[#d8cfbf] py-4 first:pt-0 sm:[&:nth-child(2)]:pt-0 lg:gap-1 lg:py-3">
                  <h3 className="font-inter text-xl leading-tight font-extrabold tracking-[-0.4px] text-[#1c1917] lg:text-lg">{title}</h3>
                  <p className="font-inter text-sm leading-6 text-[#57534e] lg:text-[13px] lg:leading-5">{text}</p>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    className="mt-0.5 border-b border-[#1c1917] pb-0.5 font-inter text-sm font-semibold text-[#1c1917] transition-colors hover:border-[#e05a47] hover:text-[#e05a47] lg:text-[13px]"
                  >
                    {navigationCopy.learnMore} →
                  </Link>
                </article>
              ))}
            </div>
          </section>

          {/* the blog, and letters (side by side on desktop) */}
          <div className="flex flex-col gap-8 lg:contents">
            <section data-menu="part" aria-label={navigationCopy.blogs} className="flex flex-col gap-4 lg:gap-3 lg:border-l lg:border-[#d8cfbf] lg:px-6">
              <ColumnHeading>{navigationCopy.blogs}</ColumnHeading>
              <ul className="flex flex-col">
                {navigationBlogs.map(({ tag, title, href }) => (
                  <li key={title} className="border-b border-[#d8cfbf] py-3 first:pt-0">
                    <Link href={href} onClick={onNavigate} className="group flex flex-col gap-1">
                      <span className="font-inter text-xs font-semibold text-[#e05a47]">{tag}</span>
                      <span className="font-inter text-base leading-snug font-bold text-[#1c1917] capitalize transition-colors group-hover:text-[#e05a47]">{title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section data-menu="part" aria-label={navigationCopy.formTitle} className="flex flex-col gap-3 lg:border-l lg:border-[#d8cfbf] lg:pl-6">
              <ColumnHeading>{navigationCopy.formTitle}</ColumnHeading>
              <p className="font-inter text-sm leading-6 text-[#57534e] lg:text-[13px] lg:leading-5">{navigationCopy.formIntro}</p>
              <MenuContactForm />
            </section>
          </div>
        </div>

        {/* the foot: ways to reach the studio, and the imprint */}
        <footer data-menu="part" className="mt-8 border-t-2 border-[#2b2622] lg:mt-4">
          <ul className="grid divide-y divide-[#d8cfbf] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {navigationContacts.map(({ label, links }) => (
              <li key={label} className="flex flex-col items-center gap-1 px-3 py-3 text-center lg:flex-row lg:justify-center lg:gap-3 lg:py-2.5">
                <span className="font-inter text-[11px] font-extrabold tracking-[2.5px] text-[#e05a47] uppercase">{label}</span>
                <span className="flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5">
                  {links.map(({ text, href, ...link }) => (
                    <a
                      key={text}
                      href={href}
                      {...("external" in link && link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="font-inter text-sm font-bold text-[#1c1917] transition-colors hover:text-[#e05a47]"
                    >
                      {text}
                    </a>
                  ))}
                </span>
              </li>
            ))}
          </ul>
          <p className="border-t border-[#2b2622] pt-3 text-center font-inter text-[11px] tracking-[1.5px] text-[#57534e] uppercase lg:pt-2">
            <Link href="/" onClick={onNavigate} className="hover:text-[#e05a47]">
              {navigationCopy.imprint}
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
