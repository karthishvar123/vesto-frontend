"use client";

import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, CheckCircle, Loader2, ImagePlus } from "lucide-react";
import Image from "next/image";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { useWardrobe } from "@/context/wardrobe-context";
import { useAuth } from "@/context/auth-context";

// ─── Color detection ────────────────────────────────────────────────────────

interface DetectedColor {
    name: string;           // display: "Navy Blue" | "Multi-colour"
    baseColor: string;      // pairing: "cool" | "warm" | "earthy" | "neutral"
    hex: string;            // swatch preview
    isMultiColour?: boolean;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }
    return [h * 360, s * 100, l * 100];
}

// ── Admin-aligned colour palette ─────────────────────────────
// Mirrors the exact colour names & hex values used in the admin
// panel's Color Family picker, grouped by baseColor.

interface PaletteEntry {
    name: string;
    baseColor: string;
    hex: string;
    hMin: number; hMax: number;
    lMin?: number; lMax?: number;
    sMin?: number;
}

// Chromatic entries — matched by hue range (and optionally lightness/sat)
const CHROMATIC_PALETTE: PaletteEntry[] = [
    // ── Warm ──────────────────────────────────────────────────
    { name: "Maroon",     baseColor: "warm", hex: "#800000", hMin: 0,   hMax: 10,  lMin: 0,  lMax: 28 },
    { name: "Burgundy",   baseColor: "warm", hex: "#800020", hMin: 0,   hMax: 10,  lMin: 28, lMax: 45 },
    { name: "Rust",       baseColor: "warm", hex: "#B7410E", hMin: 10,  hMax: 25,  lMin: 0,  lMax: 42 },
    { name: "Terracotta", baseColor: "warm", hex: "#E2725B", hMin: 10,  hMax: 25,  lMin: 42, lMax: 65 },
    { name: "Brick",      baseColor: "warm", hex: "#CB4154", hMin: 335, hMax: 360, lMin: 0,  lMax: 45 },
    { name: "Wine",       baseColor: "warm", hex: "#722F37", hMin: 340, hMax: 360, lMin: 0,  lMax: 32 },
    { name: "Paprika",    baseColor: "warm", hex: "#8D021F", hMin: 350, hMax: 360, lMin: 0,  lMax: 30 },
    { name: "Amber",      baseColor: "warm", hex: "#FFBF00", hMin: 38,  hMax: 50,  lMin: 55, lMax: 100 },
    { name: "Saffron",    baseColor: "warm", hex: "#F4C430", hMin: 44,  hMax: 56,  lMin: 50, lMax: 100 },
    { name: "Mustard",    baseColor: "warm", hex: "#FFDB58", hMin: 44,  hMax: 58,  lMin: 40, lMax: 70 },
    { name: "Ochre",      baseColor: "warm", hex: "#CC7722", hMin: 30,  hMax: 44,  lMin: 32, lMax: 56 },
    { name: "Copper",     baseColor: "warm", hex: "#B87333", hMin: 25,  hMax: 35,  lMin: 38, lMax: 54 },
    // ── Earthy ────────────────────────────────────────────────
    { name: "Latte",      baseColor: "earthy", hex: "#C5A582", hMin: 28, hMax: 38, lMin: 58, lMax: 75, sMin: 10 },
    { name: "Camel",      baseColor: "earthy", hex: "#C19A6B", hMin: 28, hMax: 38, lMin: 50, lMax: 62 },
    { name: "Tan",        baseColor: "earthy", hex: "#D2B48C", hMin: 30, hMax: 40, lMin: 60, lMax: 78 },
    { name: "Cork",       baseColor: "earthy", hex: "#987654", hMin: 28, hMax: 36, lMin: 40, lMax: 52 },
    { name: "Walnut",     baseColor: "earthy", hex: "#773F1A", hMin: 20, hMax: 30, lMin: 24, lMax: 38 },
    { name: "Chocolate",  baseColor: "earthy", hex: "#D2691E", hMin: 20, hMax: 30, lMin: 40, lMax: 58 },
    { name: "Coffee",     baseColor: "earthy", hex: "#6F4E37", hMin: 18, hMax: 28, lMin: 26, lMax: 38 },
    { name: "Mocha",      baseColor: "earthy", hex: "#967969", hMin: 18, hMax: 28, lMin: 40, lMax: 56 },
    { name: "Brown",      baseColor: "earthy", hex: "#A52A2A", hMin: 0,  hMax: 18, lMin: 30, lMax: 46 },
    { name: "Clay",       baseColor: "earthy", hex: "#B66A50", hMin: 12, hMax: 22, lMin: 44, lMax: 58 },
    { name: "Soil",       baseColor: "earthy", hex: "#4E342E", hMin: 5,  hMax: 18, lMin: 16, lMax: 28 },
    { name: "Bark",       baseColor: "earthy", hex: "#3C2825", hMin: 5,  hMax: 16, lMin: 10, lMax: 22 },
    { name: "Beige",      baseColor: "earthy", hex: "#F5F5DC", hMin: 54, hMax: 68, lMin: 80, lMax: 100, sMin: 10 },
    { name: "Khaki",      baseColor: "earthy", hex: "#F0E68C", hMin: 54, hMax: 70, lMin: 64, lMax: 82 },
    { name: "Olive",      baseColor: "earthy", hex: "#808000", hMin: 56, hMax: 72, lMin: 0,  lMax: 40 },
    // ── Cool ──────────────────────────────────────────────────
    { name: "Midnight Blue", baseColor: "cool", hex: "#191970", hMin: 220, hMax: 250, lMin: 0,  lMax: 22 },
    { name: "Navy",       baseColor: "cool", hex: "#000080", hMin: 220, hMax: 250, lMin: 0,  lMax: 18 },
    { name: "Indigo",     baseColor: "cool", hex: "#4B0082", hMin: 255, hMax: 285, lMin: 0,  lMax: 28 },
    { name: "Slate Blue", baseColor: "cool", hex: "#6A5ACD", hMin: 240, hMax: 260, lMin: 35, lMax: 58 },
    { name: "Denim",      baseColor: "cool", hex: "#1560BD", hMin: 210, hMax: 225, lMin: 22, lMax: 42 },
    { name: "Blue",       baseColor: "cool", hex: "#0000FF", hMin: 210, hMax: 250, lMin: 38, lMax: 65 },
    { name: "Steel Blue", baseColor: "cool", hex: "#4682B4", hMin: 200, hMax: 220, lMin: 38, lMax: 55 },
    { name: "Sky Blue",   baseColor: "cool", hex: "#87CEEB", hMin: 195, hMax: 215, lMin: 60, lMax: 82 },
    { name: "Ice Blue",   baseColor: "cool", hex: "#AFDBF5", hMin: 198, hMax: 214, lMin: 78, lMax: 96 },
    { name: "Light Blue", baseColor: "cool", hex: "#ADD8E6", hMin: 190, hMax: 210, lMin: 70, lMax: 90 },
    { name: "Cyan",       baseColor: "cool", hex: "#00FFFF", hMin: 175, hMax: 195, lMin: 70, lMax: 100 },
    { name: "Teal",       baseColor: "cool", hex: "#008080", hMin: 170, hMax: 192, lMin: 20, lMax: 45 },
];

// Achromatic entries — matched by lightness only (when saturation < 15)
const ACHROMATIC_PALETTE: { name: string; baseColor: string; hex: string; lMin: number; lMax: number }[] = [
    { name: "Black",     baseColor: "neutral", hex: "#1a1a1a", lMin: 0,  lMax: 18 },
    { name: "Charcoal",  baseColor: "neutral", hex: "#36454F", lMin: 18, lMax: 30 },
    { name: "Smoke",     baseColor: "neutral", hex: "#848884", lMin: 30, lMax: 42 },
    { name: "Grey",      baseColor: "neutral", hex: "#808080", lMin: 42, lMax: 58 },
    { name: "Stone",     baseColor: "neutral", hex: "#888C8D", lMin: 58, lMax: 68 },
    { name: "Ash",       baseColor: "neutral", hex: "#B2BEB5", lMin: 68, lMax: 78 },
    { name: "Pebble",    baseColor: "neutral", hex: "#C0C0C0", lMin: 78, lMax: 86 },
    { name: "Silver",    baseColor: "neutral", hex: "#C0C0C0", lMin: 86, lMax: 92 },
    { name: "Off-White", baseColor: "neutral", hex: "#F8F8F8", lMin: 92, lMax: 98 },
    { name: "White",     baseColor: "neutral", hex: "#FFFFFF", lMin: 98, lMax: 101 },
];

// Taupes / near-neutral chromatics (low-sat warm-ish) → also neutral
const NEAR_NEUTRAL_PALETTE: { name: string; baseColor: string; hex: string; hMin: number; hMax: number; sMin: number; sMax: number; lMin: number; lMax: number }[] = [
    { name: "Taupe",    baseColor: "neutral", hex: "#483C32", hMin: 20,  hMax: 40,  sMin: 5, sMax: 18, lMin: 0,  lMax: 35 },
    { name: "Ecru",     baseColor: "neutral", hex: "#C2B280", hMin: 38,  hMax: 52,  sMin: 5, sMax: 22, lMin: 55, lMax: 78 },
    { name: "Sand",     baseColor: "neutral", hex: "#C2B280", hMin: 38,  hMax: 52,  sMin: 8, sMax: 25, lMin: 62, lMax: 82 },
    { name: "Cream",    baseColor: "neutral", hex: "#FFFDD0", hMin: 50,  hMax: 70,  sMin: 5, sMax: 25, lMin: 86, lMax: 100 },
    { name: "Ivory",    baseColor: "neutral", hex: "#FFFFF0", hMin: 50,  hMax: 70,  sMin: 3, sMax: 18, lMin: 92, lMax: 100 },
    { name: "Mushroom", baseColor: "neutral", hex: "#BE9E8B", hMin: 14,  hMax: 28,  sMin: 8, sMax: 20, lMin: 52, lMax: 70 },
];

function detectAdminColor(h: number, s: number, l: number, hex: string): DetectedColor {
    // 1. Achromatic (black / grey / white family)
    if (s < 12) {
        const match = ACHROMATIC_PALETTE.find(e => l >= e.lMin && l < e.lMax);
        if (match) return { name: match.name, baseColor: match.baseColor, hex: match.hex };
    }

    // 2. Near-neutral (low-sat warm/yellow tones → neutral)
    if (s < 26) {
        const match = NEAR_NEUTRAL_PALETTE.find(e =>
            h >= e.hMin && h < e.hMax && s >= e.sMin && s <= e.sMax && l >= e.lMin && l < e.lMax
        );
        if (match) return { name: match.name, baseColor: match.baseColor, hex: match.hex };
    }

    // 3. Chromatic — find closest entry by hue+lightness
    const candidates = CHROMATIC_PALETTE.filter(e => {
        const hOk = e.hMax > e.hMin
            ? h >= e.hMin && h < e.hMax
            : h >= e.hMin || h < e.hMax; // wraps around 360
        const lOk = e.lMin !== undefined ? l >= e.lMin! && l < e.lMax! : true;
        const sOk = e.sMin !== undefined ? s >= e.sMin! : true;
        return hOk && lOk && sOk;
    });
    if (candidates.length > 0) {
        const best = candidates[0]; // first match wins (order matters)
        return { name: best.name, baseColor: best.baseColor, hex: best.hex };
    }

    // Fallback — use raw hex and guess base colour from hue
    let baseColor = "neutral";
    if (h < 50 || h >= 330) baseColor = "warm";
    else if (h < 100) baseColor = "earthy";
    else if (h < 195) baseColor = "earthy";
    else baseColor = "cool";
    return { name: "Unknown", baseColor, hex };
}

function detectDominantColor(canvas: HTMLCanvasElement): DetectedColor {
    const ctx = canvas.getContext("2d");
    if (!ctx) return { name: "Black", baseColor: "neutral", hex: "#1a1a1a" };

    const { width, height } = canvas;
    const step = Math.max(1, Math.floor(Math.min(width, height) / 30));

    interface PixelInfo { r: number; g: number; b: number; h: number; s: number; l: number; }
    const pixels: PixelInfo[] = [];

    for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
            const px = ctx.getImageData(x, y, 1, 1).data;
            if (px[0] > 230 && px[1] > 230 && px[2] > 230) continue; // skip near-white bg
            if (px[3] < 50) continue; // skip transparent
            const [h, s, l] = rgbToHsl(px[0], px[1], px[2]);
            pixels.push({ r: px[0], g: px[1], b: px[2], h, s, l });
        }
    }

    if (pixels.length === 0) return { name: "White", baseColor: "neutral", hex: "#FFFFFF" };

    const chromatic = pixels.filter(p => p.s > 15);
    const total = pixels.length;

    // ── Achromatic garment (< 15% chromatic pixels) ──────────
    if (chromatic.length < total * 0.15) {
        const avgL = pixels.reduce((s, p) => s + p.l, 0) / total;
        const avgS = pixels.reduce((s, p) => s + p.s, 0) / total;
        const avgH = pixels.reduce((s, p) => s + p.h, 0) / total;
        const match = ACHROMATIC_PALETTE.find(e => avgL >= e.lMin && avgL < e.lMax);
        if (match) return { name: match.name, baseColor: match.baseColor, hex: match.hex };
        // Low-sat but slightly chromatic → near-neutral
        const nn = NEAR_NEUTRAL_PALETTE.find(e =>
            avgH >= e.hMin && avgH < e.hMax && avgS >= e.sMin && avgS <= e.sMax && avgL >= e.lMin && avgL < e.lMax
        );
        if (nn) return { name: nn.name, baseColor: nn.baseColor, hex: nn.hex };
        return { name: "Grey", baseColor: "neutral", hex: "#808080" };
    }

    // ── Hue histogram: 12 buckets × 30° ─────────────────────
    const BUCKETS = 12;
    const buckets = new Array(BUCKETS).fill(0);
    chromatic.forEach(p => { buckets[Math.floor(p.h / 30) % BUCKETS]++; });

    const maxVotes = Math.max(...buckets);
    const dominant = buckets.indexOf(maxVotes);
    const dominance = maxVotes / chromatic.length;

    // ── Multi-colour: no bucket clearly dominates (< 40%) ───
    if (dominance < 0.40) {
        return { name: "Multicolour", baseColor: "multicolour", hex: "#888888", isMultiColour: true };
    }

    // ── Representative pixel for dominant bucket ─────────────
    const bucketPixels = chromatic.filter(p => Math.floor(p.h / 30) % BUCKETS === dominant);
    const avgR = Math.round(bucketPixels.reduce((s, p) => s + p.r, 0) / bucketPixels.length);
    const avgG = Math.round(bucketPixels.reduce((s, p) => s + p.g, 0) / bucketPixels.length);
    const avgB = Math.round(bucketPixels.reduce((s, p) => s + p.b, 0) / bucketPixels.length);
    const repHex = `#${avgR.toString(16).padStart(2, "0")}${avgG.toString(16).padStart(2, "0")}${avgB.toString(16).padStart(2, "0")}`;
    const [domH, domS, domL] = rgbToHsl(avgR, avgG, avgB);

    return detectAdminColor(domH, domS, domL, repHex);
}


async function extractColor(file: File): Promise<DetectedColor> {
    return new Promise((resolve) => {
        const img = document.createElement("img");
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const scale = Math.min(1, 200 / Math.max(img.width, img.height));
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(detectDominantColor(canvas));
        };
        img.src = URL.createObjectURL(file);
    });
}

// ─── Type/Style data ─────────────────────────────────────────────────────────

const TYPE_OPTIONS = [
    { label: "Topwear", value: "topwear", emoji: "👕" },
    { label: "Bottomwear", value: "bottomwear", emoji: "👖" },
    { label: "Footwear", value: "footwear", emoji: "👟" },
];

const STYLE_OPTIONS: Record<string, { label: string; value: string }[]> = {
    topwear: [
        { label: "T-Shirt", value: "t-shirt" },
        { label: "Casual Shirt", value: "casual-shirt" },
        { label: "Formal Shirt", value: "formal-shirt" },
        { label: "Sweatshirt", value: "sweatshirt" },
        { label: "Jacket", value: "jacket" },
        { label: "Active T-Shirt", value: "active-t-shirt" },
    ],
    bottomwear: [
        { label: "Jeans", value: "jeans" },
        { label: "Trouser", value: "trouser" },
        { label: "Cotton Pant", value: "cotton-pant" },
        { label: "Joggers", value: "joggers" },
        { label: "Shorts", value: "shorts" },
        { label: "Track Pant", value: "track-pant" },
    ],
    footwear: [
        { label: "Sneakers", value: "sneakers" },
        { label: "Casual Shoe", value: "casual-shoe" },
        { label: "Formal Shoe", value: "formal-shoe" },
        { label: "Loafer", value: "loafer" },
        { label: "Sports Shoe", value: "sports-shoe" },
    ],
};

// ─── Component ───────────────────────────────────────────────────────────────

interface Props {
    open: boolean;
    onClose: () => void;
}

type Screen = "drop" | "classify" | "saving" | "done";

export default function UploadClothesModal({ open, onClose }: Props) {
    const { addToWardrobe } = useWardrobe();
    const { user } = useAuth();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [screen, setScreen] = useState<Screen>("drop");
    const [dragging, setDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [detectedColor, setDetectedColor] = useState<DetectedColor | null>(null);
    const [productType, setProductType] = useState<string>("");
    const [productStyle, setProductStyle] = useState<string>("");
    const [activityType, setActivityType] = useState<string>("");
    const [itemName, setItemName] = useState<string>("");
    const [error, setError] = useState<string>("");

    const reset = () => {
        setScreen("drop");
        setPreview(null);
        setFile(null);
        setDetectedColor(null);
        setProductType("");
        setProductStyle("");
        setActivityType("");
        setItemName("");
        setError("");
    };

    const handleClose = () => { reset(); onClose(); };

    const processFile = useCallback(async (f: File) => {
        if (!f.type.startsWith("image/")) { setError("Please upload an image file."); return; }
        setFile(f);
        setPreview(URL.createObjectURL(f));
        setScreen("classify");
        const color = await extractColor(f);
        setDetectedColor(color);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files[0];
        if (f) processFile(f);
    }, [processFile]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) processFile(f);
    };

    const handleTypeSelect = (type: string) => {
        setProductType(type);
        setProductStyle("");
        if (detectedColor && type) {
            const styleLabel = STYLE_OPTIONS[type][0]?.label ?? "Item";
            const colorName = detectedColor.isMultiColour ? "Multicolour" : detectedColor.name;
            setItemName(`My ${colorName} ${styleLabel}`);
        }
    };

    const handleStyleSelect = (style: string, label: string) => {
        setProductStyle(style);
        if (detectedColor) {
            const colorName = detectedColor.isMultiColour ? "Multicolour" : detectedColor.name;
            setItemName(`My ${colorName} ${label}`);
        }
    };

    // For multi-colour items: base color is fixed as "multicolour"
    // No manual tone selection needed — pairing logic handles it automatically

    const handleSave = async () => {
        if (!file || !detectedColor || !productType || !productStyle) {
            setError("Please select a type and style.");
            return;
        }
        setScreen("saving");
        try {
            // Upload image to Firebase Storage
            const uid = user?.uid ?? "guest";
            const itemId = `upload_${uid}_${Date.now()}`;
            const storageRef = ref(storage, `user-uploads/${uid}/${itemId}.jpg`);
            await uploadBytes(storageRef, file);
            const imageUrl = await getDownloadURL(storageRef);

            // Save to wardrobe
            await addToWardrobe({
                id: itemId,
                name: itemName || `My ${detectedColor.name} ${productStyle}`,
                price: 0,
                images: [imageUrl],
                productType,
                productStyle,
                activityType,
                baseColor: detectedColor.isMultiColour ? "multicolour" : detectedColor.baseColor,
                colorFamily: detectedColor.isMultiColour ? "multicolour" : detectedColor.name.toLowerCase().replace(" ", "-"),
            });
            setScreen("done");
        } catch (err) {
            console.error(err);
            setError("Upload failed. Please try again.");
            setScreen("classify");
        }
    };

    const canSave = productType && productStyle && detectedColor;

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 28, stiffness: 300 }}
                        className="fixed inset-0 z-[90] flex items-center justify-center p-4"
                    >
                        <div className="relative w-full max-w-md bg-[#111] border border-white/8 rounded-3xl overflow-hidden shadow-2xl">

                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                                <div>
                                    <h2 className="text-white font-bold text-lg">Upload Your Clothes</h2>
                                    <p className="text-white/30 text-xs mt-0.5">
                                        {screen === "drop" && "Drop a photo to add it to your wardrobe"}
                                        {screen === "classify" && "Confirm the details below"}
                                        {screen === "saving" && "Saving to your wardrobe..."}
                                        {screen === "done" && "Item added successfully!"}
                                    </p>
                                </div>
                                <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6">

                                {/* ── Screen: Drop ── */}
                                {screen === "drop" && (
                                    <>
                                        <div
                                            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                                            onDragLeave={() => setDragging(false)}
                                            onDrop={handleDrop}
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`relative flex flex-col items-center justify-center gap-4 h-56 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 ${dragging ? "border-[#C4724F] bg-[#C4724F]/5" : "border-white/10 hover:border-[#C4724F]/50 hover:bg-white/2"}`}
                                        >
                                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                            <div className="w-14 h-14 rounded-full bg-[#C4724F]/10 flex items-center justify-center">
                                                <ImagePlus className="w-6 h-6 text-[#C4724F]" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-white font-medium text-sm">Drop photo here or <span className="text-[#C4724F]">browse</span></p>
                                            </div>
                                        </div>
                                        {/* Background tip — sits cleanly below the drop zone */}
                                        <div className="flex items-center gap-2 mt-3 px-1">
                                            <span className="text-amber-400 text-xs">💡</span>
                                            <p className="text-amber-300/60 text-[11px]">
                                                Best results with a <span className="font-semibold text-amber-300/90">white or plain background</span> — dark/busy backgrounds can affect colour detection.
                                            </p>
                                        </div>
                                    </>
                                )}


                                {/* ── Screen: Classify ── */}
                                {screen === "classify" && preview && (
                                    <div className="space-y-5">
                                        {/* Background reminder */}
                                        <div className="flex items-start gap-2.5 bg-amber-500/8 border border-amber-500/20 rounded-xl px-3 py-2.5">
                                            <span className="text-amber-400 text-sm shrink-0 mt-0.5">⚠️</span>
                                            <p className="text-amber-300/80 text-[11px] leading-relaxed">
                                                Colour is auto-detected from your photo. If it looks wrong, a <span className="font-bold text-amber-300">busy or coloured background</span> may have skewed it — retake with a white/plain background for best results.
                                            </p>
                                        </div>
                                        {/* Image preview + color swatch */}
                                        <div className="flex gap-4 items-start">
                                            <div className="relative w-28 h-36 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 bg-[#1a1a1a]">
                                                <Image src={preview} alt="Preview" fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 space-y-3 pt-1">
                                                <p className="text-white/40 text-xs uppercase tracking-widest font-medium">Detected Colour</p>
                                                {detectedColor ? (
                                                    detectedColor.isMultiColour ? (
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="text-lg">🎨</span>
                                                            <span className="text-white font-bold text-sm">Multi-colour</span>
                                                            <span className="text-[10px] text-white/30 px-2 py-0.5 rounded-full border border-white/10">
                                                                pairs with black
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full border border-white/10 flex-shrink-0" style={{ backgroundColor: detectedColor.hex }} />
                                                            <span className="text-white font-bold text-sm">{detectedColor.name}</span>
                                                            <span className="text-[10px] text-white/30 capitalize px-2 py-0.5 rounded-full border border-white/10">{detectedColor.baseColor}</span>
                                                        </div>
                                                    )
                                                ) : (
                                                    <div className="flex items-center gap-2 text-white/30 text-sm">
                                                        <Loader2 className="w-4 h-4 animate-spin" /> Detecting…
                                                    </div>
                                                )}

                                                {/* Name field */}
                                                <div>
                                                    <label className="text-white/40 text-xs uppercase tracking-widest font-medium block mb-1.5">Item Name</label>
                                                    <input
                                                        type="text"
                                                        value={itemName}
                                                        onChange={(e) => setItemName(e.target.value)}
                                                        placeholder="e.g. My Navy T-Shirt"
                                                        className="w-full px-3 py-2 rounded-lg text-sm text-white"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Type picker */}
                                        <div>
                                            <p className="text-white/40 text-xs uppercase tracking-widest font-medium mb-2">Type</p>
                                            <div className="grid grid-cols-3 gap-2">
                                                {TYPE_OPTIONS.map((t) => (
                                                    <button
                                                        key={t.value}
                                                        onClick={() => handleTypeSelect(t.value)}
                                                        className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-sm font-medium transition-all ${productType === t.value ? "bg-[#C4724F]/15 border-[#C4724F]/50 text-white" : "border-white/8 text-white/40 hover:border-white/20 hover:text-white"}`}
                                                    >
                                                        <span className="text-xl">{t.emoji}</span>
                                                        <span className="text-xs">{t.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Style picker */}
                                        {productType && (
                                            <div>
                                                <p className="text-white/40 text-xs uppercase tracking-widest font-medium mb-2">Style</p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {STYLE_OPTIONS[productType].map((s) => (
                                                        <button
                                                            key={s.value}
                                                            onClick={() => handleStyleSelect(s.value, s.label)}
                                                            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all text-left ${productStyle === s.value ? "bg-[#C4724F]/15 border-[#C4724F]/50 text-white" : "border-white/8 text-white/40 hover:border-white/20 hover:text-white"}`}
                                                        >
                                                            {s.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Occasion picker */}
                                        {productStyle && (
                                            <div>
                                                <p className="text-white/40 text-xs uppercase tracking-widest font-medium mb-2">Occasion</p>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {[
                                                        { label: "Casual", value: "casual", emoji: "😊" },
                                                        { label: "Formal", value: "formal", emoji: "👔" },
                                                        { label: "Sports", value: "sports", emoji: "🏃" },
                                                    ].map((a) => (
                                                        <button
                                                            key={a.value}
                                                            onClick={() => setActivityType(a.value)}
                                                            className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-medium transition-all ${activityType === a.value
                                                                    ? "bg-[#C4724F]/15 border-[#C4724F]/50 text-white"
                                                                    : "border-white/8 text-white/40 hover:border-white/20 hover:text-white"
                                                                }`}
                                                        >
                                                            <span className="text-lg">{a.emoji}</span>
                                                            {a.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {error && <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 px-3 py-2 rounded-lg">{error}</p>}

                                        {/* Actions */}
                                        <div className="flex gap-3 pt-1">
                                            <button onClick={reset} className="flex-1 py-3 rounded-xl border border-white/10 text-white/50 hover:text-white text-sm font-medium transition-colors">
                                                ← Back
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                disabled={!canSave}
                                                className="flex-1 py-3 rounded-xl bg-[#C4724F] hover:bg-[#d4845f] disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
                                            >
                                                <Upload className="w-4 h-4" /> Add to Wardrobe
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* ── Screen: Saving ── */}
                                {screen === "saving" && (
                                    <div className="flex flex-col items-center justify-center py-12 gap-4">
                                        <Loader2 className="w-10 h-10 text-[#C4724F] animate-spin" />
                                        <p className="text-white font-medium">Saving to your wardrobe…</p>
                                        <p className="text-white/30 text-xs">Uploading image to the cloud</p>
                                    </div>
                                )}

                                {/* ── Screen: Done ── */}
                                {screen === "done" && (
                                    <div className="flex flex-col items-center justify-center py-10 gap-5">
                                        <div className="w-16 h-16 rounded-full bg-[#C4724F]/10 border border-[#C4724F]/30 flex items-center justify-center">
                                            <CheckCircle className="w-8 h-8 text-[#C4724F]" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-white font-bold text-lg">Added!</p>
                                            <p className="text-white/40 text-sm mt-1">"{itemName}" is now in your wardrobe</p>
                                        </div>
                                        <div className="flex gap-3 w-full">
                                            <button onClick={reset} className="flex-1 py-3 rounded-xl border border-white/10 text-white/50 hover:text-white text-sm font-medium transition-colors">
                                                Add Another
                                            </button>
                                            <button onClick={handleClose} className="flex-1 py-3 rounded-xl bg-[#C4724F] hover:bg-[#d4845f] text-white font-bold text-sm transition-all">
                                                View Wardrobe
                                            </button>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
