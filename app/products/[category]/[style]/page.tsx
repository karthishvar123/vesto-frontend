"use client";

import { useEffect, useState, useMemo, use } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Navbar from "@/components/navbar";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, SlidersHorizontal, ArrowUpDown, X, Check, ChevronDown } from "lucide-react";
import { useSkinTone } from "@/context/skin-tone-context";

interface Product {
    id: string;
    name: string;
    price: number;
    images: string[];
    productType: string;
    productStyle: string;
    baseColor: string;
    brand?: string;
}

const COLOR_DOTS: Record<string, string> = {
    neutral: "#9CA3AF",
    warm: "#F59E0B",
    cool: "#60A5FA",
    earthy: "#92400E",
    multicolour: "#C4724F",
};

const TONE_COLORS: Record<number, string[]> = {
    1: ["cool", "neutral"], 2: ["cool", "neutral"],
    3: ["neutral", "earthy"], 4: ["earthy", "warm"],
    5: ["warm", "earthy"], 6: ["warm", "neutral"],
};

const SORT_OPTIONS = [
    { value: "default",     label: "Default" },
    { value: "price_asc",   label: "Price: Low to High" },
    { value: "price_desc",  label: "Price: High to Low" },
    { value: "name_asc",    label: "Name: A to Z" },
    { value: "name_desc",   label: "Name: Z to A" },
];

function SkeletonCard() {
    return (
        <div className="space-y-3">
            <div className="aspect-[3/4] skeleton rounded-xl" />
            <div className="h-4 skeleton rounded w-3/4" />
            <div className="h-3 skeleton rounded w-1/3" />
        </div>
    );
}

export default function ProductsByCategoryPage({
    params,
}: {
    params: Promise<{ category: string; style: string }>;
}) {
    const { category, style } = use(params);
    const { selectedType } = useSkinTone();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter state
    const [activeColors, setActiveColors] = useState<string[]>([]);
    const [activeBrands, setActiveBrands] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
    const [maxPrice, setMaxPrice] = useState(10000);
    const [sortBy, setSortBy] = useState("default");

    // UI state
    const [showFilterSheet, setShowFilterSheet] = useState(false);
    const [showSortSheet, setShowSortSheet] = useState(false);

    const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
    const styleLabel = style.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    const recommendedColors = selectedType ? TONE_COLORS[selectedType] : [];

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const q = query(
                    collection(db, "products"),
                    where("productType", "==", category),
                    where("productStyle", "==", style),
                    where("active", "==", true)
                );
                const snap = await getDocs(q);
                const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
                setProducts(data);

                const prices = data.map(p => p.price).filter(Boolean);
                if (prices.length > 0) {
                    const max = Math.max(...prices);
                    setMaxPrice(max);
                    setPriceRange([0, max]);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [category, style]);

    const availableColors = useMemo(() =>
        [...new Set(products.map(p => p.baseColor).filter(Boolean))],
        [products]
    );

    const availableBrands = useMemo(() =>
        [...new Set(products.map(p => p.brand).filter(Boolean))] as string[],
        [products]
    );

    const toggleColor = (color: string) => {
        setActiveColors(prev =>
            prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
        );
    };

    const toggleBrand = (brand: string) => {
        setActiveBrands(prev =>
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    const clearAllFilters = () => {
        setActiveColors([]);
        setActiveBrands([]);
        setPriceRange([0, maxPrice]);
    };

    const activeFilterCount =
        activeColors.length +
        activeBrands.length +
        (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0);

    const filtered = useMemo(() => {
        let result = products.filter(p => {
            if (activeColors.length > 0 && !activeColors.includes(p.baseColor)) return false;
            if (activeBrands.length > 0 && (!p.brand || !activeBrands.includes(p.brand))) return false;
            if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
            return true;
        });

        switch (sortBy) {
            case "price_asc":  result = [...result].sort((a, b) => a.price - b.price); break;
            case "price_desc": result = [...result].sort((a, b) => b.price - a.price); break;
            case "name_asc":   result = [...result].sort((a, b) => a.name.localeCompare(b.name)); break;
            case "name_desc":  result = [...result].sort((a, b) => b.name.localeCompare(a.name)); break;
        }

        return result;
    }, [products, activeColors, activeBrands, priceRange, sortBy]);

    const activeSortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label || "Sort";

    return (
        <main className="min-h-screen bg-[#0A0A0A]">
            <Navbar />

            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-[#C4724F]/4 blur-[120px]" />
            </div>

            <div className="relative z-10 pt-20 sm:pt-32 pb-24 px-4 md:px-8 max-w-7xl mx-auto">

                <Link href="/men"
                    className="inline-flex items-center gap-2 text-sm text-white/30 hover:text-white transition-colors mb-6 group">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    {categoryLabel}
                </Link>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }} className="mb-8">
                    <span className="text-[#C4724F] text-xs font-bold uppercase tracking-widest mb-3 block">
                        {categoryLabel}
                    </span>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-2">
                        {styleLabel}
                    </h1>
                    <p className="text-white/30 text-sm">
                        {loading ? "Loading..." : `${filtered.length} item${filtered.length !== 1 ? "s" : ""}`}
                        {activeFilterCount > 0 && ` · ${activeFilterCount} filter${activeFilterCount !== 1 ? "s" : ""} applied`}
                    </p>
                </motion.div>

                {/* Skin tone recommendation banner */}
                {selectedType && recommendedColors.length > 0 && (
                    <div className="flex items-center gap-3 bg-[#C4724F]/10 border border-[#C4724F]/20 rounded-xl px-4 py-3 mb-6">
                        <span className="text-[#C4724F] text-xs">✦</span>
                        <p className="text-[#E8A87C] text-xs font-medium">
                            Based on your skin tone (Type {selectedType}), we recommend{" "}
                            <strong>{recommendedColors.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(" & ")}</strong> colors for you
                        </p>
                        {activeColors.length === 0 && (
                            <button
                                onClick={() => setActiveColors(recommendedColors)}
                                className="ml-auto text-[10px] font-bold text-[#C4724F] border border-[#C4724F]/30 px-2 py-1 rounded-full hover:bg-[#C4724F]/10 transition-colors whitespace-nowrap shrink-0"
                            >
                                Apply
                            </button>
                        )}
                    </div>
                )}

                {/* Sort + Filter bar */}
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => setShowFilterSheet(true)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold border transition-all ${
                            activeFilterCount > 0
                                ? "bg-[#C4724F] border-[#C4724F] text-white"
                                : "border-white/10 text-white/60 hover:border-white/30 hover:text-white bg-white/5"
                        }`}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filter
                        {activeFilterCount > 0 && (
                            <span className="w-5 h-5 rounded-full bg-white text-[#C4724F] text-[10px] font-black flex items-center justify-center">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => setShowSortSheet(true)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold border transition-all ${
                            sortBy !== "default"
                                ? "bg-white/10 border-white/30 text-white"
                                : "border-white/10 text-white/60 hover:border-white/30 hover:text-white bg-white/5"
                        }`}
                    >
                        <ArrowUpDown className="w-4 h-4" />
                        {sortBy !== "default" ? activeSortLabel : "Sort"}
                        <ChevronDown className="w-3 h-3 opacity-50" />
                    </button>

                    {(activeFilterCount > 0 || sortBy !== "default") && (
                        <button
                            onClick={() => { clearAllFilters(); setSortBy("default"); }}
                            className="flex items-center gap-1 text-xs text-white/30 hover:text-white transition-colors ml-auto"
                        >
                            <X className="w-3 h-3" /> Clear all
                        </button>
                    )}
                </div>

                {/* Active filter chips */}
                {(activeColors.length > 0 || activeBrands.length > 0) && (
                    <div className="flex gap-2 flex-wrap mb-6">
                        {activeColors.map(color => (
                            <button key={color} onClick={() => toggleColor(color)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium hover:bg-red-500/20 hover:border-red-500/30 transition-colors group">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLOR_DOTS[color] || "#888" }} />
                                {color}
                                <X className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                            </button>
                        ))}
                        {activeBrands.map(brand => (
                            <button key={brand} onClick={() => toggleBrand(brand)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium hover:bg-red-500/20 hover:border-red-500/30 transition-colors group">
                                {brand}
                                <X className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                            </button>
                        ))}
                    </div>
                )}

                {/* Product grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
                    {loading
                        ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                        : filtered.length === 0
                            ? (
                                <div className="col-span-full text-center py-20">
                                    <p className="text-white/20 text-lg mb-3">No products match your filters</p>
                                    <button onClick={clearAllFilters}
                                        className="text-[#C4724F] text-sm hover:underline">
                                        Clear filters
                                    </button>
                                </div>
                            )
                            : filtered.map((product, i) => (
                                <motion.div key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.04, duration: 0.4 }}>
                                    <Link href={`/product/${encodeURIComponent(product.id)}`}
                                        className="group block product-card">
                                        <div className="aspect-[3/4] relative bg-[#111] overflow-hidden rounded-xl">
                                            {product.images?.[0] ? (
                                                <Image
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white/10 text-xs">
                                                    No Image
                                                </div>
                                            )}
                                            {recommendedColors.includes(product.baseColor) && (
                                                <div className="absolute top-2 left-2 bg-[#C4724F] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                    For You
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-2 sm:p-3 mt-1">
                                            <h3 className="font-bold text-white text-xs sm:text-sm truncate group-hover:text-[#E8A87C] transition-colors">
                                                {product.name}
                                            </h3>
                                            {product.brand && (
                                                <p className="text-white/30 text-[10px] mt-0.5">{product.brand}</p>
                                            )}
                                            <div className="flex items-center justify-between mt-1.5">
                                                {product.baseColor && (
                                                    <span className="flex items-center gap-1 text-[10px] text-white/30 capitalize">
                                                        <span className="w-1.5 h-1.5 rounded-full"
                                                            style={{ backgroundColor: COLOR_DOTS[product.baseColor] || "#888" }} />
                                                        {product.baseColor}
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

            {/* Filter Side Drawer */}
            <AnimatePresence>
                {showFilterSheet && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 z-[110] backdrop-blur-md"
                            onClick={() => setShowFilterSheet(false)}
                        />
                        <motion.div
                            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 z-[120] bg-[#0A0A0A] border-l border-white/10 w-full sm:w-[400px] flex flex-col shadow-2xl"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-[#0A0A0A] shrink-0">
                                <div className="flex flex-col">
                                    <h3 className="text-white font-black text-xl uppercase tracking-widest">Filter</h3>
                                    <p className="text-white/40 text-xs mt-0.5">{filtered.length} products</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    {activeFilterCount > 0 && (
                                        <button onClick={clearAllFilters}
                                            className="text-[#C4724F] text-xs font-bold uppercase tracking-wider hover:text-white transition-colors">
                                            Clear all
                                        </button>
                                    )}
                                    <button onClick={() => setShowFilterSheet(false)}
                                        className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                                        <X className="w-5 h-5 text-white" />
                                    </button>
                                </div>
                            </div>

                            {/* Scrollable content */}
                            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10">

                                {/* Color filter */}
                                {availableColors.length > 0 && (
                                    <div>
                                        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                                            Color Family
                                        </p>
                                        <div className="flex flex-wrap gap-2.5">
                                            {availableColors.map(color => {
                                                const isRecommended = recommendedColors.includes(color);
                                                const isActive = activeColors.includes(color);
                                                return (
                                                    <button key={color} onClick={() => toggleColor(color)}
                                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold border transition-all capitalize ${
                                                            isActive
                                                                ? "bg-[#C4724F] border-[#C4724F] text-white shadow-[0_0_15px_rgba(196,114,79,0.3)]"
                                                                : isRecommended
                                                                ? "border-[#C4724F]/50 text-[#C4724F] bg-[#C4724F]/5 hover:bg-[#C4724F]/10"
                                                                : "border-white/10 text-white/60 hover:border-white/30 hover:text-white bg-white/5"
                                                        }`}>
                                                        <span className={`w-2 h-2 rounded-full ${isActive ? 'ring-2 ring-white/30 ring-offset-1 ring-offset-[#C4724F]' : ''}`}
                                                            style={{ backgroundColor: COLOR_DOTS[color] || "#888" }} />
                                                        {color}
                                                        {isRecommended && !isActive && (
                                                            <span className="text-[9px] bg-[#C4724F] text-white px-2 py-0.5 rounded-full font-black tracking-wider">
                                                                FOR YOU
                                                            </span>
                                                        )}
                                                        {isActive && <Check className="w-3.5 h-3.5 ml-1" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Brand filter */}
                                {availableBrands.length > 0 && (
                                    <div>
                                        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Brand</p>
                                        <div className="flex flex-wrap gap-2.5">
                                            {availableBrands.map(brand => {
                                                const isActive = activeBrands.includes(brand);
                                                return (
                                                    <button key={brand} onClick={() => toggleBrand(brand)}
                                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold border transition-all ${
                                                            isActive
                                                                ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                                                                : "border-white/10 text-white/60 hover:border-white/30 hover:text-white bg-white/5"
                                                        }`}>
                                                        {brand}
                                                        {isActive && <Check className="w-3.5 h-3.5 ml-1" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Price range */}
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Price Range</p>
                                        <p className="text-[#E8A87C] text-sm font-black tracking-wider">
                                            ₹{priceRange[0]} — ₹{priceRange[1]}
                                        </p>
                                    </div>
                                    <div className="relative h-2 bg-white/10 rounded-full mb-6">
                                        <div 
                                            className="absolute h-full bg-[#C4724F] rounded-full"
                                            style={{ 
                                                left: `${(priceRange[0] / maxPrice) * 100}%`,
                                                right: `${100 - (priceRange[1] / maxPrice) * 100}%` 
                                            }}
                                        />
                                        <input type="range" min={0} max={maxPrice} step={100}
                                            value={priceRange[0]}
                                            onChange={e => setPriceRange([Math.min(Number(e.target.value), priceRange[1] - 100), priceRange[1]])}
                                            className="absolute w-full h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg"
                                        />
                                        <input type="range" min={0} max={maxPrice} step={100}
                                            value={priceRange[1]}
                                            onChange={e => setPriceRange([priceRange[0], Math.max(Number(e.target.value), priceRange[0] + 100)])}
                                            className="absolute w-full h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg"
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs font-medium text-white/30">
                                        <span>₹0</span>
                                        <span>₹{maxPrice}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Sticky apply button */}
                            <div className="px-6 py-5 border-t border-white/5 bg-[#0A0A0A] shrink-0 pt-4 pb-8 sm:pb-6">
                                <button
                                    onClick={() => setShowFilterSheet(false)}
                                    className="group w-full py-4 bg-[#C4724F] hover:bg-[#d4845f] text-white font-black tracking-widest uppercase text-sm rounded-full transition-all shadow-[0_0_20px_rgba(196,114,79,0.2)] hover:shadow-[0_0_30px_rgba(196,114,79,0.4)]"
                                >
                                    Show {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Sort Bottom Sheet */}
            <AnimatePresence>
                {showSortSheet && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 z-[110] backdrop-blur-md"
                            onClick={() => setShowSortSheet(false)}
                        />
                        <motion.div
                            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 z-[120] bg-[#0A0A0A] rounded-t-3xl border-t border-white/10 shadow-2xl"
                        >
                            <div className="flex justify-center pt-4 pb-2">
                                <div className="w-12 h-1.5 rounded-full bg-white/10" />
                            </div>

                            <div className="px-6 pb-12">
                                <div className="flex items-center justify-between py-5 border-b border-white/5 mb-4">
                                    <h3 className="text-white font-black text-xl uppercase tracking-widest">Sort By</h3>
                                    <button onClick={() => setShowSortSheet(false)}
                                        className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                                        <X className="w-5 h-5 text-white" />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {SORT_OPTIONS.map(opt => (
                                        <button key={opt.value}
                                            onClick={() => { setSortBy(opt.value); setShowSortSheet(false); }}
                                            className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all font-bold ${
                                                sortBy === opt.value
                                                    ? "bg-[#C4724F]/10 text-white shadow-[inset_0_0_0_1px_rgba(196,114,79,0.5)] bg-gradient-to-r from-[#C4724F]/20 to-transparent"
                                                    : "text-white/60 hover:text-white hover:bg-white/5"
                                            }`}>
                                            {opt.label}
                                            {sortBy === opt.value && (
                                                <div className="w-6 h-6 rounded-full bg-[#C4724F] flex items-center justify-center shadow-[0_0_10px_rgba(196,114,79,0.5)]">
                                                    <Check className="w-3.5 h-3.5 text-white" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </main>
    );
}
