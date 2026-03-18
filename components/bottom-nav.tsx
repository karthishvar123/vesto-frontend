"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Shirt, ScanFace, ShoppingBag, User } from "lucide-react";

const tabs = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/men", icon: ShoppingBag, label: "Shop" },
    { href: "/shop-by-skin-tone", icon: ScanFace, label: "Skin Tone" },
    { href: "/virtual-wardrobe", icon: Shirt, label: "Wardrobe" },
    { href: "/auth", icon: User, label: "Profile" },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0D0D0D] border-t border-white/10"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
            <div className="flex items-center justify-around h-14">
                {tabs.map(({ href, icon: Icon, label }) => {
                    const isActive = pathname === href ||
                        (href !== "/" && pathname.startsWith(href));
                    return (
                        <Link
                            key={href}
                            href={href}
                            className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full"
                        >
                            <Icon
                                className={`w-5 h-5 transition-colors ${isActive ? "text-[#C4724F]" : "text-white/40"}`}
                            />
                            <span className={`text-[10px] font-medium transition-colors ${isActive ? "text-[#C4724F]" : "text-white/30"}`}>
                                {label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
