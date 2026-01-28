"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import Navbar from "@/components/navbar";
import { Loader2, ArrowRight, LogOut, User as UserIcon, Mail } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ProfilePage() {
    const { user, logout, sendLoginLink, loginWithGoogle, loading } = useAuth();

    // Login Form State
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    // Profile Data State
    const [profileData, setProfileData] = useState<{ displayName?: string }>({});

    // Fetch Profile Data when user is logged in
    useEffect(() => {
        if (user) {
            const fetchProfile = async () => {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProfileData(docSnap.data());
                }
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
            console.error("Google login error:", error);
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
            // Save email AND name for the finish-login step
            window.localStorage.setItem('emailForSignIn', email);
            window.localStorage.setItem('nameForSignIn', name);
            setStatus("success");
        } catch (error: any) {
            console.error("Login error:", error);
            setStatus("error");
            setErrorMsg(error.message || "Failed to send login link.");
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-white">
                <Navbar />
                <div className="flex items-center justify-center min-h-[80vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 pt-20">
                <div className="w-full max-w-md bg-white p-8 md:p-12 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-gray-100">

                    {user ? (
                        // --- AUTHENTICATED VIEW ---
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                                <UserIcon className="w-10 h-10" />
                            </div>

                            <h1 className="text-2xl font-light text-[#111] mb-2">
                                Welcome, <span className="font-medium">{profileData.displayName || "User"}</span>
                            </h1>
                            <p className="text-gray-500 mb-8">{user.email}</p>

                            <button
                                onClick={logout}
                                className="w-full bg-white border border-gray-200 text-[#111] py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Log out
                            </button>
                        </div>
                    ) : (
                        // --- GUEST / LOGIN VIEW ---
                        <>
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-light text-[#111] mb-2">Profile</h1>
                                <p className="text-gray-500">Log in to view your profile and sync your wardrobe.</p>
                            </div>

                            {status === "success" ? (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Mail className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-medium text-[#111] mb-2">Check your email</h3>
                                    <p className="text-gray-500 mb-6">
                                        We sent a magic link to <span className="font-semibold text-[#111]">{email}</span>. <br />
                                        Click the link to log in.
                                    </p>
                                    <button
                                        onClick={() => setStatus("idle")}
                                        className="text-sm text-gray-400 hover:text-black transition-colors"
                                    >
                                        Try a different email
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <form onSubmit={handleLoginSubmit} className="space-y-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Your Name"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                                Email address
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="name@example.com"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                                                required
                                            />
                                        </div>

                                        {status === "error" && (
                                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
                                                {errorMsg}
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={status === "loading" || !email || !name}
                                            className="w-full bg-[#111] text-white py-3.5 rounded-lg flex items-center justify-center gap-2 hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                                        >
                                            {status === "loading" ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <>
                                                    Login with Email
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                    </form>

                                    <div className="mt-6">
                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-gray-200"></div>
                                            </div>
                                            <div className="relative flex justify-center text-sm">
                                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleGoogleLogin}
                                            disabled={status === "loading"}
                                            className="mt-6 w-full bg-white border border-gray-200 text-[#111] py-3.5 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-all font-medium"
                                        >
                                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                <path
                                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                    fill="#4285F4"
                                                />
                                                <path
                                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                    fill="#34A853"
                                                />
                                                <path
                                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                    fill="#FBBC05"
                                                />
                                                <path
                                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                    fill="#EA4335"
                                                />
                                            </svg>
                                            Sign in with Google
                                        </button>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </main >
    );
}
