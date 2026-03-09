"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

interface ConicGradientButtonProps {
    width?: string | number;
    height?: string | number;
    borderColor?: string;
    animationDuration?: number;
    blurRadius?: number;
    borderRadius?: number;
    backgroundColor?: string;
    overlayBorderColor?: string;
    overlayMargin?: number;
    text?: string;
    textColor?: string;
    fontSize?: number;
    fontWeight?: number;
    fontFamily?: string;
    letterSpacing?: number;
    href: string;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
    className?: string;
    children?: ReactNode;
}

export default function ConicGradientButton({
    width = "auto",
    height = "auto",
    borderColor = "#D49A70", // Vesto Gold
    animationDuration = 3,
    borderRadius = 999, // Pill shape default
    backgroundColor = "transparent", // Transparent for Glassy effect
    overlayMargin = 2,
    text = "Button",
    textColor = "#FFFFFF",
    fontSize = 18,
    fontWeight = 500,
    fontFamily = "inherit",
    letterSpacing = 0,
    href,
    onClick,
    className = "",
    children,
}: ConicGradientButtonProps) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`relative inline-block group ${className}`}
            style={{
                width: width,
                height: height,
                borderRadius: `${borderRadius}px`,
                textDecoration: "none",
            }}
        >
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: `${borderRadius}px`,
                    padding: "2px", // Space for gradient to show
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {/* Rotating Gradient Background (Border Effect) */}
                <motion.div
                    style={{
                        position: "absolute",
                        top: "-50%",
                        left: "-50%",
                        right: "-50%",
                        bottom: "-50%",
                        width: "200%",
                        height: "200%",
                        background: `conic-gradient(from 0deg, transparent 0deg, ${borderColor} 360deg)`,
                        zIndex: 1,
                        opacity: 0.8, // Slightly softer gradient
                    }}
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: animationDuration,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                />

                {/* Inner Background Overlay with Glassy Effect */}
                <div
                    style={{
                        position: "absolute",
                        top: `${overlayMargin}px`,
                        left: `${overlayMargin}px`,
                        right: `${overlayMargin}px`,
                        bottom: `${overlayMargin}px`,
                        backgroundColor: "rgba(0, 0, 0, 0.4)", // Semi-transparent dark bg
                        backdropFilter: "blur(10px)", // Glassy blur
                        borderRadius: `${Math.max(0, borderRadius - overlayMargin)}px`,
                        zIndex: 2,
                        boxShadow: `
                            inset 0px 1px 2px rgba(255, 255, 255, 0.1),
                            inset 0px -1px 2px rgba(0,0,0,0.2)
                        `, // Inner lighting
                    }}
                />

                {/* Hover Glow Effect */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[2]"
                    style={{
                        top: `${overlayMargin}px`,
                        left: `${overlayMargin}px`,
                        right: `${overlayMargin}px`,
                        bottom: `${overlayMargin}px`,
                        borderRadius: `${Math.max(0, borderRadius - overlayMargin)}px`,
                        background: "radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)"
                    }}
                />

                {/* Content */}
                <div
                    style={{
                        position: "relative",
                        zIndex: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "16px 32px",
                        width: "100%",
                        height: "100%",
                        textShadow: "0 2px 4px rgba(0,0,0,0.5)" // Text shadow for readability
                    }}
                >
                    {children ? (
                        children
                    ) : (
                        <span
                            style={{
                                color: textColor,
                                fontSize: `${fontSize}px`,
                                fontWeight: fontWeight,
                                fontFamily: fontFamily,
                                letterSpacing: `${letterSpacing}px`,
                                whiteSpace: "nowrap",
                            }}
                        >
                            {text}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
