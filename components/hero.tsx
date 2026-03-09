"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

const WORDS = ["Skin Tone.", "Your Style.", "Your Confidence.", "Your Identity."];

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

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        for (let i = 0; i < 80; i++) {
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

            // Draw connecting lines
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

            {/* Content */}
            <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-24">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C4724F]/30 bg-[#C4724F]/10 text-[#C4724F] text-xs font-bold uppercase tracking-widest mb-10">
                    <Sparkles className="w-3 h-3" />
                    AI-Powered Style Intelligence
                </div>

                {/* Main heading */}
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white leading-[0.88] mb-6 select-none">
                    <span className="block">DRESS FOR</span>
                    <span className="block min-h-[1.1em] text-transparent bg-clip-text bg-gradient-to-r from-[#C4724F] via-[#E8A87C] to-[#C4724F]">
                        {displayed}
                        <span className="animate-pulse">|</span>
                    </span>
                </h1>

                <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-light">
                    Vesto analyses your skin tone, builds your wardrobe, and pairs every outfit — so you always look intentional.
                </p>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                    <Link
                        href="/shop-by-skin-tone"
                        className="group flex items-center gap-3 px-8 py-4 bg-[#C4724F] hover:bg-[#d4845f] text-white font-bold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(196,114,79,0.4)]"
                    >
                        Find My Skin Tone
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="/men"
                        className="group flex items-center gap-3 px-8 py-4 border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white font-medium rounded-full transition-all duration-300 backdrop-blur-sm"
                    >
                        Browse Collection
                    </Link>
                </div>

                {/* Stats bar */}
                <div className="flex items-center justify-center gap-12 text-center border-t border-white/5 pt-10">
                    {[
                        { num: "6", label: "Skin Tone Types" },
                        { num: "3", label: "Smart Categories" },
                        { num: "AI", label: "Camera Detection" },
                    ].map((s) => (
                        <div key={s.label}>
                            <div className="text-3xl font-black text-white mb-1">{s.num}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-widest">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 text-xs tracking-widest uppercase">
                <span>Scroll</span>
                <div className="w-px h-12 bg-gradient-to-b from-gray-600 to-transparent animate-pulse" />
            </div>
        </section>
    );
}
