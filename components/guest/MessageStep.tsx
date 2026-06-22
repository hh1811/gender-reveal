"use client";

export function MessageStep({
  message,
  onMessageChange,
  onSubmit,
  onBack,
}: {
  message: string;
  onMessageChange: (v: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}) {
  return (
    <div className="my-auto">
      <div className="text-[12px] font-extrabold tracking-[2px] text-[#B9A7F7] text-center">CASI LISTO</div>
      <h1 className="font-serif font-bold text-[34px] leading-[1.08] mt-2 mb-1 text-center text-[#3a3349]">
        Un mensaje para los papás
      </h1>
      <p className="text-center text-[15px] text-[#8a8398] mb-[22px]">Opcional, pero les encantará leerlo.</p>
      <textarea
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        placeholder="Escribe tus buenos deseos…"
        rows={4}
        className="w-full border-2 border-[#ecdfd2] bg-white rounded-2xl px-[17px] py-[15px] text-[15px] leading-[1.5] text-[#3a3349] outline-none resize-none"
      />
      <button
        onClick={onSubmit}
        className="w-full mt-[18px] border-none rounded-2xl py-4 text-[16px] font-extrabold text-white cursor-pointer bg-[#6A4FC9]"
      >
        Enviar mi voto
      </button>
      <button onClick={onBack} className="w-full bg-transparent border-none text-[#a99fb6] text-[14px] font-bold py-[14px] cursor-pointer">
        Cambiar mi voto
      </button>
    </div>
  );
}
