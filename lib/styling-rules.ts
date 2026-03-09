// ─────────────────────────────────────────────────────────────
// lib/styling-rules.ts
// Centralised pairing & colour-compatibility rules for Vesto.
// Previously duplicated in:
//   app/complete-your-look/[productId]/page.tsx
//   app/virtual-wardrobe/complete-look/[productId]/page.tsx
// ─────────────────────────────────────────────────────────────

export interface StyleRule {
    type: string;
    styles: string[];
    label: string;
    isInner?: boolean;
}

// Improved colour compatibility map
// Previously only allowed [baseColor, 'neutral'] which was too restrictive.
export const COLOR_COMPAT: Record<string, string[]> = {
    neutral: ['neutral', 'earthy', 'cool', 'warm'],
    warm: ['warm', 'earthy', 'neutral'],
    cool: ['cool', 'neutral'],
    earthy: ['earthy', 'warm', 'neutral'],
};

export function getAllowedColors(baseColor: string): string[] {
    const bc = baseColor?.toLowerCase() || 'neutral';
    return COLOR_COMPAT[bc] ?? ['neutral'];
}

export function getNeededItems(
    productType: string,
    productStyle: string
): StyleRule[] | null {
    const type = productType?.toLowerCase();
    const style = productStyle?.toLowerCase();

    if (type === 'topwear') {
        if (['t-shirt', 'sweatshirt'].includes(style)) {
            return [
                { type: 'bottomwear', styles: ['jeans'], label: 'Jeans' },
                { type: 'bottomwear', styles: ['joggers'], label: 'Joggers' },
                { type: 'bottomwear', styles: ['cotton-pant'], label: 'Cotton Pants' },
                { type: 'bottomwear', styles: ['shorts'], label: 'Shorts' },
                { type: 'topwear', styles: ['jacket'], label: 'Jackets' },
                { type: 'footwear', styles: ['sneakers'], label: 'Sneakers' },
            ];
        }
        if (style === 'casual-shirt') {
            return [
                { type: 'bottomwear', styles: ['jeans'], label: 'Jeans' },
                { type: 'bottomwear', styles: ['trouser'], label: 'Trousers' },
                { type: 'topwear', styles: ['jacket'], label: 'Jackets' },
                { type: 'footwear', styles: ['sneakers'], label: 'Sneakers' },
                { type: 'footwear', styles: ['loafer'], label: 'Loafers' },
            ];
        }
        if (style === 'formal-shirt') {
            return [
                { type: 'bottomwear', styles: ['trouser'], label: 'Trousers' },
                { type: 'footwear', styles: ['formal-shoe'], label: 'Formal Shoes' },
                { type: 'footwear', styles: ['loafer'], label: 'Loafers' },
            ];
        }
        if (style === 'active-t-shirt') {
            return [
                { type: 'bottomwear', styles: ['track-pant'], label: 'Track Pants' },
                { type: 'bottomwear', styles: ['joggers'], label: 'Joggers' },
                { type: 'bottomwear', styles: ['shorts'], label: 'Shorts' },
                { type: 'footwear', styles: ['sports-shoe'], label: 'Sports Shoes' },
            ];
        }
        if (style === 'jacket') {
            return [
                { type: 'topwear', styles: ['t-shirt'], isInner: true, label: 'T-Shirts' },
                { type: 'topwear', styles: ['casual-shirt'], isInner: true, label: 'Casual Shirts' },
                { type: 'bottomwear', styles: ['jeans'], label: 'Jeans' },
                { type: 'bottomwear', styles: ['cotton-pant'], label: 'Cotton Pants' },
                { type: 'bottomwear', styles: ['trouser'], label: 'Trousers' },
                { type: 'footwear', styles: ['casual-shoe'], label: 'Casual Shoes' },
            ];
        }
    }

    if (type === 'bottomwear') {
        if (style === 'jeans') {
            return [
                { type: 'topwear', styles: ['t-shirt'], label: 'T-Shirts' },
                { type: 'topwear', styles: ['casual-shirt'], label: 'Casual Shirts' },
                { type: 'topwear', styles: ['sweatshirt'], label: 'Sweatshirts' },
                { type: 'topwear', styles: ['jacket'], label: 'Jackets' },
                { type: 'footwear', styles: ['sneakers'], label: 'Sneakers' },
            ];
        }
        if (style === 'cotton-pant') {
            return [
                { type: 'topwear', styles: ['t-shirt'], label: 'T-Shirts' },
                { type: 'topwear', styles: ['jacket'], label: 'Jackets' },
                { type: 'footwear', styles: ['casual-shoe'], label: 'Casual Shoes' },
            ];
        }
        if (style === 'trouser') {
            return [
                { type: 'topwear', styles: ['formal-shirt'], label: 'Formal Shirts' },
                { type: 'topwear', styles: ['casual-shirt'], label: 'Casual Shirts' },
                { type: 'topwear', styles: ['jacket'], label: 'Jackets' },
                { type: 'footwear', styles: ['formal-shoe'], label: 'Formal Shoes' },
                { type: 'footwear', styles: ['loafer'], label: 'Loafers' },
                { type: 'footwear', styles: ['casual-shoe'], label: 'Casual Shoes' },
            ];
        }
        if (style === 'joggers') {
            return [
                { type: 'topwear', styles: ['t-shirt'], label: 'T-Shirts' },
                { type: 'topwear', styles: ['sweatshirt'], label: 'Sweatshirts' },
                { type: 'topwear', styles: ['active-t-shirt'], label: 'Active T-Shirts' },
                { type: 'footwear', styles: ['sneakers'], label: 'Sneakers' },
                { type: 'footwear', styles: ['sports-shoe'], label: 'Sports Shoes' },
            ];
        }
        if (style === 'shorts') {
            return [
                { type: 'topwear', styles: ['t-shirt'], label: 'T-Shirts' },
                { type: 'topwear', styles: ['active-t-shirt'], label: 'Active T-Shirts' },
                { type: 'footwear', styles: ['sneakers'], label: 'Sneakers' },
                { type: 'footwear', styles: ['sports-shoe'], label: 'Sports Shoes' },
            ];
        }
        if (style === 'track-pant') {
            return [
                { type: 'topwear', styles: ['active-t-shirt'], label: 'Active T-Shirts' },
                { type: 'footwear', styles: ['sports-shoe'], label: 'Sports Shoes' },
            ];
        }
    }

    return null;
}
