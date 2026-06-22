"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Contraseña incorrecta");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-[360px]">
        <div className="text-[12px] font-extrabold tracking-[2.5px] text-[#B9A7F7] text-center">PANEL DE CONTROL</div>
        <h1 className="font-serif font-bold text-[34px] mt-1 mb-6 text-center text-[#3a3349]">Acceso de administrador</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          autoFocus
          className="w-full border-2 border-[#ecdfd2] bg-white rounded-2xl px-[18px] py-4 text-[16px] text-[#3a3349] outline-none"
        />
        {error && <div className="mt-3 text-[13px] font-bold text-[#a4677f] text-center">{error}</div>}
        <button
          type="submit"
          disabled={loading || !password}
          className="w-full mt-[18px] border-none rounded-2xl py-4 text-[16px] font-extrabold text-white cursor-pointer"
          style={{ background: !password ? "#d8cfe8" : "#6A4FC9" }}
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
