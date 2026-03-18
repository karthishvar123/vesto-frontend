"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Onboarding from "./onboarding";

export default function OnboardingWrapper() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const done = localStorage.getItem("vesto_onboarding_complete");
        if (!done) setShow(true);
    }, []);

    if (!show) return null;

    return (
        <AnimatePresence>
            <Onboarding
                onComplete={() => {
                    localStorage.setItem("vesto_onboarding_complete", "true");
                    setShow(false);
                }}
            />
        </AnimatePresence>
    );
}
