"use client";

import React from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const FlipCardStack = dynamic(() => import("./flip-card-stack"), { ssr: false });
import GlowCard from "./glow-card";
import ConicGradientButton from "./conic-gradient-button";
import { ArrowRight } from "lucide-react";

const generatedImages = [
    "/products/generated/hanger-tshirt.png",
    "/products/generated/hanger-joggers.png",
    "/products/generated/hanger-shirt.png",
    "/products/generated/hanger-sweatshirt.png"
];

export default function ScrollLayoutSection() {
    return (
        <section className="relative w-full py-16 sm:py-24 flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-12 px-4 sm:px-6 lg:px-20 overflow-hidden">

            {/* Left Column: Flip Card Stack */}
            <div className="w-full lg:w-1/2 h-[360px] sm:h-[500px] lg:h-[700px] relative z-20 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-black/0 via-black/0 to-black/0 pointer-events-none z-30" />
                <FlipCardStack
                    cards={generatedImages.map(img => ({ image: { src: img } }))}
                    cardWidth={typeof window !== "undefined" && window.innerWidth < 400 ? 280 : 350}
                    cardHeight={500}
                    stackOffset={12}
                    stackRotation={-5}
                    borderRadius={12}
                />
            </div>

            {/* Right Column: Content Box */}
            <motion.div
                className="w-full lg:w-1/2 flex justify-center lg:justify-start relative z-30"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <div className="w-full max-w-xl">
                    <GlowCard className="p-12 border border-white/10 bg-black/40 backdrop-blur-md">
                        <h2 className="text-5xl md:text-6xl font-serif text-white mb-6 leading-tight">
                            Your <span className="italic text-white">Digital</span> <br />
                            Wardrobe.
                        </h2>

                        <p className="text-xl text-white/90 font-light mb-8 leading-relaxed">
                            Organize your style effortlessly. Visualize every piece you own, paired perfectly on virtual hangers.
                            Planned outfits, smart matches, and a clutter-free mind.
                        </p>

                        <div>
                            <ConicGradientButton href="/virtual-wardrobe" className="text-lg px-8 py-4">
                                <span className="flex items-center gap-3">
                                    Start Organizing <ArrowRight className="w-5 h-5" />
                                </span>
                            </ConicGradientButton>
                        </div>
                    </GlowCard>
                </div>
            </motion.div>

        </section>
    );
}
