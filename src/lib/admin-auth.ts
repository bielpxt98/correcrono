import { timingSafeEqual } from "crypto";
import { isDemoMode } from "./demo-data";

/** Em modo demo a senha é: demo */
const DEMO_PASSWORD = "demo";

export function checkAdminPassword(password: string | null | undefined): boolean {
  if (!password) return false;

  if (isDemoMode()) {
    return password === DEMO_PASSWORD || password === "demo";
  }

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;

  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
