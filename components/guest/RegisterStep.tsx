"use client";

export function RegisterStep({
  name,
  onNameChange,
  onContinue,
}: {
  name: string;
  onNameChange: (v: string) => void;
  onContinue: () => void;
}) {
  const canContinue = !!name.trim();
  return (
    <div className="my-auto">
      <div className="relative flex justify-center items-center mb-[22px] h-[124px]">
        <div
          className="absolute rounded-full"
          style={{
            width: 320,
            height: 320,
            filter: "blur(36px)",
            background:
              "radial-gradient(circle, rgba(159,214,249,.4) 0%, rgba(195,175,245,.26) 45%, transparent 72%)",
          }}
        />
        <div
          className="relative z-10 w-[124px] h-[124px] rounded-full animate-gr-float"
          style={{
            background:
              "radial-gradient(circle at 30% 24%, rgba(255,255,255,.95) 0%, rgba(255,255,255,0) 22%), radial-gradient(circle at 34% 30%, rgba(255,255,255,.7) 0%, rgba(255,255,255,0) 42%), linear-gradient(145deg,#9fd6f9 0%,#c3aef5 48%,#f6abce 100%)",
            boxShadow:
              "0 0 70px 18px rgba(142,205,247,.42), 0 0 85px 24px rgba(247,168,200,.32), inset 0 14px 22px rgba(255,255,255,.65), inset -8px -14px 22px rgba(110,80,160,.22)",
          }}
        />
      </div>
      <div className="text-[11px] font-extrabold tracking-[3px] text-[#a89be0] text-center">27 JUNIO 2026</div>
      <h1
        className="font-serif font-bold text-[42px] leading-[1.05] mt-2 mb-1 text-center"
        style={{
          background: "linear-gradient(135deg,#5fa8d9,#9b7fe0,#e08bb3)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        HÉCTOR &amp; LIZ
      </h1>
      <p className="text-center text-[14.5px] text-[#766d89] mb-[22px]">Nuestro Baby #3 está en camino.</p>
      <input
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Tu nombre"
        className="w-full border-2 border-[#ecdfd2] bg-white rounded-2xl px-[18px] py-4 text-[16px] text-[#3a3349] outline-none"
      />
      <button
        onClick={onContinue}
        disabled={!canContinue}
        className="w-full mt-[16px] border-none rounded-full h-[58px] text-[16px] font-extrabold text-white transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
        style={{
          background: canContinue ? "linear-gradient(135deg,#6FB6E8,#9B8FE0,#EE93BE)" : "#d8cfe8",
          boxShadow: canContinue
            ? "0 16px 32px -16px rgba(142,205,247,.5), 0 16px 32px -16px rgba(247,168,200,.4)"
            : "none",
          cursor: canContinue ? "pointer" : "not-allowed",
        }}
      >
        Continuar
      </button>
    </div>
  );
}
