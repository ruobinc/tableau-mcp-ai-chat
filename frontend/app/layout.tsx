import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { JWTProvider } from "../contexts/JWTContext";
import { tableauUserName } from "../constants/constants";
import ThemeRegistry from "../components/ThemeRegistry";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Super Store Dashboard",
  description: "Interactive analytics workspace for the next-gen Super Store",
  icons: {
    icon: [
      { url: "/super-store-icon.svg", type: "image/svg+xml" },
      { url: "/super-store-icon.svg", sizes: "64x64" }
    ],
    shortcut: "/super-store-icon.svg",
    apple: "/super-store-icon.svg"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Tableau Embedding API scriptを遅延ロード */}
        <Script
          strategy="lazyOnload"
          type="module"
          src="https://prod-apnortheast-a.online.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js"
        />
        <ThemeRegistry>
          <JWTProvider
            defaultUsername={tableauUserName}
            prefetchDefaultToken={false}
          >
            {children}
          </JWTProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
