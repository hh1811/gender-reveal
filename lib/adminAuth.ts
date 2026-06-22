export const ADMIN_COOKIE_NAME = "admin_session";

export function isAdminAuthConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

async function sign(value: string): Promise<string> {
  const secret = process.env.ADMIN_COOKIE_SECRET || "dev-secret-change-me";
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
  ]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function expectedSessionToken(): Promise<string | null> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return sign(password);
}

export async function checkPassword(candidate: string): Promise<boolean> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const [a, b] = await Promise.all([sign(candidate), sign(password)]);
  return timingSafeEqualHex(a, b);
}

export async function isValidSessionToken(token: string | undefined | null): Promise<boolean> {
  const expected = await expectedSessionToken();
  if (!expected) return true;
  if (!token) return false;
  return timingSafeEqualHex(token, expected);
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
