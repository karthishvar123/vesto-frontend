"use client";

import { useEffect, useState, use } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Navbar from "@/components/navbar";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useWardrobe } from "@/context/wardrobe-context";
import { ArrowRight, Heart, HeartOff, ChevronLeft, Sparkles, Tag, Palette, ShoppingCart } from "lucide-react";

interface Product {
    id: string; name: string; price: number; description: string;
    images: string[]; productType: string; productStyle: string;
    baseColor: string; activityType: string; skinToneCompatibility: string[]; colorFamily?: string;
    brand?: string; affiliateLink?: string;
}

function SkeletonProduct() {
    return (
        <div className="pt-32 pb-24 px-4 md:px-8 max-w-7xl mx-auto animate-pulse">
            <div className="grid md:grid-cols-2 gap-12">
                <div className="aspect-[3/4] skeleton rounded-2xl" />
                <div className="space-y-5 pt-4">
                    <div className="h-4 skeleton rounded w-24" />
                    <div className="h-10 skeleton rounded w-3/4" />
                    <div className="h-6 skeleton rounded w-1/3" />
                    <div className="h-24 skeleton rounded" />
                    <div className="h-12 skeleton rounded-full" />
                </div>
            </div>
        </div>
    );
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const productId = decodeURIComponent(resolvedParams.id);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [source, setSource] = useState<string | null>(null);
    const [sourceId, setSourceId] = useState<string | null>(null);
    const { addToWardrobe, removeFromWardrobe, isInWardrobe } = useWardrobe();
    const inWardrobe = product ? isInWardrobe(product.id) : false;

    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            setSource(params.get("source"));
            setSourceId(params.get("sourceId"));
        }
    }, []);

    useEffect(() => {
        const fetch = async () => {
            try {
                const snap = await getDoc(doc(db, "products", productId));
                if (snap.exists()) setProduct({ id: snap.id, ...snap.data() } as Product);
            } finally { setLoading(false); }
        };
        fetch();
    }, [productId]);

    const handleWardrobeToggle = () => {
        if (!product) return;
        inWardrobe ? removeFromWardrobe(product.id) : addToWardrobe({ id: product.id, name: product.name, price: product.price, images: product.images, productType: product.productType, productStyle: product.productStyle, baseColor: product.baseColor, activityType: product.activityType, colorFamily: product.colorFamily ?? "" });
    };

    if (loading) return <main className="min-h-screen bg-[#0A0A0A]"><Navbar /><SkeletonProduct /></main>;
    if (!product) return <main className="min-h-screen bg-[#0A0A0A] flex items-center justify-center"><Navbar /><div className="text-center"><h1 className="text-2xl font-bold text-white mb-4">Product not found</h1><Link href="/" className="text-[#C4724F] underline">Go home</Link></div></main>;

    return (
        <main className="min-h-screen bg-[#0A0A0A]">
            <Navbar />

            {/* Ambient glow */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-[#C4724F]/4 blur-[120px]" />
            </div>

            <div className="relative z-10 pt-28 pb-24 px-4 md:px-8 max-w-7xl mx-auto">
                {/* Back link */}
                {source === "complete-your-look" && sourceId ? (
                    <Link href={`/complete-your-look/${encodeURIComponent(sourceId)}`} className="inline-flex items-center gap-2 text-sm text-white/30 hover:text-white transition-colors mb-8 group">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back to Complete Your Look
                    </Link>
                ) : (
                    <Link href="/men" className="inline-flex items-center gap-2 text-sm text-white/30 hover:text-white transition-colors mb-8 group">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back to Shop
                    </Link>
                )}

                <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
                    {/* Images */}
                    <div className="space-y-4">
                        <motion.div layoutId={`product-image-${product.id}`} className="relative aspect-[3/4] bg-[#111] rounded-2xl overflow-hidden border border-white/5">
                            <AnimatePresence mode="wait">
                                <motion.div key={activeImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="absolute inset-0">
                                    {product.images?.[activeImage] && (
                                        <Image src={product.images[activeImage]} alt={product.name} fill className="object-cover" />
                                    )}
                                </motion.div>
                            </AnimatePresence>
                            {/* Corner accents */}
                            {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos, i) => (
                                <div key={i} className={`absolute ${pos} w-5 h-5`}>
                                    <div className={`absolute ${i < 2 ? "top-0" : "bottom-0"} ${i % 2 === 0 ? "left-0" : "right-0"} w-px h-5 bg-[#C4724F]/40`} />
                                    <div className={`absolute ${i < 2 ? "top-0" : "bottom-0"} ${i % 2 === 0 ? "left-0" : "right-0"} w-5 h-px bg-[#C4724F]/40`} />
                                </div>
                            ))}
                        </motion.div>
                        {product.images?.length > 1 && (
                            <div className="flex gap-3">
                                {product.images.map((img, i) => (
                                    <button key={i} onClick={() => setActiveImage(i)} className={`relative w-16 h-20 rounded-lg overflow-hidden border-2 transition-all ${activeImage === i ? "border-[#C4724F]" : "border-white/5 hover:border-white/20"}`}>
                                        <Image src={img} alt="" fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="sticky top-28 space-y-7">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs font-bold text-[#C4724F] uppercase tracking-widest">{product.productType}</span>
                                <span className="w-1 h-1 rounded-full bg-white/20" />
                                <span className="text-xs font-bold text-white/30 uppercase tracking-widest">{product.productStyle}</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight mb-3">{product.name}</h1>
                            <p className="text-3xl font-black text-[#E8A87C]">₹{product.price}</p>
                        </div>

                        {product.description && (
                            <p className="text-white/50 leading-relaxed text-sm border-l-2 border-[#C4724F]/30 pl-4">{product.description}</p>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                            {product.baseColor && (
                                <span className="flex items-center gap-1.5 text-xs text-white/50 bg-white/5 border border-white/8 px-3 py-1.5 rounded-full">
                                    <Palette className="w-3 h-3 text-[#C4724F]" /> {product.baseColor}
                                </span>
                            )}
                            {product.activityType && (
                                <span className="flex items-center gap-1.5 text-xs text-white/50 bg-white/5 border border-white/8 px-3 py-1.5 rounded-full">
                                    <Tag className="w-3 h-3 text-[#C4724F]" /> {product.activityType}
                                </span>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="space-y-4 pt-4 mt-2 border-t border-white/5">
                            {product.affiliateLink && (
                                <a 
                                    href={product.affiliateLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-black hover:bg-white/90 font-black tracking-widest uppercase rounded-full transition-all duration-300 shadow-[0_4px_20px_rgba(255,255,255,0.1)] hover:shadow-[0_4px_25px_rgba(255,255,255,0.2)]"
                                >
                                    <ShoppingCart className="w-5 h-5 group-hover:-rotate-6 transition-transform" />
                                    Get it from {product.brand || "Store"}
                                </a>
                            )}
                            <div>
                                <Link
                                    href={`/complete-your-look/${encodeURIComponent(product.id)}`}
                                    className="group w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#C4724F] hover:bg-[#d4845f] text-white font-bold rounded-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(196,114,79,0.3)]"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Complete Your Look
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <p className="text-white/25 text-[10px] text-center mt-2 leading-relaxed">
                                    Vesto pairs this item with compatible bottoms, shoes &amp; layers based on color rules
                                </p>
                            </div>
                            <button
                                onClick={handleWardrobeToggle}
                                className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-full font-bold border transition-all duration-300 ${inWardrobe ? "bg-[#C4724F]/10 border-[#C4724F]/40 text-[#E8A87C] hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400" : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20"}`}
                            >
                                {inWardrobe ? <><HeartOff className="w-4 h-4" /> Remove from Wardrobe</> : <><Heart className="w-4 h-4" /> Add to Wardrobe</>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
