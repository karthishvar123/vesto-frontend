"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SkinToneAnimation from "@/components/skin-tone-animation";
import ConicGradientButton from "@/components/conic-gradient-button";
import GlowCard from "@/components/glow-card"; // Reusing the glassy button style if appropriate, or standard button

export default function ConceptSection() {
    return (
        <section
            id="how-it-works"
            className="w-full bg-transparent flex items-center justify-center py-12 sm:py-20 relative overflow-hidden"
        >
            <div className="container mx-auto px-4 sm:px-6 h-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-24">

                {/* Left Side: Glassy Section Box with Glow Effect */}
                <GlowCard className="flex-1 w-full max-w-3xl min-h-[300px] flex flex-col justify-center p-6 sm:p-12 lg:p-16">
                    <div className="space-y-6 relative z-10">
                        <h2 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight uppercase tracking-tight" style={{ color: '#FFFFFF' }}>
                            Wear Colors <br />
                            That Work <br />
                            For You.
                        </h2>
                        <p className="text-lg md:text-xl text-white font-light tracking-wide max-w-lg" style={{ color: '#FFFFFF' }}>
                            A smarter way to shop based on your skin tone category.
                        </p>
                    </div>
                </GlowCard>

                {/* Right Side: Animation Only */}
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-16 w-full max-w-xl">

                    {/* Skin Tone Animation */}
                    <div className="w-full flex justify-center py-4">
                        <SkinToneAnimation />
                    </div>

                    {/* CTA Button with Conic Effect */}
                    <div className="flex justify-center">
                        <ConicGradientButton
                            text="SHOP BY SKINTONE"
                            href="/shop-by-skin-tone"
                            borderColor="#ffffff" // White/Silver gradient
                            backgroundColor="transparent" // Allow glassy effect to show
                            textColor="#ffffff"
                            fontSize={18}
                            overlayMargin={2}
                            className="shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(255,255,255,0.2)] transition-shadow duration-500"
                        >
                            <span className="flex items-center gap-3 text-lg font-medium text-white uppercase tracking-wider">
                                Shop by SkinTone <ArrowRight className="w-5 h-5" />
                            </span>
                        </ConicGradientButton>
                    </div>
                </div>
            </div>
        </section>
    );
}
