import HeroSection from "../components/Hero.Section"
import WhoWeAreSection from "../components/WhoWeAre.Section"
import WhatWeMakeSection from "../components/WhatWeMake.Section"
import CreativePlaygroundSection from "../components/CreativePlayground.Section"
import CompanyWeKeepSection from "../components/CompanyWeKeep.Section"
import KindWordsSection from "../components/KindWords.Section"
import NewspaperSection from "../components/Newspaper.Section"
import StartConversationSection from "../components/StartConversation.Section"

function HomePage() {
    return (
        <>
            <HeroSection />
            <WhoWeAreSection />
            <WhatWeMakeSection />
            <CreativePlaygroundSection />
            <CompanyWeKeepSection />
            <KindWordsSection />
            <NewspaperSection />
            <StartConversationSection />
        </>
    )
}

export default HomePage
