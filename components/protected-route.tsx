"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/navbar";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/profile");
        }
    }, [user, loading, router]);

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

    if (!user) {
        return null; // Don't render anything while redirecting
    }

    return <>{children}</>;
}
