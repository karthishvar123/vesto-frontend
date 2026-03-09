"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ScanFace } from "lucide-react";

const TONES = [
    { id: 1, color: "#FFDFC4", label: "Type I", sub: "Pale White" },
    { id: 2, color: "#E6B998", label: "Type II", sub: "Fair" },
    { id: 3, color: "#CF9E76", label: "Type III", sub: "Medium" },
    { id: 4, color: "#A87652", label: "Type IV", sub: "Olive" },
    { id: 5, color: "#75482F", label: "Type V", sub: "Brown" },
    { id: 6, color: "#4B2C20", label: "Type VI", sub: "Deep" },
];

export default function SkinToneShop() {
    return (
        <section id="how-it-works" className="relative w-full py-32 bg-[#0A0A0A] overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#C4724F]/5 blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 mb-16">
                    <div>
                        <span className="text-[#C4724F] text-xs font-bold uppercase tracking-widest mb-4 block">
                            Step 01 — Personalization
                        </span>
                        <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.88]">
                            Start With<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C4724F] to-[#E8A87C]">
                                Your Tone
                            </span>
                        </h2>
                    </div>
                    <p className="text-white/40 text-lg max-w-sm leading-relaxed font-light">
                        We use the Fitzpatrick scale to map your complexion to colors that will make you look your best — scientifically.
                    </p>
                </div>

                {/* Tone cards */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-14">
                    {TONES.map((tone, i) => (
                        <motion.div
                            key={tone.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.07 }}
                            whileHover={{ y: -8, scale: 1.03 }}
                            className="group relative overflow-hidden rounded-2xl border border-white/5 cursor-pointer"
                        >
                            {/* Color block */}
                            <div
                                className="h-28 w-full transition-all duration-500 group-hover:brightness-110"
                                style={{ background: `linear-gradient(135deg, ${tone.color}, ${tone.color}bb)` }}
                            />
                            {/* Info */}
                            <div className="p-3 bg-[#111] border-t border-white/5">
                                <p className="text-white text-xs font-bold">{tone.label}</p>
                                <p className="text-white/40 text-[10px]">{tone.sub}</p>
                            </div>
                            {/* Glow on hover */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
                                style={{ background: `radial-gradient(circle at center, ${tone.color}, transparent)` }}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* CTA Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <Link
                        href="/shop-by-skin-tone"
                        className="group flex items-center gap-3 px-8 py-4 bg-[#C4724F] hover:bg-[#d4845f] text-white font-bold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(196,114,79,0.3)]"
                    >
                        <ScanFace className="w-4 h-4" />
                        Shop by Skin Tone
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <p className="text-white/30 text-sm">or use AI camera for instant detection</p>
                </div>
            </div>
        </section>
    );
}
