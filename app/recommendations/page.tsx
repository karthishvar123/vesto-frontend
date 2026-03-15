"use client";

import { useEffect, useState } from "react";
import { useSkinTone } from "@/context/skin-tone-context";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Navbar from "@/components/navbar";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

interface Product {
    id: string;
    name: string;
    price: number;
    images: string[];
    productType: string;
    baseColor: string;
}

const PRIORITY_MAP: Record<number, string[]> = {
    1: ["cool", "neutral"],
    2: ["cool", "neutral"],
    3: ["neutral", "earthy"],
    4: ["earthy", "warm"],
    5: ["warm", "earthy"],
    6: ["warm", "neutral"],
};

function SkeletonCard() {
    return (
        <div className="space-y-3">
            <div className="aspect-[3/4] skeleton rounded-xl" />
            <div className="h-4 skeleton rounded w-3/4" />
            <div className="h-3 skeleton rounded w-1/3" />
        </div>
    );
}

export default function RecommendationsPage() {
    const { selectedType } = useSkinTone();
    const [loading, setLoading] = useState(true);
    const [topwear, setTopwear] = useState<Product[]>([]);

    useEffect(() => {
        const fetchAndSortProducts = async () => {
            if (!selectedType) { setLoading(false); return; }
            try {
                const productsRef = collection(db, "products");
                const q = query(productsRef, where("active", "==", true));
                const snapshot = await getDocs(q);
                const allProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
                const priorities = PRIORITY_MAP[selectedType] || [];
                const tops = allProducts
                    .filter(p => p.productType === "topwear" && priorities.includes(p.baseColor))
                    .sort((a, b) => priorities.indexOf(a.baseColor) - priorities.indexOf(b.baseColor));
                setTopwear(tops);
            } catch (error) {
                console.error("Error fetching recommendations:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAndSortProducts();
    }, [selectedType]);

    if (!selectedType && !loading) {
        return (
            <div className="min-h-screen bg-[#0A0A0A]">
                <Navbar />
                <div className="pt-40 px-4 text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">No Skin Tone Selected</h1>
                    <Link href="/shop-by-skin-tone" className="text-[#C4724F] underline">Select your skin tone first</Link>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#0A0A0A] pb-20">
            <Navbar />

            <div className="pt-32 px-4 md:px-8 max-w-7xl mx-auto">
                <Link href="/shop-by-skin-tone" className="inline-flex items-center text-sm text-white/40 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Change Skin Tone
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">
                        Curated for <span className="vesto-accent-text">Your Tone</span>
                    </h1>
                    <p className="text-white/40 max-w-xl mx-auto">
                        Choose a top, then use <span className="text-white font-bold">Complete Your Look</span> to build the full outfit.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                    {loading
                        ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                        : topwear.length === 0
                            ? <p className="text-white/30 col-span-full text-center py-20">No curated topwear found for your profile.</p>
                            : topwear.map((product) => (
                                <Link key={product.id} href={`/product/${product.id}?source=recommendations`} className="group block product-card">
                                    <div className="aspect-[3/4] relative overflow-hidden rounded-xl bg-[#111]">
                                        {product.images?.[0] ? (
                                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">No Image</div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-sm font-bold text-white mb-1 truncate group-hover:text-[#C4724F] transition-colors">{product.name}</h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-white/30 capitalize">{product.baseColor}</span>
                                            <span className="text-sm font-bold text-white">₹{product.price}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                    }
                </div>
            </div>
        </main>
    );
}
