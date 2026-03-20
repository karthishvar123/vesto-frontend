"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const getItems = (isMobile: boolean) => {
    const spread = isMobile ? 70 : 120;
    return [
        { id: 1, name: "Shorts", src: "/products/generated/beige-shorts.png", x: -spread, y: -spread, rotate: -6 },
        { id: 2, name: "Joggers", src: "/products/generated/grey-joggers.png", x: spread, y: -spread, rotate: 6 },
        { id: 3, name: "Cotton Pants", src: "/products/generated/beige-chinos.png", x: -spread, y: spread, rotate: -4 },
        { id: 4, name: "Sneakers", src: "/products/generated/white-sneakers.png", x: spread, y: spread, rotate: 4 },
    ];
};

export default function FloatingClothingGallery() {
    const [isActive, setIsActive] = React.useState(false);
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    const items = getItems(isMobile);

    return (
        <div
            className="relative w-full h-[380px] sm:h-[500px] flex items-center justify-center cursor-pointer"
            onMouseEnter={() => setIsActive(true)}
            onMouseLeave={() => setIsActive(false)}
            onClick={() => setIsActive(!isActive)}
        >
            {/* Satellite Items (Hidden behind Main) */}
            {items.map((item, index) => (
                <PolaroidItem
                    key={item.id}
                    item={item}
                    index={index}
                    isActive={isActive}
                />
            ))}

            {/* Central T-Shirt (Hero Item) - Always Visible & Top Z-Index */}
            <motion.div
                className="relative z-50 cursor-pointer"
                animate={{
                    y: isActive ? 0 : [0, -10, 0], // Stop floating on active
                    scale: isActive ? 1.05 : 1,
                    rotate: isActive ? 0 : -2
                }}
                transition={{ duration: 0.5 }}
            >
                {/* Main Polaroid Frame */}
                <div
                    className="bg-white shadow-2xl transition-shadow duration-300"
                    style={{
                        padding: '12px 12px 40px 12px',
                        borderRadius: '2px',
                    }}
                >
                    <div className="relative w-48 h-60 bg-gray-50 border border-gray-100 overflow-hidden">
                        <Image
                            src="/products/generated/navy-tshirt.png"
                            alt="Navy T-Shirt"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="absolute bottom-3 left-0 w-full text-center">
                        <span className="font-handwriting text-gray-800 text-sm font-bold uppercase tracking-widest">Main</span>
                    </div>
                </div>
            </motion.div>

        </div>
    );
}

function PolaroidItem({ item, index, isActive }: { item: any, index: number, isActive: boolean }) {
    // Generate random float values for unique motion
    const randomDuration = 4 + (index * 0.5);

    return (
        <motion.div
            className="absolute z-40 pointer-events-none"
            initial={{ x: 0, y: 0, scale: 0.5, opacity: 0, rotate: 0 }}
            animate={isActive ? {
                x: item.x,
                y: item.y,
                scale: 1,
                opacity: 1,
                rotate: item.rotate,
                transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                    delay: index * 0.1
                }
            } : {
                x: 0,
                y: 0,
                scale: 0.5,
                opacity: 0,
                rotate: 0,
                transition: { duration: 0.3 }
            }}
        >
            {/* Satellite Polaroid Frame */}
            <div
                className="bg-white shadow-xl"
                style={{
                    padding: '8px 8px 28px 8px', // Slightly smaller padding for smaller items
                    borderRadius: '2px',
                }}
            >
                {/* Reduced size from w-40 h-40 to w-24 h-24 on mobile, w-32 h-32 on desktop */}
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 border border-gray-100 overflow-hidden">
                    <Image
                        src={item.src}
                        alt={item.name}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="absolute bottom-1.5 left-0 w-full text-center">
                    <span className="font-handwriting text-gray-600 text-[9px] sm:text-[10px] font-medium uppercase tracking-widest">{item.name}</span>
                </div>
            </div>

            {/* Continuous Float Animation only when visible */}
            {isActive && (
                <motion.div
                    className="absolute inset-0"
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                        duration: randomDuration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5 + (index * 0.2)
                    }}
                />
            )}
        </motion.div>
    );
}
