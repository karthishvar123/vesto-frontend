"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Shirt, ArrowRight } from "lucide-react";
import { WardrobeItem } from "@/context/wardrobe-context";
import { getDailyOutfits, DailyOutfit, StyleCategory } from "@/lib/daily-outfit";

interface Props {
    items: WardrobeItem[];
    loading: boolean;
}

// ── Style badge colours ───────────────────────────────────────
const STYLE_META: Record<
    StyleCategory,
    { emoji: string; bg: string; text: string; border: string }
> = {
    Casual: {
        emoji: "👕",
        bg: "bg-blue-500/10",
        text: "text-blue-300",
        border: "border-blue-500/20",
    },
    Formal: {
        emoji: "👔",
        bg: "bg-amber-500/10",
        text: "text-amber-300",
        border: "border-amber-500/20",
    },
    Sports: {
        emoji: "🏃",
        bg: "bg-green-500/10",
        text: "text-green-300",
        border: "border-green-500/20",
    },
};

// ── Tiny item thumbnail ───────────────────────────────────────
function ItemThumb({ item, label }: { item: WardrobeItem; label: string }) {
    return (
        <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
            <div className="w-full aspect-[3/4] relative bg-[#1a1a1a] rounded-xl overflow-hidden border border-white/5">
                {item.images?.[0] ? (
                    <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Shirt className="w-6 h-6 text-white/10" />
                    </div>
                )}
            </div>
            <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">{label}</p>
            <p className="text-xs text-white/60 font-semibold truncate w-full text-center px-1">
                {item.name}
            </p>
        </div>
    );
}

// ── Single outfit card ────────────────────────────────────────
function OutfitCard({ outfit }: { outfit: DailyOutfit }) {
    const meta = STYLE_META[outfit.style];

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full bg-[#111] rounded-2xl border border-white/5 p-4 flex flex-col gap-4 hover:border-[#C4724F]/30 transition-colors"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${meta.bg} ${meta.text} ${meta.border}`}
                >
                    {meta.emoji} {outfit.style}
                </span>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 items-start">
                <ItemThumb item={outfit.top} label="Top" />
                {/* Plus divider */}
                <div className="flex flex-col items-center justify-center pt-8 shrink-0">
                    <div className="w-6 h-6 rounded-full bg-[#C4724F]/10 border border-[#C4724F]/20 flex items-center justify-center">
                        <span className="text-[#C4724F] text-xs font-bold">+</span>
                    </div>
                </div>
                <ItemThumb item={outfit.bottom} label="Bottom" />
            </div>

            {/* CTA */}
            <Link
                href={`/virtual-wardrobe/complete-look/${encodeURIComponent(outfit.top.id)}`}
                className="mt-auto w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#C4724F]/10 hover:bg-[#C4724F]/20 border border-[#C4724F]/20 hover:border-[#C4724F]/50 text-[#E8A87C] text-xs font-bold rounded-full transition-all group"
            >
                <Sparkles className="w-3 h-3" />
                Style It
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
        </motion.div>
    );
}

// ── Main export ───────────────────────────────────────────────
export default function DailyOutfitCard({ items, loading }: Props) {
    const suggestions = useMemo(() => getDailyOutfits(items), [items]);

    // Don't render section if loading or no suggestions
    if (loading || suggestions.length === 0) return null;

    // Format today's date label
    const dateLabel = new Date().toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
    });

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
        >
            {/* Section header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <span className="text-[#C4724F] text-xs font-black uppercase tracking-widest block mb-1">
                        ✨ Today&apos;s Look
                    </span>
                    <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                        Daily Picks · {dateLabel}
                    </h2>
                </div>
                <span className="text-white/20 text-xs">Refreshes tomorrow</span>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-[#C4724F]/20 to-transparent mb-6" />

            {/* Cards row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {suggestions.map((outfit, i) => (
                    <OutfitCard key={`${outfit.style}-${i}`} outfit={outfit} />
                ))}
            </div>
        </motion.section>
    );
}
