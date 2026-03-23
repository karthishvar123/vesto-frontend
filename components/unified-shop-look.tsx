"use client";

import SkinToneShop from "@/components/skin-tone-shop";
import CompleteLook from "@/components/complete-look";
import VirtualWardrobe from "@/components/virtual-wardrobe";
import WhyVesto from "@/components/why-vesto";

export default function UnifiedShopLook() {
    return (
        <div className="w-full bg-[#0A0A0A]">
            <WhyVesto />
            <div className="vesto-divider" />
            <SkinToneShop />
            <div className="vesto-divider" />
            <CompleteLook />
            <div className="vesto-divider" />
            <VirtualWardrobe />
        </div>
    );
}
