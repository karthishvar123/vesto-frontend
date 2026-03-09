"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import Navbar from "@/components/navbar";
import { Loader2, ArrowRight, LogOut, User as UserIcon, Mail, Sparkles } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ProfilePage() {
    const { user, logout, sendLoginLink, loginWithGoogle, loading } = useAuth();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const [profileData, setProfileData] = useState<{ displayName?: string }>({});

    useEffect(() => {
        if (user) {
            const fetchProfile = async () => {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) setProfileData(docSnap.data());
            };
            fetchProfile();
        }
    }, [user]);

    const handleGoogleLogin = async () => {
        setStatus("loading");
        setErrorMsg("");
        try {
            await loginWithGoogle();
            setStatus("success");
        } catch (error: any) {
            setStatus("error");
            setErrorMsg(error.message || "Failed to sign in with Google.");
        }
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !name) return;
        setStatus("loading");
        setErrorMsg("");
        try {
            await sendLoginLink(email);
            window.localStorage.setItem('emailForSignIn', email);
            window.localStorage.setItem('nameForSignIn', name);
            setStatus("success");
        } catch (error: any) {
            setStatus("error");
            setErrorMsg(error.message || "Failed to send login link.");
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-[#0A0A0A]">
                <Navbar />
                <div className="flex items-center justify-center min-h-[80vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-[#C4724F]" />
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#0A0A0A]">
            <Navbar />

            {/* Background glow */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#C4724F]/5 blur-[100px]" />
            </div>

            <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 pt-20 relative z-10">
                <div className="w-full max-w-md bg-[#111]/80 backdrop-blur-xl p-8 md:p-10 rounded-2xl border border-white/8 shadow-2xl">

                    {user ? (
                        <div className="text-center">
                            <div className="w-20 h-20 bg-[#C4724F]/10 border border-[#C4724F]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-[#C4724F] text-2xl font-black">{user.email?.[0].toUpperCase()}</span>
                            </div>
                            <h1 className="text-2xl font-light text-white mb-1">
                                Welcome, <span className="font-bold">{profileData.displayName || "User"}</span>
                            </h1>
                            <p className="text-white/40 mb-8 text-sm">{user.email}</p>
                            <button
                                onClick={logout}
                                className="w-full bg-white/5 border border-white/10 text-white/70 hover:text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-sm"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#C4724F]/30 bg-[#C4724F]/10 text-[#C4724F] text-xs font-bold uppercase tracking-widest mb-5">
                                    <Sparkles className="w-3 h-3" />
                                    Members Only
                                </div>
                                <h1 className="text-3xl font-bold text-white mb-2">Sign In</h1>
                                <p className="text-white/40 text-sm">Log in to sync your wardrobe across all devices.</p>
                            </div>

                            {status === "success" ? (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 bg-[#C4724F]/10 border border-[#C4724F]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Mail className="w-8 h-8 text-[#C4724F]" />
                                    </div>
                                    <h3 className="text-xl font-medium text-white mb-2">Check your email</h3>
                                    <p className="text-white/40 mb-6 text-sm">
                                        We sent a magic link to <span className="font-semibold text-white">{email}</span>
                                    </p>
                                    <button onClick={() => setStatus("idle")} className="text-sm text-white/30 hover:text-white transition-colors">
                                        Try a different email
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Your Name"
                                            className="w-full px-4 py-3 rounded-lg text-sm"
                                            required
                                        />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="name@example.com"
                                            className="w-full px-4 py-3 rounded-lg text-sm"
                                            required
                                        />
                                        {status === "error" && (
                                            <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 px-3 py-2 rounded-lg">{errorMsg}</p>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={status === "loading" || !email || !name}
                                            className="vesto-btn-primary w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                                        >
                                            {status === "loading" ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>Login with Email <ArrowRight className="w-4 h-4" /></>
                                            )}
                                        </button>
                                    </form>

                                    <div className="my-6 flex items-center gap-3">
                                        <div className="flex-1 h-px bg-white/5" />
                                        <span className="text-white/20 text-xs">or</span>
                                        <div className="flex-1 h-px bg-white/5" />
                                    </div>

                                    <button
                                        onClick={handleGoogleLogin}
                                        disabled={status === "loading"}
                                        className="vesto-btn-ghost w-full justify-center text-sm"
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                        Continue with Google
                                    </button>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
