import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { SkinToneProvider } from "@/context/skin-tone-context";
import { WardrobeProvider } from "@/context/wardrobe-context";
import { AuthProvider } from "@/context/auth-context";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Vesto | AI-Powered Style Intelligence",
  description: "Dress for your skin tone. Vesto analyses your complexion, builds your wardrobe, and pairs every outfit — so you always look intentional.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${dmSans.variable} ${dmSerif.variable} antialiased bg-[#0A0A0A]`}
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
