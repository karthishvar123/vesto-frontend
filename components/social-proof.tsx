export default function SocialProof() {
    return (
        <section className="w-full py-8 sm:py-20 border-t border-white/5 bg-[#0A0A0A]">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-24 items-start max-w-5xl mx-auto px-4">
                {[
                    { num: "6", label: "Fitzpatrick skin types covered" },
                    { num: "50+", label: "Color families mapped" },
                    { num: "3", label: "Smart outfit categories" },
                ].map((s) => (
                    <div key={s.label} className="text-center flex flex-col items-center">
                        <p className="text-4xl sm:text-5xl font-black text-[#C4724F] mb-2">{s.num}</p>
                        <p className="text-white/40 text-[10px] sm:text-sm uppercase tracking-widest max-w-[160px] leading-relaxed">{s.label}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
