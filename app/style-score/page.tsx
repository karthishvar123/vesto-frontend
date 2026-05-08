"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingBag, AlertTriangle, CheckCircle2, TrendingUp, Palette, Target, Zap } from "lucide-react";
import Navbar from "@/components/navbar";
import { useWardrobe } from "@/context/wardrobe-context";
import { useSkinTone } from "@/context/skin-tone-context";
import {
    getCompositeStyleScore,
    getCoverageScore,
    getSkinToneMatchPct,
    getColorBalance,
    getOccasionCoverage,
    getGapAlerts,
} from "@/lib/style-score";

// ── Circular progress meter ───────────────────────────────────
function CircularMeter({
    pct, label, sublabel, color = "#C4724F", size = 140, delay = 0,
}: {
    pct: number; label: string; sublabel: string;
    color?: string; size?: number; delay?: number;
}) {
    const r = (size - 16) / 2;
    const circ = 2 * Math.PI * r;
    const dash = (pct / 100) * circ;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className="flex flex-col items-center gap-3"
        >
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="-rotate-90">
                    {/* Track */}
                    <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
                    {/* Progress */}
                    <motion.circle
                        cx={size / 2} cy={size / 2} r={r}
                        fill="none"
                        stroke={color}
                        strokeWidth={8}
                        strokeLinecap="round"
                        strokeDasharray={circ}
                        initial={{ strokeDashoffset: circ }}
                        animate={{ strokeDashoffset: circ - dash }}
                        transition={{ duration: 1.2, delay: delay + 0.2, ease: "easeOut" }}
                    />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                        className="text-3xl font-black text-white leading-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: delay + 0.8 }}
                    >
                        {pct}
                    </motion.span>
                    <span className="text-xs text-white/30 font-bold">%</span>
                </div>
            </div>
            <div className="text-center">
                <p className="text-white font-bold text-sm">{label}</p>
                <p className="text-white/40 text-xs mt-0.5">{sublabel}</p>
            </div>
        </motion.div>
    );
}

// ── Donut chart for color balance ────────────────────────────
function DonutChart({ segments }: { segments: { label: string; pct: number; color: string }[] }) {
    const r = 52;
    const circ = 2 * Math.PI * r;
    let offset = 0;
    const validSegs = segments.filter((s) => s.pct > 0);

    return (
        <div className="flex items-center gap-8 flex-wrap justify-center">
            <div className="relative w-32 h-32">
                <svg width={128} height={128} className="-rotate-90">
                    <circle cx={64} cy={64} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={20} />
                    {validSegs.map((seg, i) => {
                        const dash = (seg.pct / 100) * circ;
                        const gap  = circ - dash;
                        const el = (
                            <motion.circle
                                key={seg.label}
                                cx={64} cy={64} r={r}
                                fill="none"
                                stroke={seg.color}
                                strokeWidth={20}
                                strokeDasharray={`${dash} ${gap}`}
                                strokeDashoffset={-offset}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 + i * 0.15 }}
                            />
                        );
                        offset += dash;
                        return el;
                    })}
                </svg>
                {validSegs.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white/20 text-xs text-center leading-tight">No data</span>
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-2">
                {segments.map((seg) => (
                    <div key={seg.label} className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                        <span className="text-xs text-white/60 font-medium">{seg.label}</span>
                        <span className="text-xs text-white/30 ml-auto pl-4">{seg.pct}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Grade helper ──────────────────────────────────────────────
function getGrade(score: number): { label: string; color: string; bg: string } {
    if (score >= 80) return { label: "Excellent", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" };
    if (score >= 60) return { label: "Good",      color: "text-[#E8A87C]",   bg: "bg-[#C4724F]/10 border-[#C4724F]/20" };
    if (score >= 40) return { label: "Fair",      color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/20" };
    return              { label: "Needs Work",  color: "text-red-400",     bg: "bg-red-500/10 border-red-500/20" };
}

// ── Main page ─────────────────────────────────────────────────
export default function StyleScorePage() {
    const { items, loading } = useWardrobe();
    const { selectedType } = useSkinTone();

    const scores = useMemo(() => ({
        composite:  getCompositeStyleScore(items, selectedType),
        coverage:   getCoverageScore(items),
        skinMatch:  getSkinToneMatchPct(items, selectedType),
        colorBal:   getColorBalance(items),
        occasions:  getOccasionCoverage(items),
        gaps:       getGapAlerts(items, selectedType),
    }), [items, selectedType]);

    const grade = getGrade(scores.composite);

    return (
        <main className="min-h-screen bg-[#0A0A0A]">
                <Navbar />

                {/* Ambient glow */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-[#C4724F]/4 blur-[130px]" />
                </div>

                <div className="relative z-10 pt-20 sm:pt-32 pb-28 px-4 sm:px-6 md:px-8 max-w-5xl mx-auto">

                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
                        <span className="text-[#C4724F] text-xs font-bold uppercase tracking-widest mb-3 block">Wardrobe Intelligence</span>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                                    Style Score
                                </h1>
                                <p className="text-white/30 mt-3 text-sm">
                                    Based on {items.length} item{items.length !== 1 ? "s" : ""} · {selectedType ? `Fitzpatrick Type ${selectedType}` : "No skin tone set"}
                                </p>
                            </div>
                            {items.length > 0 && (
                                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold ${grade.bg} ${grade.color}`}>
                                    <Zap className="w-4 h-4" />
                                    {grade.label}
                                </span>
                            )}
                        </div>
                    </motion.div>

                    {loading ? (
                        /* Skeleton */
                        <div className="space-y-6 animate-pulse">
                            <div className="h-64 skeleton rounded-2xl" />
                            <div className="h-48 skeleton rounded-2xl" />
                        </div>
                    ) : items.length === 0 ? (
                        /* Empty state */
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-24 h-24 rounded-3xl bg-[#C4724F]/10 border border-[#C4724F]/20 flex items-center justify-center mb-6">
                                <TrendingUp className="w-10 h-10 text-[#C4724F]/50" />
                            </div>
                            <h2 className="text-2xl font-black text-white mb-2">No wardrobe data yet</h2>
                            <p className="text-white/40 text-sm max-w-xs mb-8 leading-relaxed">
                                Add items to your wardrobe to unlock your Style Score and see what's missing.
                            </p>
                            <Link href="/virtual-wardrobe" className="inline-flex items-center gap-2 px-6 py-3 bg-[#C4724F] text-white font-bold rounded-full hover:bg-[#d4845f] transition-all">
                                Build Your Wardrobe
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="space-y-6">

                            {/* ── Composite Score Hero ── */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                                className="bg-[#111] border border-white/5 rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-8"
                            >
                                <CircularMeter pct={scores.composite} label="Overall Style Score" sublabel="Composite rating" color="#C4724F" size={160} delay={0.2} />
                                <div className="flex-1 space-y-4 w-full">
                                    <p className="text-white/50 text-sm leading-relaxed">
                                        Your style score combines occasion coverage, skin-tone compatibility, and color variety. Improve any pillar to raise your score.
                                    </p>
                                    {/* Score bar breakdown */}
                                    {[
                                        { label: "Occasion Coverage", pct: scores.coverage,  color: "#C4724F", icon: Target },
                                        { label: "Skin Tone Match",   pct: scores.skinMatch, color: "#E8A87C", icon: Palette },
                                        { label: "Color Variety",
                                          pct: Math.round((scores.colorBal.filter(b => b.count > 0).length / scores.colorBal.length) * 100),
                                          color: "#60A5FA", icon: TrendingUp },
                                    ].map(({ label, pct, color, icon: Icon }) => (
                                        <div key={label} className="space-y-1.5">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="flex items-center gap-1.5 text-white/60 font-medium">
                                                    <Icon className="w-3.5 h-3.5" style={{ color }} />
                                                    {label}
                                                </span>
                                                <span className="font-bold text-white">{pct}%</span>
                                            </div>
                                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full rounded-full"
                                                    style={{ backgroundColor: color }}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${pct}%` }}
                                                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* ── Three meters row ── */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                                    className="bg-[#111] border border-white/5 rounded-2xl p-6 flex flex-col items-center"
                                >
                                    <CircularMeter pct={scores.coverage} label="Coverage Score" sublabel="Occasions covered" color="#C4724F" size={130} delay={0.3} />
                                </motion.div>
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                                    className="bg-[#111] border border-white/5 rounded-2xl p-6 flex flex-col items-center"
                                >
                                    <CircularMeter pct={scores.skinMatch} label="Skin Tone Match" sublabel={selectedType ? `Type ${selectedType} palette` : "Set skin tone first"} color="#E8A87C" size={130} delay={0.4} />
                                </motion.div>
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                                    className="bg-[#111] border border-white/5 rounded-2xl p-6 flex flex-col items-center"
                                >
                                    <CircularMeter
                                        pct={Math.round((scores.colorBal.filter(b => b.count > 0).length / scores.colorBal.length) * 100)}
                                        label="Color Variety" sublabel={`${scores.colorBal.filter(b=>b.count>0).length} of 4 families`}
                                        color="#60A5FA" size={130} delay={0.5}
                                    />
                                </motion.div>
                            </div>

                            {/* ── Color Balance Donut ── */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                                className="bg-[#111] border border-white/5 rounded-2xl p-6"
                            >
                                <div className="flex items-center gap-2 mb-6">
                                    <Palette className="w-4 h-4 text-[#C4724F]" />
                                    <h2 className="text-white font-bold uppercase tracking-tight text-sm">Color Balance</h2>
                                </div>
                                <DonutChart segments={scores.colorBal} />
                            </motion.div>

                            {/* ── Occasion Coverage Grid ── */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
                                className="bg-[#111] border border-white/5 rounded-2xl p-6"
                            >
                                <div className="flex items-center gap-2 mb-5">
                                    <Target className="w-4 h-4 text-[#C4724F]" />
                                    <h2 className="text-white font-bold uppercase tracking-tight text-sm">Occasion Coverage</h2>
                                    <span className="ml-auto text-white/30 text-xs">{scores.occasions.filter(o => o.covered).length}/{scores.occasions.length} covered</span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {scores.occasions.map((occ) => (
                                        <div key={occ.slug}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                                                occ.covered
                                                    ? "bg-[#C4724F]/8 border-[#C4724F]/20"
                                                    : "bg-white/3 border-white/5"
                                            }`}
                                        >
                                            <span className="text-lg">{occ.emoji}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-xs font-bold truncate ${occ.covered ? "text-white" : "text-white/40"}`}>{occ.label}</p>
                                            </div>
                                            {occ.covered
                                                ? <CheckCircle2 className="w-4 h-4 text-[#C4724F] shrink-0" />
                                                : <div className="w-4 h-4 rounded-full border border-white/15 shrink-0" />
                                            }
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* ── Gap Alerts ── */}
                            {scores.gaps.length > 0 && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                                    className="bg-[#111] border border-white/5 rounded-2xl p-6"
                                >
                                    <div className="flex items-center gap-2 mb-5">
                                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                                        <h2 className="text-white font-bold uppercase tracking-tight text-sm">Gap Alerts</h2>
                                        <span className="ml-auto text-white/30 text-xs">{scores.gaps.length} item{scores.gaps.length !== 1 ? "s" : ""}</span>
                                    </div>
                                    <div className="space-y-3">
                                        {scores.gaps.map((gap, i) => (
                                            <motion.div
                                                key={gap.id}
                                                initial={{ opacity: 0, x: -12 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.65 + i * 0.08 }}
                                                className={`flex items-start gap-4 p-4 rounded-xl border ${
                                                    gap.priority === "high"
                                                        ? "bg-red-500/5 border-red-500/15"
                                                        : "bg-amber-500/5 border-amber-500/15"
                                                }`}
                                            >
                                                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${gap.priority === "high" ? "bg-red-400" : "bg-amber-400"}`} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white text-sm font-bold">{gap.message}</p>
                                                    <p className="text-white/40 text-xs mt-0.5 leading-snug">{gap.reason}</p>
                                                </div>
                                                <Link
                                                    href="/men"
                                                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-[#C4724F]/10 hover:bg-[#C4724F]/20 border border-[#C4724F]/20 hover:border-[#C4724F]/40 text-[#E8A87C] text-xs font-bold rounded-full transition-all"
                                                >
                                                    <ShoppingBag className="w-3 h-3" />
                                                    Shop
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* ── No skin tone prompt ── */}
                            {!selectedType && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
                                    className="bg-[#C4724F]/8 border border-[#C4724F]/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                                >
                                    <div className="flex-1">
                                        <p className="text-white font-bold text-sm">Set your skin tone to unlock Skin Tone Match score</p>
                                        <p className="text-white/40 text-xs mt-1">Your Fitzpatrick type determines which colors in your wardrobe actually suit you.</p>
                                    </div>
                                    <Link href="/shop-by-skin-tone"
                                        className="shrink-0 px-4 py-2.5 bg-[#C4724F] text-white text-sm font-bold rounded-full hover:bg-[#d4845f] transition-all"
                                    >
                                        Set Skin Tone →
                                    </Link>
                                </motion.div>
                            )}

                        </div>
                    )}
                </div>
            </main>
    );
}
