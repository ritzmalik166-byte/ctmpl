import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import paperPlaneAccent from "@/public/icons/paper-plane-accent.svg";

type SectionLabelProps = {
  children: React.ReactNode;
  /** "dark" text for light sections (default), "light" for dark sections. */
  tone?: "dark" | "light";
  className?: string;
};

/** Small uppercase eyebrow with a little paper plane, e.g. "WHO WE ARE". */
function SectionLabel({ children, tone = "dark", className }: SectionLabelProps) {
  return (
    <p
      className={cn(
        "flex items-center gap-2.5 text-xs font-semibold uppercase",
        tone === "light" ? "text-white" : "text-ink-deep",
        className
      )}
    >
      <Image src={paperPlaneAccent} alt="" width={27} height={27} unoptimized className="shrink-0" />
      {children}
    </p>
  );
}

export default SectionLabel;
