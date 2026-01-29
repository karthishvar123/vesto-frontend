"use client";

import { useEffect, useState, use } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { Loader2, ChevronDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Product {
    id: string;
    name: string;
    price: number;
    images: string[];
    productType: string;
    productStyle: string;
    baseColor?: string;
    colorFamily?: string;
    createdAt?: any; // Timestamp
}

const SORT_OPTIONS = [
    { label: "Newest", value: "newest" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
];

export default function ProductListingPage({ params }: { params: Promise<{ category: string; style: string }> }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Sort State
    const [sortBy, setSortBy] = useState("newest");

    // React 19 / Next.js 15 param unwrapping
    const resolvedParams = use(params);
    const category = resolvedParams.category;
    const style = resolvedParams.style;

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const productsRef = collection(db, "products");
                const q = query(
                    productsRef,
                    where("productType", "==", category),
                    where("productStyle", "==", style),
                    where("active", "==", true)
                );

                const querySnapshot = await getDocs(q);
                const fetchedProducts: Product[] = [];
                querySnapshot.forEach((doc) => {
                    fetchedProducts.push({ id: doc.id, ...doc.data() } as Product);
                });
                setProducts(fetchedProducts);
                setFilteredProducts(fetchedProducts);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        if (category && style) {
            fetchProducts();
        }
    }, [category, style]);

    useEffect(() => {
        const result = [...products];

        // Apply Sort
        if (sortBy === "price-asc") {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price-desc") {
            result.sort((a, b) => b.price - a.price);
        } else if (sortBy === "newest") {
            // Assuming createdAt exists, otherwise stable sort
            result.sort((a, b) => {
                const timeA = a.createdAt?.seconds || 0;
                const timeB = b.createdAt?.seconds || 0;
                return timeB - timeA;
            });
        }

        setFilteredProducts(result);
    }, [products, sortBy]);

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <div className="pt-32 pb-16 px-4 md:px-8 max-w-[1600px] mx-auto">
                <div className="flex flex-col md:flex-row items-baseline justify-between mb-8 pb-6 border-b border-gray-100">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-[#111] uppercase tracking-tighter mb-2">
                            {style.replace(/-/g, ' ')}
                        </h1>
                        <p className="text-gray-500 capitalize">{category} • {filteredProducts.length} items</p>
                    </div>

                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        {/* Sort Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50 min-w-[160px] justify-between">
                                    <span>Sort: {SORT_OPTIONS.find(o => o.value === sortBy)?.label}</span>
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[160px]">
                                {SORT_OPTIONS.map((option) => (
                                    <DropdownMenuItem
                                        key={option.value}
                                        onClick={() => setSortBy(option.value)}
                                        className={sortBy === option.value ? "font-bold bg-gray-50" : ""}
                                    >
                                        {option.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="flex gap-12">
                    {/* Product Grid - Full Width */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="flex justify-center py-40">
                                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center py-40 text-gray-500">
                                <p className="text-xl font-medium text-[#111] mb-2">No products found</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-10 gap-x-6">
                                {filteredProducts.map((product) => (
                                    <Link key={product.id} href={`/product/${encodeURIComponent(product.id)}`}>
                                        <div className="group cursor-pointer">
                                            <div className="aspect-[3/4] relative bg-gray-100 mb-4 overflow-hidden rounded-xl">
                                                {product.images && product.images.length > 0 ? (
                                                    <Image
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                                                        No Image
                                                    </div>
                                                )}
                                                {/* Optional tag */}
                                                {(product.price < 500) && ( // Example conditional tag
                                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                                        Best Value
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className="font-bold text-[#111] text-base mb-1 truncate">{product.name}</h3>
                                            <div className="flex items-center gap-2">
                                                <p className="text-[#111] text-sm font-medium">₹{product.price}</p>
                                                {product.colorFamily && (
                                                    <p className="text-gray-400 text-xs capitalize">• {product.colorFamily}</p>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

