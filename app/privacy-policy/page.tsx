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

                <h1 className="text-4xl md:text-5xl font-bold font-serif mb-3 tracking-tight">Privacy Policy</h1>
                <p className="text-white/40 mb-2 uppercase tracking-widest text-sm">Effective Date: March 2026</p>
                <p className="text-white/40 mb-12 text-sm">Last Updated: March 2026</p>

                <div className="space-y-12 text-white/80 leading-relaxed">

                    <section>
                        <p className="text-white/70">
                            Vesto ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use the Vesto app and website. By using Vesto, you agree to the practices described in this policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
                        <div className="space-y-4 text-white/70">
                            <div>
                                <h3 className="text-white font-semibold mb-1">Account Information</h3>
                                <p>When you sign up using Google or Email via Firebase Authentication, we collect your name, email address, and basic profile data.</p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-1">Wardrobe Data</h3>
                                <p>Clothing images you upload are stored securely in Firebase Storage. Colour detection is performed client-side on your device — your images are not sent to any external AI or processing server.</p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-1">Skin Tone Data</h3>
                                <p>If you use the AI camera feature, skin tone analysis is performed entirely on your device using MediaPipe. No facial images or biometric data are transmitted to or stored on our servers.</p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-1">Usage Data</h3>
                                <p>We may collect standard analytics on how you interact with the app, such as pages visited and features used, to improve the service.</p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-1">Device Information</h3>
                                <p>We may collect basic device information such as browser type, operating system, and IP address for security and performance purposes.</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
                        <ul className="list-disc pl-5 space-y-2 text-white/70">
                            <li>To provide the core services of Vesto: virtual wardrobe management, personalised style suggestions, and skin-tone based recommendations.</li>
                            <li>To maintain and improve the performance, security, and features of the app.</li>
                            <li>To communicate with you about your account, updates, or support requests.</li>
                            <li>We <strong className="text-white">do not</strong> sell, rent, or share your personal data or uploaded images with third parties for marketing purposes.</li>
                            <li>We <strong className="text-white">do not</strong> use your wardrobe images or skin tone data to train any AI or machine learning models.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Third-Party Services</h2>
                        <div className="space-y-4 text-white/70">
                            <div>
                                <h3 className="text-white font-semibold mb-1">Google Firebase</h3>
                                <p>We use Firebase for authentication, database (Firestore), and file storage. Firebase is operated by Google LLC and their use of data is governed by <a href="https://firebase.google.com/support/privacy" target="_blank" className="text-[#C4724F] hover:underline">Google's Privacy Policy</a>.</p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-1">Affiliate Links (Cuelinks)</h3>
                                <p>When you click on product recommendations, you may be redirected to third-party stores via Cuelinks. Cuelinks and the destination stores may place cookies on your browser to track referrals and process commissions. We do not control these third-party cookies. You can opt out by disabling cookies in your browser settings.</p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-1">MediaPipe (Google)</h3>
                                <p>The AI camera feature uses MediaPipe, which runs entirely on your device. No camera data is sent to Google or any external server through our app.</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Data Storage & Security</h2>
                        <ul className="list-disc pl-5 space-y-2 text-white/70">
                            <li>Your data is stored securely using Firebase security rules, which restrict access to only your authenticated account.</li>
                            <li>We use industry-standard encryption for data in transit (HTTPS) and at rest.</li>
                            <li>While we take all reasonable measures to protect your data, no system is 100% secure. We cannot guarantee absolute security.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Data Retention</h2>
                        <ul className="list-disc pl-5 space-y-2 text-white/70">
                            <li>We retain your account and wardrobe data for as long as your account is active.</li>
                            <li>If you request account deletion, we will delete your personal data and wardrobe images within <strong className="text-white">30 days</strong>.</li>
                            <li>Anonymised, aggregated usage data may be retained for analytics purposes after account deletion.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. Your Rights</h2>
                        <ul className="list-disc pl-5 space-y-2 text-white/70">
                            <li><strong className="text-white">Access:</strong> You can request a copy of all personal data we hold about you.</li>
                            <li><strong className="text-white">Correction:</strong> You can update your account information at any time through the app.</li>
                            <li><strong className="text-white">Deletion:</strong> You can request deletion of your account and all associated data by contacting us.</li>
                            <li><strong className="text-white">Portability:</strong> You can request an export of your wardrobe data in a standard format.</li>
                            <li>To exercise any of these rights, email us at <a href="mailto:vesto.fashionstore@gmail.com" className="text-[#C4724F] hover:underline">vesto.fashionstore@gmail.com</a>.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">7. Children's Privacy</h2>
                        <p className="text-white/70">
                            Vesto is not intended for users under the age of <strong className="text-white">13</strong>. We do not knowingly collect personal data from children under 13. If we become aware that we have collected data from a child under 13, we will delete it immediately. If you believe a child has provided us with personal data, please contact us.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">8. Governing Law</h2>
                        <p className="text-white/70">
                            This Privacy Policy is governed by the laws of India, including the Information Technology Act, 2000 and applicable rules. Any disputes arising under this policy shall be subject to the jurisdiction of courts in India.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">9. Changes to This Policy</h2>
                        <p className="text-white/70">
                            We may update this Privacy Policy from time to time. We will notify you of significant changes by email or through a notice in the app. Your continued use of Vesto after changes are posted constitutes your acceptance of the updated policy. We encourage you to review this page periodically.
                        </p>
                    </section>

                    <section className="pt-8 border-t border-white/10">
                        <h2 className="text-xl font-bold text-white mb-4">Contact Us</h2>
                        <p className="text-white/70">
                            If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us at:{" "}
                            <a href="mailto:vesto.fashionstore@gmail.com" className="text-[#C4724F] hover:underline">
                                vesto.fashionstore@gmail.com
                            </a>
                        </p>
                        <p className="text-white/50 text-sm mt-2">We aim to respond to all privacy-related enquiries within 7 business days.</p>
                    </section>

                </div>
            </div>
        </div>
    );
}
