"use client";

import React, { useState } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { cn } from "@/lib/utils";

export interface FluidCardItem {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    image?: string;
    gradient: string;
}

interface FluidCardStackProps {
    items: FluidCardItem[];
    className?: string;
}

export default function FluidCardStack({ items, className }: FluidCardStackProps) {
    const [activeId, setActiveId] = useState<string | null>(items[0]?.id || null);

    return (
        <LayoutGroup>
            <div className={cn("w-full flex flex-col md:flex-row gap-3 h-[420px] sm:h-[500px] md:h-[450px]", className)}>
                {items.map((item) => (
                    <Card
                        key={item.id}
                        item={item}
                        isActive={activeId === item.id}
                        onHover={() => setActiveId(item.id)}
                    />
                ))}
            </div>
        </LayoutGroup>
    );
}

function Card({
    item,
    isActive,
    onHover
}: {
    item: FluidCardItem,
    isActive: boolean,
    onHover: () => void
}) {
    return (
        <motion.div
            layout
            onMouseEnter={onHover}
            onClick={onHover}
            className={cn(
                "relative h-full rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-out",
                isActive ? "flex-[3]" : "flex-[1]"
            )}
            initial={false}
        >
            {/* Background Image */}
            {item.image && (
                <div className="absolute inset-0">
                    <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                    {/* Dark Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-black/60" />
                </div>
            )}

            {/* Background with Gradient (Fallback or Overlay) */}
            <div
                className={cn(
                    "absolute inset-0 transition-opacity duration-500",
                    item.image ? "opacity-30 mix-blend-overlay" : "opacity-20"
                )}
                style={{ background: item.gradient }}
            />

            {/* Glassmorphism Overlay */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm border border-white/10 transition-colors duration-300 hover:bg-white/10" />

            {/* Content Container */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <motion.div layout="position" className="relative z-10 space-y-4">
                    {/* Title */}
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-white text-black"
                        )}>
                            {item.id}
                        </div>
                        <h3
                            className={cn(
                                "text-xl font-bold text-white uppercase tracking-wider transition-colors duration-300",
                                // Removed text-white class to rely on inline style
                            )}
                        >
                            {item.title}
                        </h3>
                    </div>

                    {/* Subtitle (Always Visible but styled differently when active) */}
                    <motion.p
                        layout="position"
                        className={cn(
                            "text-lg font-serif italic text-white transition-opacity duration-300",
                            isActive ? "opacity-100" : "opacity-70 line-clamp-2"
                        )}
                    >
                        {item.subtitle}
                    </motion.p>

                    {/* Description (Only visible when active) */}
                    <motion.div
                        className="overflow-hidden"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                            opacity: isActive ? 1 : 0,
                            height: isActive ? "auto" : 0
                        }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                        <p
                            className="text-base leading-relaxed text-white max-w-lg"
                        >
                            {item.description}
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
}
