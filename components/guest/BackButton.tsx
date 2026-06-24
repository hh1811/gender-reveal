"use client";

export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 bg-transparent border-none text-[#a99fb6] text-[13px] font-bold cursor-pointer mb-4 -ml-1 px-1 py-1"
    >
      <span style={{ fontSize: 16 }}>←</span> Atrás
    </button>
  );
}
