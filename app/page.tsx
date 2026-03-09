import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import UnifiedShopLook from "@/components/unified-shop-look";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <Navbar />
      <Hero />
      <UnifiedShopLook />
    </main>
  );
}
