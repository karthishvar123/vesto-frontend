"use client";

import { useState } from "react";
import { useWardrobe, WardrobeItem } from "@/context/wardrobe-context";
import Navbar from "@/components/navbar";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Shirt, HeartOff, Sparkles, ArrowRight, Upload, Pencil, ScanFace, Plus } from "lucide-react";
import ProtectedRoute from "@/components/protected-route";
import UploadClothesModal from "@/components/upload-clothes-modal";
import EditClothesModal from "@/components/edit-clothes-modal";
import DailyOutfitCard from "@/components/daily-outfit-card";

const TABS = ["All", "Topwear", "Bottomwear", "Footwear"];

export default function VirtualWardrobePage() {
    const { items, removeFromWardrobe, loading } = useWardrobe();
    const [activeTab, setActiveTab] = useState("All");
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [uploadOpen, setUploadOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<WardrobeItem | null>(null);

    const filtered = activeTab === "All" ? items : items.filter(i => i.productType?.toLowerCase() === activeTab.toLowerCase());

    const handleRemove = async (id: string) => {
        setRemovingId(id);
        await removeFromWardrobe(id);
        setRemovingId(null);
    };

    const tabCounts: Record<string, number> = {
        All: items.length,
        Topwear: items.filter(i => i.productType?.toLowerCase() === "topwear").length,
        Bottomwear: items.filter(i => i.productType?.toLowerCase() === "bottomwear").length,
        Footwear: items.filter(i => i.productType?.toLowerCase() === "footwear").length,
    };

    return (
        <ProtectedRoute>
            <main className="min-h-screen bg-[#0A0A0A]">
                <Navbar />

                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-[#C4724F]/4 blur-[120px]" />
                </div>

                <div className="relative z-10 pt-20 sm:pt-32 pb-24 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">

                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
                        <span className="text-[#C4724F] text-xs font-bold uppercase tracking-widest mb-4 block">Personal Collection</span>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                                    My Wardrobe
                                </h1>
                                <p className="text-white/30 mt-3">{items.length} item{items.length !== 1 ? "s" : ""} saved</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setUploadOpen(true)}
                                    className="inline-flex items-center gap-2 px-5 py-3 bg-[#C4724F]/10 border border-[#C4724F]/30 hover:bg-[#C4724F]/20 hover:border-[#C4724F]/60 text-[#C4724F] text-sm font-bold rounded-full transition-all"
                                >
                                    <Upload className="w-4 h-4" /> Upload My Clothes
                                </button>
                                <Link href="/men" className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:border-[#C4724F]/40 text-white text-sm font-bold rounded-full transition-all group">
                                    Browse Shop
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                    {/* Daily Outfit Suggestions */}
                    <DailyOutfitCard items={items} loading={loading} />

                    {/* Tabs */}
                    <div className="flex gap-2 mb-10 flex-wrap">
                        {TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === tab ? "bg-[#C4724F] text-white shadow-[0_0_20px_rgba(196,114,79,0.3)]" : "bg-white/5 border border-white/8 text-white/40 hover:text-white hover:border-white/20"}`}
                            >
                                {tab}
                                {tabCounts[tab] > 0 && (
                                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-black ${activeTab === tab ? "bg-white/20 text-white" : "bg-white/10 text-white/40"}`}>
                                        {tabCounts[tab]}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Grid */}
                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="space-y-3 animate-pulse">
                                    <div className="aspect-[3/4] skeleton rounded-xl" />
                                    <div className="h-4 skeleton rounded w-3/4" />
                                </div>
                            ))}
                        </div>
                    ) : items.length === 0 && activeTab === "All" ? (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-16 px-4 text-center">
                            {/* Animated icon */}
                            <div className="relative w-32 h-32 mb-6">
                                <div className="absolute inset-0 rounded-3xl bg-[#C4724F]/10 border border-[#C4724F]/20 flex items-center justify-center">
                                    <Shirt className="w-12 h-12 text-[#C4724F]/40" />
                                </div>
                                <motion.div
                                    className="absolute -top-2 -right-2 w-8 h-8 bg-[#C4724F] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(196,114,79,0.5)]"
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                >
                                    <Plus className="w-4 h-4 text-white" />
                                </motion.div>
                            </div>

                            <h2 className="text-white font-black text-2xl mb-2 uppercase tracking-tight">
                                Your closet is empty
                            </h2>
                            <p className="text-white/40 text-sm mb-8 max-w-xs leading-relaxed">
                                Start by finding clothes that match your skin tone, then add them here to build your wardrobe.
                            </p>

                            {/* Step guide */}
                            <div className="w-full max-w-xs space-y-3 mb-8">
                                {[
                                    { step: "1", text: "Select your skin tone", href: "/shop-by-skin-tone" },
                                    { step: "2", text: "Browse matched clothes", href: "/men" },
                                    { step: "3", text: "Add items to wardrobe", href: null },
                                ].map((item) => (
                                    <div key={item.step} className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/5">
                                        <span className="w-7 h-7 rounded-full bg-[#C4724F]/20 border border-[#C4724F]/30 flex items-center justify-center text-[#C4724F] text-xs font-black shrink-0">
                                            {item.step}
                                        </span>
                                        <p className="text-white/60 text-sm flex-1 text-left">{item.text}</p>
                                        {item.href && (
                                            <Link href={item.href} className="text-[#C4724F] shrink-0">
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <Link
                                href="/shop-by-skin-tone"
                                className="flex items-center gap-2 px-8 py-4 bg-[#C4724F] text-white font-bold rounded-full hover:bg-[#d4845f] transition-all hover:scale-105"
                            >
                                <ScanFace className="w-4 h-4" />
                                Get Started
                            </Link>
                        </motion.div>
                    ) : filtered.length === 0 ? (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-32 px-4 text-center rounded-3xl border-2 border-dashed border-white/5">
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                <Shirt className="w-8 h-8 text-white/20" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2">
                                No {activeTab} yet
                            </h3>
                            <p className="text-white/30 max-w-xs mb-8">
                                Browse the shop and save some {activeTab.toLowerCase()} to get started.
                            </p>
                            <Link href="/men" className="vesto-btn-primary">
                                Browse Shop <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    ) : (
                        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                            <AnimatePresence>
                                {filtered.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.25 }}
                                        className="group relative"
                                    >
                                        <div className="product-card overflow-hidden">
                                            <div className="aspect-[3/4] relative bg-[#111] overflow-hidden rounded-xl">
                                                {item.images?.[0] ? (
                                                    <Image src={item.images[0]} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Shirt className="w-10 h-10 text-white/10" />
                                                    </div>
                                                )}

                                                {/* Hover overlay */}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                                                    <Link href={`/virtual-wardrobe/complete-look/${encodeURIComponent(item.id)}`} className="flex items-center gap-2 px-4 py-2 bg-[#C4724F] text-white text-xs font-bold rounded-full hover:bg-[#d4845f] transition-colors">
                                                        <Sparkles className="w-3 h-3" /> Style It
                                                    </Link>
                                                </div>

                                                {/* Edit button — only for user-uploaded items */}
                                                {item.id.startsWith("upload_") && (
                                                    <button
                                                        onClick={() => setEditingItem(item)}
                                                        className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-[#C4724F]/80 hover:border-[#C4724F]"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5 text-white" />
                                                    </button>
                                                )}

                                                {/* Remove button */}
                                                <button
                                                    onClick={() => handleRemove(item.id)}
                                                    disabled={removingId === item.id}
                                                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/80 hover:border-red-400"
                                                >
                                                    <HeartOff className="w-3.5 h-3.5 text-white" />
                                                </button>
                                            </div>
                                            <div className="p-3">
                                                <h3 className="font-bold text-white text-sm truncate">{item.name}</h3>
                                                <p className="text-white/30 text-xs mt-0.5 capitalize">{item.productStyle?.replace("-", " ")}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </main>
            <UploadClothesModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
            <EditClothesModal item={editingItem} onClose={() => setEditingItem(null)} />
        </ProtectedRoute>
    );
}
