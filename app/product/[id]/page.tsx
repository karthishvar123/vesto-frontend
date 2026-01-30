"use client";

import { useEffect, useState, use } from "react";
import { useSearchParams } from "next/navigation";
import { useWardrobe } from "@/context/wardrobe-context";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { Loader2, ArrowLeft, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
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
    affiliateLink?: string;
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState<string>("");
    const [isPaused, setIsPaused] = useState(false);

    const { addToWardrobe, removeFromWardrobe, isInWardrobe } = useWardrobe();

    // Hooks must be at top level
    const searchParams = useSearchParams();
    const source = searchParams.get('source');
    const sourceId = searchParams.get('sourceId');

    const resolvedParams = use(params);
    const productId = decodeURIComponent(resolvedParams.id);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const docRef = doc(db, "products", productId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data() as Product;
                    setProduct({ ...data, id: docSnap.id });
                    if (data.images && data.images.length > 0) {
                        setActiveImage(data.images[0]);
                    }
                } else {
                    console.log("No such product!");
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    // Auto-scroll carousel
    useEffect(() => {
        if (!product?.images || product.images.length <= 1 || isPaused) return;

        const interval = setInterval(() => {
            handleNext();
        }, 3000);

        return () => clearInterval(interval);
    }, [activeImage, isPaused, product]);

    const handleNext = () => {
        if (!product?.images) return;
        const currentIndex = product.images.indexOf(activeImage);
        const nextIndex = (currentIndex + 1) % product.images.length;
        setActiveImage(product.images[nextIndex]);
    };

    const handlePrev = () => {
        if (!product?.images) return;
        const currentIndex = product.images.indexOf(activeImage);
        const prevIndex = (currentIndex - 1 + product.images.length) % product.images.length;
        setActiveImage(product.images[prevIndex]);
    };

    let backLink = product ? `/products/${product.productType}/${product.productStyle}` : "/";
    let backLabel = product ? `Back to ${product.productStyle}` : "Back to Home";

    if (source === 'recommendations') {
        backLink = '/recommendations';
        backLabel = 'Back to Recommendations';
    } else if (source === 'complete-your-look' && sourceId) {
        backLink = `/complete-your-look/${sourceId}`;
        backLabel = 'Back to Complete Your Look';
    } else if (source === 'virtual-wardrobe') {
        backLink = '/virtual-wardrobe';
        backLabel = 'Back to Wardrobe';
    }

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
        <main className="min-h-screen bg-white">
            <Navbar />

            <div className="pt-32 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
                <Link href={backLink} className="inline-flex items-center text-sm text-gray-500 hover:text-black mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {backLabel}
                </Link>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Left Col: Images */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div
                            className="aspect-[3/4] relative bg-gray-50 rounded-2xl overflow-hidden group"
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={() => setIsPaused(false)}
                        >
                            {activeImage ? (
                                <Image
                                    src={activeImage}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-all duration-500"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    No Image
                                </div>
                            )}

                            {/* Carousel Controls */}
                            {product.images && product.images.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => { e.preventDefault(); handlePrev(); }}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.preventDefault(); handleNext(); }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbs */}
                        {product.images && product.images.length > 1 && (
                            <div className="flex gap-4 overflow-auto pb-2 scrollbar-none">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(img)}
                                        className={`relative w-24 aspect-[3/4] flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${activeImage === img ? 'border-black ring-1 ring-black/50' : 'border-transparent hover:border-gray-200'}`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.name} ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Col: Details */}
                    <div className="flex flex-col pt-4">
                        <div className="mb-2">
                            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">{product.productType} / {product.productStyle}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-[#111] mb-4 leading-tight">{product.name}</h1>
                        <p className="text-2xl font-medium text-[#111] mb-8">₹{product.price}</p>

                        <div className="prose prose-stone mb-8 text-gray-600 leading-relaxed">
                            <p>{product.description}</p>
                        </div>

                        {/* Additional Details Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-10 py-6 border-y border-gray-100">
                            <div>
                                <span className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Activity</span>
                                <span className="font-medium capitalize">{product.activityType || "Casual"}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Color</span>
                                <span className="font-medium capitalize">{product.baseColor || "Standard"}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {product.affiliateLink ? (
                                <a
                                    href={product.affiliateLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full"
                                >
                                    <Button className="w-full py-6 text-lg rounded-full bg-[#111] hover:bg-black/90 text-white" size="lg">
                                        Buy
                                    </Button>
                                </a>
                            ) : (
                                <Button className="w-full py-6 text-lg rounded-full bg-[#111] hover:bg-black/90 text-white" size="lg">
                                    Buy
                                </Button>
                            )}
                            <div className={`grid gap-4 ${product.productType?.toLowerCase() === 'footwear' ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                {product.productType?.toLowerCase() !== 'footwear' && (
                                    <Link href={`/complete-your-look/${product.id}`} className="w-full">
                                        <Button className="w-full py-6 rounded-full bg-[#111] hover:bg-black/90 text-white">
                                            Complete Your Look
                                        </Button>
                                    </Link>
                                )}
                                <Button
                                    onClick={() => {
                                        if (isInWardrobe(product.id)) {
                                            removeFromWardrobe(product.id);
                                        } else {
                                            addToWardrobe(product as any); // Cast to WardrobeItem compatible type
                                        }
                                    }}
                                    className={`w-full py-6 rounded-full transition-colors ${isInWardrobe(product.id)
                                        ? 'bg-gray-100 text-black hover:bg-gray-200'
                                        : 'bg-[#111] hover:bg-black/90 text-white'
                                        }`}
                                >
                                    {isInWardrobe(product.id) ? "Remove from Wardrobe" : "Add to Wardrobe"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
