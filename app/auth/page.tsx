"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import { Loader2, Mail, Chrome } from "lucide-react";

export default function AuthPage() {
    const { user, sendLoginLink, loginWithGoogle, logout } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await sendLoginLink(email);
            setSent(true);
        } catch (err: any) {
            setError(err.message || "Failed to send link.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        setLoading(true);
        setError("");
        try {
            await loginWithGoogle();
            router.push("/virtual-wardrobe");
        } catch (err: any) {
            setError(err.message || "Google sign-in failed.");
        } finally {
            setLoading(false);
        }
    };

    if (user) {
        return (
            <main className="min-h-screen bg-[#0A0A0A]">
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
                    <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                        <div className="w-14 h-14 rounded-full bg-[#C4724F]/20 border border-[#C4724F]/40 flex items-center justify-center text-[#C4724F] text-xl font-black mx-auto mb-4">
                            {user.email?.[0].toUpperCase()}
                        </div>
                        <p className="text-white font-bold mb-1 truncate">{user.displayName || "Welcome back"}</p>
                        <p className="text-white/40 text-sm mb-6 truncate">{user.email}</p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => router.push("/virtual-wardrobe")}
                                className="w-full bg-[#C4724F] hover:bg-[#d4845f] text-white py-3 rounded-xl font-bold transition-colors"
                            >
                                My Wardrobe
                            </button>
                            <button
                                onClick={logout}
                                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white py-3 rounded-xl font-medium transition-colors text-sm"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#0A0A0A]">
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
                <div className="w-full max-w-sm">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Sign In</h1>
                        <p className="text-white/40 text-sm">Access your wardrobe and style profile.</p>
                    </div>

                    {sent ? (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                            <div className="w-12 h-12 bg-[#C4724F]/10 border border-[#C4724F]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-5 h-5 text-[#C4724F]" />
                            </div>
                            <h2 className="text-white font-bold mb-2">Check your inbox</h2>
                            <p className="text-white/40 text-sm">We sent a sign-in link to <span className="text-white/70">{email}</span></p>
                        </div>
                    ) : (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-4">
                            {error && (
                                <p className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
                                    {error}
                                </p>
                            )}

                            <button
                                onClick={handleGoogle}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
                            >
                                <Chrome className="w-4 h-4" />
                                Continue with Google
                            </button>

                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-white/10" />
                                <span className="text-white/20 text-xs">or</span>
                                <div className="flex-1 h-px bg-white/10" />
                            </div>

                            <form onSubmit={handleEmailLogin} className="space-y-3">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-[#C4724F]/50 focus:ring-2 focus:ring-[#C4724F]/20 outline-none transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !email}
                                    className="w-full bg-[#C4724F] hover:bg-[#d4845f] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                                    Send Sign-In Link
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
