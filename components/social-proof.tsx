"use client";

import { FlaskConical } from "lucide-react";

export default function SocialProof() {
    return (
        <section className="w-full py-10 sm:py-16 border-t border-white/5 bg-[#0A0A0A]">
            <div className="max-w-2xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-center sm:text-left">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                    <FlaskConical className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                    <p className="text-white font-black text-sm uppercase tracking-tight">
                        Built on the{" "}
                        <span className="text-[#E8A87C]">Fitzpatrick Scale</span>
                    </p>
                    <p className="text-white/30 text-xs leading-relaxed mt-1">
                        The dermatological standard used by NASA, the WHO, and dermatologists worldwide — not a guess.
                    </p>
                </div>
            </div>
        </section>
    );
}
