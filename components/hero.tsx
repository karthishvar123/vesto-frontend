"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center pt-32 overflow-hidden bg-white">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 pointer-events-none">
                <img
                    src="/vesto-hanger-bg.png"
                    alt="Vesto Hanger Background"
                    className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/30 to-white" />
            </div>


            <div className="container mx-auto px-6 relative z-10 text-center">

                {/* Stylized Title */}
                <div className="flex justify-center gap-3 mb-10">
                    {[
                        { char: "V", color: "#3B2319" },
                        { char: "E", color: "#6D4936" },
                        { char: "S", color: "#A06E50" },
                        { char: "T", color: "#D49A70" },
                        { char: "O", color: "#F5CBA7" },
                    ].map((letter) => (
                        <span
                            key={letter.char}
                            style={{ backgroundColor: letter.color }}
                            className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-2xl text-white text-3xl md:text-4xl font-bold font-serif shadow-lg transition-transform hover:-translate-y-1 duration-300"
                        >
                            {letter.char}
                        </span>
                    ))}
                </div>

                {/* Massive Typography */}
                {/* Massive Typography - Notion Style Serif */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight text-[#111111] mb-6 px-4">
                    Style, <br className="md:hidden" />
                    <span className="italic text-gray-400">Reinvented.</span>
                </h1>

                <p className="text-base md:text-lg lg:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed px-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200 fill-mode-both">
                    The intelligent wardrobe assistant that understands your skin tone, pairs your outfits, and redefines your confidence.
                </p>

                <div className="flex justify-center items-center mb-20">
                    <Button
                        asChild
                        className="h-14 px-10 text-lg font-medium text-[#111111] bg-white/20 backdrop-blur-3xl border border-white/40 shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] hover:bg-white/40 rounded-full transition-all duration-300"
                    >
                        <Link
                            href="#how-it-works"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            How Vesto Works
                        </Link>
                    </Button>
                </div>
            </div>
        </section >
    );
}
