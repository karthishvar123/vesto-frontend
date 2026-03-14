import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white pt-24 pb-20">
            <div className="container mx-auto px-6 max-w-3xl">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-12 text-sm font-medium"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6 tracking-tight">Privacy Policy</h1>
                <p className="text-white/40 mb-12 uppercase tracking-widest text-sm">Effective Date: March 2026</p>

                <div className="space-y-12 text-white/80 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
                        <ul className="list-disc pl-5 space-y-2 text-white/70">
                            <li><strong className="text-white">Account Information:</strong> Name, email address, and profile data when you sign up using Google or Email via Firebase Authentication.</li>
                            <li><strong className="text-white">Wardrobe Data:</strong> Images of clothing you upload, which are stored securely in Firebase Storage. We process these images client-side to detect colours.</li>
                            <li><strong className="text-white">Usage Data:</strong> Standard analytics on how you interact with the app.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
                        <ul className="list-disc pl-5 space-y-2 text-white/70">
                            <li>To provide the core services of Vesto: virtual wardrobe management, style suggestions, and skin-tone analysis.</li>
                            <li>We do <strong className="text-white">not</strong> sell your personal data or uploaded images to third parties.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Third-Party Services & Affiliate Links</h2>
                        <ul className="list-disc pl-5 space-y-2 text-white/70">
                            <li>We use third-party tools like Google Firebase for authentication and database management. Their use of data is governed by their respective privacy policies.</li>
                            <li><strong className="text-white">Affiliate Links (Cuelinks):</strong> When you click on product recommendations on Vesto, you may be redirected to third-party stores via Cuelinks. Cuelinks and the destination stores may place cookies on your browser to track the referral and process commissions. We do not control these third-party cookies.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Data Security & Your Rights</h2>
                        <ul className="list-disc pl-5 space-y-2 text-white/70">
                            <li>Your data is secured by Firebase security rules. You have the right to request deletion of your account and all associated wardrobe images at any time.</li>
                        </ul>
                    </section>

                    <section className="pt-8 border-t border-white/10">
                        <h2 className="text-xl font-bold text-white mb-4">Contact Us</h2>
                        <p className="text-white/70">
                            If you have any questions about this Privacy Policy, please contact us at:{" "}
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
