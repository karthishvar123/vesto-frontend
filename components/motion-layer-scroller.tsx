"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform, useVelocity } from "framer-motion";
import Image from "next/image";

interface MotionLayerScrollerProps {
    images: string[];
    settings?: {
        minLayers?: number;
        layerSpacing?: number;
        layerWidth?: number;
        layerHeight?: number;
        perspective?: number;
        cameraTilt?: number;
        cameraRotation?: number;
        scrollSensitivity?: number;
        opacity?: number;
        borderRadius?: number;
        color?: string;
    };
}

export default function MotionLayerScroller({
    images,
    settings = {}
}: MotionLayerScrollerProps) {
    // Default settings
    const minLayers = settings.minLayers || 20;
    const layerSpacing = settings.layerSpacing || 300; // Increased spacing for better visibility
    const layerWidth = settings.layerWidth || 250;
    const layerHeight = settings.layerHeight || 300;
    const perspective = settings.perspective || 1000;
    const cameraTilt = settings.cameraTilt || -10;
    const cameraRotation = settings.cameraRotation || -15; // Slight isometric view
    const scrollSensitivity = settings.scrollSensitivity || 2;
    const opacity = settings.opacity || 1;
    const borderRadius = settings.borderRadius || 12;
    const backgroundColor = settings.color || "rgba(255, 255, 255, 0.9)"; // White cards

    const containerRef = useRef<HTMLDivElement>(null);
    const scrollY = useMotionValue(0);
    const smoothScroll = useSpring(scrollY, { stiffness: 100, damping: 30 });

    // Calculate total layers needed for infinite loop
    const numImages = images.length;
    const totalLayers = Math.max(minLayers, numImages > 0 ? Math.max(numImages * 4, minLayers) : minLayers);

    // Scroll Handler
    const handleWheel = useCallback((e: WheelEvent) => {
        e.preventDefault();
        const factor = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
        const delta = e.deltaY * factor * scrollSensitivity;
        const current = scrollY.get() + delta;
        scrollY.set(current);
    }, [scrollSensitivity, scrollY]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        container.addEventListener("wheel", handleWheel, { passive: false });
        // Auto Play initial nudge
        scrollY.set(100);
        return () => container.removeEventListener("wheel", handleWheel);
    }, [handleWheel, scrollY]);


    // Tilt based on velocity
    const scrollVelocity = useVelocity(smoothScroll);
    const smoothVelocity = useSpring(scrollVelocity, { stiffness: 100, damping: 30 });
    const velocityRotation = useTransform(smoothVelocity, [-1000, 0, 1000], [-5, 0, 5]);
    const sceneRotateX = useTransform(velocityRotation, offset => cameraTilt + offset);

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                perspective: `${perspective}px`,
                perspectiveOrigin: "center center",
                position: "relative",
                cursor: "grab",
                background: "transparent" // Transparent so it blends with section bg
            }}
        >
            <motion.div
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    transformStyle: "preserve-3d",
                    transformOrigin: "center center",
                    rotateX: sceneRotateX,
                    rotateY: cameraRotation,
                }}
            >
                {Array.from({ length: totalLayers }).map((_, index) => {
                    return (
                        <Layer
                            key={index}
                            index={index}
                            totalLayers={totalLayers}
                            layerSpacing={layerSpacing}
                            smoothScroll={smoothScroll}
                            width={layerWidth}
                            height={layerHeight}
                            imageUrl={images[index % numImages]}
                            opacity={opacity}
                            borderRadius={borderRadius}
                            backgroundColor={backgroundColor}
                        />
                    );
                })}
            </motion.div>
        </div>
    );
}

function Layer({
    index,
    totalLayers,
    layerSpacing,
    smoothScroll,
    width,
    height,
    imageUrl,
    opacity: baseOpacity,
    borderRadius,
    backgroundColor
}: {
    index: number,
    totalLayers: number,
    layerSpacing: number,
    smoothScroll: any,
    width: number,
    height: number,
    imageUrl: string,
    opacity: number,
    borderRadius: number,
    backgroundColor: string
}) {
    // Determine Z position
    const zInitial = -index * layerSpacing;
    const totalDepth = totalLayers * layerSpacing;

    const layerZ = useTransform(smoothScroll, (value: number) => {
        let currentZ = zInitial + value;
        // Infinite loop logic
        const cycle = totalDepth;
        const normalizedZ = ((currentZ % cycle) + cycle) % cycle;
        const wrappedZ = normalizedZ - cycle * 0.5; // Center the range
        return wrappedZ;
    });

    // Fade opacity at edges of the view depth
    const maxDepth = totalDepth * 0.4;
    const opacity = useTransform(layerZ,
        [-maxDepth, -maxDepth * 0.2, 0, maxDepth * 0.2, maxDepth],
        [0, baseOpacity, baseOpacity, baseOpacity, 0]
    );

    const scale = useTransform(layerZ,
        [-maxDepth, 0, maxDepth],
        [0.6, 1, 1.4]
    );

    // Simple Z-index sort
    const zIndex = useTransform(layerZ, (z: number) => Math.round(5000 + z));

    return (
        <motion.div
            style={{
                position: "absolute",
                width: `${width}px`,
                height: `${height}px`,
                left: "50%",
                top: "50%",
                x: "-50%",
                y: "-50%",
                z: layerZ,
                scale: scale,
                opacity: opacity,
                zIndex: zIndex,
                backgroundColor: backgroundColor,
                borderRadius: `${borderRadius}px`,
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // border: "1px solid rgba(255,255,255,0.1)",
                padding: "20px"
            }}
        >
            <div className="relative w-full h-full overflow-hidden rounded-md bg-white">
                <Image
                    src={imageUrl}
                    alt={`Gallery Item ${index}`}
                    fill
                    className="object-contain p-4" // Use object-contain to show the full hanger
                    sizes="300px"
                />
            </div>
        </motion.div>
    );
}
