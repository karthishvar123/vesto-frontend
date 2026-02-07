"use client";

import { useEffect, useState, use } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, query, collection, where, getDocs } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { Loader2, ArrowLeft, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/protected-route";

interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    images: string[];
    productType: string;
    productStyle: string;
    baseColor: string;
    activityType: string;
    colorFamily?: string;
}

export default function CompleteYourLookPage({ params }: { params: Promise<{ productId: string }> }) {
    const [product, setProduct] = useState<Product | null>(null);
    // State to hold categorized recommendations
    const [categorizedRecs, setCategorizedRecs] = useState<{ [key: string]: Product[] }>({});
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState<string>("");

    const resolvedParams = use(params);
    const productId = decodeURIComponent(resolvedParams.productId);

    // Mapping Rules
    const getNeededItems = (p: Product) => {
        const type = p.productType.toLowerCase();
        const style = p.productStyle.toLowerCase();

        // Rules based on User Request
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
        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Fetch main product
                const docRef = doc(db, "products", productId);
                const docSnap = await getDoc(docRef);

                if (!docSnap.exists()) {
                    setProduct(null);
                    setLoading(false);
                    return;
                }

                const currentProduct = { id: docSnap.id, ...docSnap.data() } as Product;
                setProduct(currentProduct);
                if (currentProduct.images?.length > 0) setActiveImage(currentProduct.images[0]);

                // 2. Determine needed items
                const neededConfig = getNeededItems(currentProduct);
                if (!neededConfig) {
                    setLoading(false);
                    return;
                }

                // 3. Fetch all candidates to allow cross-activity matching (e.g. Smart Casual)
                // Rely on style mapping for filtering.
                const q = query(collection(db, "products"));

                const querySnapshot = await getDocs(q);
                const candidates = querySnapshot.docs
                    .map((d: any) => ({ id: d.id, ...d.data() } as Product))
                    .filter((p: Product) => p.id !== currentProduct.id); // Exclude self

                // 4. Group matches by category
                const newRecs: { [key: string]: Product[] } = {};

                // Color Rules
                const getAllowedColors = (baseColor: string) => {
                    const bc = baseColor?.toLowerCase() || 'neutral'; // Fallback
                    if (bc === 'neutral') return ['neutral', 'earthy', 'cool', 'warm'];
                    return [bc, 'neutral'];
                };

                const allowedColors = getAllowedColors(currentProduct.baseColor);

                // Helper to find all matches
                const findMatches = (type: string, allowedStyles: string[]) => {
                    return candidates.filter((c: Product) =>
                        c.productType.toLowerCase() === type &&
                        allowedStyles.includes(c.productStyle.toLowerCase()) &&
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
                console.error("Error in CYL logic:", error);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchData();
        }
    }, [productId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
                <Link href="/">
                    <Button>Go Home</Button>
                </Link>
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <main className="min-h-screen bg-white text-[#111]">
                <Navbar />

                <div className="pt-32 pb-24 px-4 md:px-8 max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="max-w-3xl mb-16">
                        <Link href={`/product/${product.id}`} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors mb-6 group">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Product
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">Complete Your Look.</h1>
                        <p className="text-lg text-gray-500 font-light">
                            Curated styling options designed to perfectly complement your <span className="font-medium text-black">{product.name}</span>.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-y-12 lg:gap-x-16">
                        {/* Main Product (Hero) - Spans 3 cols (Sticky) */}
                        <div className="lg:col-span-4 xl:col-span-3">
                            <div className="sticky top-32 space-y-4">
                                <div className="group relative aspect-[3/4] bg-gray-100 rounded-[2rem] overflow-hidden shadow-sm">
                                    <div className="absolute top-4 left-4 bg-black/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-full z-10 uppercase tracking-wider shadow-lg">
                                        Base Item
                                    </div>
                                    {activeImage ? (
                                        <Image
                                            src={activeImage}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : null}
                                </div>
                                <div className="px-1">
                                    <h3 className="text-lg font-semibold tracking-tight leading-tight mb-1">{product.name}</h3>
                                    <p className="text-gray-500">₹{product.price}</p>
                                </div>
                            </div>
                        </div>

                        {/* Recommendations - Spans 9 cols */}
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
                                                <Link href={`/product/${item.id}?source=complete-your-look&sourceId=${product.id}`} key={item.id} className="group block space-y-4">
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
                                                        {/* Interactive overlay */}
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/2 transition-colors" />
                                                        <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                                            <div className="bg-white p-2 rounded-full shadow-lg">
                                                                <ArrowLeft className="w-4 h-4 rotate-180" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1 px-1">
                                                        <h4 className="font-medium text-base text-gray-900 leading-snug group-hover:underline decoration-1 underline-offset-4">{item.name}</h4>
                                                        <p className="text-gray-500 text-sm">₹{item.price}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-32 px-4 text-center bg-gray-50 rounded-[3rem] border border-gray-100 dashed border-2">
                                    <div className="bg-white p-6 rounded-full shadow-lg mb-8">
                                        <SearchX className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#111] mb-2">No Matches Found</h3>
                                    <p className="text-gray-500 max-w-sm leading-relaxed">
                                        We couldn't find the perfect items to pair with this look right now. Our catalogue is constantly updating.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </ProtectedRoute>
    );
}
