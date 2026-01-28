import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyChFWneIyBsWRLEY5f8jbNIygI4f-RyqFQ",
    authDomain: "vesto-9eb76.firebaseapp.com",
    projectId: "vesto-9eb76",
    storageBucket: "vesto-9eb76.firebasestorage.app",
    messagingSenderId: "297025085510",
    appId: "1:297025085510:web:64e7d823abcebde8dd6a47",
    measurementId: "G-62508YYZHX"
};

// Initialize Firebase (Singleton pattern)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { db, storage, auth, googleProvider };
