import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import paperFoldAccent from "@/public/icons/paper-fold-accent.svg";

type SectionLabelProps = {
  children: React.ReactNode;
  /** "dark" text for light sections (default), "light" for dark sections. */
  tone?: "dark" | "light";
  className?: string;
};

/** Small uppercase eyebrow with the folded-paper corner, e.g. "WHO WE ARE". */
function SectionLabel({ children, tone = "dark", className }: SectionLabelProps) {
  return (
    <p
      className={cn(
        "flex items-center gap-2.5 text-xs font-semibold uppercase",
        tone === "light" ? "text-white" : "text-ink-deep",
        className
      )}
    >
      <Image src={paperFoldAccent} alt="" width={27} height={27} unoptimized className="shrink-0" />
      {children}
    </p>
  );
}

export default SectionLabel;
