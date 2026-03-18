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

                <h1 className="text-4xl md:text-5xl font-bold font-serif mb-3 tracking-tight">Terms of Service</h1>
                <p className="text-white/40 mb-2 uppercase tracking-widest text-sm">Effective Date: March 2026</p>
                <p className="text-white/40 mb-12 text-sm">Last Updated: March 2026</p>

                <div className="space-y-12 text-white/80 leading-relaxed">

                    <section>
                        <p className="text-white/70">
                            Welcome to Vesto. These Terms of Service ("Terms") govern your access to and use of the Vesto application and website (collectively, the "Service"), operated by Vesto ("we", "our", or "us"). Please read these Terms carefully before using the Service. By accessing or using Vesto, you agree to be bound by these Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                        <p className="text-white/70">
                            By creating an account or using any part of the Service, you confirm that you are at least <strong className="text-white">13 years of age</strong>, have read and understood these Terms, and agree to be bound by them. If you do not agree, you must not use the Service. If you are using the Service on behalf of an organisation, you represent that you have authority to bind that organisation to these Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. User Accounts</h2>
                        <ul className="list-disc pl-5 space-y-2 text-white/70">
                            <li>You must provide accurate and complete information when creating an account.</li>
                            <li>You are solely responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.</li>
                            <li>You must notify us immediately at <a href="mailto:vesto.fashionstore@gmail.com" className="text-[#C4724F] hover:underline">vesto.fashionstore@gmail.com</a> if you suspect any unauthorised use of your account.</li>
                            <li>We reserve the right to suspend or terminate accounts that violate these Terms, at our sole discretion, with or without prior notice.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. User Content</h2>
                        <ul className="list-disc pl-5 space-y-2 text-white/70">
                            <li>You retain full ownership of any clothing images and content you upload to your Virtual Wardrobe.</li>
                            <li>By uploading content, you grant Vesto a limited, non-exclusive, royalty-free licence to store and process that content solely to provide the Service to you.</li>
                            <li>You agree <strong className="text-white">not</strong> to upload content that is inappropriate, offensive, defamatory, or violates any third-party intellectual property rights.</li>
                            <li>We do not use your uploaded images to train AI models or share them with third parties.</li>
                            <li>You may delete your content at any time through the app or by contacting us.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Acceptable Use</h2>
                        <p className="text-white/70 mb-3">You agree not to:</p>
                        <ul className="list-disc pl-5 space-y-2 text-white/70">
                            <li>Use the Service for any unlawful purpose or in violation of any applicable laws.</li>
                            <li>Attempt to gain unauthorised access to any part of the Service or its infrastructure.</li>
                            <li>Scrape, reverse engineer, or copy any part of the Service without written permission.</li>
                            <li>Use the Service to transmit spam, malware, or any harmful content.</li>
                            <li>Impersonate any person or entity or misrepresent your affiliation with any person or entity.</li>
                            <li>Interfere with or disrupt the integrity or performance of the Service.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Affiliate Disclosure</h2>
                        <ul className="list-disc pl-5 space-y-2 text-white/70">
                            <li>Vesto participates in affiliate marketing programmes via <strong className="text-white">Cuelinks</strong>. When you click on product links and make a purchase, we may earn a commission at no additional cost to you.</li>
                            <li>Affiliate commissions help support the development and maintenance of the platform.</li>
                            <li>Our product recommendations are based on skin tone compatibility and style matching — not on affiliate commission rates. We do not promote products solely because they offer higher commissions.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. Intellectual Property</h2>
                        <ul className="list-disc pl-5 space-y-2 text-white/70">
                            <li>All content, design, code, branding, logos, and features of Vesto are owned by or licensed to Vesto and are protected by applicable intellectual property laws.</li>
                            <li>You may not copy, reproduce, distribute, modify, or create derivative works from any part of the Service without our prior written permission.</li>
                            <li>The name "Vesto", the V logo, and all associated branding are trademarks of Vesto.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">7. Disclaimer of Warranties</h2>
                        <ul className="list-disc pl-5 space-y-2 text-white/70">
                            <li>The Service is provided <strong className="text-white">"as is"</strong> and <strong className="text-white">"as available"</strong> without warranties of any kind, either express or implied.</li>
                            <li>Fashion and style recommendations, skin tone analysis, and daily outfit suggestions are provided for <strong className="text-white">guidance and entertainment purposes only</strong>. Vesto does not guarantee specific style outcomes or that recommendations will suit every individual.</li>
                            <li>We do not warrant that the Service will be uninterrupted, error-free, or free of viruses or other harmful components.</li>
                            <li>Vesto is not a dermatology or medical service. Skin tone analysis is an approximate guide only.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">8. Limitation of Liability</h2>
                        <ul className="list-disc pl-5 space-y-2 text-white/70">
                            <li>To the maximum extent permitted by law, Vesto shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the Service.</li>
                            <li>Vesto shall not be liable for any damages arising from third-party links, purchases made through affiliate links, or content on external websites.</li>
                            <li>Our total liability to you for any claim arising from these Terms shall not exceed the amount you have paid to us in the 12 months preceding the claim (if any).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">9. Account Termination</h2>
                        <ul className="list-disc pl-5 space-y-2 text-white/70">
                            <li>You may delete your account at any time by contacting us at <a href="mailto:vesto.fashionstore@gmail.com" className="text-[#C4724F] hover:underline">vesto.fashionstore@gmail.com</a>.</li>
                            <li>We reserve the right to suspend or permanently terminate your access to the Service at any time, with or without notice, if we believe you have violated these Terms or applicable laws.</li>
                            <li>Upon termination, your right to use the Service ceases immediately. We will delete your data in accordance with our Privacy Policy.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">10. Changes to the Service</h2>
                        <p className="text-white/70">
                            We reserve the right to modify, suspend, or discontinue any part of the Service at any time without liability. We will endeavour to provide reasonable notice of significant changes where possible. Your continued use of the Service after changes constitutes acceptance of the modified Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">11. Changes to These Terms</h2>
                        <p className="text-white/70">
                            We may update these Terms from time to time. We will notify you of material changes by email or through a notice in the app. The updated Terms will be effective from the date posted. We encourage you to review these Terms periodically. Your continued use of the Service after changes are posted constitutes your acceptance.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">12. Governing Law & Disputes</h2>
                        <ul className="list-disc pl-5 space-y-2 text-white/70">
                            <li>These Terms are governed by and construed in accordance with the laws of <strong className="text-white">India</strong>, including the Information Technology Act, 2000.</li>
                            <li>Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts in India.</li>
                            <li>We encourage you to contact us first to resolve any disputes informally before pursuing legal action.</li>
                        </ul>
                    </section>

                    <section className="pt-8 border-t border-white/10">
                        <h2 className="text-xl font-bold text-white mb-4">Contact Us</h2>
                        <p className="text-white/70">
                            If you have any questions about these Terms of Service, please contact us at:{" "}
                            <a href="mailto:vesto.fashionstore@gmail.com" className="text-[#C4724F] hover:underline">
                                vesto.fashionstore@gmail.com
                            </a>
                        </p>
                        <p className="text-white/50 text-sm mt-2">We aim to respond to all enquiries within 7 business days.</p>
                    </section>

                </div>
            </div>
        </div>
    );
}
