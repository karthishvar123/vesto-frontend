"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Sparkles, ShoppingBag, Bookmark, BookmarkCheck, Shirt, ArrowRight, ChevronDown } from "lucide-react";
import Navbar from "@/components/navbar";
import { useWardrobe, WardrobeItem } from "@/context/wardrobe-context";
import { useSkinTone } from "@/context/skin-tone-context";

// ── Occasion config ───────────────────────────────────────────
interface Occasion {
  slug: string; label: string; emoji: string;
  dresscode: string; description: string;
  topStyles: string[]; bottomStyles: string[]; footwearStyles: string[];
  colorHint: string;
}

const OCCASIONS: Occasion[] = [
  {
    slug: "wedding-guest", label: "Wedding Guest", emoji: "💍",
    dresscode: "Semi-Formal / Cocktail", description: "Earth tones, pastels — avoid white & black",
    topStyles: ["formal-shirt", "casual-shirt"],
    bottomStyles: ["trouser"],
    footwearStyles: ["formal-shoe", "loafer"],
    colorHint: "earthy",
  },
  {
    slug: "baraat", label: "Baraat", emoji: "🎺",
    dresscode: "Ethnic / Festive", description: "Bold colors, sherwanis, kurtas",
    topStyles: ["formal-shirt", "casual-shirt"],
    bottomStyles: ["trouser", "jeans"],
    footwearStyles: ["loafer", "formal-shoe", "casual-shoe"],
    colorHint: "warm",
  },
  {
    slug: "office", label: "Office / Interview", emoji: "💼",
    dresscode: "Business Formal", description: "Neutrals, navy, grey — clean and sharp",
    topStyles: ["formal-shirt"],
    bottomStyles: ["trouser"],
    footwearStyles: ["formal-shoe", "loafer"],
    colorHint: "neutral",
  },
  {
    slug: "first-date", label: "First Date", emoji: "✨",
    dresscode: "Smart Casual", description: "Warm tones, fitted silhouettes",
    topStyles: ["casual-shirt", "t-shirt"],
    bottomStyles: ["jeans", "trouser"],
    footwearStyles: ["sneakers", "loafer", "casual-shoe"],
    colorHint: "warm",
  },
  {
    slug: "casual", label: "Casual Outing", emoji: "👕",
    dresscode: "Casual", description: "Any color family, comfortable fits",
    topStyles: ["t-shirt", "sweatshirt", "casual-shirt"],
    bottomStyles: ["jeans", "cotton-pant", "joggers", "shorts"],
    footwearStyles: ["sneakers", "casual-shoe"],
    colorHint: "neutral",
  },
  {
    slug: "festive", label: "Diwali / Festival", emoji: "🪔",
    dresscode: "Festive Ethnic", description: "Bold warm tones, ethnic cuts",
    topStyles: ["formal-shirt", "casual-shirt"],
    bottomStyles: ["trouser", "jeans"],
    footwearStyles: ["loafer", "formal-shoe"],
    colorHint: "warm",
  },
  {
    slug: "eid", label: "Eid", emoji: "🌙",
    dresscode: "Ethnic Smart", description: "Whites, pastels, kurta sets",
    topStyles: ["formal-shirt", "casual-shirt"],
    bottomStyles: ["trouser"],
    footwearStyles: ["loafer", "formal-shoe"],
    colorHint: "neutral",
  },
];

const SKINTONE_COLORS: Record<number, string[]> = {
  1: ["cool", "neutral"], 2: ["cool", "neutral", "earthy"],
  3: ["warm", "earthy", "neutral"], 4: ["warm", "earthy", "neutral"],
  5: ["warm", "earthy"], 6: ["warm", "earthy", "neutral"],
};

// ── Helpers ───────────────────────────────────────────────────
function pickBest(items: WardrobeItem[], styles: string[], skinColors: string[]): WardrobeItem | null {
  const pool = items.filter(i => styles.includes(i.productStyle?.toLowerCase()));
  if (!pool.length) return null;
  const matched = pool.filter(i => skinColors.includes((i.colorFamily ?? i.baseColor ?? "").toLowerCase()));
  return matched[0] ?? pool[0];
}

interface SavedLook {
  id: string; occasion: string; date: string;
  top: WardrobeItem | null; bottom: WardrobeItem | null; footwear: WardrobeItem | null;
}

function loadSavedLooks(): SavedLook[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem("vesto_saved_looks") || "[]"); } catch { return []; }
}
function saveLook(look: SavedLook) {
  const existing = loadSavedLooks();
  const updated = [look, ...existing.filter(l => l.id !== look.id)].slice(0, 20);
  localStorage.setItem("vesto_saved_looks", JSON.stringify(updated));
}

// ── Item thumbnail ────────────────────────────────────────────
function ItemCard({ item, label }: { item: WardrobeItem; label: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="aspect-[3/4] relative bg-[#1a1a1a] rounded-xl overflow-hidden border border-white/5">
        {item.images?.[0]
          ? <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
          : <div className="w-full h-full flex items-center justify-center"><Shirt className="w-8 h-8 text-white/10" /></div>
        }
      </div>
      <p className="text-[10px] font-bold text-[#C4724F] uppercase tracking-widest">{label}</p>
      <p className="text-xs text-white/70 font-semibold truncate">{item.name}</p>
      {item.brand && <p className="text-[10px] text-white/30 uppercase tracking-wider">{item.brand}</p>}
    </div>
  );
}

// ── Missing item placeholder ──────────────────────────────────
function MissingCard({ label, style }: { label: string; style: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="aspect-[3/4] relative bg-white/3 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-2">
        <Shirt className="w-8 h-8 text-white/10" />
        <span className="text-[10px] text-white/20 text-center px-2 leading-tight">No {style} in wardrobe</span>
      </div>
      <p className="text-[10px] font-bold text-amber-500/70 uppercase tracking-widest">{label}</p>
      <Link href="/men" className="inline-flex items-center gap-1 text-xs text-[#C4724F] hover:text-[#E8A87C] transition-colors font-bold">
        <ShoppingBag className="w-3 h-3" /> Shop Now
      </Link>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function OccasionPlannerPage() {
  const { items } = useWardrobe();
  const { selectedType } = useSkinTone();

  const [selectedOccasion, setSelectedOccasion] = useState<string>("");
  const [eventDate, setEventDate] = useState<string>("");
  const [planned, setPlanned] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const skinColors = selectedType ? (SKINTONE_COLORS[selectedType] ?? ["neutral"]) : ["neutral"];
  const occasion = OCCASIONS.find(o => o.slug === selectedOccasion);

  const look = useMemo(() => {
    if (!occasion) return null;
    const wardrobeItems = items;
    const top      = pickBest(wardrobeItems.filter(i => i.productType?.toLowerCase() === "topwear"),      occasion.topStyles,      skinColors);
    const bottom   = pickBest(wardrobeItems.filter(i => i.productType?.toLowerCase() === "bottomwear"),   occasion.bottomStyles,   skinColors);
    const footwear = pickBest(wardrobeItems.filter(i => i.productType?.toLowerCase() === "footwear"),     occasion.footwearStyles, skinColors);
    return { top, bottom, footwear };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [occasion, items, selectedType]);

  const hasMissing = look && (!look.top || !look.bottom || !look.footwear);
  const hasAny     = look && (look.top || look.bottom || look.footwear);

  const handlePlan = () => {
    if (!selectedOccasion) return;
    setPlanned(true);
    setSaved(false);
  };

  const handleSave = () => {
    if (!look || !occasion) return;
    const newLook: SavedLook = {
      id: `${occasion.slug}-${Date.now()}`,
      occasion: occasion.label,
      date: eventDate,
      top: look.top, bottom: look.bottom, footwear: look.footwear,
    };
    saveLook(newLook);
    setSaved(true);
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <Navbar />

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-[#C4724F]/4 blur-[120px]" />
      </div>

      <div className="relative z-10 pt-20 sm:pt-32 pb-28 px-4 sm:px-6 md:px-8 max-w-4xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
          <span className="text-[#C4724F] text-xs font-bold uppercase tracking-widest mb-3 block">Smart Styling</span>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-3">
            Occasion<br /><span className="text-[#E8A87C]">Planner</span>
          </h1>
          <p className="text-white/30 text-sm max-w-md">
            Tell us the occasion — Vesto picks the best outfit from your wardrobe, matched to your skin tone.
          </p>
        </motion.div>

        {/* Input card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-[#111] border border-white/5 rounded-2xl p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-4">

            {/* Occasion dropdown */}
            <div className="flex-1 relative">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest block mb-2">Occasion</label>
              <button
                onClick={() => setDropdownOpen(p => !p)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 hover:border-[#C4724F]/40 rounded-xl text-sm text-left transition-all"
              >
                <span className={occasion ? "text-white font-medium" : "text-white/30"}>
                  {occasion ? `${occasion.emoji} ${occasion.label}` : "Select an occasion…"}
                </span>
                <ChevronDown className={`w-4 h-4 text-white/30 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                    className="absolute top-full mt-2 left-0 right-0 bg-[#151515] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50"
                  >
                    {OCCASIONS.map(occ => (
                      <button key={occ.slug}
                        onClick={() => { setSelectedOccasion(occ.slug); setDropdownOpen(false); setPlanned(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-white/5 transition-colors ${selectedOccasion === occ.slug ? "bg-[#C4724F]/10 text-[#E8A87C]" : "text-white/70"}`}
                      >
                        <span className="text-base">{occ.emoji}</span>
                        <div>
                          <p className="font-semibold">{occ.label}</p>
                          <p className="text-[10px] text-white/30">{occ.dresscode}</p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Date picker */}
            <div className="sm:w-48">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest block mb-2">Event Date</label>
              <input
                type="date"
                value={eventDate}
                onChange={e => setEventDate(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 hover:border-[#C4724F]/40 focus:border-[#C4724F]/60 rounded-xl text-sm text-white outline-none transition-all [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Dress code hint */}
          {occasion && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex items-center gap-3 px-3 py-2 bg-[#C4724F]/8 border border-[#C4724F]/15 rounded-lg">
              <Sparkles className="w-3.5 h-3.5 text-[#C4724F] shrink-0" />
              <p className="text-xs text-white/50"><span className="text-[#E8A87C] font-bold">{occasion.dresscode}</span> — {occasion.description}</p>
            </motion.div>
          )}

          <button
            onClick={handlePlan}
            disabled={!selectedOccasion}
            className={`mt-5 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all ${
              selectedOccasion
                ? "bg-[#C4724F] text-white hover:bg-[#d4845f] shadow-[0_0_30px_rgba(196,114,79,0.25)]"
                : "bg-white/5 text-white/20 cursor-not-allowed"
            }`}
          >
            <Calendar className="w-4 h-4" /> Plan My Outfit
          </button>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {planned && occasion && look && (
            <motion.div
              key={selectedOccasion}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="space-y-5"
            >
              {/* Look header */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#C4724F] uppercase tracking-widest block mb-1">Recommended Look</span>
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">
                    {occasion.emoji} {occasion.label}
                    {eventDate && <span className="text-white/30 font-medium text-sm ml-2 normal-case">· {new Date(eventDate + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>}
                  </h2>
                </div>
                {hasAny && (
                  <button
                    onClick={handleSave}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                      saved
                        ? "bg-[#C4724F]/20 border-[#C4724F]/40 text-[#E8A87C]"
                        : "bg-white/5 border-white/10 text-white/50 hover:border-[#C4724F]/30 hover:text-[#C4724F]"
                    }`}
                  >
                    {saved ? <><BookmarkCheck className="w-3.5 h-3.5" /> Saved!</> : <><Bookmark className="w-3.5 h-3.5" /> Save Look</>}
                  </button>
                )}
              </div>

              {/* Skin tone context */}
              {selectedType && (
                <div className="flex items-center gap-2 text-xs text-white/30">
                  <span className="w-2 h-2 rounded-full bg-[#C4724F]" />
                  Filtered for Fitzpatrick Type {selectedType} — {skinColors.join(", ")} palette
                </div>
              )}

              {/* 3-item grid */}
              <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
                <div className="grid grid-cols-3 gap-4">
                  {look.top
                    ? <ItemCard item={look.top} label="Topwear" />
                    : <MissingCard label="Topwear" style={occasion.topStyles[0]} />
                  }
                  {look.bottom
                    ? <ItemCard item={look.bottom} label="Bottomwear" />
                    : <MissingCard label="Bottomwear" style={occasion.bottomStyles[0]} />
                  }
                  {look.footwear
                    ? <ItemCard item={look.footwear} label="Footwear" />
                    : <MissingCard label="Footwear" style={occasion.footwearStyles[0]} />
                  }
                </div>
              </div>

              {/* Missing items section */}
              {hasMissing && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="bg-amber-500/5 border border-amber-500/15 rounded-2xl p-5"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <ShoppingBag className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-bold text-sm">Complete the look</p>
                      <p className="text-white/40 text-xs mt-0.5">Your wardrobe is missing some items for this occasion</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {!look.top && (
                      <div className="flex items-center justify-between px-3 py-2.5 bg-white/3 rounded-xl">
                        <span className="text-xs text-white/60">Need: <span className="text-white font-medium capitalize">{occasion.topStyles[0].replace("-", " ")}</span></span>
                        <Link href="/men" className="flex items-center gap-1 text-xs text-[#C4724F] font-bold hover:text-[#E8A87C] transition-colors">Shop <ArrowRight className="w-3 h-3" /></Link>
                      </div>
                    )}
                    {!look.bottom && (
                      <div className="flex items-center justify-between px-3 py-2.5 bg-white/3 rounded-xl">
                        <span className="text-xs text-white/60">Need: <span className="text-white font-medium capitalize">{occasion.bottomStyles[0].replace("-", " ")}</span></span>
                        <Link href="/men" className="flex items-center gap-1 text-xs text-[#C4724F] font-bold hover:text-[#E8A87C] transition-colors">Shop <ArrowRight className="w-3 h-3" /></Link>
                      </div>
                    )}
                    {!look.footwear && (
                      <div className="flex items-center justify-between px-3 py-2.5 bg-white/3 rounded-xl">
                        <span className="text-xs text-white/60">Need: <span className="text-white font-medium capitalize">{occasion.footwearStyles[0].replace("-", " ")}</span></span>
                        <Link href="/men" className="flex items-center gap-1 text-xs text-[#C4724F] font-bold hover:text-[#E8A87C] transition-colors">Shop <ArrowRight className="w-3 h-3" /></Link>
                      </div>
                    )}
                  </div>
                  <Link href="/men"
                    className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-[#C4724F]/10 hover:bg-[#C4724F]/20 border border-[#C4724F]/20 hover:border-[#C4724F]/40 text-[#E8A87C] text-sm font-bold rounded-xl transition-all"
                  >
                    <ShoppingBag className="w-4 h-4" /> Shop to Complete This Look
                  </Link>
                </motion.div>
              )}

              {/* No wardrobe at all */}
              {!hasAny && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10 bg-[#111] border border-white/5 rounded-2xl">
                  <Shirt className="w-10 h-10 text-white/10 mx-auto mb-3" />
                  <p className="text-white font-bold mb-1">Your wardrobe is empty</p>
                  <p className="text-white/30 text-xs mb-5">Add items to get personalized outfit recommendations</p>
                  <Link href="/men" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C4724F] text-white text-sm font-bold rounded-full hover:bg-[#d4845f] transition-all">
                    Start Building Your Wardrobe
                  </Link>
                </motion.div>
              )}

              {/* Skin tone CTA if not set */}
              {!selectedType && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex items-center gap-4 px-5 py-4 bg-[#C4724F]/8 border border-[#C4724F]/20 rounded-xl"
                >
                  <div className="flex-1">
                    <p className="text-white font-bold text-sm">Set your skin tone for better matches</p>
                    <p className="text-white/40 text-xs mt-0.5">Skin-tone filtering picks the most flattering colors from your wardrobe.</p>
                  </div>
                  <Link href="/shop-by-skin-tone" className="shrink-0 px-4 py-2 bg-[#C4724F] text-white text-xs font-bold rounded-full hover:bg-[#d4845f] transition-all">
                    Set Tone →
                  </Link>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Occasion grid — shown before planning */}
        {!planned && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <p className="text-white/20 text-xs uppercase tracking-widest mb-4">Or browse occasions</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {OCCASIONS.map(occ => (
                <button key={occ.slug}
                  onClick={() => { setSelectedOccasion(occ.slug); setPlanned(true); setSaved(false); }}
                  className="flex flex-col items-start gap-2 p-4 bg-[#111] hover:bg-[#C4724F]/8 border border-white/5 hover:border-[#C4724F]/25 rounded-xl transition-all text-left group"
                >
                  <span className="text-2xl">{occ.emoji}</span>
                  <div>
                    <p className="text-white text-xs font-bold group-hover:text-[#E8A87C] transition-colors">{occ.label}</p>
                    <p className="text-white/30 text-[10px] mt-0.5">{occ.dresscode}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </main>
  );
}
