import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { SkinToneProvider } from "@/context/skin-tone-context";
import { WardrobeProvider } from "@/context/wardrobe-context";
import { AuthProvider } from "@/context/auth-context";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vesto | Revolutionizing Style",
  description: "Curated men's fashion platform with personalized skin tone matching.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <SkinToneProvider>
            <WardrobeProvider>
              {children}
            </WardrobeProvider>
          </SkinToneProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
