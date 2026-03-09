"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import GlowCard from "@/components/glow-card";
import FlipCardStack from "@/components/flip-card-stack";

const CARDS = [
    {
        title: "Topwear",
        description: "T-Shirts, Shirts, Jackets...",
        image: null,
    },
    {
        title: "Bottomwear",
        description: "Jeans, Trousers, Joggers...",
        image: null,
    },
    {
        title: "Footwear",
        description: "Sneakers, Formal, Loafers...",
        image: null,
    },
];

// Since FlipCardStack expects card.image.src format, render our own cards inline
function WardrobeCardStack() {
    const colors = ["#1a1a2e", "#0f1a1a", "#1a1a0f"];
    const accents = ["#C4724F", "#4ECDC4", "#F7DC6F"];
    const labels = ["Topwear", "Bottomwear", "Footwear"];
    const counts = ["T-Shirts, Shirts, Jackets...", "Jeans, Trousers, Joggers...", "Sneakers, Formal, Loafers..."];

    return (
        <div className="relative h-80 flex items-center justify-center">
            {labels.map((label, i) => (
                <motion.div
                    key={label}
                    className="absolute w-56 rounded-2xl border border-white/10 overflow-hidden shadow-2xl cursor-grab"
                    style={{ backgroundColor: colors[i] }}
                    initial={{ rotate: (i - 1) * 12, x: (i - 1) * 55, y: (i - 1) * 10, zIndex: i }}
                    animate={{ rotate: (i - 1) * 12, x: (i - 1) * 55, y: (i - 1) * 10 }}
                    whileHover={{ y: -24, rotate: 0, scale: 1.06, zIndex: 10 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                    <div className="p-5">
                        <div
                            className="w-9 h-9 rounded-xl mb-4 flex items-center justify-center text-lg font-black"
                            style={{ backgroundColor: accents[i] + "22", color: accents[i] }}
                        >
                            {label[0]}
                        </div>
                        <p className="text-white font-bold text-sm mb-1">{label}</p>
                        <p className="text-white/30 text-xs">{counts[i]}</p>
                    </div>
                    <div
                        className="h-20 w-full opacity-20"
                        style={{ background: `linear-gradient(to bottom, transparent, ${accents[i]})` }}
                    />
                </motion.div>
            ))}
        </div>
    );
}

export default function VirtualWardrobe() {
    return (
        <section className="w-full py-32 bg-[#0A0A0A] relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="grid md:grid-cols-2 gap-16 items-center">

                    {/* Left: Flip Card Stack */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex items-center justify-center"
                    >
                        <WardrobeCardStack />
                    </motion.div>

                    {/* Right: Glow Card Text */}
                    <GlowCard className="p-10 lg:p-14">
                        <div className="space-y-8 relative z-10">
                            <div>
                                <span className="text-[#C4724F] text-xs font-bold uppercase tracking-widest mb-4 block">
                                    Step 03 — Your Wardrobe
                                </span>
                                <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-[0.88]">
                                    <motion.span
                                        className="block"
                                        initial={{ opacity: 0, x: 40 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        Everything you own,
                                    </motion.span>
                                    <motion.span
                                        className="block text-transparent bg-clip-text bg-gradient-to-r from-[#C4724F] to-[#E8A87C]"
                                        initial={{ opacity: 0, x: 40 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: 0.15 }}
                                    >
                                        remembered.
                                    </motion.span>
                                    <motion.span
                                        className="block"
                                        initial={{ opacity: 0, x: 40 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: 0.3 }}
                                    >
                                        Everything you buy,
                                    </motion.span>
                                    <motion.span
                                        className="block text-white/30"
                                        initial={{ opacity: 0, x: 40 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: 0.45 }}
                                    >
                                        matched.
                                    </motion.span>
                                </h2>
                            </div>

                            <p className="text-white/50 text-lg leading-relaxed font-light">
                                Your digital closet. Organised by category, styled intelligently, and always ready to help you decide what to wear.
                            </p>

                            <Link
                                href="/virtual-wardrobe"
                                className="group inline-flex items-center gap-3 px-8 py-4 border border-white/10 hover:border-[#C4724F]/50 bg-white/5 hover:bg-[#C4724F]/10 text-white font-bold rounded-full transition-all duration-300"
                            >
                                Open Wardrobe
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </GlowCard>
                </div>
            </div>
        </section>
    );
}
