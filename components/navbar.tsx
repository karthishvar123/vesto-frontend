"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { Menu, X, ChevronRight } from "lucide-react";

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const menMenu = [
    {
      category: "Topwear",
      items: ["T-Shirt", "Sweatshirt", "Jacket", "Formal Shirt", "Casual Shirt", "Active T-Shirt"]
    },
    {
      category: "Bottomwear",
      items: ["Jeans", "Trouser", "Cotton Pant", "Joggers", "Shorts", "Track Pant"]
    },
    {
      category: "Footwear",
      items: ["Casual Shoe", "Sneakers", "Formal Shoe", "Loafer", "Sports Shoe"]
    }
  ];

  const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 pointer-events-none p-6">
      <div
        className="pointer-events-auto mx-auto max-w-fit bg-white/20 backdrop-blur-3xl border border-white/40 shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] rounded-full px-8 py-3 flex items-center gap-12 relative group"
        onMouseLeave={() => setActiveMenu(null)}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/5 opacity-50 pointer-events-none rounded-full" />
        <div className="relative z-10 flex items-center gap-12">
          {/* Logo */}
          <Link
            href="/"
            className="font-bold tracking-tight text-[#111111] text-2xl flex items-center gap-2 uppercase"
          >
            <span className="w-8 h-8 bg-black rounded text-white flex items-center justify-center text-base font-serif italic">V</span>
            Vesto
          </Link>

          {/* Navigation Links - Desktop */}
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
                        item === "VIRTUAL WARDROBE" ? "/virtual-wardrobe" : "#"
                  }
                  className="text-base font-medium text-[#37352F] hover:text-black transition-colors uppercase py-4"
                >
                  {item}
                </Link>

                {/* Dropdown Menu for MEN */}
                <AnimatePresence>
                  {item === "MEN" && activeMenu === "MEN" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-6 w-[600px] bg-white/95 backdrop-blur-xl border border-white/40 shadow-xl rounded-3xl p-8 z-50 -ml-24"
                    >
                      <div className="grid grid-cols-2 gap-y-10 gap-x-12">
                        {menMenu.map((group) => (
                          <div key={group.category} className="space-y-4">
                            <h3 className="text-xs font-bold text-[#111] uppercase tracking-widest border-b border-black/5 pb-2">
                              {group.category}
                            </h3>
                            <div className="flex flex-col gap-3">
                              {group.items.map((style) => (
                                <Link
                                  key={style}
                                  href={`/products/${slugify(group.category)}/${slugify(style)}`}
                                  className="group flex items-center gap-2 text-sm text-[#37352F]/70 hover:text-black transition-all"
                                >
                                  <span className="w-1 h-1 rounded-full bg-black opacity-0 group-hover:opacity-100 transition-opacity" />
                                  <span className="group-hover:translate-x-1 transition-transform">
                                    {style}
                                  </span>
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

          {/* Action Button */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-[#37352F] hover:text-black transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Desktop Profile Link */}
            <Link href="/profile" className="text-base font-medium text-[#37352F] hover:text-black transition-colors hidden md:block uppercase">
              Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] pointer-events-auto"
            />

            {/* Menu Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm bg-white z-[70] pointer-events-auto shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-bold tracking-tight text-[#111111] text-xl flex items-center gap-2 uppercase"
                >
                  <span className="w-8 h-8 bg-black rounded text-white flex items-center justify-center text-base font-serif italic">V</span>
                  Vesto
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="p-6 space-y-1">
                <Link
                  href="/men"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors group"
                >
                  <span className="text-lg font-medium text-[#111]">MEN</span>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#111] group-hover:translate-x-1 transition-all" />
                </Link>

                <Link
                  href="/shop-by-skin-tone"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors group"
                >
                  <span className="text-lg font-medium text-[#111]">SHOP BY SKINTONE</span>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#111] group-hover:translate-x-1 transition-all" />
                </Link>

                <Link
                  href="/virtual-wardrobe"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors group"
                >
                  <span className="text-lg font-medium text-[#111]">VIRTUAL WARDROBE</span>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#111] group-hover:translate-x-1 transition-all" />
                </Link>

                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors group"
                >
                  <span className="text-lg font-medium text-[#111]">PROFILE</span>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#111] group-hover:translate-x-1 transition-all" />
                </Link>
              </nav>

              {/* User Info & Logout (if logged in) */}
              {user && (
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100 bg-gray-50">
                  <p className="text-sm text-gray-500 mb-3">Signed in as</p>
                  <p className="text-sm font-medium text-[#111] mb-4 truncate">{user.email}</p>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-[#111] text-white py-3 rounded-lg font-medium hover:bg-black/90 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
