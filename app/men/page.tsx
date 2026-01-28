"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Navbar from "@/components/navbar";
import Link from "next/link";
import Image from "next/image";
import { Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface Product {
    id: string;
    name: string;
    price: number;
    images: string[];
    productType: string;
    productStyle: string;
    active: boolean;
}

// Define the menu structure to guide the page layout (matching Navbar)
const menStructure = [
    {
        category: "Topwear",
        slug: "topwear",
        items: [
            { label: "T-Shirt", value: "t-shirt" },
            { label: "Sweatshirt", value: "sweatshirt" },
            { label: "Jacket", value: "jacket" },
            { label: "Formal Shirt", value: "formal-shirt" },
            { label: "Casual Shirt", value: "casual-shirt" },
            { label: "Active T-Shirt", value: "active-t-shirt" }
        ]
    },
    {
        category: "Bottomwear",
        slug: "bottomwear",
        items: [
            { label: "Jeans", value: "jeans" },
            { label: "Trouser", value: "trouser" },
            { label: "Cotton Pant", value: "cotton-pant" },
            { label: "Joggers", value: "joggers" },
            { label: "Shorts", value: "shorts" },
            { label: "Track Pant", value: "track-pant" }
        ]
    },
    {
        category: "Footwear",
        slug: "footwear",
        items: [
            { label: "Casual Shoe", value: "casual-shoe" },
            { label: "Sneakers", value: "sneakers" },
            { label: "Formal Shoe", value: "formal-shoe" },
            { label: "Loafer", value: "loafer" },
            { label: "Sports Shoe", value: "sports-shoe" }
        ]
    }
];

export default function MenPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Fetch all active products
                // Ideally, we would filter by a gender field if it existed.
                // For now, we fetch all active products and filter by the known Men's categories client-side.
                const productsRef = collection(db, "products");
                const q = query(productsRef, where("active", "==", true));
                const querySnapshot = await getDocs(q);

                const fetchedProducts: Product[] = [];
                querySnapshot.forEach((doc) => {
                    fetchedProducts.push({ id: doc.id, ...doc.data() } as Product);
                });

                setProducts(fetchedProducts);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Helper to get products for a specific category and style
    const getProductsForStyle = (categorySlug: string, styleValue: string) => {
        return products.filter(p =>
            p.productType === categorySlug &&
            p.productStyle === styleValue
        );
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-white">
                <Navbar />
                <div className="flex justify-center items-center h-screen">
                    <Loader2 className="h-8 w-8 animate-spin text-[#111]" />
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <div className="pt-32 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
                <header className="mb-16 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black text-[#111] uppercase tracking-tighter mb-4"
                    >
                        Men's Collection
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-500 text-lg max-w-2xl mx-auto"
                    >
                        Explore our curated selection of essentials and statement pieces.
                    </motion.p>
                </header>

                <div className="space-y-24">
                    {menStructure.map((section, sectionIndex) => {
                        // Check if this entire category has any products
                        const hasProductsInCategory = section.items.some(style =>
                            getProductsForStyle(section.slug, style.value).length > 0
                        );

                        if (!hasProductsInCategory) return null;

                        return (
                            <motion.section
                                key={section.category}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="flex items-end justify-between border-b border-black/10 pb-4 mb-8">
                                    <h2 className="text-3xl md:text-4xl font-bold text-[#111] uppercase tracking-tight">
                                        {section.category}
                                    </h2>
                                    {/* Optional: 'View All' link for the category if you had a category page */}
                                </div>

                                <div className="space-y-12">
                                    {section.items.map((style) => {
                                        const styleProducts = getProductsForStyle(section.slug, style.value);

                                        if (styleProducts.length === 0) return null;

                                        return (
                                            <div key={style.value} className="space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-xl font-medium text-gray-900 flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 bg-[#111] rounded-full"></span>
                                                        {style.label}
                                                    </h3>
                                                    <Link
                                                        href={`/products/${section.slug}/${style.value}`}
                                                        className="text-sm font-medium text-gray-500 hover:text-[#111] flex items-center gap-1 transition-colors group"
                                                    >
                                                        View all <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                                    </Link>
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                                    {styleProducts.slice(0, 5).map((product) => (
                                                        <Link key={product.id} href={`/product/${encodeURIComponent(product.id)}`}>
                                                            <div className="group cursor-pointer">
                                                                <div className="aspect-[3/4] relative bg-gray-100 mb-3 overflow-hidden rounded-lg">
                                                                    {product.images && product.images.length > 0 ? (
                                                                        <Image
                                                                            src={product.images[0]}
                                                                            alt={product.name}
                                                                            fill
                                                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50 text-xs">
                                                                            No Image
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <h4 className="font-medium text-[#111] text-sm truncate">{product.name}</h4>
                                                                <p className="text-gray-500 text-xs mt-0.5">₹{product.price}</p>
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
            </div>
        </main>
    );
}
