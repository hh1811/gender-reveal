"use client";

import { useState, type CSSProperties } from "react";
import type { VoteChoice } from "@/lib/types";
import { colorFor, initialFor, softFor } from "@/lib/voteDisplay";

const BORDER: Record<VoteChoice, string> = { nino: "#8ECDF7", nina: "#F7A8C8" };

export function Avatar({
  name,
  vote,
  photoUrl,
  size,
  glow = false,
  className = "",
  style,
}: {
  name: string;
  vote: VoteChoice;
  photoUrl: string | null;
  size: number;
  glow?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const [broken, setBroken] = useState(false);
  const border = BORDER[vote];
  const showPhoto = !!photoUrl && !broken;
  return (
    <div
      className={`relative overflow-hidden rounded-full flex items-center justify-center font-extrabold flex-none ${className}`}
      style={{
        width: size,
        height: size,
        color: colorFor(vote),
        background: softFor(vote),
        border: `2px solid ${border}`,
        boxShadow: glow ? `0 0 18px 4px ${border}66` : undefined,
        fontSize: size * 0.4,
        ...style,
      }}
    >
      {showPhoto && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photoUrl}
          alt={name}
          onError={() => setBroken(true)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      {!showPhoto && initialFor(name)}
    </div>
  );
}
