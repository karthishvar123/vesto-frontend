"use client";

import Navbar from "@/components/navbar";
import { useWardrobe, WardrobeItem } from "@/context/wardrobe-context";
import { motion } from "framer-motion";
import { Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ProtectedRoute from "@/components/protected-route";

export default function VirtualWardrobePage() {
    const { items, loading, removeFromWardrobe } = useWardrobe();

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    // Categorize Items
    const topwear = items.filter(i => i.productType?.toLowerCase() === 'topwear');
    const bottomwear = items.filter(i => i.productType?.toLowerCase() === 'bottomwear');
    const footwear = items.filter(i => i.productType?.toLowerCase() === 'footwear');

    const hasItems = items.length > 0;

    return (
        <ProtectedRoute>
            <main className="min-h-screen bg-white pb-20">
                <Navbar />

                <div className="pt-32 px-4 md:px-8 max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-16 text-center"
                    >
                        <h1 className="text-4xl md:text-6xl font-black text-[#111] uppercase tracking-tighter mb-4">
                            Your Wardrobe
                        </h1>
                        <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">
                            A collection of your favorite pieces, organized for effortless styling.
                        </p>
                    </motion.div>

                    {!hasItems ? (
                        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
                            <h2 className="text-2xl font-bold text-[#111] mb-4">Your wardrobe is empty</h2>
                            <p className="text-gray-500 mb-8">Start adding items from the shop to build your collection.</p>
                            <Link href="/recommendations" className="inline-block bg-[#111] text-white px-8 py-4 rounded-full font-medium hover:bg-black/90 transition-colors">
                                Browse Recommendations
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-24">
                            {topwear.length > 0 && <WardrobeSection title="Topwear" items={topwear} onRemove={removeFromWardrobe} />}
                            {bottomwear.length > 0 && <WardrobeSection title="Bottomwear" items={bottomwear} onRemove={removeFromWardrobe} />}
                            {footwear.length > 0 && <WardrobeSection title="Footwear" items={footwear} onRemove={removeFromWardrobe} />}
                        </div>
                    )}
                </div>
            </main>
        </ProtectedRoute>
    );
}

function WardrobeSection({ title, items, onRemove }: { title: string, items: WardrobeItem[], onRemove: (id: string) => void }) {
    const isTopwear = title.toLowerCase() === 'topwear';

    return (
        <section>
            <div className="flex items-end justify-between border-b border-gray-100 pb-4 mb-8">
                <h2 className="text-3xl font-light tracking-tight text-[#111]">{title}</h2>
                <span className="text-sm text-gray-400 font-medium">{items.length} Items</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                {items.map((item) => (
                    <div key={item.id} className="group relative block">
                        {/* 
                            Rule 2: Bottomwear and Footwear should not be selectable (only images present).
                            Rule 1: "Style this" Only beneath Topwear.
                        */}
                        <div className={`block ${!isTopwear ? 'pointer-events-none' : ''}`}>
                            <div className="aspect-[3/4] relative bg-gray-50 rounded-2xl overflow-hidden mb-4">
                                {item.images?.[0] ? (
                                    <Image
                                        src={item.images[0]}
                                        alt={item.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                                )}
                            </div>
                            <h3 className="text-lg font-bold text-[#111] leading-tight mb-1">
                                {item.name}
                            </h3>
                            <p className="font-medium text-gray-500">₹{item.price}</p>
                        </div>

                        {/* Topwear: "Style This" Button */}
                        {isTopwear && (
                            <Link href={`/virtual-wardrobe/complete-look/${item.id}`} className="mt-4 block w-full">
                                <button className="w-full bg-[#111] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-black/90 transition-colors">
                                    Style This
                                </button>
                            </Link>
                        )}

                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onRemove(item.id);
                            }}
                            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500 z-10 pointer-events-auto"
                            title="Remove from Wardrobe"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}
