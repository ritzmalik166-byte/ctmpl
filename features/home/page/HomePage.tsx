import HeroSection from "../components/Hero.Section"
import WhoWeAreSection from "../components/WhoWeAre.Section"
import WhatWeMakeSection from "../components/WhatWeMake.Section"
import CreativePlaygroundSection from "../components/CreativePlayground.Section"
import KindWordsSection from "../components/KindWords.Section"
import PinboardSection from "../components/Pinboard.Section"
import StartConversationSection from "../components/StartConversation.Section"

function HomePage() {
    return (
        <>
            <HeroSection />
            <WhoWeAreSection />
            <WhatWeMakeSection />
            <CreativePlaygroundSection />
            <KindWordsSection />
            <PinboardSection />
            <StartConversationSection />
        </>
    )
}

export default HomePage
