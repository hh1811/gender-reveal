"use client";

export function NamesStep({
  nameNino,
  nameNina,
  onNameNinoChange,
  onNameNinaChange,
  onContinue,
}: {
  nameNino: string;
  nameNina: string;
  onNameNinoChange: (v: string) => void;
  onNameNinaChange: (v: string) => void;
  onContinue: () => void;
}) {
  return (
    <div className="my-auto">
      <div className="text-[12px] font-extrabold tracking-[2px] text-[#B9A7F7] text-center">UNA IDEA MÁS</div>
      <h1 className="font-serif font-bold text-[34px] leading-[1.08] mt-2 mb-1 text-center text-[#3a3349]">
        ¿Qué nombre le pondrías?
      </h1>
      <p className="text-center text-[15px] text-[#766d89] mb-[22px]">Opcional. Sugiere un nombre para cada caso.</p>

      <div className="mb-[14px]">
        <div className="text-[12px] font-extrabold tracking-[1px] text-[#2C6E8F] mb-[6px]">SI ES NIÑO</div>
        <input
          value={nameNino}
          onChange={(e) => onNameNinoChange(e.target.value)}
          placeholder="Nombre para niño…"
          className="w-full border-2 border-[#ecdfd2] bg-white rounded-2xl px-[17px] py-[14px] text-[15px] text-[#3a3349] outline-none"
        />
      </div>

      <div className="mb-[6px]">
        <div className="text-[12px] font-extrabold tracking-[1px] text-[#B14B7E] mb-[6px]">SI ES NIÑA</div>
        <input
          value={nameNina}
          onChange={(e) => onNameNinaChange(e.target.value)}
          placeholder="Nombre para niña…"
          className="w-full border-2 border-[#ecdfd2] bg-white rounded-2xl px-[17px] py-[14px] text-[15px] text-[#3a3349] outline-none"
        />
      </div>

      <button
        onClick={onContinue}
        className="w-full mt-[18px] border-none rounded-2xl py-4 text-[16px] font-extrabold text-white cursor-pointer bg-[#6A4FC9]"
      >
        Continuar
      </button>
    </div>
  );
}
