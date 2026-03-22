"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Navbar from "@/components/navbar";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search, X } from "lucide-react";
import { motion } from "framer-motion";
import { useSkinTone } from "@/context/skin-tone-context";

interface Product { id: string; name: string; price: number; images: string[]; productType: string; productStyle: string; active: boolean; baseColor?: string; colorFamily?: string; brand?: string; }

const menStructure = [
    { category: "Topwear", slug: "topwear", items: [{ label: "T-Shirt", value: "t-shirt" }, { label: "Sweatshirt", value: "sweatshirt" }, { label: "Jacket", value: "jacket" }, { label: "Formal Shirt", value: "formal-shirt" }, { label: "Casual Shirt", value: "casual-shirt" }, { label: "Active T-Shirt", value: "active-t-shirt" }] },
    { category: "Bottomwear", slug: "bottomwear", items: [{ label: "Jeans", value: "jeans" }, { label: "Trouser", value: "trouser" }, { label: "Cotton Pant", value: "cotton-pant" }, { label: "Joggers", value: "joggers" }, { label: "Shorts", value: "shorts" }, { label: "Track Pant", value: "track-pant" }] },
    { category: "Footwear", slug: "footwear", items: [{ label: "Casual Shoe", value: "casual-shoe" }, { label: "Sneakers", value: "sneakers" }, { label: "Formal Shoe", value: "formal-shoe" }, { label: "Loafer", value: "loafer" }, { label: "Sports Shoe", value: "sports-shoe" }] },
];

// --- Fuzzy Search Utilities ---
function levenshtein(a: string, b: string): number {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1) // insert or delete
                );
            }
        }
    }
    return matrix[b.length][a.length];
}

function fuzzyMatch(query: string, target: string | undefined | null): boolean {
    if (!target) return false;
    
    // Normalise: lowercase and remove hyphens (so "tshirt" matches "t-shirt")
    const cleanTarget = target.toLowerCase().replace(/-/g, "");
    const cleanQuery = query.replace(/-/g, "");
    
    // Exact substring match
    if (cleanTarget.includes(cleanQuery)) return true;
    
    // Apply typo tolerance (1 mistake for words 4+, 2 for 7+)
    const maxTypos = cleanQuery.length >= 7 ? 2 : (cleanQuery.length >= 4 ? 1 : 0);
    if (maxTypos === 0) return false;

    // Check each word in the target separately
    const targetWords = cleanTarget.split(/\s+/);
    for (const tw of targetWords) {
        if (Math.abs(tw.length - cleanQuery.length) > maxTypos) continue;
        if (levenshtein(cleanQuery, tw) <= maxTypos) return true;
    }
    return false;
}
// ------------------------------

function SkeletonRow() {
    return (
        <div className="space-y-4">
            <div className="h-6 skeleton rounded w-32" />
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <div className="aspect-[3/4] skeleton rounded-xl" />
                        <div className="h-3 skeleton rounded w-3/4" />
                        <div className="h-3 skeleton rounded w-1/3" />
                    </div>
                ))}
            </div>
        </div>
    );
}

const TONE_COLORS: Record<number, string[]> = {
    1: ["cool", "neutral"], 2: ["cool", "neutral"],
    3: ["neutral", "earthy"], 4: ["earthy", "warm"],
    5: ["warm", "earthy"], 6: ["warm", "neutral"],
};

const COLOR_META: Record<string, { label: string; dot: string }> = {
    neutral: { label: "Neutral", dot: "#9CA3AF" },
    cool:    { label: "Cool",    dot: "#60A5FA" },
    warm:    { label: "Warm",    dot: "#F59E0B" },
    earthy:  { label: "Earthy",  dot: "#92400E" },
};

export default function MenPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeColor, setActiveColor] = useState<string | null>(null);
    const [brandFilter, setBrandFilter] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const { selectedType } = useSkinTone();
    const recommendedColors = selectedType ? (TONE_COLORS[selectedType] ?? []) : [];
    const brands = [...new Set(products.map(p => p.brand).filter(Boolean))] as string[];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const q = query(collection(db, "products"), where("active", "==", true));
                const snap = await getDocs(q);
                setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        fetchProducts();
    }, []);

    const getProductsForStyle = (cat: string, style: string) =>
        products.filter(p => {
            // First check standard filters
            const matchesCat = p.productType === cat;
            const matchesStyle = p.productStyle === style;
            const matchesColor = !activeColor || p.baseColor === activeColor;
            const matchesBrand = !brandFilter || p.brand === brandFilter;

            if (!matchesCat || !matchesStyle || !matchesColor || !matchesBrand) return false;

            // Then check search query if present
            if (searchQuery.trim() === "") return true;
            
            const keywords = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
            
            // For a product to match, every keyword must be found (with fuzzy matching) in at least one of its fields
            return keywords.every(kw => {
                const matchesName = fuzzyMatch(kw, p.name);
                const matchesColorName = fuzzyMatch(kw, p.colorFamily) || fuzzyMatch(kw, p.baseColor);
                const matchesBrand = fuzzyMatch(kw, p.brand);
                const matchesType = fuzzyMatch(kw, p.productType) || fuzzyMatch(kw, p.productStyle);
                
                return matchesName || matchesColorName || matchesBrand || matchesType;
            });
        });

    return (
        <main className="min-h-screen bg-[#0A0A0A]">
            <Navbar />

            {/* Hero banner */}
            <div className="relative pt-20 sm:pt-32 pb-10 sm:pb-16 px-4 sm:px-6 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-[#C4724F]/5 blur-[100px]" />
                </div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <span className="text-[#C4724F] text-xs font-bold uppercase tracking-widest mb-4 block">Men's Collection</span>
                        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                            The Edit
                        </h1>
                        <p className="text-white/40 text-lg max-w-xl">Curated essentials and statement pieces for the modern man.</p>
                    </motion.div>
                </div>
            </div>

            {/* Filters Section */}
            <div className="pb-24 px-4 md:px-8 max-w-7xl mx-auto">
                
                {/* Search Bar */}
                <div className="relative mb-8 max-w-md">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="w-4 h-4 text-white/40" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name or color..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-full py-3.5 pl-11 pr-11 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C4724F]/50 focus:bg-[#C4724F]/5 transition-all"
                    />
                    {searchQuery && (
                        <button 
                            onClick={() => setSearchQuery("")}
                            className="absolute inset-y-0 right-4 flex items-center text-white/40 hover:text-white"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Color filter chips */}
                <div className="flex gap-2 overflow-x-auto pb-3 mb-6" style={{ scrollbarWidth: "none" }}>
                    <button
                        onClick={() => setActiveColor(null)}
                        className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap border transition-all shrink-0 ${
                            !activeColor ? "bg-[#C4724F] border-[#C4724F] text-white" : "border-white/10 text-white/40 hover:text-white"
                        }`}
                    >
                        All
                    </button>
                    {Object.entries(COLOR_META).map(([key, meta]) => {
                        const isRecommended = recommendedColors.includes(key);
                        const isActive = activeColor === key;
                        return (
                            <button
                                key={key}
                                onClick={() => setActiveColor(isActive ? null : key)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap border transition-all shrink-0 ${
                                    isActive ? "bg-[#C4724F] border-[#C4724F] text-white"
                                    : isRecommended ? "border-[#C4724F]/50 text-[#C4724F] bg-[#C4724F]/10"
                                    : "border-white/10 text-white/40 hover:text-white"
                                }`}
                            >
                                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: meta.dot }} />
                                {meta.label}
                                {isRecommended && !isActive && (
                                    <span className="text-[8px] bg-[#C4724F] text-white px-1.5 py-0.5 rounded-full leading-none">
                                        FOR YOU
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Brand filter chips */}
                {brands.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-3 mb-8" style={{ scrollbarWidth: "none" }}>
                        <button
                            onClick={() => setBrandFilter(null)}
                            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all shrink-0 ${
                                !brandFilter ? "bg-white/10 border-white/20 text-white" : "border-white/10 text-white/30 hover:text-white"
                            }`}
                        >
                            All Brands
                        </button>
                        {brands.map(brand => (
                            <button
                                key={brand}
                                onClick={() => setBrandFilter(brandFilter === brand ? null : brand)}
                                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all shrink-0 ${
                                    brandFilter === brand
                                        ? "bg-white/10 border-white/20 text-white"
                                        : "border-white/10 text-white/30 hover:text-white"
                                }`}
                            >
                                {brand}
                            </button>
                        ))}
                    </div>
                )}

                {loading ? (
                    <div className="space-y-20">
                        {Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)}
                    </div>
                ) : (
                    <div className="space-y-24">
                        {menStructure.map((section) => {
                            const hasProducts = section.items.some(s => getProductsForStyle(section.slug, s.value).length > 0);
                            if (!hasProducts) return null;
                            return (
                                <motion.section key={section.category} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                                    <div className="flex items-end justify-between border-b border-white/5 pb-4 mb-10">
                                        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">{section.category}</h2>
                                    </div>
                                    <div className="space-y-14">
                                        {section.items.map((style) => {
                                            const styleProducts = getProductsForStyle(section.slug, style.value);
                                            if (styleProducts.length === 0) return null;
                                            return (
                                                <div key={style.value}>
                                                    <div className="flex items-center justify-between mb-5">
                                                        <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest flex items-center gap-2">
                                                            <span className="w-1 h-1 rounded-full bg-[#C4724F]" />
                                                            {style.label}
                                                        </h3>
                                                        <Link href={`/products/${section.slug}/${style.value}`} className="text-xs font-bold text-[#C4724F] hover:text-[#E8A87C] flex items-center gap-1 transition-colors group uppercase tracking-wider">
                                                            View all <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                                        </Link>
                                                    </div>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                                        {styleProducts.slice(0, 5).map((product) => (
                                                            <Link key={product.id} href={`/product/${encodeURIComponent(product.id)}`}>
                                                                <div className="group product-card cursor-pointer">
                                                                    <div className="aspect-[3/4] relative bg-[#111] overflow-hidden rounded-xl">
                                                                        {product.images?.[0] ? (
                                                                            <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                                                        ) : (
                                                                            <div className="w-full h-full flex items-center justify-center text-white/10 text-xs">No Image</div>
                                                                        )}
                                                                    </div>
                                                                    <div className="p-3">
                                                                        <h4 className="font-bold text-white text-sm truncate group-hover:text-[#E8A87C] transition-colors">{product.name}</h4>
                                                                        {product.brand && (
                                                                            <p className="text-white/30 text-[10px] mt-0.5">{product.brand}</p>
                                                                        )}
                                                                        <p className="text-white/40 text-xs mt-1">₹{product.price}</p>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.section>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}
