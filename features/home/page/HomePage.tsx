import HeroSection from "../components/Hero.Section"
import WhoWeAreSection from "../components/WhoWeAre.Section"
import WhatWeMakeSection from "../components/WhatWeMake.Section"
import CreativePlaygroundSection from "../components/CreativePlayground.Section"
import CompanyWeKeepSection from "../components/CompanyWeKeep.Section"
import KindWordsSection from "../components/KindWords.Section"
import PinboardSection from "../components/Pinboard.Section"
import StartConversationSection from "../components/StartConversation.Section"
import { ScrollPlane } from "../components/ScrollPlane"

function HomePage() {
    return (
        <>
            <HeroSection />
            <WhoWeAreSection />
            <WhatWeMakeSection />
            <CreativePlaygroundSection />
            <CompanyWeKeepSection />
            <KindWordsSection />
            <PinboardSection />
            <StartConversationSection />
            {/* the eyebrow plane, flying from section to section with the scroll */}
            <ScrollPlane />
        </>
    )
}

export default HomePage
