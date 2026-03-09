"use client";

import SkinToneShop from "@/components/skin-tone-shop";
import CompleteLook from "@/components/complete-look";
import VirtualWardrobe from "@/components/virtual-wardrobe";

export default function UnifiedShopLook() {
    return (
        <div className="w-full bg-[#0A0A0A]">
            <div className="vesto-divider" />
            <SkinToneShop />
            <div className="vesto-divider" />
            <CompleteLook />
            <div className="vesto-divider" />
            <VirtualWardrobe />
        </div>
    );
}
