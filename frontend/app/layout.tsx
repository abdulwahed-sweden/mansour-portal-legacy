import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mansour's Portal | The Resilient Bloom",
  description:
    "A Legacy NFT immortalizing a family painting's journey from Sweden to Gaza. Painted by Sara Mansour, forever enshrined in grandmother's room in Cairo.",
  openGraph: {
    title: "The Resilient Bloom - Mansour's Portal",
    description: "A Legacy NFT immortalizing a family painting's journey across continents",
    images: ["https://gateway.pinata.cloud/ipfs/QmbmreB8fSVruYEGZZqdnxxyvdEyibiBp21nG84qtKca3F"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
