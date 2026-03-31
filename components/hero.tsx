"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

const WORDS = ["Skin Tone.", "Your Style.", "Your Confidence.", "Your Identity."];

const MOCK_COLORS = [
    { name: "Olive", hex: "#6B7A4A" },
    { name: "Rust", hex: "#8B4513" },
    { name: "Cream", hex: "#F5DEB3" },
    { name: "Navy", hex: "#1B2A4A" },
    { name: "Camel", hex: "#C19A6B" },
];

const MOCK_OUTFIT = [
    { label: "Linen Shirt", tag: "Topwear", color: "#C19A6B" },
    { label: "Slim Chinos", tag: "Bottomwear", color: "#6B7A4A" },
    { label: "Derby Shoes", tag: "Footwear", color: "#4B2C20" },
];

function PhoneMockup() {
    return (
        <div className="relative mx-auto select-none
            w-[200px] sm:w-[240px] md:w-[260px]">
            {/* Phone outer frame */}
            <div className="relative rounded-[32px] border border-white/10 bg-[#111] shadow-[0_40px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.05)] overflow-hidden">
                {/* Top notch */}
                <div className="flex justify-center pt-3 pb-1">
                    <div className="w-16 h-1 rounded-full bg-white/10" />
                </div>

                {/* Screen content */}
                <div className="px-3 pb-5 pt-1.5 space-y-2.5">
                    {/* App header */}
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black tracking-widest text-[#C4724F] uppercase">Vesto</span>
                        <CheckCircle2 className="w-3 h-3 text-green-400" />
                    </div>

                    {/* Skin tone detected chip */}
                    <div className="rounded-xl bg-[#C4724F]/15 border border-[#C4724F]/25 px-2.5 py-2">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full border-2 border-[#C4724F]/40 shrink-0" style={{ backgroundColor: "#A87652" }} />
                            <div>
                                <p className="text-white text-[9px] font-black leading-none">Type IV · Moderate Brown</p>
                                <p className="text-white/40 text-[7px] mt-0.5">Warm undertone detected</p>
                            </div>
                        </div>
                    </div>

                    {/* Best colors row */}
                    <div>
                        <p className="text-white/30 text-[7px] uppercase tracking-widest mb-1 font-bold">Your Best Colors</p>
                        <div className="flex gap-1">
                            {MOCK_COLORS.map((c) => (
                                <div key={c.name} className="flex flex-col items-center gap-0.5">
                                    <div
                                        className="w-6 h-6 rounded-full border border-white/10"
                                        style={{ backgroundColor: c.hex }}
                                    />
                                    <span className="text-white/25 text-[5px]">{c.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Today's outfit card */}
                    <div className="rounded-xl bg-white/4 border border-white/8 overflow-hidden">
                        <div className="px-2.5 py-1.5 border-b border-white/5 flex items-center justify-between">
                            <p className="text-white text-[8px] font-black uppercase tracking-wider">Today&apos;s Outfit</p>
                            <Sparkles className="w-2 h-2 text-[#C4724F]" />
                        </div>
                        <div className="px-2.5 py-1.5 space-y-1">
                            {MOCK_OUTFIT.map((item) => (
                                <div key={item.label} className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-white/70 text-[8px] font-medium flex-1">{item.label}</span>
                                    <span className="text-white/25 text-[6px] uppercase tracking-wider">{item.tag}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mock CTA */}
                    <div className="w-full rounded-full bg-[#C4724F] py-1.5 text-center">
                        <span className="text-white text-[8px] font-black uppercase tracking-wider">Shop This Look</span>
                    </div>
                </div>
            </div>

            {/* Glow under phone */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-10 bg-[#C4724F]/20 blur-2xl rounded-full pointer-events-none" />
        </div>
    );
}

export default function Hero() {
    const [wordIndex, setWordIndex] = useState(0);
    const [displayed, setDisplayed] = useState("");
    const [deleting, setDeleting] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Typewriter effect
    useEffect(() => {
        const target = WORDS[wordIndex];
        let timeout: ReturnType<typeof setTimeout>;

        if (!deleting && displayed.length < target.length) {
            timeout = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 80);
        } else if (!deleting && displayed.length === target.length) {
            timeout = setTimeout(() => setDeleting(true), 1800);
        } else if (deleting && displayed.length > 0) {
            timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
        } else if (deleting && displayed.length === 0) {
            setDeleting(false);
            setWordIndex((i) => (i + 1) % WORDS.length);
        }
        return () => clearTimeout(timeout);
    }, [displayed, deleting, wordIndex]);

    // Particle canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;
        const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number }[] = [];
        const isMobile = window.innerWidth < 768;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const particleCount = isMobile ? 30 : 80;
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                r: Math.random() * 1.5 + 0.3,
                alpha: Math.random() * 0.5 + 0.1,
            });
        }

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(180,140,100,${p.alpha})`;
                ctx.fill();
            });

            // Draw connecting lines (skip on mobile)
            if (!isMobile) {
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 120) {
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.strokeStyle = `rgba(180,140,100,${0.08 * (1 - dist / 120)})`;
                            ctx.lineWidth = 0.5;
                            ctx.stroke();
                        }
                    }
                }
            }

            animationId = requestAnimationFrame(draw);
        };

        draw();
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0A]">
            {/* Particle canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

            {/* Radial glow */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#C4724F]/8 blur-[120px]" />
                <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-indigo-500/5 blur-[80px]" />
            </div>

            {/* Grid overlay */}
            <div
                className="absolute inset-0 z-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
                    backgroundSize: "60px 60px",
                }}
            />

            {/* Content — stacked on mobile, split on md+ */}
            <div className="relative z-10 w-full max-w-6xl mx-auto px-5 pt-20 pb-10 md:pt-24 md:pb-16
                flex flex-col md:flex-row items-center justify-between gap-8 md:gap-8">

                {/* Left: text + CTAs */}
                <div className="flex-1 text-center md:text-left w-full">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-[#C4724F]/30 bg-[#C4724F]/10 text-[#C4724F] text-[10px] md:text-xs font-bold uppercase tracking-widest mb-5 md:mb-8">
                        <Sparkles className="w-3 h-3" />
                        Smart Style. Built For You.
                    </div>

                    {/* Main heading */}
                    <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[0.88] mb-4 md:mb-6 select-none">
                        <span className="block">DRESS FOR</span>
                        <span className="block min-h-[1.1em] text-transparent bg-clip-text bg-gradient-to-r from-[#C4724F] via-[#E8A87C] to-[#C4724F]">
                            {displayed}
                            <span className="animate-pulse">|</span>
                        </span>
                    </h1>

                    <p className="text-gray-400 text-base md:text-xl max-w-xl mx-auto md:mx-0 mb-6 md:mb-8 leading-relaxed font-light">
                        Tell Vesto your skin tone. It shows you exactly which colors suit you, builds your digital wardrobe, and suggests a fresh outfit every morning. Free.
                    </p>

                    {/* CTA buttons */}
                    <div className="flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-3 mb-2">
                        <Link
                            href="/shop-by-skin-tone"
                            className="group flex items-center justify-center gap-3 px-7 py-3.5 md:px-8 md:py-4 w-full sm:w-auto bg-[#C4724F] hover:bg-[#d4845f] text-white font-bold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(196,114,79,0.4)]"
                        >
                            Find My Skin Tone
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/men"
                            className="group flex items-center justify-center gap-3 px-7 py-3.5 md:px-8 md:py-4 w-full sm:w-auto border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white font-medium rounded-full transition-all duration-300 backdrop-blur-sm"
                        >
                            Browse Collection
                        </Link>
                    </div>

                    {/* Explainer line */}
                    <p className="text-white/30 text-xs text-center md:text-left mb-6 md:mb-8">
                        Use your camera or pick manually — takes 10 seconds.
                    </p>

                    {/* Stats bar */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-8 text-center md:text-left border-t border-white/5 pt-6 md:pt-8 w-full">
                        {[
                            { num: "6", label: "Skin Types" },
                            { num: "∞", label: "Outfits" },
                            { num: "Free", label: "Always" },
                        ].map((s) => (
                            <div key={s.label} className="flex flex-col items-center md:items-start justify-center">
                                <div className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-0.5">{s.num}</div>
                                <div className="text-[9px] sm:text-xs text-gray-500 uppercase tracking-widest leading-tight">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: phone mockup — inline on mobile (compact), full on desktop */}
                <div className="flex-shrink-0 w-full md:w-auto flex items-center justify-center">
                    <PhoneMockup />
                </div>

            </div>
        </section>
    );
}
