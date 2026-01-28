"use client";

import Navbar from "@/components/navbar";
import { motion } from "framer-motion";
import { useSkinTone } from "@/context/skin-tone-context";
import { useRouter } from "next/navigation";
import { ArrowRight, Info } from "lucide-react";

export default function ShopBySkinTonePage() {
    const { selectSkinTone, selectedType, saveSkinToneToFirestore } = useSkinTone();
    const router = useRouter();

    const handleShopClick = async () => {
        if (!selectedType) return;
        await saveSkinToneToFirestore();
        router.push("/recommendations");
    };

    const skinTones = [
        { name: "Type I", color: "#FFDFC4", edge: "#F3C4B1", sub: "Light, Pale White", undertone: "Cool", undertoneColor: "bg-blue-100 text-blue-800" },
        { name: "Type II", color: "#E6B998", edge: "#D7A07B", sub: "White, Fair", undertone: "Cool", undertoneColor: "bg-blue-100 text-blue-800" },
        { name: "Type III", color: "#CF9E76", edge: "#B9885C", sub: "Medium, White to Olive", undertone: "Warm", undertoneColor: "bg-amber-100 text-amber-800" },
        { name: "Type IV", color: "#A87652", edge: "#8E5C3E", sub: "Olive, Moderate Brown", undertone: "Neutral", undertoneColor: "bg-gray-100 text-gray-800" },
        { name: "Type V", color: "#75482F", edge: "#5C3521", sub: "Brown, Dark Brown", undertone: "Warm", undertoneColor: "bg-amber-100 text-amber-800" },
        { name: "Type VI", color: "#4B2C20", edge: "#361E14", sub: "Black, Very Dark Brown", undertone: "Neutral", undertoneColor: "bg-gray-100 text-gray-800" }
    ];

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <div className="pt-32 pb-16 px-4 md:px-8 max-w-7xl mx-auto flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-black text-[#111] uppercase tracking-tighter mb-6">
                        Select Your Skin Tone
                    </h1>
                    <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto flex items-center justify-center gap-2">
                        <Info className="w-5 h-5 text-gray-400" />
                        Choose the tone that best matches your complexion.
                    </p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {skinTones.map((tone, index) => {
                        const typeId = (index + 1) as 1 | 2 | 3 | 4 | 5 | 6;
                        const isSelected = selectedType === typeId;

                        return (
                            <motion.div
                                key={tone.name}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => selectSkinTone(typeId)}
                                className={`
                                    relative p-6 rounded-3xl cursor-pointer transition-all duration-300 border-2 flex items-center gap-6
                                    ${isSelected
                                        ? 'border-[#111] bg-gray-50 shadow-xl'
                                        : 'border-transparent bg-white hover:bg-gray-50 hover:shadow-lg hover:border-gray-100'
                                    }
                                `}
                            >
                                {/* Circle Preview */}
                                <div
                                    className={`w-20 h-20 rounded-full flex-shrink-0 shadow-inner border-2 border-white/50 ${isSelected ? 'ring-2 ring-[#111] ring-offset-2' : ''}`}
                                    style={{ background: `radial-gradient(circle at 35% 35%, ${tone.color}, ${tone.edge})` }}
                                />

                                {/* Info */}
                                <div className="flex flex-col items-start gap-1">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-xl font-bold uppercase tracking-tight text-[#111]">{tone.name}</h2>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${tone.undertoneColor}`}>
                                            {tone.undertone}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 font-medium">{tone.sub}</p>
                                </div>

                                {/* Checkmark for selected state */}
                                {isSelected && (
                                    <div className="absolute top-6 right-6 text-[#111]">
                                        <div className="w-6 h-6 bg-[#111] rounded-full flex items-center justify-center text-white">
                                            <ArrowRight className="w-3 h-3" />
                                        </div>
                                    </div>
                                )}
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
    );
}
