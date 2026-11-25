import HomePage from "@/features/home/page/HomePage"
import type { Metadata } from "next"
import Gateway from "@/features/gateway/components/Gateway"

export const metadata: Metadata = {
  title: "Creative Thinks Media | Advertising Agency in Noida, Delhi NCR",
  description:
    "Full-service advertising and creative agency in Noida, Delhi NCR since 2008. Print, radio, events, artists, digital, reels and AI film under one roof.",
}

export default function Home() {
  return (
    <>
      {/* the welcome gateway: home page only, once per browser session */}
      <Gateway />
      <HomePage />
    </>
  )
}