"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const cards = [
    { id: 1, src: "/navytshirt.png", alt: "Navy T-Shirt", rotate: -15, x: -60 },
    { id: 2, src: "/beigepants.png", alt: "Beige Pants", rotate: -7, x: -30 },
    { id: 3, src: "/blueoxfordshirt.png", alt: "Oxford Shirt", rotate: 0, x: 0 },
    { id: 4, src: "/darkjeans.png", alt: "Dark Jeans", rotate: 7, x: 30 },
    { id: 5, src: "/whitesneakers.png", alt: "White Sneakers", rotate: 15, x: 60 },
];

export default function FashionCardAnimation() {
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-64 h-80 sm:w-72 sm:h-96">
                {cards.map((card, index) => (
                    <motion.div
                        key={card.id}
                        className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-100 flex items-center justify-center"
                        initial={{ rotate: 0, x: 0, opacity: 0, scale: 0.9 }}
                        animate={{
                            rotate: card.rotate,
                            x: card.x,
                            opacity: 1,
                            scale: 1
                        }}
                        transition={{
                            duration: 2,
                            ease: [0.2, 0.65, 0.3, 0.9], // Smooth easing
                            delay: index * 0.2, // Staggered entrance
                            repeat: Infinity,
                            repeatType: "reverse",
                            repeatDelay: 1
                        }}
                        style={{
                            boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.1)",
                            zIndex: index,
                            transformOrigin: "bottom center"
                        }}
                    >
                        <div className="relative w-full h-full p-4">
                            <Image
                                src={card.src}
                                alt={card.alt}
                                fill
                                className="object-contain p-4"
                            />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
