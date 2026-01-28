"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { doc, setDoc, getDoc, arrayUnion, arrayRemove, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./auth-context";

export interface WardrobeItem {
    id: string;
    name: string;
    price: number;
    images: string[];
    productType: string;
    productStyle: string;
    baseColor: string;
    activityType?: string;
    colorFamily?: string;
}

interface WardrobeContextType {
    items: WardrobeItem[];
    addToWardrobe: (item: WardrobeItem) => Promise<void>;
    removeFromWardrobe: (itemId: string) => Promise<void>;
    isInWardrobe: (itemId: string) => boolean;
    loading: boolean;
}

const WardrobeContext = createContext<WardrobeContextType | undefined>(undefined);

export function WardrobeProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<WardrobeItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const { user, loading: authLoading } = useAuth();

    // Initialize Session ID for guests
    useEffect(() => {
        if (typeof window !== 'undefined') {
            let sid = sessionStorage.getItem("vesto_session_id");
            if (!sid) {
                sid = crypto.randomUUID();
                sessionStorage.setItem("vesto_session_id", sid);
            }
            setSessionId(sid);
        }
    }, []);

    // Load and Sync Wardrobe
    useEffect(() => {
        if (authLoading) return; // Wait for auth to settle
        if (!sessionId && !user) return;

        const loadAndSyncWardrobe = async () => {
            setLoading(true);
            try {
                if (user && user.email) {
                    // 1. User is logged in. Load User Wardrobe
                    const userDocRef = doc(db, "Wardrobe", user.email);
                    const userDocSnap = await getDoc(userDocRef);
                    let userItems: WardrobeItem[] = userDocSnap.exists() ? userDocSnap.data().items || [] : [];

                    // 2. Check for Guest Wardrobe to merge
                    if (sessionId) {
                        const guestDocRef = doc(db, "Wardrobe", sessionId);
                        const guestDocSnap = await getDoc(guestDocRef);

                        if (guestDocSnap.exists()) {
                            const guestItems: WardrobeItem[] = guestDocSnap.data().items || [];

                            if (guestItems.length > 0) {
                                // Merge guest items into user items
                                const mergedItems = [...userItems];
                                guestItems.forEach(guestItem => {
                                    if (!mergedItems.some(i => i.id === guestItem.id)) {
                                        mergedItems.push(guestItem);
                                    }
                                });

                                userItems = mergedItems;

                                // Update User Wardrobe in Firestore
                                await setDoc(userDocRef, {
                                    items: userItems,
                                    updatedAt: serverTimestamp()
                                }, { merge: true });

                                // Optional: access previous session data? For now, we just merge.
                                // We could delete the guest doc, but keeping it is safer for history.
                            }
                        }
                    }
                    setItems(userItems);

                } else if (sessionId) {
                    // Guest User
                    const docRef = doc(db, "Wardrobe", sessionId);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        setItems(docSnap.data().items || []);
                    } else {
                        setItems([]);
                    }
                }
            } catch (error) {
                console.error("Error loading wardrobe:", error);
            } finally {
                setLoading(false);
            }
        };

        loadAndSyncWardrobe();
    }, [user, sessionId, authLoading]);

    const addToWardrobe = async (item: WardrobeItem) => {
        const targetId = (user && user.email) ? user.email : sessionId;
        if (!targetId) return;

        // Optimistic Update
        if (items.some(i => i.id === item.id)) return;
        setItems(prev => [...prev, item]);

        try {
            const docRef = doc(db, "Wardrobe", targetId);
            await setDoc(docRef, {
                items: arrayUnion(item),
                updatedAt: serverTimestamp()
            }, { merge: true });
        } catch (error) {
            console.error("Error adding to wardrobe:", error);
            setItems(prev => prev.filter(i => i.id !== item.id));
        }
    };

    const removeFromWardrobe = async (itemId: string) => {
        const targetId = (user && user.email) ? user.email : sessionId;
        if (!targetId) return;

        const itemToRemove = items.find(i => i.id === itemId);
        if (!itemToRemove) return;

        setItems(prev => prev.filter(i => i.id !== itemId));

        try {
            const docRef = doc(db, "Wardrobe", targetId);
            await setDoc(docRef, {
                items: arrayRemove(itemToRemove),
                updatedAt: serverTimestamp()
            }, { merge: true });
        } catch (error) {
            console.error("Error removing from wardrobe:", error);
            setItems(prev => [...prev, itemToRemove]);
        }
    };

    const isInWardrobe = (itemId: string) => {
        return items.some(i => i.id === itemId);
    };

    return (
        <WardrobeContext.Provider value={{ items, addToWardrobe, removeFromWardrobe, isInWardrobe, loading }}>
            {children}
        </WardrobeContext.Provider>
    );
}

export function useWardrobe() {
    const context = useContext(WardrobeContext);
    if (context === undefined) {
        throw new Error("useWardrobe must be used within a WardrobeProvider");
    }
    return context;
}
