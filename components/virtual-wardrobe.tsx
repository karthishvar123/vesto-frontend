"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import GlowCard from "@/components/glow-card";
import Image from "next/image";

const WARDROBE_CARDS = [
    {
        label: "Topwear",
        description: "T-Shirts, Shirts, Jackets...",
        image: "/products/generated/hanger-tshirt.png",
        accent: "#C4724F",
        bg: "#1a1208",
    },
    {
        label: "Bottomwear",
        description: "Jeans, Trousers, Joggers...",
        image: "/products/generated/beige-chinos.png",
        accent: "#4ECDC4",
        bg: "#0a1a18",
    },
    {
        label: "Footwear",
        description: "Sneakers, Loafers, Formals...",
        image: "/products/generated/white-sneakers.png",
        accent: "#F7DC6F",
        bg: "#18180a",
    },
];

function WardrobeCardStack() {
    return (
        <div className="relative h-[22rem] sm:h-[26rem] flex items-center justify-center">
            {WARDROBE_CARDS.map((card, i) => (
                <motion.div
                    key={card.label}
                    className="absolute w-52 sm:w-64 h-[18rem] sm:h-[22rem] rounded-2xl border border-white/10 overflow-hidden shadow-2xl cursor-grab flex flex-col"
                    style={{ backgroundColor: card.bg }}
                    initial={{ rotate: (i - 1) * 8, x: (i - 1) * 46, y: (i - 1) * 8, zIndex: i }}
                    animate={{ rotate: (i - 1) * 8, x: (i - 1) * 46, y: (i - 1) * 8 }}
                    whileHover={{ y: -24, rotate: 0, scale: 1.06, zIndex: 10 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                    <div className="relative flex-1 w-full overflow-hidden">
                        <Image src={card.image} alt={card.label} fill
                            className="object-contain p-4 drop-shadow-lg" sizes="256px" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
                    </div>
                    <div className="px-4 py-3 border-t border-white/5"
                        style={{ backgroundColor: card.accent + "18" }}>
                        <p className="text-white font-bold text-sm">{card.label}</p>
                        <p className="text-white/35 text-[11px] mt-0.5 truncate">{card.description}</p>
                    </div>
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
