import type { Metadata } from "next";
import Navbar from "@/components/website/layout/Navbar";
import Gateway from "@/features/gateway/components/Gateway";
import { fontVariables } from "@/config/fonts";
import { siteConfig } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function WebsiteLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Gateway />
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
