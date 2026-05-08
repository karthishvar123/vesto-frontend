// lib/style-score.ts — Vesto Style Score engine
import { WardrobeItem } from "@/context/wardrobe-context";

export interface OccasionCoverage {
    label: string; slug: string; covered: boolean; emoji: string;
}
export interface ColorSegment {
    label: string; slug: string; count: number; pct: number; color: string;
}
export interface GapAlert {
    id: string; message: string; reason: string; priority: "high" | "medium";
}

const OCCASION_STYLE_MAP: Record<string, string[]> = {
    "wedding-guest": ["formal-shirt", "kurta", "sherwani", "trouser", "loafer", "formal-shoe"],
    "office":        ["formal-shirt", "casual-shirt", "trouser", "formal-shoe", "loafer"],
    "casual":        ["t-shirt", "casual-shirt", "sweatshirt", "jeans", "cotton-pant", "sneakers"],
    "first-date":    ["casual-shirt", "t-shirt", "jeans", "trouser", "sneakers", "loafer"],
    "festive":       ["kurta", "sherwani", "formal-shirt", "loafer", "formal-shoe"],
    "gym":           ["active-t-shirt", "track-pant", "joggers", "shorts", "sports-shoe"],
};

const OCCASION_META = [
    { label: "Wedding",    slug: "wedding-guest", emoji: "💍" },
    { label: "Office",     slug: "office",        emoji: "💼" },
    { label: "Casual",     slug: "casual",        emoji: "👕" },
    { label: "First Date", slug: "first-date",    emoji: "✨" },
    { label: "Festive",    slug: "festive",       emoji: "🪔" },
    { label: "Gym",        slug: "gym",           emoji: "💪" },
];

const COLOR_FAMILY_META = [
    { label: "Neutrals",   slug: "neutral", color: "#9CA3AF" },
    { label: "Warm Tones", slug: "warm",    color: "#F97316" },
    { label: "Cool Tones", slug: "cool",    color: "#60A5FA" },
    { label: "Earth",      slug: "earthy",  color: "#92400E" },
];

const SKINTONE_PALETTES: Record<number, string[]> = {
    1: ["cool", "neutral"],
    2: ["cool", "neutral", "earthy"],
    3: ["warm", "earthy", "neutral"],
    4: ["warm", "earthy", "neutral"],
    5: ["warm", "earthy"],
    6: ["warm", "earthy", "neutral"],
};

export function getOccasionCoverage(items: WardrobeItem[]): OccasionCoverage[] {
    const styles = new Set(items.map((i) => i.productStyle?.toLowerCase()).filter(Boolean));
    return OCCASION_META.map(({ label, slug, emoji }) => ({
        label, slug, emoji,
        covered: (OCCASION_STYLE_MAP[slug] ?? []).some((s) => styles.has(s)),
    }));
}

export function getCoverageScore(items: WardrobeItem[]): number {
    const coverage = getOccasionCoverage(items);
    return Math.round((coverage.filter((o) => o.covered).length / coverage.length) * 100);
}

export function getColorBalance(items: WardrobeItem[]): ColorSegment[] {
    const total = items.length || 1;
    return COLOR_FAMILY_META.map(({ label, slug, color }) => {
        const count = items.filter(
            (i) => i.colorFamily?.toLowerCase() === slug || i.baseColor?.toLowerCase() === slug
        ).length;
        return { label, slug, count, pct: Math.round((count / total) * 100), color };
    });
}

export function getSkinToneMatchPct(items: WardrobeItem[], fitzpatrickType: number | null): number {
    if (!fitzpatrickType || items.length === 0) return 0;
    const recommended = SKINTONE_PALETTES[fitzpatrickType] ?? ["neutral"];
    const matched = items.filter((i) => {
        const cf = (i.colorFamily ?? i.baseColor ?? "").toLowerCase();
        return recommended.some((r) => cf.includes(r));
    }).length;
    return Math.round((matched / items.length) * 100);
}

export function getGapAlerts(items: WardrobeItem[], fitzpatrickType: number | null): GapAlert[] {
    const alerts: GapAlert[] = [];
    const styles = new Set(items.map((i) => i.productStyle?.toLowerCase()).filter(Boolean));
    const types  = new Set(items.map((i) => i.productType?.toLowerCase()).filter(Boolean));

    if (!styles.has("formal-shoe") && !styles.has("loafer")) {
        alerts.push({ id: "no-formal-footwear", message: "No formal footwear saved", reason: "Needed for Office and Wedding occasions", priority: "high" });
    }
    if (!types.has("bottomwear")) {
        alerts.push({ id: "no-bottomwear", message: "No bottomwear in wardrobe", reason: "Add jeans or trousers to build complete outfits", priority: "high" });
    }
    if (!types.has("topwear")) {
        alerts.push({ id: "no-topwear", message: "No topwear saved yet", reason: "Add shirts or t-shirts to unlock outfit suggestions", priority: "high" });
    }
    if (!styles.has("kurta") && !styles.has("sherwani")) {
        alerts.push({ id: "no-ethnic", message: "No ethnic or festive wear", reason: "Missing outfits for Festive and Wedding occasions", priority: "medium" });
    }
    const balance  = getColorBalance(items);
    const dominant = balance.find((b) => b.pct >= 70);
    if (dominant && items.length >= 5) {
        alerts.push({ id: "color-imbalance", message: `Over-indexed on ${dominant.label}`, reason: `${dominant.pct}% of your wardrobe is one color family — add variety`, priority: "medium" });
    }
    if (fitzpatrickType) {
        const matchPct = getSkinToneMatchPct(items, fitzpatrickType);
        if (matchPct < 50 && items.length >= 4) {
            alerts.push({ id: "skintone-mismatch", message: "Many items clash with your skin tone", reason: `Only ${matchPct}% of your wardrobe suits Fitzpatrick Type ${fitzpatrickType}`, priority: "high" });
        }
    }
    return alerts;
}

export function getCompositeStyleScore(items: WardrobeItem[], fitzpatrickType: number | null): number {
    if (items.length === 0) return 0;
    const coverage     = getCoverageScore(items);
    const skinMatch    = getSkinToneMatchPct(items, fitzpatrickType);
    const balance      = getColorBalance(items);
    const balanceScore = Math.round((balance.filter((b) => b.count > 0).length / balance.length) * 100);
    return Math.round(coverage * 0.4 + skinMatch * 0.4 + balanceScore * 0.2);
}
