"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import Navbar from "@/components/navbar";
import { Loader2, AlertCircle } from "lucide-react";

export default function FinishLoginPage() {
    const router = useRouter();
    const { finishLogin } = useAuth();

    const [status, setStatus] = useState<"verifying" | "input_required" | "error" | "success">("verifying");
    const [email, setEmail] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    // Prevent double-execution in Strict Mode
    const processedRef = useRef(false);

    useEffect(() => {
        if (processedRef.current) return;
        processedRef.current = true;

        const attemptAutoLogin = async () => {
            const storedEmail = window.localStorage.getItem('emailForSignIn');

            if (!storedEmail) {
                setStatus("input_required");
                return;
            }

            try {
                await finishLogin(storedEmail, window.location.href);
                setStatus("success");
                router.push("/virtual-wardrobe");
            } catch (error: any) {
                console.error("Auto-login error:", error);
                if (error.code === 'auth/invalid-email') {
                    setStatus("input_required");
                    setErrorMsg("Please verify your email address to complete sign-in.");
                } else {
                    setStatus("error");
                    setErrorMsg(error.message || "Invalid or expired login link.");
                }
            }
        };

        attemptAutoLogin();
    }, [finishLogin, router]);

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus("verifying");
        setErrorMsg("");

        try {
            await finishLogin(email, window.location.href);
            setStatus("success");
            router.push("/virtual-wardrobe");
        } catch (error: any) {
            console.error("Manual login error:", error);
            setStatus("input_required");
            if (error.code === 'auth/invalid-email') {
                setErrorMsg("That email address doesn't match the link. Please try again.");
            } else {
                setErrorMsg(error.message || "Failed to verify login link.");
            }
        }
    };

    return (
        <main className="min-h-screen bg-[#0A0A0A]">
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">

                {status === "verifying" && (
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#C4724F]" />
                        <h2 className="text-xl text-white">Verifying your login...</h2>
                    </div>
                )}

                {status === "input_required" && (
                    <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm">
                        <div className="text-center mb-6">
                            <h2 className="text-xl font-medium text-white mb-2">Confirm your email</h2>
                            <p className="text-white/40 text-sm">
                                For security, please re-enter the email address you used to request this link.
                            </p>
                        </div>

                        {errorMsg && (
                            <div className="p-3 mb-4 bg-red-500/10 text-red-400 text-sm rounded-lg flex items-center gap-2 border border-red-500/20">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {errorMsg}
                            </div>
                        )}

                        <form onSubmit={handleManualSubmit} className="space-y-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:ring-2 focus:ring-[#C4724F]/30 focus:border-[#C4724F]/50 outline-none transition-all"
                                required
                            />
                            <button
                                type="submit"
                                className="w-full bg-[#C4724F] hover:bg-[#d4845f] text-white py-3 rounded-lg font-bold transition-colors"
                            >
                                Complete Sign In
                            </button>
                        </form>
                    </div>
                )}

                {status === "error" && (
                    <div className="text-center max-w-md">
                        <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl text-white mb-2">Login Link Expired or Invalid</h2>
                        <p className="text-white/40 mb-6">{errorMsg}</p>
                        <button
                            onClick={() => router.push('/profile')}
                            className="bg-[#C4724F] hover:bg-[#d4845f] text-white px-6 py-3 rounded-lg font-bold transition-colors"
                        >
                            Back to Login
                        </button>
                    </div>
                )}

                {status === "success" && (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-[#C4724F]/10 text-[#C4724F] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#C4724F]/20">
                            <Loader2 className="w-8 h-8 animate-spin" />
                        </div>
                        <h2 className="text-xl text-white">Success! Redirecting...</h2>
                    </div>
                )}

            </div>
        </main>
    );
}
