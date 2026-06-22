"use client";

import { useEffect, useState } from "react";
import { Halo } from "@/components/shared/Halo";
import { Orb } from "@/components/shared/Orb";
import { COUNTDOWN_TARGET_ISO, EVENT_DATE_LABEL } from "@/lib/eventConfig";

function getRemaining() {
  const ms = Math.max(0, new Date(COUNTDOWN_TARGET_ISO).getTime() - Date.now());
  const totalSeconds = Math.floor(ms / 1000);
  return {
    h: Math.floor(totalSeconds / 3600),
    m: Math.floor((totalSeconds % 3600) / 60),
    s: totalSeconds % 60,
  };
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function CountdownView() {
  const [remaining, setRemaining] = useState({ h: 0, m: 0, s: 0 });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  useEffect(() => {
    setRemaining(getRemaining());
    const id = setInterval(() => setRemaining(getRemaining()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative min-h-screen w-screen overflow-hidden flex flex-col items-center text-center">
      <div
        className="absolute inset-0 animate-gr-drift"
        style={{
          background:
            "radial-gradient(circle at 12% 10%, rgba(142,205,247,.4), transparent 50%), radial-gradient(circle at 88% 8%, rgba(247,168,200,.36), transparent 52%), radial-gradient(circle at 50% 110%, rgba(106,79,201,.2), transparent 62%), #faf6f0",
        }}
      />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center w-full px-[4vw]">
        <div className="font-extrabold tracking-[5px] text-[#a89be0]" style={{ fontSize: "clamp(14px,1.6vw,22px)" }}>
          {EVENT_DATE_LABEL}
        </div>

        <div
          className="relative flex items-center justify-center"
          style={{ margin: "clamp(18px,3vh,40px) 0", width: "clamp(220px,28vw,360px)", height: "clamp(220px,28vw,360px)" }}
        >
          <Halo size={460} />
          <Orb
            variant="main"
            size={260}
            glow={1.3}
            floating
            className="relative z-10"
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        <h1
          className="font-serif font-bold text-[#3a3349]"
          style={{ fontSize: "clamp(48px,7vw,110px)", lineHeight: 1.02 }}
        >
          FALTA POCO
        </h1>

        <div
          className="font-extrabold text-[#6A4FC9]"
          style={{
            fontSize: "clamp(80px,14vw,220px)",
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
            marginTop: "clamp(10px,2vh,24px)",
            textShadow: "0 14px 40px rgba(106,79,201,.25)",
          }}
        >
          {pad(remaining.h)}:{pad(remaining.m)}:{pad(remaining.s)}
        </div>

        <p className="text-[#766d89] font-bold" style={{ fontSize: "clamp(16px,2vw,26px)", marginTop: "clamp(10px,1.8vh,20px)" }}>
          Para descubrir el gran secreto
        </p>
      </div>

      <div
        className="relative z-10 w-full flex flex-col items-center"
        style={{ paddingBottom: "clamp(24px,4vh,56px)", gap: "clamp(10px,1.4vh,18px)" }}
      >
        <p className="font-extrabold text-[#3a3349]" style={{ fontSize: "clamp(15px,1.8vw,24px)" }}>
          Última oportunidad para hacer tu predicción
        </p>
        {siteUrl && (
          <div className="flex items-center gap-3">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(siteUrl)}`}
              alt="Código QR para participar"
              width={120}
              height={120}
              className="rounded-xl bg-white p-2"
              style={{ boxShadow: "0 10px 30px -16px rgba(106,79,201,.5)" }}
            />
            <span className="font-extrabold tracking-[1px] text-[#a99fb6]" style={{ fontSize: "clamp(13px,1.4vw,18px)" }}>
              Escanea y participa
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
