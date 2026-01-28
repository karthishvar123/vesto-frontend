"use client";

import { useEffect, useState, use } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, query, collection, where, getDocs } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

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
                    { type: 'bottomwear', styles: ['jeans', 'joggers', 'cotton-pant'], label: 'Recommended Bottomwear' },
                    { type: 'footwear', styles: ['sneakers'], label: 'Recommended Footwear' }
                ];
            }
            if (style === 'casual-shirt') {
                return [
                    { type: 'bottomwear', styles: ['jeans', 'trouser'], label: 'Recommended Bottomwear' },
                    { type: 'footwear', styles: ['sneakers', 'loafer'], label: 'Recommended Footwear' }
                ];
            }
            if (style === 'formal-shirt') {
                return [
                    { type: 'bottomwear', styles: ['trouser'], label: 'Recommended Bottomwear' },
                    { type: 'footwear', styles: ['formal-shoe', 'loafer'], label: 'Recommended Footwear' }
                ];
            }
            if (style === 'active-t-shirt') {
                return [
                    { type: 'bottomwear', styles: ['track-pant', 'joggers', 'shorts'], label: 'Recommended Bottomwear' },
                    { type: 'footwear', styles: ['sports-shoe'], label: 'Recommended Footwear' }
                ];
            }
            if (style === 'jacket') {
                return [
                    { type: 'topwear', styles: ['t-shirt', 'casual-shirt'], isInner: true, label: 'Recommended Inner Wear' },
                    { type: 'bottomwear', styles: ['jeans', 'cotton-pant', 'trouser'], label: 'Recommended Bottomwear' },
                    { type: 'footwear', styles: ['casual-shoe'], label: 'Recommended Footwear' }
                ];
            }
        }

        if (type === 'bottomwear') {
            if (['jeans'].includes(style)) {
                return [
                    { type: 'topwear', styles: ['t-shirt', 'casual-shirt', 'sweatshirt'], label: 'Recommended Topwear' },
                    { type: 'footwear', styles: ['sneakers'], label: 'Recommended Footwear' }
                ];
            }
            if (style === 'cotton-pant') {
                return [
                    { type: 'topwear', styles: ['t-shirt', 'jacket'], label: 'Recommended Topwear' },
                    { type: 'footwear', styles: ['casual-shoe'], label: 'Recommended Footwear' }
                ];
            }
            if (style === 'trouser') {
                return [
                    { type: 'topwear', styles: ['formal-shirt', 'casual-shirt', 'jacket'], label: 'Recommended Topwear' },
                    { type: 'footwear', styles: ['formal-shoe', 'loafer', 'casual-shoe'], label: 'Recommended Footwear' }
                ];
            }
            if (style === 'joggers') {
                return [
                    { type: 'topwear', styles: ['t-shirt', 'sweatshirt', 'active-t-shirt'], label: 'Recommended Topwear' },
                    { type: 'footwear', styles: ['sneakers', 'sports-shoe'], label: 'Recommended Footwear' }
                ];
            }
            if (style === 'shorts') {
                return [
                    { type: 'topwear', styles: ['t-shirt', 'active-t-shirt'], label: 'Recommended Topwear' },
                    { type: 'footwear', styles: ['sneakers', 'sports-shoe'], label: 'Recommended Footwear' }
                ];
            }
            if (style === 'track-pant') {
                return [
                    { type: 'topwear', styles: ['active-t-shirt'], label: 'Recommended Topwear' },
                    { type: 'footwear', styles: ['sports-shoe'], label: 'Recommended Footwear' }
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

    const totalRecommendationPrice = Object.values(categorizedRecs).flat().reduce((acc, curr) => acc + curr.price, 0);

    return (
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
                                        <h3 className="text-2xl font-light tracking-tight">{category}</h3>
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
                            <div className="flex flex-col items-center justify-center text-center p-20 bg-gray-50 rounded-[2rem] border border-gray-100">
                                <h3 className="text-xl font-medium text-gray-900 mb-2">No Matches Found</h3>
                                <p className="text-gray-500 max-w-sm">We couldn't find the perfect items to pair with this look right now. Our catalogue is constantly updating.</p>
                            </div>
                        )}
                    </div>
                </div>

                {Object.keys(categorizedRecs).length > 0 && (
                    <div className="fixed bottom-8 left-0 right-0 max-w-none flex justify-center z-50 pointer-events-none px-4">
                        <div className="pointer-events-auto bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-full p-2 pl-6 pr-2 flex items-center gap-6 transition-transform hover:scale-[1.02] duration-300">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Outfit Value</span>
                                <span className="font-semibold text-lg">₹{product.price + totalRecommendationPrice}</span>
                            </div>
                            <Button className="rounded-full bg-black hover:bg-black/90 text-white px-8 py-6 h-auto text-base font-medium shadow-lg hover:shadow-xl transition-all">
                                Add Complete Look to Cart
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
