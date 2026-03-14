import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white pt-24 pb-20">
            <div className="container mx-auto px-6 max-w-3xl">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-12 text-sm font-medium"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6 tracking-tight">Terms of Service</h1>
                <p className="text-white/40 mb-12 uppercase tracking-widest text-sm">Effective Date: March 2026</p>

                <div className="space-y-12 text-white/80 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                        <p className="text-white/70">
                            By using Vesto (the "Service"), you agree to be bound by these Terms. If you do not agree, please do not use the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. User Accounts & Content</h2>
                        <ul className="list-disc pl-5 space-y-2 text-white/70">
                            <li>You are responsible for maintaining the security of your account credentials.</li>
                            <li>You retain ownership of any clothing images you upload to your Virtual Wardrobe. However, by uploading them, you grant Vesto the right to store and process them solely to provide the Service to you.</li>
                            <li>You agree not to upload inappropriate, offensive, or copyrighted materials that you do not have permission to use.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Affiliate Disclosure</h2>
                        <ul className="list-disc pl-5 space-y-2 text-white/70">
                            <li>Vesto participates in affiliate marketing programs (via Cuelinks). This means we may earn a commission if you purchase products through links on our site or our Shop pages. This comes at no additional cost to you and helps support the platform.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Disclaimer of Warranties</h2>
                        <ul className="list-disc pl-5 space-y-2 text-white/70">
                            <li>The fashion and style recommendations (including skin tone analysis and daily outfit suggestions) are provided "as is" for entertainment and stylistic guidance only. Vesto does not guarantee perfect matches or specific outcomes.</li>
                        </ul>
                    </section>
                    
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Limitation of Liability</h2>
                        <ul className="list-disc pl-5 space-y-2 text-white/70">
                            <li>Vesto shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service or third-party links accessed through the Service.</li>
                        </ul>
                    </section>

                    <section className="pt-8 border-t border-white/10">
                        <h2 className="text-xl font-bold text-white mb-4">Contact Us</h2>
                        <p className="text-white/70">
                            If you have questions regarding these Terms, contact us at:{" "}
                            <a href="mailto:vesto.fashionstore@gmail.com" className="text-[#C4724F] hover:underline">
                                vesto.fashionstore@gmail.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
