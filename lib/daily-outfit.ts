// ─────────────────────────────────────────────────────────────
// lib/daily-outfit.ts
// Generates 3 daily outfit suggestions (Casual, Formal, Sports)
// seeded by today's date so they stay consistent all day.
// No-repeat: yesterday's top per style is excluded if alternatives exist.
// ─────────────────────────────────────────────────────────────

import { WardrobeItem } from "@/context/wardrobe-context";
import { getAllowedColors } from "@/lib/styling-rules";

export type StyleCategory = "Casual" | "Formal" | "Sports";

export interface DailyOutfit {
    style: StyleCategory;
    top: WardrobeItem;
    bottom: WardrobeItem;
}

// ── Style buckets ─────────────────────────────────────────────
const CASUAL_TOPS = ["t-shirt", "sweatshirt", "casual-shirt"];
const CASUAL_BOTTOMS = ["jeans", "cotton-pant", "joggers", "shorts"];

const FORMAL_TOPS = ["formal-shirt"];
const FORMAL_BOTTOMS = ["trouser"];

const SPORTS_TOPS = ["active-t-shirt"];
const SPORTS_BOTTOMS = ["track-pant", "joggers", "shorts"];

// ── Deterministic hash from a string ─────────────────────────
function hashString(str: string): number {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return Math.abs(hash);
}

// ── Pick one item from a list using a seeded index ───────────
function seededPick<T>(arr: T[], seed: number): T {
    return arr[seed % arr.length];
}

// ── Date helpers ─────────────────────────────────────────────
function getDateKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function getYesterdayKey(): string {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return getDateKey(d);
}

// ── localStorage helpers (safe for SSR) ──────────────────────
const LS_KEY = "vesto_daily_outfit_history";

interface OutfitHistory {
    [dateKey: string]: {
        [style: string]: string; // topId
    };
}

function loadHistory(): OutfitHistory {
    if (typeof window === "undefined") return {};
    try {
        return JSON.parse(localStorage.getItem(LS_KEY) || "{}");
    } catch {
        return {};
    }
}

function saveHistory(dateKey: string, style: StyleCategory, topId: string): void {
    if (typeof window === "undefined") return;
    try {
        const history = loadHistory();
        if (!history[dateKey]) history[dateKey] = {};
        history[dateKey][style] = topId;
        // Keep only last 7 days to avoid bloat
        const keys = Object.keys(history).sort();
        if (keys.length > 7) delete history[keys[0]];
        localStorage.setItem(LS_KEY, JSON.stringify(history));
    } catch { /* ignore */ }
}

// ── Build a suggestion for one style bucket ───────────────────
function buildSuggestion(
    style: StyleCategory,
    topStyles: string[],
    bottomStyles: string[],
    wardrobeItems: WardrobeItem[],
    seed: number,
    yesterdayTopId: string | null,
): DailyOutfit | null {
    const tops = wardrobeItems.filter(
        (i) =>
            i.productType?.toLowerCase() === "topwear" &&
            topStyles.includes(i.productStyle?.toLowerCase())
    );
    const bottoms = wardrobeItems.filter(
        (i) =>
            i.productType?.toLowerCase() === "bottomwear" &&
            bottomStyles.includes(i.productStyle?.toLowerCase())
    );

    if (tops.length === 0 || bottoms.length === 0) return null;

    // Exclude yesterday's top if we have more than one option
    const availableTops =
        yesterdayTopId && tops.length > 1
            ? tops.filter((t) => t.id !== yesterdayTopId)
            : tops;

    // Pick top (seeded)
    const top = seededPick(availableTops, seed);

    // Prefer colour-compatible bottom
    const allowedColors = getAllowedColors(top.baseColor);
    const compatBottoms = bottoms.filter((b) =>
        allowedColors.includes(b.baseColor?.toLowerCase())
    );
    const bottomPool = compatBottoms.length > 0 ? compatBottoms : bottoms;
    const bottom = seededPick(bottomPool, seed + 7);

    return { style, top, bottom };
}

// ── Main export ───────────────────────────────────────────────
export function getDailyOutfits(items: WardrobeItem[]): DailyOutfit[] {
    const today = new Date();
    const todayKey = getDateKey(today);
    const yesterdayKey = getYesterdayKey();
    const baseSeed = hashString(todayKey);

    // Load yesterday's history to avoid repeating same top
    const history = loadHistory();
    const yesterdayPicks = history[yesterdayKey] || {};

    const buckets: [StyleCategory, string[], string[], number][] = [
        ["Casual", CASUAL_TOPS, CASUAL_BOTTOMS, baseSeed],
        ["Formal", FORMAL_TOPS, FORMAL_BOTTOMS, baseSeed + 31],
        ["Sports", SPORTS_TOPS, SPORTS_BOTTOMS, baseSeed + 61],
    ];

    const results: DailyOutfit[] = [];

    for (const [style, topStyles, bottomStyles, seed] of buckets) {
        const yesterdayTopId = yesterdayPicks[style] ?? null;
        const suggestion = buildSuggestion(style, topStyles, bottomStyles, items, seed, yesterdayTopId);
        if (suggestion) {
            results.push(suggestion);
            // Persist today's pick so tomorrow can avoid it
            saveHistory(todayKey, style, suggestion.top.id);
        }
    }

    return results;
}
