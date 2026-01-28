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
                // No email in storage? Ask user to input it.
                setStatus("input_required");
                return;
            }

            try {
                await finishLogin(storedEmail, window.location.href);
                setStatus("success");
                router.push("/virtual-wardrobe");
            } catch (error: any) {
                console.error("Auto-login error:", error);

                // If invalid email, allow user to type it in
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
            setStatus("input_required"); // Let them try again

            if (error.code === 'auth/invalid-email') {
                setErrorMsg("That email address doesn't match the link. Please try again.");
            } else {
                setErrorMsg(error.message || "Failed to verified login link.");
            }
        }
    };

    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">

                {status === "verifying" && (
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                        <h2 className="text-xl text-[#111]">Verifying your login...</h2>
                    </div>
                )}

                {status === "input_required" && (
                    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-gray-100">
                        <div className="text-center mb-6">
                            <h2 className="text-xl font-medium text-[#111] mb-2">Confirm your email</h2>
                            <p className="text-gray-500 text-sm">
                                For security, please re-enter the email address you used to request this link.
                            </p>
                        </div>

                        {errorMsg && (
                            <div className="p-3 mb-4 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {errorMsg}
                            </div>
                        )}

                        <form onSubmit={handleManualSubmit} className="space-y-4">
                            <div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-[#111] text-white py-3 rounded-lg hover:bg-black transition-colors"
                            >
                                Complete Sign In
                            </button>
                        </form>
                    </div>
                )}

                {status === "error" && (
                    <div className="text-center max-w-md">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl text-[#111] mb-2">Login Link Expired or Invalid</h2>
                        <p className="text-gray-500 mb-6">{errorMsg}</p>
                        <button
                            onClick={() => router.push('/login')}
                            className="bg-[#111] text-white px-6 py-3 rounded-lg hover:bg-black transition-colors"
                        >
                            Back to Login
                        </button>
                    </div>
                )}

                {status === "success" && (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Loader2 className="w-8 h-8 animate-spin" />
                        </div>
                        <h2 className="text-xl text-[#111]">Success! Redirecting...</h2>
                    </div>
                )}

            </div>
        </main>
    );
}
