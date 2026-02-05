"use client";

import { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { ArrowRight, Camera, X, Check, Loader2, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Skin tone presets (Must match page.tsx)
const skinTones = [
    { type: 1, color: "#FFDFC4", r: 255, g: 223, b: 196 },
    { type: 2, color: "#E6B998", r: 230, g: 185, b: 152 },
    { type: 3, color: "#CF9E76", r: 207, g: 158, b: 118 },
    { type: 4, color: "#A87652", r: 168, g: 118, b: 82 },
    { type: 5, color: "#75482F", r: 117, g: 72, b: 47 },
    { type: 6, color: "#4B2C20", r: 75, g: 44, b: 32 }
];

interface AICameraProps {
    onClose: () => void;
    onMatchFound: (type: 1 | 2 | 3 | 4 | 5 | 6) => void;
}

export default function AICamera({ onClose, onMatchFound }: AICameraProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null); // For pixel reading
    const [stream, setStream] = useState<MediaStream | null>(null);
    const streamRef = useRef<MediaStream | null>(null); // Ref to track stream for cleanup
    const [loading, setLoading] = useState(true);
    const [faceDetected, setFaceDetected] = useState(false);
    const [bestMatch, setBestMatch] = useState<number | null>(null);
    const [scannedColor, setScannedColor] = useState<string | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const landmarkerRef = useRef<FaceLandmarker | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialize MediaPipe
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
            try {
                if (landmarkerRef.current) {
                    landmarkerRef.current.close();
                    landmarkerRef.current = null;
                }
            } catch (err) {
                console.warn("Error closing MediaPipe landmarker:", err);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Reconnect stream to video element when switching back from captured image
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
                videoRef.current.onloadeddata = () => {
                    setLoading(false);
                };
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

    const captureAndAnalyze = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const landmarker = landmarkerRef.current;

        if (!video || !canvas || !landmarker) return;

        // Ensure video is ready and has valid dimensions
        if (!video.videoWidth || !video.videoHeight) {
            console.error("Video not ready yet");
            return;
        }

        // Draw current frame to canvas
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Save captured image
        const dataUrl = canvas.toDataURL("image/png");
        setCapturedImage(dataUrl);

        // Analyze the captured frame
        try {
            const results = landmarker.detect(canvas);

            if (results.faceLandmarks && results.faceLandmarks.length > 0) {
                setFaceDetected(true);
                const landmarks = results.faceLandmarks[0];
                const point = landmarks[151]; // Forehead center point
                extractSkinColor(point.x, point.y);
            } else {
                setFaceDetected(false);
                setBestMatch(null);
            }
        } catch (error) {
            console.error("Error analyzing captured frame:", error);
            setFaceDetected(false);
            setBestMatch(null);
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

                // Create an image object to draw to canvas for analysis
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

                    try {
                        const results = landmarker.detect(canvas);
                        if (results.faceLandmarks && results.faceLandmarks.length > 0) {
                            setFaceDetected(true);
                            const landmarks = results.faceLandmarks[0];
                            const point = landmarks[151];
                            extractSkinColor(point.x, point.y);
                        } else {
                            setFaceDetected(false);
                            setBestMatch(null);
                        }
                    } catch (error) {
                        console.error("Error analyzing uploaded image:", error);
                        setFaceDetected(false);
                        setBestMatch(null);
                    }
                };
                img.src = result;
            }
        };
        reader.readAsDataURL(file);
    };

    const handleRetake = () => {
        setCapturedImage(null);
        setBestMatch(null);
        setFaceDetected(false);

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        // Ensure video element is connected to the stream
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    };

    const extractSkinColor = (xPercent: number, yPercent: number) => {
        // We use the canvas that already has the image/frame drawn on it
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });

        if (!ctx) return;

        // Get pixel at landmark position
        const x = Math.floor(xPercent * canvas.width);
        const y = Math.floor(yPercent * canvas.height);

        // Sample a 5x5 area for average
        const frameData = ctx.getImageData(x - 2, y - 2, 5, 5).data;
        let r = 0, g = 0, b = 0, count = 0;

        for (let i = 0; i < frameData.length; i += 4) {
            r += frameData[i];
            g += frameData[i + 1];
            b += frameData[i + 2];
            count++;
        }

        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);

        setScannedColor(`rgb(${r}, ${g}, ${b})`);
        findBestMatch(r, g, b);
    };

    const findBestMatch = (r: number, g: number, b: number) => {
        let minDiff = Infinity;
        let closestPlugin = 3;

        skinTones.forEach((tone) => {
            // Euclidean distance
            const diff = Math.sqrt(
                Math.pow(r - tone.r, 2) +
                Math.pow(g - tone.g, 2) +
                Math.pow(b - tone.b, 2)
            );

            if (diff < minDiff) {
                minDiff = diff;
                closestPlugin = tone.type;
            }
        });

        // Stabilize result: only update if we are somewhat confident
        // For now, we update immediately for responsiveness
        setBestMatch(closestPlugin);
    };

    const handleConfirm = () => {
        if (bestMatch) {
            onMatchFound(bestMatch as 1 | 2 | 3 | 4 | 5 | 6);
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
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-20"
                >
                    <X className="w-5 h-5 text-gray-600" />
                </button>

                <h2 className="text-2xl font-black text-[#111] mb-4 text-center">AI Skin Tone Finder</h2>

                <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-[3/4] mb-6 shadow-inner">
                    {/* Video Feed or Captured Image */}
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

                    {/* Loading State */}
                    {loading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white gap-3">
                            <Loader2 className="w-10 h-10 animate-spin" />
                            <p className="font-medium text-sm">Initializing Face AI...</p>
                        </div>
                    )}



                    {/* Result Overlay */}
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
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Best Match</p>
                                <h3 className="text-lg font-black text-[#111]">Type {bestMatch}</h3>
                            </div>
                            {/* Color detected debug 
                            <div className="w-6 h-6 rounded-full border border-gray-200" style={{background: scannedColor || 'transparent'}} />
                            */}
                        </motion.div>
                    )}

                    {/* No face detected warning */}
                    {capturedImage && !faceDetected && !loading && (
                        <div className="absolute bottom-4 left-4 right-4 bg-red-500/90 text-white p-3 rounded-xl text-center backdrop-blur-md">
                            <p className="font-bold text-sm">No face detected. Please retake the photo.</p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    {!capturedImage ? (
                        <div className="flex gap-3 w-full">
                            <button
                                onClick={captureAndAnalyze}
                                disabled={loading}
                                className={`flex-1 py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-all
                                    ${loading
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-[#111] text-white shadow-lg hover:scale-[1.02] active:scale-[0.98]'}
                                `}
                            >
                                <Camera className="w-5 h-5" />
                                Capture
                            </button>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={loading}
                                className={`flex-1 py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-all border-2
                                    ${loading
                                        ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                                        : 'bg-white text-[#111] border-gray-200 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98]'}
                                `}
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
                                    ${bestMatch
                                        ? 'bg-[#111] shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                                        : 'bg-gray-300 cursor-not-allowed'}
                                `}
                            >
                                Use This Tone <Check className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    <p className="text-xs text-center text-gray-400 mt-2">
                        Your photo is processed locally and never sent to a server.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
