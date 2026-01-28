"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function CompleteLook() {
    return (
        <section className="w-full py-24 bg-transparent flex items-center justify-center">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="grid md:grid-cols-2 gap-12 items-center">

                    {/* Left Side: Outfit Composition Image */}
                    <div className="relative w-full aspect-square md:aspect-[4/3] flex items-center justify-center">
                        {/* Using object-contain to make sure the full outfit composition is visible and not cropped */}
                        <div className="relative w-full h-full max-w-[600px]">
                            <Image
                                src="/outfit-composition.png"
                                alt="Complete Outfit Composition"
                                fill
                                className="object-contain mix-blend-multiply contrast-125"
                                priority
                            />
                        </div>
                    </div>

                    {/* Right Side: Typography */}
                    <div className="flex flex-col items-end text-right space-y-6 w-full">
                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-[#111] uppercase tracking-tighter leading-[0.85] font-sans">
                            <motion.span
                                className="block"
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                COMPLETE
                            </motion.span>
                            <motion.span
                                className="block"
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                            >
                                YOUR LOOK
                            </motion.span>
                        </h2>

                        <motion.p
                            className="text-lg md:text-xl text-[#111]/65 font-medium leading-loose max-w-lg"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            Style compatibility across categories
                            <br />
                            <span>No mismatches. Ever.</span>
                        </motion.p>
                    </div>

                </div>
            </div>
        </section>
    );
}
