"use client";

import SkinToneShop from "@/components/skin-tone-shop";
import CompleteLook from "@/components/complete-look";
import VirtualWardrobe from "@/components/virtual-wardrobe";

export default function UnifiedShopLook() {
    return (
        <section className="w-full px-4 mb-20">
            <div className="w-full max-w-[96%] mx-auto flex flex-col gap-12">

                {/* Box 1: Skin Tone Shop */}
                <div className="bg-[#F6F6F6] rounded-[32px] overflow-hidden shadow-sm">
                    <SkinToneShop />
                </div>

                {/* Divider Line in Whitespace */}
                <div className="w-full px-12 md:px-24">
                    <div className="w-full h-px bg-[#111] opacity-10" />
                </div>

                {/* Box 2: Complete Look */}
                <div className="bg-[#F6F6F6] rounded-[32px] overflow-hidden shadow-sm">
                    <CompleteLook />
                </div>

                {/* Divider Line in Whitespace */}
                <div className="w-full px-12 md:px-24">
                    <div className="w-full h-px bg-[#111] opacity-10" />
                </div>

                {/* Box 3: Virtual Wardrobe */}
                <div className="bg-[#F6F6F6] rounded-[32px] overflow-hidden shadow-sm">
                    <VirtualWardrobe />
                </div>

            </div>
        </section>
    );
}
