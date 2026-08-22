import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SiteShell } from "@/components/site-shell";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.docjizzle.com"),
  title: "Doc Jordan's High Vibe Shop | Books, Music & ALKAMI Apparel",
  description:
    "A premium storefront for Doc Jordan's high-vibrational books, music, and ALKAMI clothing collections.",
  openGraph: {
    title: "Doc Jordan's High Vibe Shop",
    description: "Books, music, and clothing for mindful recovery, inner peace, and elevated daily living.",
    images: ["/images/hero-doc-jordan-store.png"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}

