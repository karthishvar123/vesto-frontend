"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
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
            const type = parseInt(savedType) as SkinToneType;
            if (type !== selectedType) setSelectedType(type);
        }
        if (savedTone) {
            const tone = savedTone as NormalizedTone;
            if (tone !== normalizedTone) setNormalizedTone(tone);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // FIX: When a logged-in user loads the app and has no session skin tone,
    // pull their saved skin tone from Firestore so it persists across devices/sessions.
    useEffect(() => {
        if (!user || selectedType) return;

        const loadFromFirestore = async () => {
            try {
                const docRef = doc(db, "Skintone", user.email!);
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    const data = snap.data();
                    const type = data.fitzpatrickType as SkinToneType;
                    const tone = data.normalizedTone as NormalizedTone;
                    setSelectedType(type);
                    setNormalizedTone(tone);
                    sessionStorage.setItem("vesto_skintone_type", type.toString());
                    sessionStorage.setItem("vesto_normalized_tone", tone);
                }
            } catch (error) {
                console.error("Error loading skin tone from Firestore:", error);
            }
        };

        loadFromFirestore();
    }, [user, selectedType]);

    const normalizeSkinTone = (type: SkinToneType): NormalizedTone => {
        switch (type) {
            case 1:
            case 2: return "fair";
            case 3: return "medium";
            case 4: return "tan";
            case 5:
            case 6: return "deep";
            default: return "medium";
        }
    };

    const selectSkinTone = (type: SkinToneType) => {
        const tone = normalizeSkinTone(type);
        setSelectedType(type);
        setNormalizedTone(tone);
        sessionStorage.setItem("vesto_skintone_type", type.toString());
        sessionStorage.setItem("vesto_normalized_tone", tone);
    };

    const saveSkinToneToFirestore = async () => {
        if (!selectedType || !normalizedTone) return;

        try {
            let docId: string;

            if (user && user.email) {
                docId = user.email;
            } else {
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
