"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { navigationLinks } from "@/config/navigation";

/**
 * One page tab in the folder ("01 What we make" …): a paper strip with a
 * coloured number stamp, as in the Figma frames. Hovered (desktop) or pressed
 * (phones) it is pulled out of the folder: it slides out a little, turns
 * burnt orange with a cream stamp, and an arrow points the way (on desktop it
 * also opens out to the 246px it is drawn at, hovered, in Figma). `style`
 * places it (its Figma place, size and tilt).
 */
export function MenuTab({ index, color, mobile, onNavigate, style }: { index: number; color: string; mobile: boolean; onNavigate: () => void; style: CSSProperties }) {
  const { label, href } = navigationLinks[index];
  const number = String(index + 1).padStart(2, "0");
  const size = mobile
    ? { stamp: 30.3, stampLeft: 12.1, num: 12, label: 19, lh: 23.18, labelLeft: 54.1 }
    : { stamp: 32.4, stampLeft: 12.2, num: 13, label: 20, lh: 24.4, labelLeft: 56.3 };
  // (Tailwind needs whole class names: one set for phones, pressed; one for desktop, hovered)
  const stampPulled = mobile ? "group-active:bg-[#fbf3e6] group-active:text-[#d16a42]" : "group-hover:bg-[#fbf3e6] group-hover:text-[#d16a42]";
  const labelPulled = mobile ? "group-active:text-white" : "group-hover:text-white";
  return (
    <Link
      href={href}
      onClick={onNavigate}
      style={{ ...style, "--stamp": color } as CSSProperties}
      className={`group absolute rounded-[3px] bg-[#fbf3e6] bg-[url(/images/website/menu/paper-50.webp)] bg-cover bg-center bg-blend-multiply shadow-[0_3px_5px_rgba(64,41,20,0.16)] outline-none transition-[translate,background-color,box-shadow,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-2 focus-visible:ring-[#d16a42] ${
        mobile
          ? "active:translate-x-2 active:bg-[#d16a42] active:bg-[url(/images/website/menu/paper-25.webp)] active:shadow-[0_6px_12px_rgba(64,41,20,0.3)]"
          : "hover:w-[246px]! hover:translate-x-3.5 hover:bg-[#d16a42] hover:bg-[url(/images/website/menu/paper-25.webp)] hover:shadow-[0_6px_12px_rgba(64,41,20,0.3)] focus-visible:translate-x-3.5 focus-visible:bg-[#d16a42]"
      }`}
    >
      {/* the number stamp */}
      <span
        aria-hidden="true"
        className={`absolute top-1/2 grid -translate-y-1/2 place-items-center rounded-full bg-(--stamp) font-typewriter leading-none font-bold text-white transition-colors duration-300 ${stampPulled} group-focus-visible:bg-[#fbf3e6] group-focus-visible:text-[#d16a42]`}
        style={{ left: size.stampLeft, width: size.stamp, height: size.stamp, fontSize: size.num }}
      >
        {number}
      </span>
      <span
        className={`absolute top-1/2 -translate-y-1/2 font-instrument font-bold whitespace-nowrap text-[#2b2825] transition-colors duration-300 ${labelPulled} group-focus-visible:text-white`}
        style={{ left: size.labelLeft, fontSize: size.label, lineHeight: `${size.lh}px` }}
      >
        {label}
      </span>
      {/* the arrow: always there on phones, out with the tab on desktop */}
      <svg
        aria-hidden="true"
        viewBox="0 0 16 12"
        className={`absolute top-1/2 -translate-y-1/2 transition-[opacity,translate,color] duration-300 ${
          mobile ? "text-[#8a6a43] group-active:text-[#fbf3e6]" : "-translate-x-2 text-[#fbf3e6] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100"
        }`}
        style={{ right: mobile ? 16.4 : 16, width: mobile ? 16 : 18, height: mobile ? 12 : 14 }}
      >
        <path d="M1.5 6h12.5M9.5 1.5 14 6l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth={mobile ? 1.7 : 2} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}
