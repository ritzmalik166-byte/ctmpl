import Image from "next/image";
import { leadStory, newspaperCopy, stories, storyPlacements } from "../constants/newspaper.constants";
import { Tilted } from "./Newspaper.Tilted";
import { ReadLink, Story, StoryTag } from "./Newspaper.Story";
import masthead from "@/public/images/website/home/newspaper/masthead.png";
import photoDesk from "@/public/images/website/home/newspaper/photo-desk.png";

/**
 * The front page of The CTM Times (Figma 75:1209, in px of the 1440 section):
 * the sheet turned -3°, with its masthead, the lead story and its photo on
 * the left, three more stories on the right.
 */
export function FrontPage() {
  return (
    <>
      {/* the sheet of newsprint */}
      <Tilted box={{ left: 96.86, top: 273.71, width: 1247.93, height: 953.25 }}>
        <div className="h-[891.52px] w-[1202.92px] bg-white" />
      </Tilted>

      {/* the lead story: headline, excerpt, link */}
      <article className="absolute top-[790.62px] left-[180px] h-[368.78px] w-[445.31px]">
        <Tilted box={{ left: 15, top: 221.38, width: 422.19, height: 93.83 }}>
          <p className="w-[419px] font-inter text-lg leading-6 font-semibold text-[#444] capitalize">{leadStory.excerpt}</p>
        </Tilted>
        <Tilted box={{ left: 14.2, top: 324.99, width: 170.6, height: 43.8 }}>
          <ReadLink href={leadStory.href} gap="large">
            {newspaperCopy.readFullStory}
          </ReadLink>
        </Tilted>
        <Tilted box={{ left: 0, top: 0.38, width: 445.31, height: 226.5 }}>
          <h3 className="w-[435.23px] font-inter text-[56px] leading-[normal] font-semibold text-black capitalize">
            <span className="font-extrabold text-[#e05a47]">{leadStory.headline.highlight}</span>
            {leadStory.headline.rest}
          </h3>
        </Tilted>
      </article>

      {/* masthead: "The CTM Times", edition, date and price */}
      <Tilted box={{ left: 159.97, top: 309.68, width: 1072.65, height: 210.58 }}>
        <Image src={masthead} alt="The CTM Times" width={1066} height={155} className="max-w-none" />
      </Tilted>
      {/* the lead story's photo, and its tag */}
      <Tilted box={{ left: 170, top: 547, width: 446.18, height: 266.38 }}>
        <Image src={photoDesk} alt="" width={434} height={244} className="max-w-none" />
      </Tilted>
      <Tilted box={{ left: 169.99, top: 536, width: 173.65, height: 26.03 }}>
        <StoryTag>{leadStory.tag}</StoryTag>
      </Tilted>

      {/* the other stories */}
      {storyPlacements.map(({ layout, left, top }, i) => (
        <Story key={`${left}-${top}`} article={stories[i]} layout={layout} left={left} top={top} />
      ))}
    </>
  );
}
