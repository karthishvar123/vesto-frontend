"use client";

import { ScanFace, ShoppingBag, Shirt, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import SkinToneAnimation from "@/components/skin-tone-animation";

export default function Features() {
    return (
        <section id="features" className="py-24 bg-white relative">
            <div className="container mx-auto px-6">

                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#111] font-serif mb-6">
                        More than just shopping.
                    </h2>
                    <p className="text-lg text-[#37352F] opacity-60">
                        A complete toolkit for the modern man to dress better, faster, and smarter.
                    </p>
                </div>

                {/* Notion Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto">

                    {/* Feature 1 */}
                    <div className="notion-block flex flex-col justify-center items-center h-[280px] group hover:border-[#111] transition-colors duration-300 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-orange-50/50 to-transparent opacity-50" />
                        <SkinToneAnimation />
                    </div>

                    {/* Feature 2 */}
                    <div className="notion-block flex flex-col justify-between min-h-[280px] group hover:border-[#111] transition-colors duration-300">
                        <div className="mb-4">
                            <div className="w-12 h-12 rounded-lg bg-[#D3E5EF] flex items-center justify-center text-[#0B6E99] mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Palette size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-[#111] mb-2 font-serif">Curated Colors</h3>
                            <p className="text-[#37352F] text-sm opacity-80 leading-relaxed">
                                Get instant recommendations for clothing colors that enhance your natural look.
                            </p>
                        </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="notion-block flex flex-col justify-between min-h-[280px] group hover:border-[#111] transition-colors duration-300">
                        <div className="mb-4">
                            <div className="w-12 h-12 rounded-lg bg-[#FFE2DD] flex items-center justify-center text-[#D44C47] mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Shirt size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-[#111] mb-2 font-serif">Virtual Wardrobe</h3>
                            <p className="text-[#37352F] text-sm opacity-80 leading-relaxed">
                                Digitize your closet and generate outfit combinations automatically.
                            </p>
                        </div>
                    </div>

                    {/* Feature 4 */}
                    <div className="notion-block flex flex-col justify-between min-h-[280px] group hover:border-[#111] transition-colors duration-300">
                        <div className="mb-4">
                            <div className="w-12 h-12 rounded-lg bg-[#DBEDDB] flex items-center justify-center text-[#0F7B6C] mb-4 group-hover:scale-110 transition-transform duration-300">
                                <ShoppingBag size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-[#111] mb-2 font-serif">Smart Shop</h3>
                            <p className="text-[#37352F] text-sm opacity-80 leading-relaxed">
                                Buy outfits that actually work for you from your favorite brands.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
