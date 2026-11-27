"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { blogPreviewCta, navigationBlogs } from "@/config/navigation";

/** The preview paper's width, and its gap from the blog card (px of the 1440 desk). */
const WIDTH = 218;
const GAP = 18;
/** The desk's size (the preview is kept on it). */
const DESK = { width: 1440, height: 1060 };

/**
 * Desktop menu: hover one of the "Latest from the blog" cards (marked
 * `data-blog`) and a preview paper unfolds out of its left edge, in the blog's
 * own paper colour (its pin's): a strip of tape across the top, the blog's
 * picture taped on as a polaroid (revealed from the top down), its topic and
 * date typed out, its title and a "Read the story" link, the lines rising in
 * one by one. Moving to another card slides the paper along to it, its colour
 * changing and its content turning over; moving off the cards (and the paper:
 * it stays while the pointer's on it, so its link can be clicked) folds it
 * away. Placed in the desk's 1440 frame (see MenuDesk).
 */
export function MenuBlogPreview({ onNavigate }: { onNavigate: () => void }) {
  const paper = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [shownIndex, setShownIndex] = useState(0);
  const anchor = useRef({ x: 0, y: 0, h: 0 });
  const open = useRef(false);
  if (active !== null && active !== shownIndex) setShownIndex(active);

  // which card is hovered (a moment's grace going between the cards and the paper)
  useEffect(() => {
    const note = paper.current;
    const desk = note?.parentElement;
    if (!note || !desk || !window.matchMedia("(hover: hover)").matches) return;
    let timer = 0;
    const over = (e: PointerEvent) => {
      const t = e.target instanceof Element ? e.target : null;
      const card = t?.closest<HTMLElement>("[data-blog]");
      if (card && desk.contains(card)) {
        window.clearTimeout(timer);
        // where it is on the desk (the desk is drawn scaled to the screen)
        const d = desk.getBoundingClientRect();
        const r = card.getBoundingClientRect();
        const k = d.width / DESK.width;
        anchor.current = { x: (r.left - d.left) / k, y: (r.top - d.top) / k, h: r.height / k };
        setActive(Number(card.dataset.blog));
      } else if (t && note.contains(t)) {
        window.clearTimeout(timer);
      } else if (open.current) {
        window.clearTimeout(timer);
        timer = window.setTimeout(() => setActive(null), 200);
      }
    };
    document.addEventListener("pointerover", over);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("pointerover", over);
    };
  }, []);

  // unfold it, slide it along, or fold it away
  useLayoutEffect(() => {
    const note = paper.current;
    if (!note) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (active === null) {
      if (open.current) gsap.to(note, { autoAlpha: 0, rotationY: -55, scale: 0.94, duration: reduced ? 0.01 : 0.28, ease: "power2.in", overwrite: "auto" });
      open.current = false;
      return;
    }
    const { x: cx, y: cy, h: ch } = anchor.current;
    const h = note.offsetHeight;
    const x = cx - WIDTH - GAP;
    const y = gsap.utils.clamp(130, DESK.height - h - 20, cy + ch / 2 - h / 2);
    const tilt = active % 2 ? 1.4 : -1.4;
    const blog = navigationBlogs[active];
    if (!open.current) {
      gsap.set(note, { x: x + 24, y, rotation: tilt + 3, rotationY: -70, scale: 0.9, autoAlpha: 0, transformPerspective: 900, transformOrigin: "100% 50%", backgroundColor: blog.paper });
      gsap.to(note, { x, rotation: tilt, rotationY: 0, scale: 1, autoAlpha: 1, duration: reduced ? 0.01 : 0.6, ease: "power3.out", overwrite: "auto" });
    } else {
      gsap.to(note, { x, y, rotation: tilt, backgroundColor: blog.paper, duration: reduced ? 0.01 : 0.45, ease: "power3.out", overwrite: "auto" });
    }
    open.current = true;
    if (reduced) return;
    // its content: the picture revealed from the top down, the lines rising in one by one
    const pic = note.querySelector("[data-bp='pic']");
    const img = note.querySelector("[data-bp='img']");
    const lines = note.querySelectorAll("[data-bp='line']");
    const tl = gsap.timeline({ delay: 0.12 });
    tl.fromTo(pic, { clipPath: "inset(0 0 100% 0)", rotation: -6, y: -6 }, { clipPath: "inset(0 0 0% 0)", rotation: 0, y: 0, duration: 0.55, ease: "power3.out" })
      .fromTo(img, { scale: 1.15 }, { scale: 1, duration: 0.9, ease: "power2.out" }, 0)
      .fromTo(lines, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.07 }, 0.18);
    return () => void tl.kill();
  }, [active]);

  const blog = navigationBlogs[shownIndex];
  const [topic, date] = blog.tag.split(" · ");
  return (
    <div
      ref={paper}
      aria-hidden={active === null}
      className="invisible absolute top-0 left-0 z-30 opacity-0 shadow-[0_2px_3px_rgba(64,41,20,0.18),6px_18px_28px_-10px_rgba(64,41,20,0.5)]"
      style={{ width: WIDTH }}
    >
      {/* the paper's grain, and the tape holding it up */}
      <span className="pointer-events-none absolute inset-0 bg-[url(/images/website/menu/paper-45.webp)] bg-cover opacity-60 mix-blend-multiply" />
      <span className="absolute -top-[9px] left-1/2 h-[18px] w-[66px] -translate-x-1/2 -rotate-2 bg-[rgba(240,228,196,0.85)] shadow-[0_1px_1px_rgba(90,60,20,0.12)]" />
      <div key={shownIndex} className="relative px-[13px] pt-[16px] pb-[12px]">
        {/* the picture, a polaroid, with a corner of tape */}
        <div data-bp="pic" className="relative bg-white p-[5px] pb-[6px] shadow-[0_2px_6px_rgba(60,40,20,0.25)]">
          <div className="relative aspect-[4/3] overflow-hidden">
            <div data-bp="img" className="absolute inset-0">
              <Image src={blog.image} alt="" fill sizes="190px" className="object-cover" />
            </div>
          </div>
          <span className="absolute -top-[5px] -right-[9px] h-[12px] w-[34px] rotate-[32deg] bg-[rgba(240,228,196,0.9)]" />
        </div>
        {/* the topic and the date, typed */}
        <p data-bp="line" className="mt-[10px] flex items-center gap-[6px] font-typewriter text-[9px] leading-none font-bold tracking-[0.12em] uppercase">
          <span className="rounded-[2px] px-[5px] py-[3px] text-[#fbf3e6]" style={{ backgroundColor: blog.pin }}>
            {topic}
          </span>
          <span className="text-[#6b5f55]">{date}</span>
        </p>
        <p data-bp="line" className="mt-[7px] font-instrument text-[15.5px] leading-[19px] font-bold text-[#2b2825]">
          {blog.title}
        </p>
        <div data-bp="line" className="mt-[10px] flex items-center justify-between border-t border-dashed border-[rgba(90,60,30,0.3)] pt-[8px]">
          <Link
            href={blog.href}
            onClick={onNavigate}
            tabIndex={active === null ? -1 : undefined}
            className="group/cta inline-flex items-center gap-[5px] font-inter text-[10.5px] font-bold whitespace-nowrap text-[#2b2825] transition-colors hover:text-[#d16a42]"
          >
            <span className="bg-size-[100%_1.2px] bg-bottom bg-no-repeat pb-[1px]" style={{ backgroundImage: `linear-gradient(${blog.pin},${blog.pin})` }}>
              {blogPreviewCta}
            </span>
            <span className="transition-[translate] duration-300 group-hover/cta:translate-x-[5px]">→</span>
          </Link>
          <span className="font-caveat text-[12px] leading-none font-bold whitespace-nowrap text-[#6b5f55]">fresh off the press!</span>
        </div>
      </div>
    </div>
  );
}
