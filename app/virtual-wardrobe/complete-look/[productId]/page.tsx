"use client";

import { useEffect, useState, use } from "react";
import { useWardrobe, WardrobeItem } from "@/context/wardrobe-context";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { ArrowLeft, SearchX } from "lucide-react";
import { getNeededItems, getAllowedColors } from "@/lib/styling-rules";

function ProductSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="aspect-[3/4] skeleton rounded-2xl" />
            <div className="h-4 skeleton rounded w-3/4" />
        </div>
    );
}

export default function CompleteWardrobeLookPage({ params }: { params: Promise<{ productId: string }> }) {
    const { items, loading: wardrobeLoading } = useWardrobe();
    const [product, setProduct] = useState<WardrobeItem | null>(null);
    const [categorizedRecs, setCategorizedRecs] = useState<{ [key: string]: WardrobeItem[] }>({});
    const [loading, setLoading] = useState(true);

    const resolvedParams = use(params);
    const productId = decodeURIComponent(resolvedParams.productId);

    useEffect(() => {
        if (wardrobeLoading) return;

        const init = async () => {
            setLoading(true);
            try {
                const currentProduct = items.find(i => i.id === productId);

                if (!currentProduct) {
                    setProduct(null);
                    setLoading(false);
                    return;
                }

                setProduct(currentProduct);

                const neededConfig = getNeededItems(currentProduct.productType, currentProduct.productStyle);
                if (!neededConfig) { setLoading(false); return; }

                const candidates = items.filter(i => i.id !== currentProduct.id);
                const allowedColors = getAllowedColors(currentProduct.baseColor);
                const newRecs: { [key: string]: WardrobeItem[] } = {};

                const findMatches = (type: string, allowedStyles: string[]) =>
                    candidates.filter((c) =>
                        c.productType?.toLowerCase() === type &&
                        allowedStyles.includes(c.productStyle?.toLowerCase()) &&
                        allowedColors.includes(c.baseColor?.toLowerCase())
                    );

                for (const req of neededConfig) {
                    const matches = findMatches(req.type, req.styles);
                    if (matches.length > 0) newRecs[req.label] = matches;
                }
                setCategorizedRecs(newRecs);

            } catch (error) {
                console.error("Error in styling logic:", error);
            } finally {
                setLoading(false);
            }
        };

        if (productId) init();
    }, [productId, items, wardrobeLoading]);

    if (loading || wardrobeLoading) {
        return (
            <div className="min-h-screen bg-[#0A0A0A]">
                <Navbar />
                <div className="pt-32 pb-24 px-4 md:px-8 max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-12 gap-y-12 lg:gap-x-16">
                        <div className="lg:col-span-4 xl:col-span-3">
                            <div className="aspect-[3/4] skeleton rounded-2xl" />
                        </div>
                        <div className="lg:col-span-8 xl:col-span-9">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
                                {Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-white mb-4">Item Not Found in Wardrobe</h1>
                <Link href="/virtual-wardrobe" className="text-[#C4724F] underline">Back to Wardrobe</Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#0A0A0A] text-white">
            <Navbar />

            {/* Ambient glow */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-[#C4724F]/4 blur-[120px]" />
            </div>

            <div className="relative z-10 pt-32 pb-24 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="max-w-3xl mb-16">
                    <Link href="/virtual-wardrobe" className="inline-flex items-center text-sm font-medium text-white/40 hover:text-white transition-colors mb-6 group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Wardrobe
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">Style Your Look.</h1>
                    <p className="text-lg text-white/40">
                        Using items from your <span className="font-bold text-[#E8A87C]">Virtual Wardrobe</span>.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-y-12 lg:gap-x-16">
                    {/* Main Product */}
                    <div className="lg:col-span-4 xl:col-span-3">
                        <div className="sticky top-32 space-y-4">
                            <div className="relative aspect-[3/4] bg-[#111] rounded-2xl overflow-hidden border border-white/5">
                                <div className="absolute top-4 left-4 bg-[#C4724F] text-white text-[10px] font-bold px-3 py-1.5 rounded-full z-10 uppercase tracking-wider">
                                    Base Item
                                </div>
                                {/* Corner accents */}
                                {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos, i) => (
                                    <div key={i} className={`absolute ${pos} w-5 h-5`}>
                                        <div className={`absolute ${i < 2 ? "top-0" : "bottom-0"} ${i % 2 === 0 ? "left-0" : "right-0"} w-px h-5 bg-[#C4724F]/40`} />
                                        <div className={`absolute ${i < 2 ? "top-0" : "bottom-0"} ${i % 2 === 0 ? "left-0" : "right-0"} w-5 h-px bg-[#C4724F]/40`} />
                                    </div>
                                ))}
                                {product.images?.[0] && (
                                    <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                                )}
                            </div>
                            <div className="px-1">
                                <h3 className="text-base font-bold text-white leading-tight mb-1">{product.name}</h3>
                            </div>
                        </div>
                    </div>

                    {/* Recommendations */}
                    <div className="lg:col-span-8 xl:col-span-9 space-y-20">
                        {Object.keys(categorizedRecs).length > 0 ? (
                            Object.entries(categorizedRecs).map(([category, items]) => (
                                <div key={category} className="space-y-8">
                                    <div className="flex items-end justify-between border-b border-white/5 pb-4">
                                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{category}</h3>
                                        <span className="text-sm text-white/30 font-medium">{items.length} Options</span>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10">
                                        {items.map((item) => (
                                            <div key={item.id} className="group">
                                                <div className="aspect-[3/4] relative bg-[#111] rounded-xl overflow-hidden border border-white/5 group-hover:border-[#C4724F]/30 transition-all duration-300">
                                                    {item.images?.[0] ? (
                                                        <Image
                                                            src={item.images[0]}
                                                            alt={item.name}
                                                            fill
                                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-white/10 text-xs">No Image</div>
                                                    )}
                                                </div>
                                                <div className="p-3">
                                                    <h4 className="font-bold text-white text-sm leading-snug">{item.name}</h4>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 px-4 text-center rounded-3xl border-2 border-dashed border-white/5">
                                <div className="bg-white/5 p-6 rounded-full mb-8">
                                    <SearchX className="w-10 h-10 text-white/20" />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-2">No Matching Wardrobe Items</h3>
                                <p className="text-white/40 max-w-sm mb-8 leading-relaxed">
                                    You don't have enough matching items in your wardrobe yet. Add more pieces to unlock outfits.
                                </p>
                                <Link href="/recommendations" className="vesto-btn-primary">
                                    Browse Shop
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
