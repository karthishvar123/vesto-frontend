"use client";

import Navbar from "@/components/navbar";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useSkinTone } from "@/context/skin-tone-context";
import { useRouter } from "next/navigation";
import { ArrowRight, Info, Camera, Sparkles } from "lucide-react";
import { useState } from "react";
import dynamic from "next/dynamic";
import ProtectedRoute from "@/components/protected-route";

// Dynamically import AICamera to avoid loading heavy ML models initially
const AICamera = dynamic(() => import("@/components/skin-tone-finder/ai-camera"), {
    loading: () => <div className="fixed inset-0 bg-black/50 z-[100]" />,
    ssr: false
});

export default function ShopBySkinTonePage() {
    const { selectSkinTone, selectedType, saveSkinToneToFirestore } = useSkinTone();
    const router = useRouter();
    const [showCamera, setShowCamera] = useState(false);

    const handleShopClick = async () => {
        if (!selectedType) return;
        await saveSkinToneToFirestore();
        router.push("/recommendations");
    };

    const handleMatchFound = (type: 1 | 2 | 3 | 4 | 5 | 6) => {
        selectSkinTone(type);
        // Optional: show a toast or feedback
    };

    const skinTones = [
        { name: "Type I", color: "#FFDFC4", edge: "#F3C4B1", sub: "Light, Pale White", undertone: "Cool", undertoneColor: "bg-blue-100 text-blue-800" },
        { name: "Type II", color: "#E6B998", edge: "#D7A07B", sub: "White, Fair", undertone: "Cool", undertoneColor: "bg-blue-100 text-blue-800" },
        { name: "Type III", color: "#CF9E76", edge: "#B9885C", sub: "Medium, White to Olive", undertone: "Warm", undertoneColor: "bg-amber-100 text-amber-800" },
        { name: "Type IV", color: "#A87652", edge: "#8E5C3E", sub: "Olive, Moderate Brown", undertone: "Neutral", undertoneColor: "bg-gray-100 text-gray-800" },
        { name: "Type V", color: "#75482F", edge: "#5C3521", sub: "Brown, Dark Brown", undertone: "Warm", undertoneColor: "bg-amber-100 text-amber-800" },
        { name: "Type VI", color: "#4B2C20", edge: "#361E14", sub: "Black, Very Dark Brown", undertone: "Neutral", undertoneColor: "bg-gray-100 text-gray-800" }
    ];

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
    };

    return (
        <ProtectedRoute>
            <main className="min-h-screen bg-white">
                <Navbar />

                {/* AI Camera Modal */}
                <AnimatePresence>
                    {showCamera && (
                        <AICamera
                            onClose={() => setShowCamera(false)}
                            onMatchFound={handleMatchFound}
                        />
                    )}
                </AnimatePresence>

                <div className="pt-32 pb-16 px-4 md:px-8 max-w-7xl mx-auto flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-center mb-16 max-w-3xl"
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-widest mb-6">
                            Personalized Styling
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black text-[#111] uppercase tracking-tighter mb-6 leading-[0.9]">
                            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Perfect Match.</span>
                        </h1>
                        <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
                            Unlock personalized color recommendations tailored to your unique complexion. Stop guessing, start glowing.
                        </p>

                        {/* AI Finder Button */}
                        <div className="flex justify-center">
                            <button
                                onClick={() => setShowCamera(true)}
                                className="group relative inline-flex items-center gap-4 px-10 py-5 bg-[#111] text-white rounded-full font-bold text-lg shadow-2xl hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] hover:scale-105 transition-all duration-300 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <Camera className="w-6 h-6 relative z-10" />
                                <span className="relative z-10">Analyze with AI Camera</span>
                                <div className="relative z-10 bg-white/20 p-1 rounded-full">
                                    <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                                </div>
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl"
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                    >
                        {skinTones.map((tone, index) => {
                            const typeId = (index + 1) as 1 | 2 | 3 | 4 | 5 | 6;
                            const isSelected = selectedType === typeId;

                            return (
                                <motion.div
                                    key={tone.name}
                                    variants={itemVariants}
                                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => selectSkinTone(typeId)}
                                    className={`
                                    relative overflow-hidden cursor-pointer transition-all duration-300 rounded-2xl border-2
                                    ${isSelected
                                            ? 'border-[#111] shadow-2xl ring-1 ring-[#111] ring-offset-2'
                                            : 'border-transparent shadow-lg hover:shadow-xl'
                                        }
                                `}
                                >
                                    {/* Palette Color Block */}
                                    <div
                                        className="h-32 w-full relative group"
                                        style={{ backgroundColor: tone.color }}
                                    >
                                        {/* Gradient overlay to show undertone depth */}
                                        <div className="w-full h-full absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-white mix-blend-overlay" />
                                        <div className="w-full h-full" style={{ background: `linear-gradient(to bottom right, ${tone.color}, ${tone.edge})` }} />
                                    </div>

                                    <div className="p-6 bg-white">
                                        <div className="flex items-center justify-between mb-2">
                                            <h2 className="text-2xl font-black uppercase tracking-tighter text-[#111]">{tone.name}</h2>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${tone.undertoneColor}`}>
                                                {tone.undertone}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 font-medium">{tone.sub}</p>
                                    </div>

                                    {/* Checkmark for selected state */}
                                    <AnimatePresence>
                                        {isSelected && (
                                            <motion.div
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                className="absolute top-4 right-4 bg-white/30 backdrop-blur-md p-2 rounded-full text-white shadow-sm"
                                            >
                                                <ArrowRight className="w-5 h-5" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    <motion.div
                        className="mt-16 sticky bottom-8 z-50"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <button
                            onClick={handleShopClick}
                            disabled={!selectedType}
                            className={`relative px-8 md:px-12 py-4 md:py-5 rounded-full shadow-2xl
                            flex items-center gap-3 transition-all duration-300 ease-out backdrop-blur-md
                            ${selectedType
                                    ? 'bg-[#111] text-white hover:scale-105 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.4)]'
                                    : 'bg-white/80 text-gray-300 border border-gray-100 cursor-not-allowed'
                                }
                        `}
                        >
                            <span className="text-lg md:text-xl font-medium tracking-wide whitespace-nowrap">
                                Shop with this skin tone
                            </span>
                            {selectedType && (
                                <ArrowRight className="w-5 h-5 opacity-90" />
                            )}
                        </button>
                    </motion.div>
                </div>
            </main>
        </ProtectedRoute>
    );
}
