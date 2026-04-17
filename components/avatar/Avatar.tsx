"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DEFAULT_AVATAR } from "@/lib/bem";

export type AvatarProps = {
  head?: string | null;
  shirt?: string | null;
  pants?: string | null;
  shoes?: string | null;
  primaryColor?: string | null;
  size?: number;
  idle?: boolean;
  className?: string;
};

const SKIN = "#F5C9A4";
const SKIN_SHADOW = "#E0A77A";
const HAIR_DARK = "#1F1612";
const HAIR_BROWN = "#6B3A1E";
const HAIR_BLOND = "#C89B3C";
const HAIR_RED = "#9B3D15";
const PANTS_BLUE = "#3B4C75";
const PANTS_BLACK = "#1A1614";
const PANTS_TAN = "#A88B5F";
const PANTS_OLIVE = "#5A5E36";
const SHOES_DARK = "#1A1614";
const SHOES_WHITE = "#F5F1EA";
const SHOES_BROWN = "#6B3A1E";
const SHOES_RED = "#B54E45";

function Head({ variant }: { variant: string }) {
  return (
    <g>
      {/* neck */}
      <rect x="60" y="78" width="16" height="14" fill={SKIN_SHADOW} rx="2" />
      {/* face */}
      <circle cx="68" cy="56" r="22" fill={SKIN} />
      {/* hair variants */}
      {variant === "h1" && (
        <>
          {/* short dark */}
          <path
            d="M46 48 Q46 28 68 28 Q90 28 90 48 Q90 52 88 54 L48 54 Q46 52 46 48 Z"
            fill={HAIR_DARK}
          />
        </>
      )}
      {variant === "h2" && (
        <>
          {/* long blond */}
          <path
            d="M44 54 Q44 26 68 26 Q92 26 92 54 L92 80 L86 80 L86 58 Q86 56 84 56 L52 56 Q50 56 50 58 L50 80 L44 80 Z"
            fill={HAIR_BLOND}
          />
        </>
      )}
      {variant === "h3" && (
        <>
          {/* buzzcut brown */}
          <path
            d="M48 50 Q48 32 68 32 Q88 32 88 50 Q88 52 87 53 L49 53 Q48 52 48 50 Z"
            fill={HAIR_BROWN}
          />
        </>
      )}
      {variant === "h4" && (
        <>
          {/* curly red */}
          <circle cx="54" cy="40" r="8" fill={HAIR_RED} />
          <circle cx="62" cy="32" r="9" fill={HAIR_RED} />
          <circle cx="72" cy="30" r="9" fill={HAIR_RED} />
          <circle cx="82" cy="36" r="8" fill={HAIR_RED} />
          <circle cx="85" cy="48" r="7" fill={HAIR_RED} />
          <circle cx="49" cy="48" r="7" fill={HAIR_RED} />
        </>
      )}
      {/* eyes */}
      <circle cx="60" cy="58" r="1.8" fill="#1A1614" />
      <circle cx="76" cy="58" r="1.8" fill="#1A1614" />
      {/* smile */}
      <path
        d="M62 66 Q68 70 74 66"
        stroke="#1A1614"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}

function Shirt({ variant, color }: { variant: string; color: string }) {
  const darker = "rgba(0,0,0,0.18)";
  return (
    <g>
      {variant === "s1" && (
        <>
          {/* t-shirt */}
          <path
            d="M36 94 L56 88 L56 96 Q68 100 80 96 L80 88 L100 94 L96 112 L88 108 L88 138 L48 138 L48 108 L40 112 Z"
            fill={color}
          />
          <path
            d="M56 88 Q68 96 80 88"
            stroke={darker}
            strokeWidth="1"
            fill="none"
          />
        </>
      )}
      {variant === "s2" && (
        <>
          {/* polo with collar */}
          <path
            d="M36 96 L56 90 L56 96 Q68 100 80 96 L80 90 L100 96 L96 114 L88 110 L88 140 L48 140 L48 110 L40 114 Z"
            fill={color}
          />
          <path d="M56 90 L64 102 L60 96 Z" fill={darker} />
          <path d="M80 90 L72 102 L76 96 Z" fill={darker} />
          {/* buttons */}
          <circle cx="68" cy="104" r="1" fill={darker} />
          <circle cx="68" cy="110" r="1" fill={darker} />
        </>
      )}
      {variant === "s3" && (
        <>
          {/* stripes */}
          <path
            d="M36 94 L56 88 L56 96 Q68 100 80 96 L80 88 L100 94 L96 112 L88 108 L88 138 L48 138 L48 108 L40 112 Z"
            fill={color}
          />
          <rect x="48" y="108" width="40" height="4" fill={darker} />
          <rect x="48" y="118" width="40" height="4" fill={darker} />
          <rect x="48" y="128" width="40" height="4" fill={darker} />
        </>
      )}
      {variant === "s4" && (
        <>
          {/* hoodie */}
          <path
            d="M34 96 L50 88 Q50 78 68 78 Q86 78 86 88 L102 96 L98 114 L90 110 L90 140 L46 140 L46 110 L38 114 Z"
            fill={color}
          />
          <path
            d="M50 88 Q68 74 86 88"
            stroke={darker}
            strokeWidth="1.5"
            fill="none"
          />
          {/* drawstring */}
          <line
            x1="64"
            y1="92"
            x2="64"
            y2="106"
            stroke={darker}
            strokeWidth="1"
          />
          <line
            x1="72"
            y1="92"
            x2="72"
            y2="106"
            stroke={darker}
            strokeWidth="1"
          />
          {/* pouch */}
          <path
            d="M54 118 L82 118 L80 132 L56 132 Z"
            fill={darker}
            opacity="0.3"
          />
        </>
      )}
    </g>
  );
}

function Pants({ variant }: { variant: string }) {
  const colorMap: Record<string, string> = {
    p1: PANTS_BLUE,
    p2: PANTS_BLACK,
    p3: PANTS_TAN,
    p4: PANTS_OLIVE,
  };
  const color = colorMap[variant] ?? PANTS_BLUE;
  return (
    <g>
      {variant === "p3" ? (
        // shorts
        <>
          <rect x="48" y="138" width="18" height="28" fill={color} rx="1" />
          <rect x="70" y="138" width="18" height="28" fill={color} rx="1" />
        </>
      ) : (
        <>
          <rect x="48" y="138" width="18" height="46" fill={color} rx="1" />
          <rect x="70" y="138" width="18" height="46" fill={color} rx="1" />
          <line
            x1="68"
            y1="138"
            x2="68"
            y2="184"
            stroke="rgba(0,0,0,0.25)"
            strokeWidth="1"
          />
        </>
      )}
    </g>
  );
}

function Shoes({ variant }: { variant: string }) {
  const variantMap: Record<string, { color: string; sole: string }> = {
    sh1: { color: SHOES_DARK, sole: SHOES_WHITE },
    sh2: { color: SHOES_WHITE, sole: SHOES_DARK },
    sh3: { color: SHOES_BROWN, sole: SHOES_DARK },
    sh4: { color: SHOES_RED, sole: SHOES_WHITE },
  };
  const v = variantMap[variant] ?? variantMap.sh1;
  const isShorts = false; // shoes sit below pants/shorts anyway
  const y = isShorts ? 176 : 184;
  return (
    <g>
      <ellipse cx="57" cy={y + 2} rx="11" ry="4" fill={v.color} />
      <ellipse cx="79" cy={y + 2} rx="11" ry="4" fill={v.color} />
      <rect x="46" y={y + 2} width="22" height="3" rx="1.5" fill={v.sole} />
      <rect x="68" y={y + 2} width="22" height="3" rx="1.5" fill={v.sole} />
    </g>
  );
}

export function Avatar({
  head,
  shirt,
  pants,
  shoes,
  primaryColor,
  size = 160,
  idle = true,
  className,
}: AvatarProps) {
  const resolved = {
    head: head ?? DEFAULT_AVATAR.head,
    shirt: shirt ?? DEFAULT_AVATAR.shirt,
    pants: pants ?? DEFAULT_AVATAR.pants,
    shoes: shoes ?? DEFAULT_AVATAR.shoes,
    color: primaryColor ?? DEFAULT_AVATAR.primaryColor,
  };

  return (
    <motion.svg
      viewBox="0 0 136 200"
      width={size}
      height={(size * 200) / 136}
      className={cn("select-none", className)}
      initial={idle ? { y: 0 } : false}
      animate={idle ? { y: [0, -2, 0] } : false}
      transition={
        idle
          ? {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }
          : undefined
      }
      aria-hidden
    >
      {/* shadow */}
      <ellipse cx="68" cy="194" rx="28" ry="3" fill="rgba(0,0,0,0.08)" />
      <Head variant={resolved.head} />
      <Shirt variant={resolved.shirt} color={resolved.color} />
      <Pants variant={resolved.pants} />
      <Shoes variant={resolved.shoes} />
    </motion.svg>
  );
}

export function AvatarPlaceholder({
  size = 160,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 136 200"
      width={size}
      height={(size * 200) / 136}
      className={cn("select-none opacity-40", className)}
      aria-hidden
    >
      <ellipse cx="68" cy="194" rx="28" ry="3" fill="rgba(0,0,0,0.06)" />
      <circle
        cx="68"
        cy="56"
        r="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />
      <path
        d="M40 190 Q40 120 68 120 Q96 120 96 190"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />
    </svg>
  );
}
