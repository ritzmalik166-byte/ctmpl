import type { Metadata } from "next";
import Navbar from "@/components/website/layout/Navbar";
import Footer from "@/components/website/layout/Footer";
import SmoothScroll from "@/components/website/layout/SmoothScroll";
import { GatewaySessionScript } from "@/features/gateway/components/GatewaySessionScript";
import { fontVariables } from "@/config/fonts";
import { siteConfig } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function WebsiteLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: GatewaySessionScript may mark <html> before React hydrates
    <html lang="en" className={`${fontVariables} h-full antialiased`} suppressHydrationWarning>
      <head>
        <GatewaySessionScript />
      </head>
      <body className="flex min-h-full flex-col">
        <SmoothScroll />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
