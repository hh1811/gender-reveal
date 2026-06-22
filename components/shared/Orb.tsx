"use client";

import type { CSSProperties } from "react";

export type OrbVariant = "main" | "nino" | "nina";

const BASE_GRADIENT: Record<OrbVariant, string> = {
  main: "linear-gradient(145deg,#9fd6f9 0%,#c3aef5 48%,#f6abce 100%)",
  nino: "linear-gradient(145deg,#bfe4fb,#8ECDF7 70%)",
  nina: "linear-gradient(145deg,#fbd3e4,#F7A8C8 70%)",
};

const GLOW_COLOR: Record<OrbVariant, string> = {
  main: "rgba(180,160,235,.55)",
  nino: "rgba(142,205,247,.65)",
  nina: "rgba(247,168,200,.65)",
};

export function Orb({
  variant,
  size,
  glow = 1,
  floating = false,
  className = "",
  style,
}: {
  variant: OrbVariant;
  size: number;
  glow?: number;
  floating?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const spread = 14 + glow * 34;
  const blur = 40 + glow * 70;
  return (
    <div
      className={`rounded-full ${floating ? "animate-gr-float" : ""} ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 24%, rgba(255,255,255,.95) 0%, rgba(255,255,255,0) 22%), radial-gradient(circle at 34% 30%, rgba(255,255,255,.7) 0%, rgba(255,255,255,0) 42%), ${BASE_GRADIENT[variant]}`,
        boxShadow: `0 0 ${blur}px ${spread}px ${GLOW_COLOR[variant]}, inset 0 14px 22px rgba(255,255,255,.65), inset -8px -14px 22px rgba(110,80,160,.22)`,
        transition: "box-shadow .7s ease",
        ...style,
      }}
    />
  );
}
