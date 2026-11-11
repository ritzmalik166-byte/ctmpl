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
 */
export function ContactCards({ className }: { className?: string }) {
  return (
    <ul className={cn("grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4 xl:flex xl:w-[1024px]", className)}>
      {contactCards.map(({ label, lines, tone }) => {
        const twoLines = lines.length > 1;
        return (
          <li
            key={label}
            className={cn("flex min-w-0 flex-col items-center xl:flex-1 rounded-[4px] bg-white/80 px-3.5 pt-3.5 text-center font-inter", twoLines ? "pb-3.5" : "gap-1 pb-[30px]")}
          >
            <span className="text-[10px] leading-[15px] text-[#78716c] uppercase">{label}</span>
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
