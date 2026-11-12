import { cn } from "@/lib/utils/cn";
import { contactCards, type ContactCard } from "../constants/startConversation.constants";

const tones: Record<ContactCard["tone"], string> = {
  ink: "text-[#1c1917]",
  brand: "text-[#e05a47]",
  whatsapp: "text-[#248018]",
};

/**
 * Quick ways to reach the agency (Figma 75:362): four cards side by side, each
 * a small label (CALL, WRITE, CHAT, VISIT) over its number, email or place.
 * All cards are 79 tall: one line sits higher with space under it, two lines
 * fill the card. Below xl they sit in a grid (one, two, then four across).
 * Hover a card and it lifts, a second sheet of paper slides out from behind its
 * bottom-right corner, and that corner folds over into a dog-ear.
 */
export function ContactCards({ className }: { className?: string }) {
  return (
    <ul data-sr="stagger" className={cn("grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4 xl:flex xl:w-[1024px]", className)}>
      {contactCards.map(({ label, lines, tone }) => {
        const twoLines = lines.length > 1;
        return (
          <li
            key={label}
            className={cn(
              "group relative isolate flex min-w-0 flex-col items-center px-3.5 pt-3.5 text-center font-inter transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 xl:flex-1",
              twoLines ? "pb-3.5" : "gap-1 pb-[30px]"
            )}
          >
            {/* a second sheet of paper behind the card: on hover it slides out from under the bottom-right corner */}
            <span
              aria-hidden="true"
              className="absolute inset-0 -z-20 rounded-[4px] bg-[#f3e6cf] bg-[url(/images/website/home/who-we-are/paper-wall.jpg)] bg-size-[256px] bg-blend-multiply shadow-[0_6px_14px_rgba(60,40,20,0.12)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2.5 group-hover:translate-y-2 group-hover:rotate-[4deg]"
            />
            {/* the card itself, with its bottom-right corner folding over into a dog-ear on hover */}
            <span
              aria-hidden="true"
              className="absolute inset-0 -z-10 rounded-[4px] bg-[#fbfbf8] shadow-[0_1px_2px_rgba(60,40,20,0.06)] transition-[clip-path,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [clip-path:polygon(0_0,100%_0,100%_100%,100%_100%,0_100%)] group-hover:shadow-[0_10px_22px_rgba(60,40,20,0.14)] group-hover:[clip-path:polygon(0_0,100%_0,100%_calc(100%-18px),calc(100%-18px)_100%,0_100%)]"
            />
            <span
              aria-hidden="true"
              className="absolute right-0 bottom-0 size-[18px] origin-bottom-right scale-0 rounded-tl-[3px] bg-linear-to-br from-[#efe3cc] from-50% to-transparent to-50% shadow-[-1px_-1px_2px_rgba(60,40,20,0.12)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100"
            />
            <span className="text-[10px] leading-[15px] text-[#78716c] uppercase transition-colors duration-300 group-hover:text-[#e05a47]">{label}</span>
            {lines.map(({ text, href }, i) => (
              <a key={text} href={href} className={cn("text-xs leading-4 font-bold whitespace-nowrap hover:underline", tones[tone], twoLines && i === 0 && "pt-1")}>
                {text}
              </a>
            ))}
          </li>
        );
      })}
    </ul>
  );
}
