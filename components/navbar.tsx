"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SearchInput({ isMobile = false }: { isMobile?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/men?q=${encodeURIComponent(query.trim())}`);
      if (isMobile) setExpanded(false);
    } else {
      router.push(`/men`);
    }
  };

  if (isMobile) {
    if (expanded) {
      return (
        <form onSubmit={handleSubmit} className="absolute inset-0 bg-[#0A0A0A] z-50 flex items-center px-4 gap-3">
          <Search className="w-5 h-5 text-white/50" />
          <input 
            autoFocus
            type="text" 
            placeholder="Search products..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-white focus:outline-none text-sm"
          />
          <button type="button" onClick={() => { setExpanded(false); setQuery(searchParams.get("q") || ""); }}>
            <X className="w-5 h-5 text-white/50" />
          </button>
        </form>
      );
    }
    return (
      <button onClick={() => setExpanded(true)} className="p-2 -mr-2 text-white/70 hover:text-white transition-colors">
        <Search className="w-5 h-5" />
      </button>
    );
  }

  // Desktop
  return (
    <form onSubmit={handleSubmit} className="relative flex items-center">
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-white/40" />
        </div>
        <input 
          type="text" 
          placeholder="Search..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-32 lg:w-40 focus:w-56 bg-transparent hover:bg-white/5 focus:bg-[#0A0A0A]/80 border border-transparent focus:border-[#C4724F]/40 rounded-full py-2 pl-9 pr-8 text-xs text-white font-medium placeholder:text-white/30 outline-none transition-all duration-500 ease-out"
        />
        {query && (
          <button type="button" onClick={() => { setQuery(""); router.push('/men'); }} className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <X className="w-3.5 h-3.5 text-white/40 hover:text-white transition-colors" />
          </button>
        )}
      </div>
    </form>
  );
}

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, loading: authLoading, logout } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);



  const menMenu = [
    { category: "Topwear", items: ["T-Shirt", "Sweatshirt", "Jacket", "Formal Shirt", "Casual Shirt", "Active T-Shirt"] },
    { category: "Bottomwear", items: ["Jeans", "Trouser", "Cotton Pant", "Joggers", "Shorts", "Track Pant"] },
    { category: "Footwear", items: ["Casual Shoe", "Sneakers", "Formal Shoe", "Loafer", "Sports Shoe"] },
  ];

  const slugify = (t: string) => t.toLowerCase().replace(/\s+/g, "-");

  return (
    <>
      {/* Mobile navbar — simple top bar, no pill */}
      <nav className={`md:hidden fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-4 h-14 transition-all duration-300 ${
          scrolled ? "bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/8" : "bg-transparent"
      }`}>
        <Link href="/" className="flex items-center gap-2 font-black tracking-tighter text-white text-lg uppercase outline-none">
          <Image src="/logo.png" alt="Vesto Logo" width={28} height={28} className="w-7 h-7 rounded-[6px] object-cover shadow-[0_0_12px_rgba(196,114,79,0.3)]" />
          <span className="text-white font-black tracking-widest text-sm">VESTO</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Suspense fallback={<div className="w-9 h-9" />}>
            <SearchInput isMobile={true} />
          </Suspense>
          
          <Link href="/auth" className="w-8 h-8 rounded-full bg-[#C4724F]/20 border border-[#C4724F]/30 flex items-center justify-center ml-1">
            {mounted && !authLoading && user ? (
              <span className="text-[#C4724F] text-xs font-black">{user.email?.[0].toUpperCase()}</span>
            ) : (
              <span className="text-[#C4724F] text-xs font-black">?</span>
            )}
          </Link>
        </div>
      </nav>

      {/* Desktop navbar — keep the original floating pill */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-[100] pointer-events-none p-5">
      <div
        className={`pointer-events-auto mx-auto max-w-fit flex items-center gap-10 px-8 py-3 rounded-full transition-all duration-500 relative ${scrolled
            ? "bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
            : "bg-white/5 backdrop-blur-md border border-white/10"
          }`}
        onMouseLeave={() => setActiveMenu(null)}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-black tracking-tighter text-white text-xl uppercase outline-none">
          <Image src="/logo.png" alt="Vesto Logo" width={32} height={32} className="w-8 h-8 rounded-lg object-cover shadow-[0_0_15px_rgba(196,114,79,0.3)]" />
          Vesto
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {["MEN", "SHOP BY SKINTONE", "VIRTUAL WARDROBE"].map((item) => (
            <div
              key={item}
              className="relative"
              onMouseEnter={() => item === "MEN" ? setActiveMenu("MEN") : setActiveMenu(null)}
            >
              <Link
                href={
                  item === "MEN" ? "/men" :
                    item === "SHOP BY SKINTONE" ? "/shop-by-skin-tone" :
                      "/virtual-wardrobe"
                }
                className="text-sm font-medium text-white/60 hover:text-white transition-colors uppercase tracking-wide py-3"
              >
                {item}
              </Link>

              <AnimatePresence>
                {item === "MEN" && activeMenu === "MEN" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full left-0 mt-4 w-[560px] bg-[#111]/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-7 z-50 -ml-20"
                  >
                    <div className="grid grid-cols-2 gap-8">
                      {menMenu.map((group) => (
                        <div key={group.category}>
                          <h3 className="text-[10px] font-bold text-[#C4724F] uppercase tracking-widest border-b border-white/5 pb-2 mb-3">
                            {group.category}
                          </h3>
                          <div className="flex flex-col gap-2">
                            {group.items.map((style) => (
                              <Link
                                key={style}
                                href={`/products/${slugify(group.category)}/${slugify(style)}`}
                                className="group flex items-center gap-2 text-sm text-white/50 hover:text-white transition-all"
                              >
                                <span className="w-1 h-1 rounded-full bg-[#C4724F] opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="group-hover:translate-x-0.5 transition-transform">{style}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          
          <Suspense fallback={<div className="w-9 h-9" />}>
            <SearchInput />
          </Suspense>

          <div
            className="relative hidden md:flex items-center"
            onMouseEnter={() => setActiveMenu("PROFILE")}
          >
            <button
              className="flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors uppercase tracking-wide py-3"
            >
              {mounted && !authLoading && user ? (
                <span className="w-7 h-7 rounded-full bg-[#C4724F]/20 border border-[#C4724F]/40 flex items-center justify-center text-[#C4724F] text-xs font-bold">
                  {user.email?.[0].toUpperCase()}
                </span>
              ) : "Profile"}
            </button>

            <AnimatePresence>
              {activeMenu === "PROFILE" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-full right-0 mt-4 w-48 bg-[#111]/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-4 z-50 overflow-hidden"
                >
                  {user ? (
                    <div className="flex flex-col gap-1">
                      <p className="px-3 py-2 text-xs text-white/40 truncate border-b border-white/5 mb-1 pb-2">
                        {user.email}
                      </p>
                      <button
                        onClick={logout}
                        className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <Link
                        href="/auth" 
                        className="px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        Sign In
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>


    </nav>
    </>
  );
}
