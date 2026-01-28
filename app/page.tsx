import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import UnifiedShopLook from "@/components/unified-shop-look";


export default function Home() {
  return (
    <main className="min-h-screen bg-white selection:bg-indigo-500/30">
      <Navbar />
      <Hero />
      <UnifiedShopLook />

    </main>
  );
}
