"use client";

import { useEffect, useState } from "react";
import { useSkinTone } from "@/context/skin-tone-context";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Navbar from "@/components/navbar";
import { motion } from "framer-motion";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
import Image from "next/image";

interface Product {
    id: string;
    name: string;
    price: number;
    images: string[];
    productType: string; // "topwear" | "bottomwear"
    baseColor: string;   // "cool" | "neutral" | "earthy" | "warm"
    // other fields...
}

const PRIORITY_MAP = {
    fair: ["cool", "neutral"],
    medium: ["neutral", "earthy"],
    tan: ["earthy", "warm"],
    deep: ["warm", "cool"]
};

export default function RecommendationsPage() {
    const { normalizedTone } = useSkinTone();
    const [loading, setLoading] = useState(true);
    const [topwear, setTopwear] = useState<Product[]>([]);

    useEffect(() => {
        const fetchAndSortProducts = async () => {
            if (!normalizedTone) {
                setLoading(false);
                return;
            }

            try {
                // Fetch all active products
                // In a real app with many products, we'd filter by color on the backend if possible,
                // but for complex priority sorting, client-side or cloud function is often easier for MVP.
                // Here we fetch active products.
                const productsRef = collection(db, "products");
                const q = query(productsRef, where("active", "==", true));
                const snapshot = await getDocs(q);

                const allProducts = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Product[];

                // Get Priority Array
                const priorities = PRIORITY_MAP[normalizedTone] || [];

                // Filter by type (Topwear) AND by allowed colors
                // The rules imply we should ONLY show items from the priority list
                const tops = allProducts.filter(p =>
                    p.productType === "topwear" &&
                    priorities.includes(p.baseColor)
                );

                // Sort Function
                const sortyByColorPriority = (a: Product, b: Product) => {
                    const indexA = priorities.indexOf(a.baseColor);
                    const indexB = priorities.indexOf(b.baseColor);
                    return indexA - indexB;
                };

                const sortedTops = tops.sort(sortyByColorPriority);

                setTopwear(sortedTops);

            } catch (error) {
                console.error("Error fetching recommendations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAndSortProducts();
    }, [normalizedTone]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (!normalizedTone) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="pt-32 px-4 text-center">
                    <h1 className="text-2xl font-bold mb-4">No Skin Tone Selected</h1>
                    <Link href="/shop-by-skin-tone" className="text-blue-600 underline">
                        Please select your skin tone first
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white pb-20">
            <Navbar />

            <div className="pt-32 px-4 md:px-8 max-w-7xl mx-auto">
                <Link href="/shop-by-skin-tone" className="inline-flex items-center text-sm text-gray-500 hover:text-black mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Change Skin Tone
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 text-center"
                >
                    <h1 className="text-3xl md:text-5xl font-black text-[#111] uppercase tracking-tighter mb-4">
                        Topwear curated for your skin tone
                    </h1>
                    <p className="text-gray-500 font-medium max-w-xl mx-auto">
                        Choose bottoms later using <span className="text-[#111] font-bold">Complete Your Look</span>
                    </p>
                </motion.div>

                {/* Topwear Section */}
                <section className="mb-16">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {topwear.length === 0 ? (
                            <p className="text-gray-400 col-span-full text-center">No curated topwear found for your profile.</p>
                        ) : (
                            topwear.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}

function ProductCard({ product }: { product: Product }) {
    return (
        <Link href={`/product/${product.id}?source=recommendations`} className="group block">
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 mb-4">
                {product.images?.[0] ? (
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        No Image
                    </div>
                )}
            </div>
            <h3 className="text-lg font-bold text-[#111] leading-tight group-hover:underline decoration-1 underline-offset-4">
                {product.name}
            </h3>
            <div className="flex items-center justify-between mt-1">
                <p className="text-gray-500 text-sm">{product.baseColor && `Color: ${product.baseColor}`}</p>
                <p className="font-medium text-[#111]">₹{product.price}</p>
            </div>
        </Link>
    );
}
