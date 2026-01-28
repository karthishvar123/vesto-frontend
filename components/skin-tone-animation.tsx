"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const skinTones = [
    { id: 1, color: "#FFDFC4", name: "Type 1" }, // Pale White (Natural)
    { id: 2, color: "#E6B998", name: "Type 2" }, // Fair (Natural)
    { id: 3, color: "#CF9E76", name: "Type 3" }, // Medium (Natural)
    { id: 4, color: "#A87652", name: "Type 4" }, // Olive (Natural)
    { id: 5, color: "#75482F", name: "Type 5" }, // Brown (Natural)
    { id: 6, color: "#4B2C20", name: "Type 6" }, // Dark Brown (Natural)
];

export default function SkinToneAnimation() {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % skinTones.length);
        }, 800); // Change every 800ms
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-2 sm:p-4">
            <div className="flex gap-2 sm:gap-4 relative flex-nowrap justify-center">
                {skinTones.map((tone, index) => {
                    const isActive = index === activeIndex;

                    return (
                        <motion.div
                            key={tone.id}
                            className="relative flex items-center justify-center"
                            animate={{
                                scale: isActive ? 1.2 : 1,
                                y: isActive ? -5 : 0,
                                zIndex: isActive ? 10 : 1
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20
                            }}
                        >
                            {/* The Circle */}
                            <div
                                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full shadow-lg border-2 sm:border-4 border-white flex items-center justify-center relative overflow-hidden"
                                style={{ backgroundColor: tone.color }}
                            >
                                {/* Static Text Inside */}
                                <span className="text-white/90 text-xs sm:text-sm font-medium font-serif drop-shadow-md">
                                    {tone.name}
                                </span>
                            </div>

                            {/* Optional: Glow/Ring effect when active */}
                            {isActive && (
                                <motion.div
                                    layoutId="active-glow"
                                    className="absolute inset-0 rounded-full ring-2 sm:ring-4 ring-offset-2 sm:ring-offset-4 ring-indigo-500/30"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                />
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
