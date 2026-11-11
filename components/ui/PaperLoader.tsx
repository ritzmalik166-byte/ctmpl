/**
 * Paper-craft loading: three little squares of paper, each with a folded
 * corner, folding over and back one after another (keyframes `paper-fold`).
 */
export function PaperLoader() {
  return (
    <span aria-hidden="true" className="flex items-center gap-1.5">
      {[0, 0.15, 0.3].map((delay) => (
        <span
          key={delay}
          className="size-3 animate-[paper-fold_1.2s_ease-in-out_infinite] rounded-[2px] bg-[linear-gradient(225deg,transparent_0_26%,#e7d6bd_26%_42%,#faf6ef_42%)] shadow-[0_1px_1px_rgba(90,40,20,0.25)]"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </span>
  );
}
