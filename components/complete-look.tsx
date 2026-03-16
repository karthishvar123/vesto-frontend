"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import GlowCard from "@/components/glow-card";
import dynamic from "next/dynamic";

const FloatingClothingGallery = dynamic(() => import("@/components/floating-clothing-gallery"), { ssr: false });

const FEATURES = [
    "Topwear → Bottomwear pairing intelligence",
    "Footwear compatibility matching",
    "Color family cross-matching",
    "Style rules by occasion",
];

export default function CompleteLook() {
    return (
        <section className="w-full py-16 sm:py-32 bg-[#0D0D0D] relative overflow-hidden">
            {/* Accent line */}
            <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-[#C4724F]/30 to-transparent" />

            <div className="container mx-auto px-6 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-16 items-center">

                    {/* Left: Floating Clothing Gallery */}
                    <motion.div
                        className="relative h-[380px] sm:h-auto"
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <FloatingClothingGallery />
                    </motion.div>

                    {/* Right: Glow Card Text */}
                    <GlowCard className="p-10 lg:p-14">
                        <div className="space-y-8 relative z-10">
                            <div>
                                <span className="text-[#C4724F] text-xs font-bold uppercase tracking-widest mb-4 block">
                                    Step 02 — Outfit Building
                                </span>
                                <h2 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[0.88]">
                                    COMPLETE<br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C4724F] to-[#E8A87C]">YOUR LOOK</span>
                                </h2>
                            </div>

                            <p className="text-white/50 text-lg leading-relaxed font-light">
                                Pick any item and Vesto instantly suggests everything that goes with it — matched by style, color family, and occasion.
                            </p>

                            <div className="space-y-3">
                                {FEATURES.map((f, i) => (
                                    <motion.div
                                        key={f}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1, duration: 0.5 }}
                                        className="flex items-center gap-3 text-white/60"
                                    >
                                        <CheckCircle2 className="w-4 h-4 text-[#C4724F] shrink-0" />
                                        <span className="text-sm">{f}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </GlowCard>
                </div>
            </div>
        </section>
    );
}
