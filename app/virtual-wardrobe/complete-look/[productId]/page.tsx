"use client";

import { useEffect, useState, use } from "react";
import { useWardrobe, WardrobeItem } from "@/context/wardrobe-context";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { Loader2, ArrowLeft, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CompleteWardrobeLookPage({ params }: { params: Promise<{ productId: string }> }) {
    const { items, loading: wardrobeLoading } = useWardrobe();
    const [product, setProduct] = useState<WardrobeItem | null>(null);
    const [categorizedRecs, setCategorizedRecs] = useState<{ [key: string]: WardrobeItem[] }>({});
    const [loading, setLoading] = useState(true);

    const resolvedParams = use(params);
    const productId = decodeURIComponent(resolvedParams.productId);

    // Reuse Logic from Complete Your Look (Simplified for Wardrobe Items)
    const getNeededItems = (p: WardrobeItem) => {
        const type = p.productType?.toLowerCase();
        const style = p.productStyle?.toLowerCase();

        // Rules (Same as before)
        if (type === 'topwear') {
            if (['t-shirt', 'sweatshirt'].includes(style)) {
                return [
                    { type: 'bottomwear', styles: ['jeans'], label: 'Jeans' },
                    { type: 'bottomwear', styles: ['joggers'], label: 'Joggers' },
                    { type: 'bottomwear', styles: ['cotton-pant'], label: 'Cotton Pants' },
                    { type: 'bottomwear', styles: ['shorts'], label: 'Shorts' },
                    { type: 'topwear', styles: ['jacket'], label: 'Jackets' },
                    { type: 'footwear', styles: ['sneakers'], label: 'Sneakers' }
                ];
            }
            if (style === 'casual-shirt') {
                return [
                    { type: 'bottomwear', styles: ['jeans'], label: 'Jeans' },
                    { type: 'bottomwear', styles: ['trouser'], label: 'Trousers' },
                    { type: 'topwear', styles: ['jacket'], label: 'Jackets' },
                    { type: 'footwear', styles: ['sneakers'], label: 'Sneakers' },
                    { type: 'footwear', styles: ['loafer'], label: 'Loafers' }
                ];
            }
            if (style === 'formal-shirt') {
                return [
                    { type: 'bottomwear', styles: ['trouser'], label: 'Trousers' },
                    { type: 'footwear', styles: ['formal-shoe'], label: 'Formal Shoes' },
                    { type: 'footwear', styles: ['loafer'], label: 'Loafers' }
                ];
            }
            if (style === 'active-t-shirt') {
                return [
                    { type: 'bottomwear', styles: ['track-pant'], label: 'Track Pants' },
                    { type: 'bottomwear', styles: ['joggers'], label: 'Joggers' },
                    { type: 'bottomwear', styles: ['shorts'], label: 'Shorts' },
                    { type: 'footwear', styles: ['sports-shoe'], label: 'Sports Shoes' }
                ];
            }
            if (style === 'jacket') {
                return [
                    { type: 'topwear', styles: ['t-shirt'], isInner: true, label: 'T-Shirts' },
                    { type: 'topwear', styles: ['casual-shirt'], isInner: true, label: 'Casual Shirts' },
                    { type: 'bottomwear', styles: ['jeans'], label: 'Jeans' },
                    { type: 'bottomwear', styles: ['cotton-pant'], label: 'Cotton Pants' },
                    { type: 'bottomwear', styles: ['trouser'], label: 'Trousers' },
                    { type: 'footwear', styles: ['casual-shoe'], label: 'Casual Shoes' }
                ];
            }
        }
        if (type === 'bottomwear') {
            if (['jeans'].includes(style)) {
                return [
                    { type: 'topwear', styles: ['t-shirt'], label: 'T-Shirts' },
                    { type: 'topwear', styles: ['casual-shirt'], label: 'Casual Shirts' },
                    { type: 'topwear', styles: ['sweatshirt'], label: 'Sweatshirts' },
                    { type: 'topwear', styles: ['jacket'], label: 'Jackets' },
                    { type: 'footwear', styles: ['sneakers'], label: 'Sneakers' }
                ];
            }
            if (style === 'cotton-pant') {
                return [
                    { type: 'topwear', styles: ['t-shirt'], label: 'T-Shirts' },
                    { type: 'topwear', styles: ['jacket'], label: 'Jackets' },
                    { type: 'footwear', styles: ['casual-shoe'], label: 'Casual Shoes' }
                ];
            }
            if (style === 'trouser') {
                return [
                    { type: 'topwear', styles: ['formal-shirt'], label: 'Formal Shirts' },
                    { type: 'topwear', styles: ['casual-shirt'], label: 'Casual Shirts' },
                    { type: 'topwear', styles: ['jacket'], label: 'Jackets' },
                    { type: 'footwear', styles: ['formal-shoe'], label: 'Formal Shoes' },
                    { type: 'footwear', styles: ['loafer'], label: 'Loafers' },
                    { type: 'footwear', styles: ['casual-shoe'], label: 'Casual Shoes' }
                ];
            }
            if (style === 'joggers') {
                return [
                    { type: 'topwear', styles: ['t-shirt'], label: 'T-Shirts' },
                    { type: 'topwear', styles: ['sweatshirt'], label: 'Sweatshirts' },
                    { type: 'topwear', styles: ['active-t-shirt'], label: 'Active T-Shirts' },
                    { type: 'footwear', styles: ['sneakers'], label: 'Sneakers' },
                    { type: 'footwear', styles: ['sports-shoe'], label: 'Sports Shoes' }
                ];
            }
            if (style === 'shorts') {
                return [
                    { type: 'topwear', styles: ['t-shirt'], label: 'T-Shirts' },
                    { type: 'topwear', styles: ['active-t-shirt'], label: 'Active T-Shirts' },
                    { type: 'footwear', styles: ['sneakers'], label: 'Sneakers' },
                    { type: 'footwear', styles: ['sports-shoe'], label: 'Sports Shoes' }
                ];
            }
            if (style === 'track-pant') {
                return [
                    { type: 'topwear', styles: ['active-t-shirt'], label: 'Active T-Shirts' },
                    { type: 'footwear', styles: ['sports-shoe'], label: 'Sports Shoes' }
                ];
            }
        }
        return null;
    };

    useEffect(() => {
        if (wardrobeLoading) return;

        const init = async () => {
            setLoading(true);
            try {
                // 1. Find Main Product in Wardrobe
                const currentProduct = items.find(i => i.id === productId);

                if (!currentProduct) {
                    setProduct(null);
                    setLoading(false);
                    return;
                }

                setProduct(currentProduct);

                // 2. Determine Needed Items
                const neededConfig = getNeededItems(currentProduct);
                if (!neededConfig) {
                    setLoading(false);
                    return;
                }

                // 3. Filter Wardrobe for Matches
                const candidates = items.filter(i => i.id !== currentProduct.id);
                const newRecs: { [key: string]: WardrobeItem[] } = {};

                // Color Rules
                const getAllowedColors = (baseColor: string) => {
                    const bc = baseColor?.toLowerCase() || 'neutral';
                    if (bc === 'neutral') return ['neutral', 'earthy', 'cool', 'warm'];
                    return [bc, 'neutral'];
                };

                const allowedColors = getAllowedColors(currentProduct.baseColor);

                const findMatches = (type: string, allowedStyles: string[]) => {
                    return candidates.filter((c) =>
                        c.productType?.toLowerCase() === type &&
                        allowedStyles.includes(c.productStyle?.toLowerCase()) &&
                        allowedColors.includes(c.baseColor?.toLowerCase())
                    );
                };

                for (const req of neededConfig) {
                    const matches = findMatches(req.type, req.styles);
                    if (matches.length > 0) {
                        newRecs[req.label] = matches;
                    }
                }
                setCategorizedRecs(newRecs);

            } catch (error) {
                console.error("Error in styling logic:", error);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            init();
        }
    }, [productId, items, wardrobeLoading]);

    if (loading || wardrobeLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Item Not Found in Wardrobe</h1>
                <Link href="/virtual-wardrobe">
                    <Button>Back to Wardrobe</Button>
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white text-[#111]">
            <Navbar />

            <div className="pt-32 pb-24 px-4 md:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="max-w-3xl mb-16">
                    <Link href="/virtual-wardrobe" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors mb-6 group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Wardrobe
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">Style Your Look.</h1>
                    <p className="text-lg text-gray-500 font-light">
                        Using items from your <span className="font-medium text-black">Virtual Wardrobe</span>.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-y-12 lg:gap-x-16">
                    {/* Main Product (Hero) */}
                    <div className="lg:col-span-4 xl:col-span-3">
                        <div className="sticky top-32 space-y-4">
                            <div className="group relative aspect-[3/4] bg-gray-100 rounded-[2rem] overflow-hidden shadow-sm">
                                <div className="absolute top-4 left-4 bg-black/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-full z-10 uppercase tracking-wider shadow-lg">
                                    Base Item
                                </div>
                                {product.images?.[0] ? (
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : null}
                            </div>
                            <div className="px-1">
                                <h3 className="text-lg font-semibold tracking-tight leading-tight mb-1">{product.name}</h3>
                            </div>
                        </div>
                    </div>

                    {/* Recommendations */}
                    <div className="lg:col-span-8 xl:col-span-9 space-y-20">
                        {Object.keys(categorizedRecs).length > 0 ? (
                            Object.entries(categorizedRecs).map(([category, items]) => (
                                <div key={category} className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                    <div className="flex items-end justify-between border-b border-gray-100 pb-4">
                                        <h3 className="text-3xl font-black uppercase tracking-tighter text-[#111]">{category}</h3>
                                        <span className="text-sm text-gray-400 font-medium">{items.length} Options</span>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
                                        {items.map((item) => (
                                            <div key={item.id} className="group block space-y-4">
                                                <div className="aspect-[3/4] relative bg-gray-50 rounded-2xl overflow-hidden transition-all duration-500 ease-out group-hover:shadow-xl">
                                                    {item.images?.[0] ? (
                                                        <Image
                                                            src={item.images[0]}
                                                            alt={item.name}
                                                            fill
                                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                                                    )}
                                                </div>

                                                <div className="space-y-1 px-1">
                                                    <h4 className="font-medium text-base text-gray-900 leading-snug">{item.name}</h4>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 px-4 text-center bg-gray-50 rounded-[3rem] border border-gray-100 dashed border-2">
                                <div className="bg-white p-6 rounded-full shadow-lg mb-8">
                                    <SearchX className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#111] mb-2">No Matching Wardrobe Items</h3>
                                <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
                                    You don't have enough matching items in your wardrobe yet. Add more pieces to unlock outfits.
                                </p>
                                <Link href="/recommendations">
                                    <Button className="rounded-full px-8 py-6 text-lg font-bold">Browse Shop</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
