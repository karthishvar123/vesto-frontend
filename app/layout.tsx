import type { Metadata, Viewport } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { SkinToneProvider } from "@/context/skin-tone-context";
import { WardrobeProvider } from "@/context/wardrobe-context";
import { AuthProvider } from "@/context/auth-context";
import Script from "next/script";

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
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Vesto",
  },
};

export const viewport: Viewport = {
  themeColor: "#C4724F",
  width: "device-width",
  initialScale: 1,
};

import { Footer } from "@/components/footer";
import BottomNav from "@/components/bottom-nav";
import OnboardingWrapper from "@/components/onboarding-wrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${dmSans.variable} ${dmSerif.variable} antialiased bg-[#0A0A0A] flex flex-col min-h-screen`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <SkinToneProvider>
            <WardrobeProvider>
              <OnboardingWrapper />
              <main className="flex-grow pb-24 md:pb-0">
                {children}
              </main>
              <Footer />
              <BottomNav />
            </WardrobeProvider>
          </SkinToneProvider>
        </AuthProvider>

        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) { console.log('SW registered: ', registration.scope); },
                  function(err) { console.log('SW registration failed: ', err); }
                );
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
