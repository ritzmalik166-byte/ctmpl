import Image from "next/image";
import drawerFoldedEdge from "@/public/images/website/home/creative-playground/drawer-folded-edge.svg";
import sanskarLogo from "@/public/images/website/home/creative-playground/sanskar-logo.png";

type CabinetDrawerProps = {
  index: number;
  top: number;
  client: string;
  /** Open when the section loads (its starting look; animations take over after). */
  initiallyOpen: boolean;
  open: boolean;
  onOpen: (index: number) => void;
};

/** The look of an open drawer: pulled out a touch towards us, casting a shadow. */
export const OPEN_DRAWER = { scale: 1.025, y: 3, boxShadow: "0 10px 16px rgba(60, 52, 36, 0.28)" };
export const CLOSED_DRAWER = { scale: 1, y: 0, boxShadow: "0 0 0 rgba(60, 52, 36, 0)" };

/**
 * One paper drawer of the filing cabinet (300 × 121): sage paper face, a cream
 * label holder with the client's logo, a drawer pull and a folded lower edge.
 * Press it to open that client's case file.
 */
export function CabinetDrawer({ index, top, client, initiallyOpen, open, onOpen }: CabinetDrawerProps) {
  const start = initiallyOpen ? OPEN_DRAWER : CLOSED_DRAWER;
  return (
    <button
      type="button"
      data-drawer={index}
      aria-pressed={open}
      aria-label={`Open the ${client} case file`}
      onClick={() => onOpen(index)}
      className="absolute left-[115px] h-[121px] w-[300px] cursor-pointer overflow-clip bg-[#a4af95] transition-[filter] duration-200 outline-none hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2c2826]"
      // starting look only: GSAP animates these from here
      style={{ top, transform: `translateY(${start.y}px) scale(${start.scale})`, boxShadow: start.boxShadow }}
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
      {/* client logo, cropped to the label as in Figma */}
      <span className="absolute top-[22px] left-[109px] h-[37px] w-[84px] overflow-hidden">
        <span className="absolute top-[-38.89%] left-[-15.24%] h-[177.78%] w-[125%]">
          <Image src={sanskarLogo} alt="" fill sizes="105px" className="pointer-events-none" />
        </span>
      </span>
    </button>
  );
}
