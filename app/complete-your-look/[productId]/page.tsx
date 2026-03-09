"use client";

import { useEffect, useState, use } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, query, collection, where, getDocs } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { ArrowLeft, SearchX, ArrowRight } from "lucide-react";
import ProtectedRoute from "@/components/protected-route";
import { getNeededItems, getAllowedColors } from "@/lib/styling-rules";

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

function ProductSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="aspect-[3/4] skeleton rounded-2xl" />
            <div className="h-4 skeleton rounded w-3/4" />
            <div className="h-3 skeleton rounded w-1/3" />
        </div>
    );
}

export default function CompleteYourLookPage({ params }: { params: Promise<{ productId: string }> }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [categorizedRecs, setCategorizedRecs] = useState<{ [key: string]: Product[] }>({});
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState<string>("");

    const resolvedParams = use(params);
    const productId = decodeURIComponent(resolvedParams.productId);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
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

                const neededConfig = getNeededItems(currentProduct.productType, currentProduct.productStyle);
                if (!neededConfig) { setLoading(false); return; }

                const q = query(collection(db, "products"), where("active", "==", true));
                const querySnapshot = await getDocs(q);
                const candidates = querySnapshot.docs
                    .map((d: any) => ({ id: d.id, ...d.data() } as Product))
                    .filter((p: Product) => p.id !== currentProduct.id);

                const newRecs: { [key: string]: Product[] } = {};
                const allowedColors = getAllowedColors(currentProduct.baseColor);

                const findMatches = (type: string, allowedStyles: string[]) =>
                    candidates.filter((c: Product) =>
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
                console.error("Error in CYL logic:", error);
            } finally {
                setLoading(false);
            }
        };

        if (productId) fetchData();
    }, [productId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0A0A]">
                <Navbar />
                <div className="pt-32 pb-24 px-4 md:px-8 max-w-7xl mx-auto">
                    <div className="h-8 skeleton rounded w-48 mb-16" />
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
                <h1 className="text-2xl font-bold text-white mb-4">Product Not Found</h1>
                <Link href="/" className="text-[#C4724F] underline">Go Home</Link>
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <main className="min-h-screen bg-[#0A0A0A] text-white">
                <Navbar />

                {/* Ambient glow */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-[#C4724F]/4 blur-[120px]" />
                </div>

                <div className="relative z-10 pt-32 pb-24 px-4 md:px-8 max-w-7xl mx-auto">
                    <div className="max-w-3xl mb-16">
                        <Link href={`/product/${product.id}`} className="inline-flex items-center text-sm font-medium text-white/40 hover:text-white transition-colors mb-6 group">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Product
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">Complete Your Look.</h1>
                        <p className="text-lg text-white/40">
                            Curated styling options to complement your{" "}
                            <span className="font-bold text-[#E8A87C]">{product.name}</span>.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-y-12 lg:gap-x-16">
                        {/* Main Product — sticky */}
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
                                    {activeImage && (
                                        <Image src={activeImage} alt={product.name} fill className="object-cover" />
                                    )}
                                </div>
                                <div className="px-1">
                                    <h3 className="text-base font-bold text-white leading-tight mb-1">{product.name}</h3>
                                    <p className="text-[#E8A87C] font-bold">₹{product.price}</p>
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
                                                <Link href={`/product/${item.id}?source=complete-your-look&sourceId=${product.id}`} key={item.id} className="group block">
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
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                                        <div className="absolute bottom-3 right-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                                            <div className="bg-[#C4724F] p-2 rounded-full">
                                                                <ArrowRight className="w-3 h-3 text-white" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="p-3">
                                                        <h4 className="font-bold text-white text-sm leading-snug group-hover:text-[#E8A87C] transition-colors">{item.name}</h4>
                                                        <p className="text-white/40 text-xs mt-0.5">₹{item.price}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-32 px-4 text-center rounded-3xl border-2 border-dashed border-white/5">
                                    <div className="bg-white/5 p-6 rounded-full mb-8">
                                        <SearchX className="w-10 h-10 text-white/20" />
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-2">No Matches Found</h3>
                                    <p className="text-white/40 max-w-sm leading-relaxed">
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
