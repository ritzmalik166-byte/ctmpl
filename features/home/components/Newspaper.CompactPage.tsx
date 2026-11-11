import Image from "next/image";
import { leadStory, newspaperCopy, stories, type Article } from "../constants/newspaper.constants";
import { ReadLink, StoryTag } from "./Newspaper.Story";
import mastheadTitle from "@/public/images/website/home/newspaper/masthead-title.png";
import photoDesk from "@/public/images/website/home/newspaper/photo-desk.png";

/** The edition line under the masthead (on desktop it's part of the masthead art). */
const dateline = { edition: "Noida edition", date: "Thursday, 5 November 2026", price: "Price: one good idea" };

/** A story, laid out to fit: tag, title, excerpt, "Read more". */
function CompactStory({ article }: { article: Article }) {
  return (
    <article className="flex flex-col items-start gap-2">
      <StoryTag>{article.tag}</StoryTag>
      <h3 className="font-inter text-lg leading-snug font-semibold text-black capitalize sm:text-[22px]">{article.title}</h3>
      <p className="font-inter text-[15px] leading-6 text-[#444] capitalize sm:text-base">{article.excerpt}</p>
      <div className="pt-1">
        <ReadLink href={article.href} gap="small">
          {newspaperCopy.readMore}
        </ReadLink>
      </div>
    </article>
  );
}

/**
 * The front page of The CTM Times laid out for smaller screens (below xl):
 * the masthead and edition line, then the lead story (photo, headline,
 * excerpt) and the other stories, all at readable sizes:
 *  - phones: one column;
 *  - md: the lead story beside the other stories;
 *  - lg: the last two stories side by side, as on desktop.
 */
export function CompactPage() {
  const [wide, ...columns] = stories;
  return (
    <div className="bg-white px-5 pt-6 pb-8 sm:px-8 sm:pt-8 sm:pb-10 lg:px-12">
      {/* masthead */}
      <Image src={mastheadTitle} alt="The CTM Times" width={699} height={92} sizes="(min-width: 768px) 560px, 80vw" className="mx-auto h-auto w-[86%] max-w-[560px]" />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-[#444] pt-1.5 pb-1.5 font-inter text-[10px] tracking-[1.2px] text-[#444] uppercase sm:text-[11px]">
        <span>{dateline.edition}</span>
        <span className="max-sm:order-last max-sm:w-full max-sm:text-center">{dateline.date}</span>
        <span>{dateline.price}</span>
      </div>
      <div className="h-[3px] border-y border-[#777]" />

      <div className="mt-6 grid gap-8 md:grid-cols-[1fr_1fr] md:gap-10 lg:grid-cols-[0.85fr_1fr]">
        {/* the lead story */}
        <article className="flex flex-col items-start gap-3">
          <StoryTag>{leadStory.tag}</StoryTag>
          <Image src={photoDesk} alt="" width={434} height={244} sizes="(min-width: 768px) 45vw, 90vw" className="h-auto w-full" />
          <h3 className="mt-1 font-inter text-[clamp(2rem,1.5rem+2.4vw,3.25rem)] leading-[1.1] font-semibold text-black capitalize">
            <span className="font-extrabold text-[#e05a47]">{leadStory.headline.highlight}</span>
            {leadStory.headline.rest}
          </h3>
          <p className="font-inter text-base leading-6 font-semibold text-[#444] capitalize sm:text-lg">{leadStory.excerpt}</p>
          <div className="pt-1">
            <ReadLink href={leadStory.href} gap="large">
              {newspaperCopy.readFullStory}
            </ReadLink>
          </div>
        </article>

        {/* the other stories */}
        <div className="flex flex-col gap-8 border-t border-[#ddd] pt-8 md:border-t-0 md:border-l md:pt-0 md:pl-10">
          <CompactStory article={wide} />
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
            {columns.map((article, i) => (
              <CompactStory key={i} article={article} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
