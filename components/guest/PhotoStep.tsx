"use client";

import { RefObject } from "react";

export function PhotoStep({
  photo,
  cameraError,
  videoRef,
  onCapture,
  onRetake,
  onFile,
  onUsePhoto,
  onSkip,
}: {
  photo: string | null;
  cameraError: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
  onCapture: () => void;
  onRetake: () => void;
  onFile: (file: File) => void;
  onUsePhoto: () => void;
  onSkip: () => void;
}) {
  const hasPhoto = !!photo;
  const noPhoto = !photo && !cameraError;
  const showError = cameraError && !photo;

  return (
    <div className="my-auto text-center">
      <div className="text-[12px] font-extrabold tracking-[2px] text-[#B9A7F7]">UNA FOTO DEL MOMENTO</div>
      <h1 className="font-serif font-bold text-[38px] leading-[1.05] mt-2 mb-1 text-[#3a3349]">¡Sonríe!</h1>
      <p className="text-[15px] text-[#8a8398] mb-[18px]">Tu foto aparecerá junto a tu voto.</p>

      <div
        className="relative w-[212px] h-[212px] rounded-full overflow-hidden mx-auto mb-2 border-4 border-white"
        style={{ background: "#efe3d6", boxShadow: "0 14px 34px -18px rgba(106,79,201,.6)" }}
      >
        {noPhoto && (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ transform: "scaleX(-1)" }}
          />
        )}
        {hasPhoto && (
          <div
            className="w-full h-full"
            style={{ backgroundImage: `url("${photo}")`, backgroundSize: "cover", backgroundPosition: "center" }}
          />
        )}
        {showError && (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-[13px] font-bold text-[#a4677f] text-center bg-[#efe3d6]">
            Activa la cámara o sube una foto
          </div>
        )}
      </div>

      <div className="h-6" />

      {noPhoto && (
        <>
          <button
            onClick={onCapture}
            className="w-full border-none rounded-2xl py-4 text-[16px] font-extrabold text-white cursor-pointer bg-[#6A4FC9]"
          >
            Tomar foto
          </button>
          <label className="block w-full mt-[10px] border-2 border-[#ecdfd2] rounded-2xl py-[13px] text-[15px] font-extrabold text-[#8a8398] cursor-pointer">
            Subir una foto
            <input
              type="file"
              accept="image/*"
              capture="user"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onFile(f);
              }}
            />
          </label>
        </>
      )}

      {hasPhoto && (
        <>
          <button
            onClick={onUsePhoto}
            className="w-full border-none rounded-2xl py-4 text-[16px] font-extrabold text-white cursor-pointer bg-[#6A4FC9]"
          >
            Usar esta foto
          </button>
          <button
            onClick={onRetake}
            className="w-full mt-[10px] bg-transparent border-2 border-[#ecdfd2] rounded-2xl py-[13px] text-[#8a8398] text-[15px] font-extrabold cursor-pointer"
          >
            Repetir
          </button>
        </>
      )}

      <button onClick={onSkip} className="w-full bg-transparent border-none text-[#a99fb6] text-[14px] font-bold py-[14px] cursor-pointer">
        Omitir foto
      </button>
    </div>
  );
}
