import type { RegistrationRow, RegistrationStatus } from "./types";

export type CountMap = Record<string, number>;

export type RegistrationStats = {
  total: number;
  /** Só conta quem não cancelou */
  active: number;
  by_status: Record<RegistrationStatus | string, number>;
  by_category: CountMap;
  by_shirt: CountMap;
  paid: number;
  pending: number;
  cancelled: number;
  refunded: number;
  /** Pagos + pendentes (ocupam vaga) */
  awaiting_or_paid: number;
};

export function computeStats(rows: RegistrationRow[]): RegistrationStats {
  const by_status: CountMap = {};
  const by_category: CountMap = {};
  const by_shirt: CountMap = {};

  for (const r of rows) {
    by_status[r.status] = (by_status[r.status] || 0) + 1;
    if (r.status === "cancelled") continue;
    by_category[r.category] = (by_category[r.category] || 0) + 1;
    by_shirt[r.shirt_size] = (by_shirt[r.shirt_size] || 0) + 1;
  }

  const paid = by_status.paid || 0;
  const pending = by_status.pending || 0;
  const cancelled = by_status.cancelled || 0;
  const refunded = by_status.refunded || 0;

  return {
    total: rows.length,
    active: paid + pending + refunded,
    by_status,
    by_category,
    by_shirt,
    paid,
    pending,
    cancelled,
    refunded,
    awaiting_or_paid: paid + pending,
  };
}

export function filterRegistrations(
  rows: RegistrationRow[],
  opts: {
    q?: string;
    status?: string;
    category?: string;
    shirt?: string;
  }
): RegistrationRow[] {
  const q = opts.q?.trim().toLowerCase() ?? "";
  const digits = q.replace(/\D/g, "");

  return rows.filter((r) => {
    if (opts.status && opts.status !== "all" && r.status !== opts.status) {
      return false;
    }
    if (opts.category && opts.category !== "all" && r.category !== opts.category) {
      return false;
    }
    if (opts.shirt && opts.shirt !== "all" && r.shirt_size !== opts.shirt) {
      return false;
    }
    if (!q) return true;
    return (
      r.full_name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      (digits.length >= 3 && r.cpf.includes(digits)) ||
      r.phone.includes(digits)
    );
  });
}

/** Ordena chaves de contagem: tamanhos conhecidos primeiro, depois alpha */
export function sortShirtKeys(keys: string[]): string[] {
  const order = ["PP", "P", "M", "G", "GG", "XG", "XXG"];
  return [...keys].sort((a, b) => {
    const ia = order.indexOf(a.toUpperCase());
    const ib = order.indexOf(b.toUpperCase());
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}

export function sortCategoryKeys(keys: string[]): string[] {
  return [...keys].sort((a, b) => a.localeCompare(b, "pt-BR"));
}
