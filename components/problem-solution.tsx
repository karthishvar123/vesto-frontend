"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { FluidCardItem } from "./fluid-card-stack";

const FluidCardStack = dynamic(() => import("./fluid-card-stack"), { ssr: false });
import { motion } from "framer-motion";

const items: FluidCardItem[] = [
    {
        id: "01",
        title: "The Problem",
        subtitle: "Most wardrobes are built around trends.",
        description: "Shopping is organized by season, popularity, and discounts — not by what actually complements your complexion.",
        gradient: "linear-gradient(135deg, #FF6B6B 0%, #556270 100%)", // Reddish/Grey
        image: "/products/generated/problem.png"
    },
    {
        id: "02",
        title: "The Insight",
        subtitle: "Color is not universal.",
        description: "The same shirt can elevate one person and dull another. Tone, contrast, and undertone change everything. This is where you create the “aha” moment.",
        gradient: "linear-gradient(135deg, #4ECDC4 0%, #556270 100%)", // Teal/Grey
        image: "/products/generated/insight.png"
    },
    {
        id: "03",
        title: "The Vesto Solution",
        subtitle: "Vesto organizes fashion by complexion compatibility.",
        description: "6 structured tone profiles. Compatible color pairings. Complete look coordination. No guesswork. Just clarity.",
        gradient: "linear-gradient(135deg, #A8E6CF 0%, #DCEDC1 100%)", // Greenish/Gold
        image: "/products/generated/solution.png"
    }
];

export default function ProblemSolution() {
    return (
        <section className="relative w-full py-32 px-6 lg:px-20 overflow-hidden bg-black">

            {/* Background Ambience */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-900/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2
                        className="text-4xl md:text-5xl font-serif mb-4"
                        style={{ color: '#FFFFFF' }}
                    >
                        The Problem With Modern Shopping
                    </h2>
                    <p
                        className="max-w-2xl mx-auto"
                        style={{ color: '#FFFFFF' }}
                    >
                        We are reimagining how men shop, moving away from generic trends to personalized compatibility.
                    </p>
                </motion.div>

                {/* The Fluid Stack */}
                <FluidCardStack items={items} />
            </div>
        </section>
    );
}
