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
      <div className="flex justify-center mb-[26px]">
        <div className="w-[88px] h-[88px] rounded-full bg-gradient-to-br from-[#8ECDF7] to-[#F7A8C8] animate-gr-float" />
      </div>
      <div className="text-[12px] font-extrabold tracking-[2.5px] text-[#B9A7F7] text-center">GENDER REVEAL</div>
      <h1 className="font-serif font-bold text-[40px] leading-[1.05] mt-[10px] mb-[8px] text-center text-[#3a3349]">
        ¡Bienvenido!
      </h1>
      <p className="text-center text-[15px] leading-[1.5] text-[#8a8398] mb-[26px]">
        Antes de votar, dinos tu nombre para sumarte a la fiesta.
      </p>
      <input
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Tu nombre"
        className="w-full border-2 border-[#ecdfd2] bg-white rounded-2xl px-[18px] py-4 text-[16px] text-[#3a3349] outline-none"
      />
      <button
        onClick={onContinue}
        disabled={!canContinue}
        className="w-full mt-[18px] border-none rounded-2xl py-4 text-[16px] font-extrabold text-white"
        style={{ background: canContinue ? "#6A4FC9" : "#d8cfe8", cursor: canContinue ? "pointer" : "not-allowed" }}
      >
        Continuar
      </button>
    </div>
  );
}
