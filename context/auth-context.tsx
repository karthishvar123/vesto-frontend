"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
    User,
    sendSignInLinkToEmail,
    isSignInWithEmailLink,
    signInWithEmailLink,
    signOut,
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider
} from "firebase/auth";
import { auth, db, googleProvider } from "../lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    sendLoginLink: (email: string) => Promise<void>;
    finishLogin: (email: string, link: string, displayName?: string) => Promise<User>;
    loginWithGoogle: () => Promise<User>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const sendLoginLink = async (email: string) => {
        const actionCodeSettings = {
            url: `${window.location.origin}/finish-login`,
            handleCodeInApp: true,
        };

        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        // Save email for verification in the finish-login page
        window.localStorage.setItem('emailForSignIn', email);
    };

    const finishLogin = async (email: string, link: string) => {
        if (!isSignInWithEmailLink(auth, link)) {
            throw new Error("Invalid login link");
        }

        // Ensure clean sign-in state to avoid "credential-already-in-use" or linking errors
        // (especially if React Strict Mode runs effects twice or previous session lingers)
        if (auth.currentUser) {
            await signOut(auth);
        }

        const result = await signInWithEmailLink(auth, email, link);
        window.localStorage.removeItem('emailForSignIn');

        // Create user profile if it doesn't exist
        if (result.user) {
            const userRef = doc(db, "users", result.user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    email: result.user.email,
                    createdAt: serverTimestamp(),
                });
            }
        }

        return result.user;
    };

    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Create user profile if it doesn't exist
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    createdAt: serverTimestamp(),
                });
            }

            return user;
        } catch (error) {
            console.error("Error signing in with Google", error);
            throw error;
        }
    };

    const logout = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, loading, sendLoginLink, finishLogin, loginWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
