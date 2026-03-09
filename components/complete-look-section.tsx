"use client";

import GlowCard from "@/components/glow-card";
import FloatingClothingGallery from "@/components/floating-clothing-gallery";

export default function CompleteLookSection() {
    return (
        <section className="w-full min-h-screen bg-transparent flex items-center justify-center py-20 relative overflow-hidden">
            <div className="container mx-auto px-6 h-full flex flex-col-reverse lg:flex-row items-center justify-between gap-16 lg:gap-24">

                {/* Left Side: Floating Gallery Animation */}
                <div className="flex-1 w-full max-w-2xl h-[600px]">
                    <FloatingClothingGallery />
                </div>

                {/* Right Side: Glow Card Text */}
                <GlowCard className="flex-1 w-full max-w-xl h-[500px] flex flex-col justify-center p-12 lg:p-16">
                    <div className="space-y-6 relative z-10 text-right">
                        <h2 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight uppercase tracking-tight" style={{ color: '#FFFFFF' }}>
                            Complete <br />
                            Your <br />
                            Look
                        </h2>
                        <h3 className="text-xl text-white/90 font-medium uppercase tracking-widest border-b border-white/20 pb-4 mb-4" style={{ color: '#EAEAEA' }}>
                            Style Compatibility
                        </h3>
                        <p className="text-lg md:text-xl text-white font-light tracking-wide" style={{ color: '#FFFFFF' }}>
                            Style compatibility across categories. <br />
                            No mismatches. Ever.
                        </p>
                    </div>
                </GlowCard>

            </div>
        </section>
    );
}
