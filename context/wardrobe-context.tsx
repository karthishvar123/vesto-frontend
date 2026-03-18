"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { doc, setDoc, getDoc, arrayUnion, arrayRemove, serverTimestamp, runTransaction } from "firebase/firestore";
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
    brand?: string;
    activityType?: string;
    colorFamily?: string;
}

interface WardrobeContextType {
    items: WardrobeItem[];
    addToWardrobe: (item: WardrobeItem) => Promise<void>;
    removeFromWardrobe: (itemId: string) => Promise<void>;
    updateWardrobeItem: (itemId: string, updates: Partial<WardrobeItem>) => Promise<void>;
    isInWardrobe: (itemId: string) => boolean;
    loading: boolean;
}

const WardrobeContext = createContext<WardrobeContextType | undefined>(undefined);

export function WardrobeProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<WardrobeItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const { user, loading: authLoading } = useAuth();
    
    // Internal helper to sync items to localStorage
    const updateItemsAndCache = (newItemsOrUpdater: React.SetStateAction<WardrobeItem[]>) => {
        setItems((prev) => {
            const resolvedItems = typeof newItemsOrUpdater === "function" ? newItemsOrUpdater(prev) : newItemsOrUpdater;
            if (typeof window !== "undefined") {
                localStorage.setItem("vesto_wardrobe_cache", JSON.stringify(resolvedItems));
            }
            return resolvedItems;
        });
    };

    // Initialize Session ID & Optimistic Cache Load
    useEffect(() => {
        if (typeof window !== "undefined") {
            const cachedItems = localStorage.getItem("vesto_wardrobe_cache");
            if (cachedItems) {
                try {
                    setItems(JSON.parse(cachedItems));
                } catch {
                    console.error("Failed to parse wardrobe cache");
                }
            }
            let sid = sessionStorage.getItem("vesto_session_id");
            if (!sid) {
                // Generate UUID with fallback for older browsers
                sid = crypto.randomUUID?.() ||
                    `${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}`;
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
                    updateItemsAndCache(userItems);

                } else if (sessionId) {
                    // Guest User
                    const docRef = doc(db, "Wardrobe", sessionId);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        updateItemsAndCache(docSnap.data().items || []);
                    } else {
                        // Keep cached items if we are offline and couldn't fetch, otherwise 0
                        setItems(prev => prev.length > 0 ? prev : []);
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
        updateItemsAndCache(prev => [...prev, item]);

        try {
            const docRef = doc(db, "Wardrobe", targetId);
            await setDoc(docRef, {
                items: arrayUnion(item),
                updatedAt: serverTimestamp()
            }, { merge: true });
        } catch (error) {
            console.error("Error adding to wardrobe:", error);
            updateItemsAndCache(prev => prev.filter(i => i.id !== item.id));
        }
    };

    const updateWardrobeItem = async (itemId: string, updates: Partial<WardrobeItem>) => {
        const targetId = (user && user.email) ? user.email : sessionId;
        if (!targetId) return;

        const oldItem = items.find(i => i.id === itemId);
        if (!oldItem) return;
        const updatedItem = { ...oldItem, ...updates };

        // Optimistic update
        updateItemsAndCache(prev => prev.map(i => i.id === itemId ? updatedItem : i));

        try {
            const docRef = doc(db, "Wardrobe", targetId);
            await runTransaction(db, async (transaction) => {
                const snap = await transaction.get(docRef);
                const currentItems: WardrobeItem[] = snap.exists() ? snap.data().items || [] : [];
                const updatedItems = currentItems.map((i: WardrobeItem) =>
                    i.id === itemId ? updatedItem : i
                );
                transaction.set(docRef, { items: updatedItems, updatedAt: serverTimestamp() }, { merge: true });
            });
        } catch (error) {
            console.error("Error updating wardrobe item:", error);
            // Rollback
            updateItemsAndCache(prev => prev.map(i => i.id === itemId ? oldItem : i));
        }
    };

    const removeFromWardrobe = async (itemId: string) => {
        const targetId = (user && user.email) ? user.email : sessionId;
        if (!targetId) return;

        const itemToRemove = items.find(i => i.id === itemId);
        if (!itemToRemove) return;

        updateItemsAndCache(prev => prev.filter(i => i.id !== itemId));

        try {
            const docRef = doc(db, "Wardrobe", targetId);
            await setDoc(docRef, {
                items: arrayRemove(itemToRemove),
                updatedAt: serverTimestamp()
            }, { merge: true });
        } catch (error) {
            console.error("Error removing from wardrobe:", error);
            updateItemsAndCache(prev => [...prev, itemToRemove]);
        }
    };

    const isInWardrobe = (itemId: string) => {
        return items.some(i => i.id === itemId);
    };

    return (
        <WardrobeContext.Provider value={{ items, addToWardrobe, removeFromWardrobe, updateWardrobeItem, isInWardrobe, loading }}>
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
