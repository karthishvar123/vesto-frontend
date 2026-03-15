"use client";

import Navbar from "@/components/navbar";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useSkinTone } from "@/context/skin-tone-context";
import { useRouter } from "next/navigation";
import { ArrowRight, Camera, Sparkles, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import dynamic from "next/dynamic";

const AICamera = dynamic(() => import("@/components/skin-tone-finder/ai-camera"), {
    loading: () => <div className="fixed inset-0 bg-black/80 z-[100]" />,
    ssr: false,
});

const skinTones = [
    { name: "Type I", color: "#FFDFC4", edge: "#F3C4B1", sub: "Pale White", undertone: "Cool", badge: "bg-blue-500/10 text-blue-300 border-blue-500/20" },
    { name: "Type II", color: "#E6B998", edge: "#D7A07B", sub: "White, Fair", undertone: "Cool", badge: "bg-blue-500/10 text-blue-300 border-blue-500/20" },
    { name: "Type III", color: "#CF9E76", edge: "#B9885C", sub: "Medium Olive", undertone: "Warm", badge: "bg-amber-500/10 text-amber-300 border-amber-500/20" },
    { name: "Type IV", color: "#A87652", edge: "#8E5C3E", sub: "Moderate Brown", undertone: "Neutral", badge: "bg-white/5 text-white/50 border-white/10" },
    { name: "Type V", color: "#75482F", edge: "#5C3521", sub: "Dark Brown", undertone: "Warm", badge: "bg-amber-500/10 text-amber-300 border-amber-500/20" },
    { name: "Type VI", color: "#4B2C20", edge: "#361E14", sub: "Very Dark Brown", undertone: "Neutral", badge: "bg-white/5 text-white/50 border-white/10" },
];

export default function ShopBySkinTonePage() {
    const { selectSkinTone, selectedType, saveSkinToneToFirestore } = useSkinTone();
    const router = useRouter();
    const [showCamera, setShowCamera] = useState(false);

    const handleShopClick = async () => {
        if (!selectedType) return;
        await saveSkinToneToFirestore();
        router.push("/recommendations");
    };

    const containerVariants: Variants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
    const itemVariants: Variants = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60 } } };

    return (
        <main className="min-h-screen bg-[#0A0A0A]">
            <Navbar />

            <AnimatePresence>
                {showCamera && <AICamera onClose={() => setShowCamera(false)} onMatchFound={(t) => selectSkinTone(t)} />}
            </AnimatePresence>

            {/* Ambient glow */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[#C4724F]/5 blur-[120px]" />
            </div>

            <div className="relative z-10 pt-32 pb-24 px-4 md:px-8 max-w-7xl mx-auto">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center mb-16 max-w-3xl mx-auto">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C4724F]/30 bg-[#C4724F]/10 text-[#E8A87C] text-xs font-bold uppercase tracking-widest mb-6">
                        <Sparkles className="w-3 h-3" /> Personalized Styling
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.88] mb-6">
                        Find Your<br />
                        <span className="text-[#E8A87C]">Perfect Match.</span>
                    </h1>
                    <p className="text-white/40 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                        Select your Fitzpatrick skin type below, or let the AI camera detect it automatically.
                    </p>

                    {/* AI Camera button */}
                    <button
                        onClick={() => setShowCamera(true)}
                        className="group inline-flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#C4724F]/40 text-white font-bold rounded-full transition-all duration-300"
                    >
                        <Camera className="w-5 h-5 text-[#C4724F]" />
                        Analyse with AI Camera
                        <span className="bg-[#C4724F]/20 border border-[#C4724F]/30 text-[#E8A87C] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">AI</span>
                    </button>
                </motion.div>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-12 max-w-3xl mx-auto">
                    <div className="flex-1 h-px bg-white/5" />
                    <span className="text-white/20 text-xs uppercase tracking-widest">or select manually</span>
                    <div className="flex-1 h-px bg-white/5" />
                </div>

                {/* Tone cards */}
                <motion.div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-16" variants={containerVariants} initial="hidden" animate="show">
                    {skinTones.map((tone, index) => {
                        const typeId = (index + 1) as 1 | 2 | 3 | 4 | 5 | 6;
                        const isSelected = selectedType === typeId;
                        return (
                            <motion.div
                                key={tone.name}
                                variants={itemVariants}
                                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => selectSkinTone(typeId)}
                                className={`relative overflow-hidden cursor-pointer rounded-2xl border-2 transition-all duration-300 ${isSelected ? "border-[#C4724F] shadow-[0_0_30px_rgba(196,114,79,0.25)]" : "border-white/5 hover:border-white/10"}`}
                            >
                                {/* Color swatch */}
                                <div className="h-28 w-full relative" style={{ background: `linear-gradient(135deg, ${tone.color}, ${tone.edge})` }}>
                                    {isSelected && (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3 bg-[#C4724F] rounded-full p-1">
                                            <CheckCircle2 className="w-4 h-4 text-white" />
                                        </motion.div>
                                    )}
                                </div>
                                {/* Info */}
                                <div className="p-4 bg-[#111]">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-white font-black text-base uppercase tracking-tight">{tone.name}</h3>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide ${tone.badge}`}>{tone.undertone}</span>
                                    </div>
                                    <p className="text-white/40 text-xs">{tone.sub}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Sticky CTA */}
                <div className="flex justify-center">
                    <motion.button
                        onClick={handleShopClick}
                        disabled={!selectedType}
                        whileHover={selectedType ? { scale: 1.03 } : {}}
                        className={`flex items-center gap-3 px-10 py-5 rounded-full font-bold text-lg transition-all duration-300 ${selectedType ? "bg-[#C4724F] text-white shadow-[0_0_40px_rgba(196,114,79,0.3)] hover:bg-[#d4845f]" : "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed"}`}
                    >
                        Shop with this skin tone
                        {selectedType && <ArrowRight className="w-5 h-5" />}
                    </motion.button>
                </div>
            </div>
        </main>
    );
}
