export default function WhyVesto() {
    return (
        <section className="w-full py-12 sm:py-24 bg-[#0A0A0A]">
            <div className="max-w-4xl mx-auto px-4 text-center mb-16">
                <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tighter mb-4">
                    Why Vesto is different
                </h2>
                <p className="text-white/40 text-lg">
                    Every other app shows you what&apos;s trending.
                    We show you what actually works for you.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
                {[
                    {
                        icon: "🎨",
                        title: "Skin tone first",
                        desc: "We use the Fitzpatrick scale to match colors to your complexion. Not trends. Not algorithms. Science."
                    },
                    {
                        icon: "👗",
                        title: "Your wardrobe, digitized",
                        desc: "Add clothes you already own. Get daily outfit suggestions from what's in your closet."
                    },
                    {
                        icon: "✨",
                        title: "Complete the look",
                        desc: "Pick any item and instantly see everything that pairs with it by color family and occasion."
                    }
                ].map(item => (
                    <div key={item.title}
                        className="bg-white/5 border border-white/10 rounded-2xl p-8 text-left hover:border-[#C4724F]/30 transition-colors">
                        <span className="text-4xl mb-6 block">{item.icon}</span>
                        <h3 className="text-white font-black text-xl mb-3">{item.title}</h3>
                        <p className="text-white/50 text-base leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
