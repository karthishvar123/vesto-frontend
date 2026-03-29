"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, X } from "lucide-react";

const SLIDES = [
    {
        id: 1,
        tag: "Welcome to Vesto",
        heading: "Dress for your\nskin tone.",
        sub: "Most apps show you what's trending. Vesto shows you what actually works — for your complexion.",
        visual: (
            <div className="flex gap-3 justify-center flex-wrap">
                {["#FFDFC4", "#E6B998", "#CF9E76", "#A87652", "#75482F", "#4B2C20"].map((color, i) => (
                    <motion.div
                        key={color}
                        className="rounded-full border-2 border-white/20 overflow-hidden"
                        style={{ backgroundColor: color }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
                    >
                        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full" style={{ backgroundColor: color }} />
                    </motion.div>
                ))}
            </div>
        ),
    },
    {
        id: 2,
        tag: "How it works",
        heading: "3 steps to\nlooking great.",
        sub: null,
        visual: (
            <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
                {[
                    { num: "01", title: "Scan your skin tone", desc: "Use camera detection or select manually from 6 Fitzpatrick types", color: "#C4724F" },
                    { num: "02", title: "Browse matched clothes", desc: "Every product is filtered by color compatibility for your tone", color: "#E8A87C" },
                    { num: "03", title: "Build your wardrobe", desc: "Save items, get daily outfit suggestions, complete your look", color: "#C4724F" },
                ].map((step, i) => (
                    <motion.div
                        key={step.num}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.15 }}
                        className="flex items-start gap-4 bg-white/5 rounded-2xl p-4 border border-white/10"
                    >
                        <span className="text-2xl font-black shrink-0" style={{ color: step.color }}>{step.num}</span>
                        <div>
                            <p className="text-white font-bold text-sm">{step.title}</p>
                            <p className="text-white/40 text-xs mt-0.5 leading-relaxed">{step.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        ),
    },
    {
        id: 3,
        tag: "Your wardrobe",
        heading: "Everything you own,\nremembered.",
        sub: "Add clothes to your virtual wardrobe. Vesto pairs them intelligently and suggests daily outfits based on what you already have.",
        visual: (
            <div className="relative w-48 h-48 mx-auto">
                {[
                    { label: "Topwear", bg: "#1a1208", rotate: -8, x: -30 },
                    { label: "Bottomwear", bg: "#0a1a18", rotate: 0, x: 0 },
                    { label: "Footwear", bg: "#18180a", rotate: 8, x: 30 },
                ].map((card, i) => (
                    <motion.div
                        key={card.label}
                        className="absolute inset-0 rounded-2xl border border-white/10 flex items-end p-3"
                        style={{ backgroundColor: card.bg, zIndex: i }}
                        initial={{ rotate: 0, x: 0, opacity: 0 }}
                        animate={{ rotate: card.rotate, x: card.x, opacity: 1 }}
                        transition={{ delay: i * 0.15, type: "spring" }}
                    >
                        <span className="text-white/50 text-xs font-bold">{card.label}</span>
                    </motion.div>
                ))}
            </div>
        ),
    },
];

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
    const [slide, setSlide] = useState(0);
    const router = useRouter();
    const isLast = slide === SLIDES.length - 1;

    const handleNext = () => {
        if (isLast) {
            onComplete();
            router.push("/shop-by-skin-tone");
        } else {
            setSlide(s => s + 1);
        }
    };

    const handleSkip = () => {
        onComplete();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-[#0A0A0A] flex flex-col"
        >
            {/* Skip button */}
            <div className="flex justify-end p-5">
                <button
                    onClick={handleSkip}
                    className="flex items-center gap-1.5 text-white/30 hover:text-white text-sm font-medium transition-colors"
                >
                    Skip <X className="w-4 h-4" />
                </button>
            </div>

            {/* Slide content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 gap-8 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={slide}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -24 }}
                        transition={{ duration: 0.35 }}
                        className="w-full flex flex-col items-center gap-8"
                    >
                        {/* Visual */}
                        <div className="w-full flex items-center justify-center min-h-[180px]">
                            {SLIDES[slide].visual}
                        </div>

                        {/* Text */}
                        <div className="text-center space-y-3 max-w-sm">
                            <span className="text-[#C4724F] text-xs font-bold uppercase tracking-widest">
                                {SLIDES[slide].tag}
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight whitespace-pre-line">
                                {SLIDES[slide].heading}
                            </h2>
                            {SLIDES[slide].sub && (
                                <p className="text-white/40 text-sm leading-relaxed">
                                    {SLIDES[slide].sub}
                                </p>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom controls */}
            <div className="p-6 pb-12 flex flex-col items-center gap-5">
                {/* Progress dots */}
                <div className="flex gap-2">
                    {SLIDES.map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                width: i === slide ? 24 : 8,
                                backgroundColor: i === slide ? "#C4724F" : "rgba(255,255,255,0.2)"
                            }}
                            className="h-2 rounded-full"
                            transition={{ duration: 0.3 }}
                        />
                    ))}
                </div>

                {/* CTA button */}
                <button
                    onClick={handleNext}
                    className="w-full max-w-sm flex items-center justify-center gap-3 py-4 bg-[#C4724F] hover:bg-[#d4845f] text-white font-bold rounded-full transition-all hover:scale-105 text-lg"
                >
                    {isLast ? "Scan My Skin Tone" : "Next"}
                    <ArrowRight className="w-5 h-5" />
                </button>

                {isLast && (
                    <button
                        onClick={handleSkip}
                        className="text-white/30 text-sm hover:text-white transition-colors"
                    >
                        {"I'll explore on my own"}
                    </button>
                )}
            </div>
        </motion.div>
    );
}
