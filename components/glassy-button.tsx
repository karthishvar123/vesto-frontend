"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface GlassyButtonProps {
    text?: string;
    href: string;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
    className?: string;
    children?: ReactNode;
}

export default function GlassyButton({
    text = "Button",
    href,
    onClick,
    className = "",
    children,
}: GlassyButtonProps) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`group relative inline-flex items-center justify-center px-12 py-4 overflow-hidden rounded-full transition-all duration-300 ${className}`}
            style={{
                background: "linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)",
                boxShadow: `
                    0px 1px 2px rgba(255, 255, 255, 0.1) inset,
                    0px 4px 16px rgba(0, 0, 0, 0.1),
                    0px 8px 32px rgba(0, 0, 0, 0.1)
                `,
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
        >
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white/5" />

            {/* Inner Content */}
            <span className="relative z-10 text-white font-medium text-lg tracking-wide uppercase">
                {children || text}
            </span>
        </Link>
    );
}
