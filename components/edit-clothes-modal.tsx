"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save } from "lucide-react";
import Image from "next/image";
import { useWardrobe, WardrobeItem } from "@/context/wardrobe-context";

// ─── Type/Style data (mirrored from upload modal) ────────────────────────────

const TYPE_OPTIONS = [
    { label: "Topwear", value: "topwear", emoji: "👕" },
    { label: "Bottomwear", value: "bottomwear", emoji: "👖" },
    { label: "Footwear", value: "footwear", emoji: "👟" },
];

const STYLE_OPTIONS: Record<string, { label: string; value: string }[]> = {
    topwear: [
        { label: "T-Shirt", value: "t-shirt" },
        { label: "Casual Shirt", value: "casual-shirt" },
        { label: "Formal Shirt", value: "formal-shirt" },
        { label: "Sweatshirt", value: "sweatshirt" },
        { label: "Jacket", value: "jacket" },
        { label: "Active T-Shirt", value: "active-t-shirt" },
    ],
    bottomwear: [
        { label: "Jeans", value: "jeans" },
        { label: "Trouser", value: "trouser" },
        { label: "Cotton Pant", value: "cotton-pant" },
        { label: "Joggers", value: "joggers" },
        { label: "Shorts", value: "shorts" },
        { label: "Track Pant", value: "track-pant" },
    ],
    footwear: [
        { label: "Sneakers", value: "sneakers" },
        { label: "Casual Shoe", value: "casual-shoe" },
        { label: "Formal Shoe", value: "formal-shoe" },
        { label: "Loafer", value: "loafer" },
        { label: "Sports Shoe", value: "sports-shoe" },
    ],
};

const ACTIVITY_OPTIONS = [
    { label: "Casual", value: "casual", emoji: "😊" },
    { label: "Formal", value: "formal", emoji: "👔" },
    { label: "Sports", value: "sports", emoji: "🏃" },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
    item: WardrobeItem | null;
    onClose: () => void;
}

export default function EditClothesModal({ item, onClose }: Props) {
    const { updateWardrobeItem } = useWardrobe();

    const [name, setName] = useState("");
    const [productType, setProductType] = useState("");
    const [productStyle, setProductStyle] = useState("");
    const [activityType, setActivityType] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Pre-fill when item changes
    useEffect(() => {
        if (item) {
            setName(item.name || "");
            setProductType(item.productType || "");
            setProductStyle(item.productStyle || "");
            setActivityType(item.activityType || "");
            setError("");
        }
    }, [item]);

    const handleTypeSelect = (type: string) => {
        setProductType(type);
        setProductStyle(""); // reset style when type changes
    };

    const handleSave = async () => {
        if (!item) return;
        if (!productType || !productStyle) {
            setError("Please select a type and style.");
            return;
        }
        setSaving(true);
        try {
            await updateWardrobeItem(item.id, {
                name,
                productType,
                productStyle,
                activityType,
            });
            onClose();
        } catch {
            setError("Failed to save. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const open = !!item;

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 28, stiffness: 300 }}
                        className="fixed inset-0 z-[90] flex items-center justify-center p-4"
                    >
                        <div className="relative w-full max-w-md bg-[#111] border border-white/8 rounded-3xl overflow-hidden shadow-2xl">

                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                                <div>
                                    <h2 className="text-white font-bold text-lg">Edit Item</h2>
                                    <p className="text-white/30 text-xs mt-0.5">Update the details for this item</p>
                                </div>
                                <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">

                                {/* Image preview + name */}
                                <div className="flex gap-4 items-start">
                                    {item?.images?.[0] && (
                                        <div className="relative w-24 h-32 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 bg-[#1a1a1a]">
                                            <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                                        </div>
                                    )}
                                    <div className="flex-1 pt-1">
                                        <label className="text-white/40 text-xs uppercase tracking-widest font-medium block mb-1.5">Item Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:border-[#C4724F]/50 outline-none transition-colors"
                                        />
                                        {/* Current color badge (read-only) */}
                                        <div className="mt-2 flex items-center gap-1.5 text-white/25 text-[11px]">
                                            <span className="capitalize">{item?.baseColor}</span>
                                            <span>·</span>
                                            <span className="capitalize">{item?.colorFamily?.replace("-", " ")}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Type picker */}
                                <div>
                                    <p className="text-white/40 text-xs uppercase tracking-widest font-medium mb-2">Type</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {TYPE_OPTIONS.map((t) => (
                                            <button
                                                key={t.value}
                                                onClick={() => handleTypeSelect(t.value)}
                                                className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-medium transition-all ${productType === t.value
                                                        ? "bg-[#C4724F]/15 border-[#C4724F]/50 text-white"
                                                        : "border-white/8 text-white/40 hover:border-white/20 hover:text-white"
                                                    }`}
                                            >
                                                <span className="text-xl">{t.emoji}</span>
                                                <span className="text-xs">{t.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Style picker */}
                                {productType && (
                                    <div>
                                        <p className="text-white/40 text-xs uppercase tracking-widest font-medium mb-2">Style</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {STYLE_OPTIONS[productType].map((s) => (
                                                <button
                                                    key={s.value}
                                                    onClick={() => setProductStyle(s.value)}
                                                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all text-left ${productStyle === s.value
                                                            ? "bg-[#C4724F]/15 border-[#C4724F]/50 text-white"
                                                            : "border-white/8 text-white/40 hover:border-white/20 hover:text-white"
                                                        }`}
                                                >
                                                    {s.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Occasion picker */}
                                {productStyle && (
                                    <div>
                                        <p className="text-white/40 text-xs uppercase tracking-widest font-medium mb-2">Occasion</p>
                                        <div className="grid grid-cols-3 gap-2">
                                            {ACTIVITY_OPTIONS.map((a) => (
                                                <button
                                                    key={a.value}
                                                    onClick={() => setActivityType(a.value)}
                                                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-medium transition-all ${activityType === a.value
                                                            ? "bg-[#C4724F]/15 border-[#C4724F]/50 text-white"
                                                            : "border-white/8 text-white/40 hover:border-white/20 hover:text-white"
                                                        }`}
                                                >
                                                    <span className="text-lg">{a.emoji}</span>
                                                    {a.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {error && <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 px-3 py-2 rounded-lg">{error}</p>}

                                {/* Actions */}
                                <div className="flex gap-3 pt-1">
                                    <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 text-white/50 hover:text-white text-sm font-medium transition-colors">
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving || !productType || !productStyle}
                                        className="flex-1 py-3 rounded-xl bg-[#C4724F] hover:bg-[#d4845f] disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        {saving ? "Saving…" : "Save Changes"}
                                    </button>
                                </div>

                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
