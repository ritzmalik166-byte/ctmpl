import { cn } from "@/lib/utils/cn";
import { newspaperCopy, storyLayouts, type Article } from "../constants/newspaper.constants";
import { Tilted } from "./Newspaper.Tilted";

/** The red section-and-date line above a story. */
export function StoryTag({ children }: { children: string }) {
  return <p className="font-inter text-sm leading-[normal] font-semibold whitespace-nowrap text-[#e05a47] capitalize">{children}</p>;
}

/** An underlined "Read more" link, as printed on the page. */
export function ReadLink({ href, children, gap }: { href: string; children: string; gap: "small" | "large" }) {
  return (
    <a
      href={href}
      className={cn(
        "flex items-center justify-center border-b border-black font-inter text-lg leading-6 font-semibold whitespace-nowrap text-[#444] capitalize transition-colors hover:text-[#e05a47]",
        gap === "large" ? "pb-2.5" : "pb-[5px]"
      )}
    >
      {children}
    </a>
  );
}

/**
 * One story on the front page, printed at the page's tilt: its tag, title,
 * excerpt and a "Read more" link. `layout`: "wide" across the top right, or a
 * "column" below it (Figma 75:1230 / 75:1242 / 75:1236).
 */
export function Story({ article, layout, left, top }: { article: Article; layout: keyof typeof storyLayouts; left: number; top: number }) {
  const l = storyLayouts[layout];
  return (
    <article className="absolute" style={{ left, top, width: l.width, height: l.height }}>
      <Tilted box={l.more}>
        <ReadLink href={article.href} gap="small">
          {newspaperCopy.readMore}
        </ReadLink>
      </Tilted>
      <Tilted box={l.excerpt}>
        <p className="font-inter text-base leading-6 text-[#444] capitalize" style={{ width: l.excerpt.text }}>
          {article.excerpt}
        </p>
      </Tilted>
      <Tilted box={l.tag}>
        <StoryTag>{article.tag}</StoryTag>
      </Tilted>
      <Tilted box={l.title}>
        <h3 className="font-inter text-[22px] leading-[normal] font-semibold text-black capitalize" style={{ width: l.title.text }}>
          {article.title}
        </h3>
      </Tilted>
    </article>
  );
}
