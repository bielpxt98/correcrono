import { createHash, timingSafeEqual } from "crypto";

/** Senha padrão do painel (use no Render se não definir ADMIN_PASSWORD) */
export const DEFAULT_ADMIN_PASSWORD = "admin123";

const SALT = "correcrono-admin-v1";

/** Senha alterada pelo painel (vale até o servidor reiniciar, se não houver env/banco) */
let runtimePassword: string | null = null;

export function hashPassword(password: string): string {
  return createHash("sha256").update(`${SALT}:${password}`).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  try {
    return timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

/** Senha efetiva: a alterada no painel > variável de ambiente > admin123 */
export function getEffectiveAdminPassword(): string {
  if (runtimePassword) return runtimePassword;
  const env = process.env.ADMIN_PASSWORD?.trim();
  if (env) return env;
  return DEFAULT_ADMIN_PASSWORD;
}

export function checkAdminPassword(password: string | null | undefined): boolean {
  if (!password) return false;
  return safeEqual(password, getEffectiveAdminPassword());
}

export function changeAdminPassword(
  currentPassword: string,
  newPassword: string
): { ok: true } | { ok: false; error: string } {
  if (!newPassword || newPassword.length < 6) {
    return { ok: false, error: "A nova senha precisa ter no mínimo 6 caracteres." };
  }
  if (newPassword.length > 80) {
    return { ok: false, error: "Senha muito longa." };
  }
  if (!checkAdminPassword(currentPassword)) {
    return { ok: false, error: "Senha atual incorreta." };
  }

  runtimePassword = newPassword;
  return { ok: true };
}
