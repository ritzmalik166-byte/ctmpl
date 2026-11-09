import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import paperFoldAccent from "@/public/icons/paper-fold-accent.svg";

/** Small uppercase eyebrow with the folded-paper corner, e.g. "WHO WE ARE". */
function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("flex items-center gap-2.5 text-xs font-semibold text-ink-deep uppercase", className)}>
      <Image src={paperFoldAccent} alt="" width={27} height={27} unoptimized className="shrink-0" />
      {children}
    </p>
  );
}

export default SectionLabel;
