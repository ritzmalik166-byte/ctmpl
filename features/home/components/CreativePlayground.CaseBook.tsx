"use client";

import { useLayoutEffect, useRef, useState, type PointerEvent } from "react";
import Image from "next/image";
import gsap from "gsap";
import { caseFileLabels, creativePlaygroundCopy, playgroundCases } from "../constants/creativePlayground.constants";
import paperBlank from "@/public/images/website/home/creative-playground/case-file/paper-blank.png";
import stampApproved from "@/public/images/website/home/creative-playground/case-file/stamp-approved.png";

/** How long a page takes to turn (s). */
const TURN = 0.75;
/** A horizontal swipe this long (px) turns the page. */
const SWIPE = 40;
/** A press that moves less than this (px) is a tap: it turns to the next page. */
const TAP = 10;

/** One page of the case file: the campaign photo clipped on, the typed details and the APPROVED stamp. */
function CasePage({ index }: { index: number }) {
  const { client, cover, file } = playgroundCases[index];
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[3px] shadow-[0_2px_6px_rgba(60,44,20,0.18)]">
      <Image src={paperBlank} alt="" fill sizes="340px" className="pointer-events-none object-cover" />
      <div className="absolute inset-0 flex flex-col px-[7%] pt-[7%] pb-[6%]">
        <p className="font-typewriter text-[10px] leading-none font-bold tracking-[1.8px] text-[#a17351] uppercase">
          {caseFileLabels.title}
        </p>
        {/* the photo, in a polaroid with a paperclip */}
        <div className="relative mx-auto mt-[7%] w-[86%] -rotate-2 bg-white p-[3%] pb-[8%] shadow-[0_3px_8px_rgba(60,44,20,0.25)]">
          <div className="relative aspect-[270/202] overflow-hidden">
            <Image src={cover} alt={`${client} campaign artwork`} fill sizes="290px" className="object-cover" />
          </div>
          <span aria-hidden="true" className="absolute -top-2.5 left-[14%] h-7 w-2.5 rounded-full border-2 border-[#9aa1a8] bg-transparent" />
        </div>
        {/* the typed details */}
        <dl className="mt-[8%] grid grid-cols-[auto_1fr] gap-x-3 gap-y-2.5 font-typewriter">
          {[
            [caseFileLabels.client, file.client],
            [caseFileLabels.campaign, file.campaign],
            [caseFileLabels.services, file.services],
          ].map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="pt-px text-[9px] leading-none font-bold tracking-[1.2px] text-[#625d58] uppercase">{label}</dt>
              <dd className="text-[13px] leading-[1.25] text-[#3f3b38]">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
      {/* APPROVED, stamped over the photo's corner (the details under it stay clear) */}
      <div data-book="stamp" className="absolute top-[47%] right-[4%] aspect-[214/88] w-[40%] -rotate-6">
        <Image src={stampApproved} alt="Approved" fill sizes="160px" className="pointer-events-none" />
      </div>
    </div>
  );
}

/**
 * Phones (below md): the case files as one file you flip through like a book,
 * instead of the filing room. Each case is a page; choosing another (the client
 * buttons, the arrows, the name slider, or a swipe across the file) turns the
 * pages over to it (a tap or click on the file turns to the next one): forward,
 * the page lifts and turns over to the left; back,
 * the earlier page comes back over from the left. Its APPROVED stamp lands
 * once the page is down. `active` and `onSelect` are the filing room's own, so
 * the selection logic is the same as everywhere else.
 */
export function CaseBook({ active, onSelect }: { active: number; onSelect: (index: number) => void }) {
  const count = playgroundCases.length;
  // the page lying open, and the turn in progress (`leaf` turns over the `base` page)
  const [view, setView] = useState({ base: active, leaf: null as number | null, forward: true });
  const [prev, setPrev] = useState(active);
  const leafRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  // a new case: decide the direction and lay out the turn (forward: the old page turns away, showing the
  // new one under it; back: the new page comes back over the old one)
  if (prev !== active) {
    setPrev(active);
    const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const forward = (active - prev + count) % count <= count / 2;
    setView(reduced ? { base: active, leaf: null, forward: true } : forward ? { base: active, leaf: prev, forward } : { base: prev, leaf: active, forward });
  }

  // play the turn
  useLayoutEffect(() => {
    const leaf = leafRef.current;
    if (view.leaf === null || !leaf) return;
    // once it's down, the case it was turning to lies open
    const done = () => setView((v) => ({ base: v.forward ? v.base : (v.leaf ?? v.base), leaf: null, forward: true }));
    const shade = leaf.querySelector("[data-book='shade']");
    const tl = gsap.timeline({ onComplete: done });
    if (view.forward) {
      tl.fromTo(leaf, { rotationY: 0 }, { rotationY: -180, duration: TURN, ease: "power2.inOut" }).fromTo(shade, { opacity: 0 }, { opacity: 0.35, duration: TURN / 2, yoyo: true, repeat: 1, ease: "sine.inOut" }, 0);
    } else {
      tl.fromTo(leaf, { rotationY: -180 }, { rotationY: 0, duration: TURN, ease: "power2.inOut" }).fromTo(shade, { opacity: 0 }, { opacity: 0.35, duration: TURN / 2, yoyo: true, repeat: 1, ease: "sine.inOut" }, 0);
    }
    return () => void tl.kill();
  }, [view]);

  // the stamp lands on each page once it's open
  useLayoutEffect(() => {
    if (view.leaf !== null || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const stamp = bookRef.current?.querySelector("[data-book='base'] [data-book='stamp']");
    if (stamp) gsap.fromTo(stamp, { opacity: 0, scale: 1.8 }, { opacity: 1, scale: 1, duration: 0.18, delay: 0.05, ease: "power4.in" });
  }, [view]);

  const onPointerDown = (e: PointerEvent) => (swipe.current = { x: e.clientX, y: e.clientY });
  const onPointerUp = (e: PointerEvent) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) < TAP && Math.abs(dy) < TAP) return next(); // a tap or click: the next page
    if (Math.abs(dx) < SWIPE || Math.abs(dx) < Math.abs(dy)) return;
    onSelect((active + (dx < 0 ? 1 : -1) + count) % count); // swipe left: next page
  };
  const next = () => onSelect((active + 1) % count);

  return (
    <div
      ref={bookRef}
      data-case-book
      role="button"
      tabIndex={0}
      aria-label={`${creativePlaygroundCopy.caseFileTab}: ${playgroundCases[active].client}. ${creativePlaygroundCopy.next}`}
      className="relative mx-auto w-full max-w-[340px] cursor-pointer touch-pan-y pt-7 outline-none select-none focus-visible:ring-2 focus-visible:ring-[#b96245] focus-visible:ring-offset-4"
      onKeyDown={(e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        next();
      }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (swipe.current = null)}
    >
      {/* the folder: its tab, and the kraft back the pages lie on */}
      <div className="absolute top-0 left-[6%] flex h-8 w-[38%] items-start justify-center rounded-t-lg bg-[#e2be82] pt-2">
        <p className="text-center font-inter text-[10px] leading-tight font-bold text-[#5b4520] uppercase">
          {creativePlaygroundCopy.caseFileTab}
        </p>
      </div>
      <div className="relative rounded-md bg-[#e2be82] p-[4%] shadow-[0_10px_22px_rgba(60,44,20,0.28)]">
        {/* the pages; perspective so a turning page lifts towards us */}
        <div className="relative aspect-[320/392] [perspective:1400px]">
          {/* a hint of the pages underneath */}
          <span aria-hidden="true" className="absolute inset-0 translate-x-[3px] translate-y-[3px] rounded-[3px] bg-[#efe6d2]" />
          <div data-book="base" className="absolute inset-0">
            <CasePage key={view.base} index={view.base} />
          </div>
          {view.leaf !== null && (
            // the turning page: its front is the page, its back plain paper; it turns about the spine (left edge)
            <div ref={leafRef} className="absolute inset-0 origin-left transform-3d" style={{ transform: `rotateY(${view.forward ? 0 : -180}deg)` }}>
              <div className="absolute inset-0 backface-hidden">
                <CasePage index={view.leaf} />
                <span data-book="shade" className="absolute inset-0 rounded-[3px] bg-black opacity-0" />
              </div>
              <div className="absolute inset-0 rotate-y-180 overflow-hidden rounded-[3px] backface-hidden">
                <Image src={paperBlank} alt="" fill sizes="340px" className="pointer-events-none -scale-x-100 object-cover" />
              </div>
            </div>
          )}
        </div>
      </div>
      <p className="mt-3 text-center font-inter text-xs text-[#7a6650]">{creativePlaygroundCopy.swipeHint}</p>
    </div>
  );
}
