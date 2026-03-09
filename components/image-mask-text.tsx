import { CSSProperties } from "react";

interface ImageMaskTextProps {
    text: string;
    imageSrc: string;
    className?: string;
    style?: CSSProperties;
    imageFit?: "cover" | "contain" | "percent";
    imagePercent?: number;
    fontSize?: number | string;
    fontWeight?: number | string;
    letterSpacing?: string;
    textAlign?: "left" | "center" | "right";
    lineHeight?: number | string;
}

export default function ImageMaskText({
    text,
    imageSrc,
    className = "",
    style = {},
    imageFit = "cover",
    imagePercent = 100,
    fontSize = "12rem", // Default large size for Title
    fontWeight = 900,
    letterSpacing = "-0.05em",
    textAlign = "center",
    lineHeight = 1,
}: ImageMaskTextProps) {
    // Calculate background size
    let bgSize = "cover";
    if (imageFit === "contain") bgSize = "contain";
    if (imageFit === "percent") bgSize = `${imagePercent}%`;

    // Map text alignment to flex justifyContent
    let justifyContent = "center";
    switch (textAlign) {
        case "left":
            justifyContent = "flex-start";
            break;
        case "right":
            justifyContent = "flex-end";
            break;
        case "center":
        default:
            justifyContent = "center";
            break;
    }

    return (
        <div
            className={className}
            style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: justifyContent,
                position: "relative",
                overflow: "hidden",
                ...style,
            }}
        >
            <span
                style={{
                    backgroundImage: `url(${imageSrc})`,
                    backgroundSize: bgSize,
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    color: "transparent",
                    display: "inline-block",
                    textAlign: textAlign,
                    lineHeight: lineHeight,
                    fontSize: fontSize,
                    fontWeight: fontWeight,
                    letterSpacing: letterSpacing,
                    fontFamily: "var(--font-serif), serif", // Ensure it uses the serif font if available, or fallback
                }}
                aria-label={text}
            >
                {text}
            </span>
        </div>
    );
}
