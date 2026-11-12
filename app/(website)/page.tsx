import HomePage from "@/features/home/page/HomePage"
import Gateway from "@/features/gateway/components/Gateway"

export default function Home() {
  return (
    <>
      {/* the welcome gateway: home page only, once per browser session */}
      <Gateway />
      <HomePage />
    </>
  )
}