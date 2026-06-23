import type { CSSProperties } from "react";
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
  const border = BORDER[vote];
  return (
    <div
      className={`rounded-full flex items-center justify-center font-extrabold flex-none ${className}`}
      style={{
        width: size,
        height: size,
        color: colorFor(vote),
        background: softFor(vote),
        backgroundImage: photoUrl ? `url("${photoUrl}")` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        border: `2px solid ${border}`,
        boxShadow: glow ? `0 0 18px 4px ${border}66` : undefined,
        fontSize: size * 0.4,
        ...style,
      }}
    >
      {!photoUrl && initialFor(name)}
    </div>
  );
}
