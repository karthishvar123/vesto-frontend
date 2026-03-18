"use client";

import { useEffect, useState, use } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Navbar from "@/components/navbar";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, SlidersHorizontal } from "lucide-react";

interface Product { id: string; name: string; price: number; images: string[]; productType: string; productStyle: string; baseColor: string; }

const COLOR_DOTS: Record<string, string> = {
    neutral: "#9CA3AF", warm: "#F59E0B", cool: "#60A5FA", earthy: "#92400E", dark: "#374151", light: "#F3F4F6",
};

function SkeletonCard() {
    return <div className="space-y-3"><div className="aspect-[3/4] skeleton rounded-xl" /><div className="h-4 skeleton rounded w-3/4" /><div className="h-3 skeleton rounded w-1/3" /></div>;
}

export default function ProductsByCategoryPage({ params }: { params: Promise<{ category: string; style: string }> }) {
    const { category, style } = use(params);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeColor, setActiveColor] = useState<string | null>(null);

    const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
    const styleLabel = style.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const q = query(collection(db, "products"), where("productType", "==", category), where("productStyle", "==", style), where("active", "==", true));
                const snap = await getDocs(q);
                setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
            } finally { setLoading(false); }
        };
        fetchProducts();
    }, [category, style]);

    const colors = [...new Set(products.map(p => p.baseColor).filter(Boolean))];
    const filtered = activeColor ? products.filter(p => p.baseColor === activeColor) : products;

    return (
        <main className="min-h-screen bg-[#0A0A0A]">
            <Navbar />
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-[#C4724F]/4 blur-[120px]" />
            </div>

            <div className="relative z-10 pt-32 pb-24 px-4 md:px-8 max-w-7xl mx-auto">
                <Link href="/men" className="inline-flex items-center gap-2 text-sm text-white/30 hover:text-white transition-colors mb-8 group">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> {categoryLabel}
                </Link>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
                    <span className="text-[#C4724F] text-xs font-bold uppercase tracking-widest mb-3 block">{categoryLabel}</span>
                    <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-4">{styleLabel}</h1>
                    <p className="text-white/30 text-sm">{loading ? "Loading..." : `${filtered.length} items`}</p>
                </motion.div>

                {/* Color filter */}
                {!loading && colors.length > 0 && (
                    <div className="flex items-center gap-3 mb-10 flex-wrap">
                        <div className="flex items-center gap-2 text-white/30 text-xs uppercase tracking-widest mr-2">
                            <SlidersHorizontal className="w-3 h-3" /> Filter
                        </div>
                        <button
                            onClick={() => setActiveColor(null)}
                            className={`text-xs font-bold px-4 py-2 rounded-full border transition-all ${!activeColor ? "bg-[#C4724F] border-[#C4724F] text-white" : "border-white/10 text-white/40 hover:border-white/20 hover:text-white"}`}
                        >All</button>
                        {colors.map(color => (
                            <button
                                key={color}
                                onClick={() => setActiveColor(color === activeColor ? null : color)}
                                className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full border transition-all capitalize ${activeColor === color ? "border-[#C4724F] text-white bg-[#C4724F]/10" : "border-white/10 text-white/40 hover:border-white/20 hover:text-white"}`}
                            >
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLOR_DOTS[color] || "#888" }} />
                                {color}
                            </button>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
                    {loading
                        ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                        : filtered.length === 0
                            ? <p className="text-white/20 col-span-full text-center py-20">No products found.</p>
                            : filtered.map((product, i) => (
                                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04, duration: 0.4 }}>
                                    <Link href={`/product/${encodeURIComponent(product.id)}`} className="group block product-card">
                                        <div className="aspect-[3/4] relative bg-[#111] overflow-hidden rounded-xl">
                                            {product.images?.[0] ? (
                                                <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white/10 text-xs">No Image</div>
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <h3 className="font-bold text-white text-sm truncate group-hover:text-[#E8A87C] transition-colors">{product.name}</h3>
                                            <div className="flex items-center justify-between mt-1">
                                                {product.baseColor && (
                                                    <span className="flex items-center gap-1 text-xs text-white/30 capitalize">
                                                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLOR_DOTS[product.baseColor] || "#888" }} />{product.baseColor}
                                                    </span>
                                                )}
                                                <span className="text-sm font-bold text-white ml-auto">₹{product.price}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))
                    }
                </div>
            </div>
        </main>
    );
}
