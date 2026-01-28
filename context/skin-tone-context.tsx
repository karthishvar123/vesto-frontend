"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./auth-context";

type SkinToneType = 1 | 2 | 3 | 4 | 5 | 6;
type NormalizedTone = "fair" | "medium" | "tan" | "deep";

interface SkinToneContextType {
    selectedType: SkinToneType | null;
    normalizedTone: NormalizedTone | null;
    selectSkinTone: (type: SkinToneType) => void;
    saveSkinToneToFirestore: () => Promise<void>;
}

const SkinToneContext = createContext<SkinToneContextType | undefined>(undefined);

export function SkinToneProvider({ children }: { children: React.ReactNode }) {
    const [selectedType, setSelectedType] = useState<SkinToneType | null>(null);
    const [normalizedTone, setNormalizedTone] = useState<NormalizedTone | null>(null);
    const { user } = useAuth();

    // Load from session storage on mount
    useEffect(() => {
        const savedType = sessionStorage.getItem("vesto_skintone_type");
        const savedTone = sessionStorage.getItem("vesto_normalized_tone");

        if (savedType) {
            setSelectedType(parseInt(savedType) as SkinToneType);
        }
        if (savedTone) {
            setNormalizedTone(savedTone as NormalizedTone);
        }
    }, []);

    const normalizeSkinTone = (type: SkinToneType): NormalizedTone => {
        switch (type) {
            case 1:
            case 2:
                return "fair";
            case 3:
                return "medium";
            case 4:
                return "tan";
            case 5:
            case 6:
                return "deep";
            default:
                return "medium"; // Fallback
        }
    };

    const selectSkinTone = (type: SkinToneType) => {
        const tone = normalizeSkinTone(type);

        // Update State
        setSelectedType(type);
        setNormalizedTone(tone);

        // Persist to Session Storage
        sessionStorage.setItem("vesto_skintone_type", type.toString());
        sessionStorage.setItem("vesto_normalized_tone", tone);
    };

    const saveSkinToneToFirestore = async () => {
        if (!selectedType || !normalizedTone) return;

        try {
            let docId = null;

            if (user && user.email) {
                // Use email if logged in
                docId = user.email;
            } else {
                // Use session ID if guest
                let sessionId = sessionStorage.getItem("vesto_session_id");
                if (!sessionId) {
                    sessionId = crypto.randomUUID();
                    sessionStorage.setItem("vesto_session_id", sessionId);
                }
                docId = sessionId;
            }

            const docRef = doc(db, "Skintone", docId);
            await setDoc(docRef, {
                id: docId,
                fitzpatrickType: selectedType,
                normalizedTone: normalizedTone,
                source: "manual",
                createdAt: serverTimestamp(),
            });

        } catch (error) {
            console.error("Error saving skin tone:", error);
        }
    };



    return (
        <SkinToneContext.Provider value={{ selectedType, normalizedTone, selectSkinTone, saveSkinToneToFirestore }}>
            {children}
        </SkinToneContext.Provider>
    );
}

export function useSkinTone() {
    const context = useContext(SkinToneContext);
    if (context === undefined) {
        throw new Error("useSkinTone must be used within a SkinToneProvider");
    }
    return context;
}
