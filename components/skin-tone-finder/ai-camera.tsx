"use client";

import { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { ArrowRight, Camera, X, Check, Loader2, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Color Conversion Helpers ---

// RGB to XYZ
function rgbToXyz(r: number, g: number, b: number) {
    let _r = r / 255;
    let _g = g / 255;
    let _b = b / 255;

    _r = _r > 0.04045 ? Math.pow((_r + 0.055) / 1.055, 2.4) : _r / 12.92;
    _g = _g > 0.04045 ? Math.pow((_g + 0.055) / 1.055, 2.4) : _g / 12.92;
    _b = _b > 0.04045 ? Math.pow((_b + 0.055) / 1.055, 2.4) : _b / 12.92;

    _r *= 100;
    _g *= 100;
    _b *= 100;

    return [
        _r * 0.4124 + _g * 0.3576 + _b * 0.1805,
        _r * 0.2126 + _g * 0.7152 + _b * 0.0722,
        _r * 0.0193 + _g * 0.1192 + _b * 0.9505
    ];
}

// XYZ to LAB
function xyzToLab(x: number, y: number, z: number) {
    let _x = x / 95.047;
    let _y = y / 100.000;
    let _z = z / 108.883;

    _x = _x > 0.008856 ? Math.pow(_x, 1 / 3) : (7.787 * _x) + (16 / 116);
    _y = _y > 0.008856 ? Math.pow(_y, 1 / 3) : (7.787 * _y) + (16 / 116);
    _z = _z > 0.008856 ? Math.pow(_z, 1 / 3) : (7.787 * _z) + (16 / 116);

    return [
        (116 * _y) - 16,
        500 * (_x - _y),
        200 * (_y - _z)
    ];
}

// RGB to LAB Wrapper
function rgbToLab(r: number, g: number, b: number) {
    const [x, y, z] = rgbToXyz(r, g, b);
    return xyzToLab(x, y, z);
}

// Calculate Delta E (CIE76)
function getDeltaE(lab1: number[], lab2: number[]) {
    return Math.sqrt(
        Math.pow(lab1[0] - lab2[0], 2) +
        Math.pow(lab1[1] - lab2[1], 2) +
        Math.pow(lab1[2] - lab2[2], 2)
    );
}

// RGB to HSV
function rgbToHsv(r: number, g: number, b: number) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, v = max;
    const d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max !== min) {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, v];
}

// HSV to RGB
function hsvToRgb(h: number, s: number, v: number) {
    let r = 0, g = 0, b = 0;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Brightness Normalization
function normalizeBrightness(r: number, g: number, b: number) {
    const [h, s, v] = rgbToHsv(r, g, b);
    // Target brightness: 60% - 80% range for consistent matching
    // If too dark (<40%), boost. If too bright (>90%), dim.
    let newV = v;
    if (v < 0.4) newV = 0.5;
    else if (v > 0.9) newV = 0.85;
    // Mild normalization towards 0.7
    newV = (v + newV) / 2;

    return hsvToRgb(h, s, newV);
}

// --- Skin Tone Data with Pre-calculated LAB ---

const skinTonesRAW = [
    { type: 1, color: "#FFDFC4", r: 255, g: 223, b: 196 },
    { type: 2, color: "#E6B998", r: 230, g: 185, b: 152 },
    { type: 3, color: "#CF9E76", r: 207, g: 158, b: 118 },
    { type: 4, color: "#A87652", r: 168, g: 118, b: 82 },
    { type: 5, color: "#75482F", r: 117, g: 72, b: 47 },
    { type: 6, color: "#4B2C20", r: 75, g: 44, b: 32 }
];

const skinTones = skinTonesRAW.map(t => ({
    ...t,
    lab: rgbToLab(t.r, t.g, t.b)
}));

interface AICameraProps {
    onClose: () => void;
    onMatchFound: (type: 1 | 2 | 3 | 4 | 5 | 6) => void;
}

export default function AICamera({ onClose, onMatchFound }: AICameraProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [loading, setLoading] = useState(true);
    const [faceDetected, setFaceDetected] = useState(false);
    const [bestMatch, setBestMatch] = useState<number | null>(null);
    const [scannedColor, setScannedColor] = useState<string | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const landmarkerRef = useRef<FaceLandmarker | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        let isMounted = true;

        async function initMediaPipe() {
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.32/wasm"
                );

                if (!isMounted) return;

                const landmarker = await FaceLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                        delegate: "GPU"
                    },
                    outputFaceBlendshapes: false,
                    runningMode: "IMAGE",
                    numFaces: 1
                });

                if (isMounted) {
                    landmarkerRef.current = landmarker;
                    startCamera();
                }
            } catch (error) {
                console.error("Error initializing MediaPipe:", error);
                setLoading(false);
            }
        }

        initMediaPipe();

        return () => {
            isMounted = false;
            stopCamera();
            if (landmarkerRef.current) {
                landmarkerRef.current.close();
                landmarkerRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!capturedImage && videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [capturedImage, stream]);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480, facingMode: "user" }
            });
            setStream(mediaStream);
            streamRef.current = mediaStream;
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.onloadeddata = () => setLoading(false);
            }
        } catch (error) {
            console.error("Error accessing camera:", error);
            setLoading(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
            setStream(null);
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            if (result) {
                setCapturedImage(result);
                analyzeImage(result);
            }
        };
        reader.readAsDataURL(file);
    };

    const analyzeImage = (imageSrc: string) => {
        const img = new Image();
        img.onload = () => {
            const canvas = canvasRef.current;
            const landmarker = landmarkerRef.current;
            if (!canvas || !landmarker) return;

            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d", { willReadFrequently: true });
            if (!ctx) return;

            ctx.drawImage(img, 0, 0);
            detectFace(canvas, landmarker);
        };
        img.src = imageSrc;
    }

    const captureAndAnalyze = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const landmarker = landmarkerRef.current;

        if (!video || !canvas || !landmarker || !video.videoWidth) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setCapturedImage(canvas.toDataURL("image/png"));

        detectFace(canvas, landmarker);
    };

    const detectFace = (canvas: HTMLCanvasElement, landmarker: FaceLandmarker) => {
        try {
            const results = landmarker.detect(canvas);

            if (results.faceLandmarks && results.faceLandmarks.length > 0) {
                setFaceDetected(true);
                const landmarks = results.faceLandmarks[0];

                // Multi-point sampling: Forehead (151), Left Cheek (50), Right Cheek (280)
                const points = [151, 50, 280];
                let totalR = 0, totalG = 0, totalB = 0;

                points.forEach(index => {
                    const point = landmarks[index];
                    const { r, g, b } = samplePoint(canvas, point.x, point.y);
                    totalR += r;
                    totalG += g;
                    totalB += b;
                });

                // Average result
                const avgR = Math.round(totalR / points.length);
                const avgG = Math.round(totalG / points.length);
                const avgB = Math.round(totalB / points.length);

                // Normalize Brightness
                const [normR, normG, normB] = normalizeBrightness(avgR, avgG, avgB);

                setScannedColor(`rgb(${normR}, ${normG}, ${normB})`);
                findBestMatch(normR, normG, normB);
            } else {
                setFaceDetected(false);
                setBestMatch(null);
            }
        } catch (error) {
            console.error("Error analyzing face:", error);
            setFaceDetected(false);
            setBestMatch(null);
        }
    };

    const samplePoint = (canvas: HTMLCanvasElement, xPercent: number, yPercent: number) => {
        const ctx = canvas.getContext("2d");
        if (!ctx) return { r: 0, g: 0, b: 0 };

        const x = Math.floor(xPercent * canvas.width);
        const y = Math.floor(yPercent * canvas.height);

        // 5x5 Sample
        const frameData = ctx.getImageData(x - 2, y - 2, 5, 5).data;
        let r = 0, g = 0, b = 0, count = 0;

        for (let i = 0; i < frameData.length; i += 4) {
            r += frameData[i];
            g += frameData[i + 1];
            b += frameData[i + 2];
            count++;
        }

        return {
            r: Math.round(r / count),
            g: Math.round(g / count),
            b: Math.round(b / count)
        };
    };

    const findBestMatch = (r: number, g: number, b: number) => {
        const targetLab = rgbToLab(r, g, b);
        let minDeltaE = Infinity;
        let closestPlugin = 3;

        skinTones.forEach((tone) => {
            // Use Delta-E instead of Euclidean
            const deltaE = getDeltaE(targetLab, tone.lab);

            if (deltaE < minDeltaE) {
                minDeltaE = deltaE;
                closestPlugin = tone.type;
            }
        });

        setBestMatch(closestPlugin);
    };

    const handleRetake = () => {
        setCapturedImage(null);
        setBestMatch(null);
        setFaceDetected(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleConfirm = () => {
        if (bestMatch) {
            onMatchFound(bestMatch as any);
            stopCamera();
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white p-4 md:p-6 rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-20"
                >
                    <X className="w-5 h-5 text-gray-600" />
                </button>

                <h2 className="text-2xl font-black text-[#111] mb-4 text-center">AI Skin Tone Finder (Enhanced)</h2>

                <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-[3/4] mb-6 shadow-inner">
                    {capturedImage ? (
                        <img
                            src={capturedImage}
                            alt="Captured"
                            className="w-full h-full object-cover transform scale-x-[-1]"
                        />
                    ) : (
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover transform scale-x-[-1]"
                        />
                    )}
                    <canvas ref={canvasRef} className="hidden" />

                    {loading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white gap-3">
                            <Loader2 className="w-10 h-10 animate-spin" />
                            <p className="font-medium text-sm">Initializing Face AI...</p>
                        </div>
                    )}

                    {bestMatch && capturedImage && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xl p-4 rounded-xl shadow-lg border border-white/50 flex items-center gap-4"
                        >
                            <div
                                className="w-12 h-12 rounded-full shadow-md border-2 border-white ring-1 ring-gray-100"
                                style={{ backgroundColor: skinTones[bestMatch - 1].color }}
                            />
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Analysis Complete</p>
                                <h3 className="text-lg font-black text-[#111]">Type {bestMatch} Match</h3>
                            </div>
                        </motion.div>
                    )}

                    {capturedImage && !faceDetected && !loading && (
                        <div className="absolute bottom-4 left-4 right-4 bg-red-500/90 text-white p-3 rounded-xl text-center backdrop-blur-md">
                            <p className="font-bold text-sm">No face detected. Please try again.</p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    {!capturedImage ? (
                        <div className="flex gap-3 w-full">
                            <button
                                onClick={captureAndAnalyze}
                                disabled={loading}
                                className={`flex-1 py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-all
                                    ${loading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#111] text-white shadow-lg hover:scale-[1.02]'}
                                `}
                            >
                                <Camera className="w-5 h-5" />
                                Capture
                            </button>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={loading}
                                className="flex-1 py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-all border-2 bg-white text-[#111] border-gray-200 hover:bg-gray-50"
                            >
                                <Upload className="w-5 h-5" />
                                Upload
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileUpload}
                            />
                        </div>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={handleRetake}
                                className="flex-1 py-4 rounded-xl border-2 border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                Retake
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={!bestMatch}
                                className={`flex-[2] py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-white transition-all
                                    ${bestMatch ? 'bg-[#111] shadow-lg hover:scale-[1.02]' : 'bg-gray-300 cursor-not-allowed'}
                                `}
                            >
                                Use This Tone <Check className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                    <p className="text-xs text-center text-gray-400 mt-2">
                        Enhanced with multi-point analysis & lighting correction.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
