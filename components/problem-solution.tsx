
"use client";

import { XCircle, CheckCircle } from "lucide-react";

export default function ProblemSolution() {
    return (
        <section id="problem-solution" className="py-24 relative overflow-hidden">
            {/* Subtle Background Gradients for Glass Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-100/30 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-orange-50/40 rounded-full blur-3xl -z-10" />

            <div className="container mx-auto px-6 max-w-6xl relative z-10">
                <div className="bg-white/60 backdrop-blur-xl border border-white/20 shadow-xl rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden">

                    {/* Shine effect */}
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/40 to-transparent pointer-events-none" />

                    <div className="text-center max-w-2xl mx-auto mb-16 relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#111] font-serif mb-4">
                            Why shopping feels broken.
                        </h2>
                        <p className="text-lg text-[#37352F] opacity-60">
                            And why Vesto is the fix you've been waiting for.
                        </p>
                    </div>

                    <div className="space-y-8 relative z-10">
                        {/* Item 1 */}
                        <div className="grid md:grid-cols-2 gap-8 items-stretch">
                            {/* Problem */}
                            <div className="bg-white/50 border border-gray-200/50 rounded-xl p-8 relative overflow-hidden group hover:bg-white transition-colors">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <XCircle className="w-24 h-24 text-red-500" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4 text-red-600">
                                        <XCircle size={24} />
                                        <span className="font-bold tracking-wide text-xs uppercase">The Problem</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-[#111] font-serif mb-4">
                                        The "Safe Color" Trap
                                    </h3>
                                    <p className="text-[#37352F] opacity-70 leading-relaxed text-base">
                                        Most men don’t know which colors actually suit them, so shopping becomes guesswork. They end up relying on safe, repetitive choices like black or navy, even when those colors don’t enhance their natural appearance.
                                    </p>
                                </div>
                            </div>

                            {/* Solution */}
                            <div className="bg-white/80 border border-gray-200/50 rounded-xl p-8 relative overflow-hidden group hover:bg-white transition-colors">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <CheckCircle className="w-24 h-24 text-green-500" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4 text-green-600">
                                        <CheckCircle size={24} />
                                        <span className="font-bold tracking-wide text-xs uppercase">The Solution</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-[#111] font-serif mb-4">
                                        Data-Driven Styling
                                    </h3>
                                    <p className="text-[#37352F] opacity-70 leading-relaxed text-base">
                                        Vesto introduces a skin-tone-first styling approach. Manually select your skin tone from a curated palette and <span className="text-[#111] font-medium bg-green-50 px-1 rounded">instantly see clothing colors</span> that are scientifically compatible with you. Reduce confusion and make every choice intentional.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

