"use client";

export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 bg-white border-2 border-[#ecdfd2] rounded-full text-[#766d89] text-[13px] font-bold cursor-pointer mb-4 px-4 py-2"
      style={{ boxShadow: "0 4px 14px -10px rgba(106,79,201,.35)" }}
    >
      <span style={{ fontSize: 14 }}>←</span> Atrás
    </button>
  );
}
