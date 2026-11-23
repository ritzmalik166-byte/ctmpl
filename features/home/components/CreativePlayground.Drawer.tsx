import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import drawerFoldedEdge from "@/public/images/website/home/creative-playground/drawer-folded-edge.svg";

type CabinetDrawerProps = {
  index: number;
  top: number;
  client: string;
  /** The client's logo, on the label holder. */
  logo: StaticImageData;
  /** Open when the section loads (its starting look; animations take over after). */
  initiallyOpen: boolean;
  open: boolean;
  onOpen: (index: number) => void;
};

/** The look of an open drawer: pulled well out towards us (larger, a little lower), over its neighbours, casting a deep shadow. */
export const OPEN_DRAWER = { scale: 1.08, y: 5, zIndex: 2, boxShadow: "0 18px 26px rgba(60, 52, 36, 0.42)" };
export const CLOSED_DRAWER = { scale: 1, y: 0, zIndex: 1, boxShadow: "0 0 0 rgba(60, 52, 36, 0)" };

/**
 * One paper drawer of the filing cabinet (300 × 121): sage paper face, a cream
 * label holder with the client's logo, a drawer pull and a folded lower edge.
 * Press it to open that client's case file.
 */
export function CabinetDrawer({ index, top, client, logo, initiallyOpen, open, onOpen }: CabinetDrawerProps) {
  const start = initiallyOpen ? OPEN_DRAWER : CLOSED_DRAWER;
  return (
    <button
      type="button"
      data-drawer={index}
      aria-pressed={open}
      aria-label={`Open the ${client} case file`}
      onClick={() => onOpen(index)}
      className="absolute left-[115px] h-[121px] w-[300px] cursor-pointer overflow-clip bg-[#a4af95] transition-[filter] duration-200 will-change-transform outline-none hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2c2826]"
      // starting look only: GSAP animates these from here
      style={{ top, zIndex: start.zIndex, transform: `translateY(${start.y}px) scale(${start.scale})`, boxShadow: start.boxShadow }}
    >
      {/* paper face */}
      <span className="absolute top-0 left-0 h-[121px] w-[302px] bg-linear-to-r from-[#adb69d] via-[#a5b096] via-50% to-[#99a78a]" />
      {/* label holder */}
      <span className="absolute top-[20px] left-[87px] h-[39px] w-[127px] bg-[#8d957b] opacity-24" />
      <span className="absolute top-[21px] left-[88px] h-[41px] w-[125px] border border-[#c7ccb5] bg-[#ebe7d2] shadow-[0_1px_2px_0_rgba(98,108,77,0.13)]" />
      <span className="absolute top-[26px] left-[93px] h-[30px] w-[115px] bg-[#f6f0df]" />
      {/* drawer pull */}
      <span className="absolute top-[68px] left-[99px] h-4 w-[104px] bg-[#89967e] opacity-30" />
      <span className="absolute top-[68px] left-[99px] h-3 w-[103px] bg-[#c9c9b5]" />
      <span className="absolute top-[68px] left-[100px] h-0.5 w-[102px] bg-[#dedcca] opacity-60" />
      <span className="absolute top-[79px] left-[100px] h-0.5 w-[102px] bg-[#b9bca7]" />
      {/* folded lower edge and paper side */}
      <Image src={drawerFoldedEdge} alt="" width={302} height={7} className="absolute top-[114px] left-0" />
      <span className="absolute top-0 left-[300px] h-[121px] w-0.5 bg-[#bbc2aa] opacity-80" />
      <span className="absolute top-[113px] left-1.5 h-px w-[289px] bg-[#b4bea4] opacity-50" />
      {/* the client's logo, fitted inside the label */}
      <span className="absolute top-[27px] left-[95px] h-[28px] w-[111px]">
        <Image src={logo} alt="" fill sizes="110px" className="pointer-events-none object-contain" />
      </span>
    </button>
  );
}

/**
 * The almirah's bottom drawer: "View all projects". The same paper drawer, its
 * label reading "View all projects" with a little arrow; it doesn't open a
 * file, it takes you to the projects page.
 */
export function ViewAllDrawer({ top, href, label }: { top: number; href: string; label: string }) {
  return (
    <Link
      href={href}
      // hovered, it slides out towards you like the others do when opened (larger, a little lower, a shadow under it)
      className="group absolute left-[115px] z-[1] h-[121px] w-[300px] cursor-pointer overflow-clip bg-[#a4af95] shadow-[0_0_0_rgba(60,52,36,0)] transition-[scale,translate,box-shadow,filter] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none hover:z-[2] hover:translate-y-[4px] hover:scale-[1.06] hover:shadow-[0_16px_24px_rgba(60,52,36,0.4)] hover:brightness-105 focus-visible:z-[2] focus-visible:translate-y-[4px] focus-visible:scale-[1.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2c2826] active:scale-[1.03]"
      style={{ top }}
    >
      {/* paper face */}
      <span className="absolute top-0 left-0 h-[121px] w-[302px] bg-linear-to-r from-[#adb69d] via-[#a5b096] via-50% to-[#99a78a]" />
      {/* label holder, reading "View all projects" */}
      <span className="absolute top-[20px] left-[55px] h-[39px] w-[191px] bg-[#8d957b] opacity-24" />
      {/* (wide enough for the arrow to glide on hover, and clipped to it, so it never crosses the edge) */}
      <span className="absolute top-[21px] left-[56px] flex h-[41px] w-[189px] items-center justify-center gap-1.5 overflow-hidden border border-[#c7ccb5] bg-[#ebe7d2] px-3 shadow-[0_1px_2px_0_rgba(98,108,77,0.13)] transition-colors duration-300 group-hover:border-[#b96245]/40 group-hover:bg-[#f6efdc]">
        <span className="font-inter text-[12px] leading-none font-bold tracking-[0.06em] text-[#4f5640] uppercase transition-colors duration-300 group-hover:text-[#2c2826]">{label}</span>
        <span aria-hidden="true" className="inline-block w-[18px] shrink-0 font-inter text-[13px] leading-none font-bold text-[#b96245] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
          &rarr;
        </span>
      </span>
      {/* drawer pull */}
      <span className="absolute top-[68px] left-[99px] h-4 w-[104px] bg-[#89967e] opacity-30" />
      <span className="absolute top-[68px] left-[99px] h-3 w-[103px] bg-[#c9c9b5]" />
      <span className="absolute top-[68px] left-[100px] h-0.5 w-[102px] bg-[#dedcca] opacity-60" />
      <span className="absolute top-[79px] left-[100px] h-0.5 w-[102px] bg-[#b9bca7]" />
      {/* folded lower edge and paper side */}
      <Image src={drawerFoldedEdge} alt="" width={302} height={7} className="absolute top-[114px] left-0" />
      <span className="absolute top-0 left-[300px] h-[121px] w-0.5 bg-[#bbc2aa] opacity-80" />
      <span className="absolute top-[113px] left-1.5 h-px w-[289px] bg-[#b4bea4] opacity-50" />
      {/* a sheen sweeping across the paper as it slides out */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/25 to-transparent opacity-0 transition-[left,opacity] duration-700 ease-out group-hover:left-[120%] group-hover:opacity-100" />
    </Link>
  );
}
