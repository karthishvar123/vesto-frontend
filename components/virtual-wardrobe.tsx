"use client";

import { motion } from "framer-motion";
import FashionCardAnimation from "@/components/fashion-card-animation";

export default function VirtualWardrobe() {
    return (
        <section className="w-full py-24 bg-transparent flex items-center justify-center">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="grid md:grid-cols-2 gap-12 items-center">

                    {/* Left Side: Wardrobe Cards Animation */}
                    <div className="relative w-full aspect-square md:aspect-[4/3] flex items-center justify-center">
                        <FashionCardAnimation />
                    </div>

                    {/* Right Side: Typography */}
                    <div className="flex flex-col items-end text-right space-y-8 w-full">
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#111] tracking-tight leading-tight font-sans">
                            <motion.span
                                className="block mb-2"
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                Everything you own, remembered.
                            </motion.span>
                            <motion.span
                                className="block mb-2"
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                            >
                                Everything you buy, matched.
                            </motion.span>
                            <motion.span
                                className="block"
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                            >
                                All in one place.
                            </motion.span>
                        </h2>

                        <motion.p
                            className="text-lg md:text-xl text-[#111]/65 font-medium leading-loose max-w-lg"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            Your personal style,
                            <br />
                            <span>organised intelligently.</span>
                        </motion.p>
                    </div>

                </div>
            </div>
        </section>
    );
}
