"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SkinToneAnimation from "./skin-tone-animation";

export default function SkinToneShop() {
    return (
        <section id="how-it-works" className="w-full py-16 md:py-24 bg-transparent flex flex-col items-center justify-center overflow-hidden">
            <div className="w-full px-4 md:px-8 lg:px-16 xl:px-24">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

                    {/* Left Column: New Bold Text */}
                    <div className="text-left w-full flex flex-col justify-center">
                        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-[#111] uppercase tracking-tighter leading-[0.85] font-sans break-words">
                            <motion.span
                                className="block"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                START WITH ONE
                            </motion.span>
                            <motion.span
                                className="block opacity-40"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                            >
                                WE HANDLE THE REST
                            </motion.span>
                        </h2>
                    </div>

                    {/* Right Column: Existing Content (Headline + Animation + Button) */}
                    <div className="flex flex-col items-center lg:items-center w-full">
                        {/* Headline */}
                        <motion.div
                            className="text-center mb-6 md:mb-8 relative z-10"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#111] tracking-tight leading-tight uppercase font-sans mb-2">
                                Made for your tone
                                <br />
                                Built for your style
                            </h3>
                        </motion.div>

                        <motion.div
                            className="w-full mb-10"
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        >
                            <SkinToneAnimation />
                        </motion.div>

                        {/* Glassmorphic Button */}
                        <motion.div
                            className="relative group cursor-pointer z-10 scale-90 md:scale-100"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            {/* Outer Glow/Shadow for 3D effect */}
                            <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />

                            <Link href="/shop-by-skin-tone">
                                <button className="relative px-8 md:px-12 py-4 md:py-5 rounded-full z-10 
                                       bg-gradient-to-b from-white/80 to-white/40
                                       backdrop-blur-md 
                                       border border-white/60
                                       shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.9)]
                                       group-hover:scale-105 transition-all duration-300 ease-out
                                       flex items-center gap-3
                                       ">
                                    <span className="text-lg md:text-xl font-medium text-[#111] tracking-wide whitespace-nowrap">
                                        Shop by SkinTone
                                    </span>
                                    <ArrowRight className="w-5 h-5 text-[#111] opacity-60 group-hover:translate-x-1 transition-transform" />

                                    {/* Shine reflection on top */}
                                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/90 to-transparent opacity-50 rounded-t-full pointer-events-none" />
                                </button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
