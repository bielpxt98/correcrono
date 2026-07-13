import { getDemoEvent, isDemoMode } from "./demo-data";
import { getActiveEvent } from "./event";
import { getServiceSupabase, isSupabaseConfigured } from "./supabase";

export type Coupon = {
  id: string;
  event_id: string;
  code: string;
  partner_name: string;
  discount_percent: number;
  max_uses: number | null;
  used_count: number;
  active: boolean;
  notes: string;
  created_at: string;
};

export type CouponValidation =
  | {
      ok: true;
      coupon: Coupon;
      original_cents: number;
      discount_cents: number;
      final_cents: number;
      label: string;
    }
  | { ok: false; error: string };

function normalizeCode(code: string): string {
  return code.trim().toUpperCase().replace(/\s+/g, "");
}

/** Cupons de exemplo na demo */
let demoCoupons: Coupon[] = [
  {
    id: "cup-1",
    event_id: "00000000-0000-4000-8000-000000000001",
    code: "MODAPRAIA10",
    partner_name: "Moda Praia",
    discount_percent: 10,
    max_uses: 100,
    used_count: 3,
    active: true,
    notes: "Loja parceira — exemplo",
    created_at: new Date().toISOString(),
  },
  {
    id: "cup-2",
    event_id: "00000000-0000-4000-8000-000000000001",
    code: "PARCEIRO15",
    partner_name: "Academia Fit",
    discount_percent: 15,
    max_uses: 50,
    used_count: 0,
    active: true,
    notes: "",
    created_at: new Date().toISOString(),
  },
];

export function getDemoCoupons(): Coupon[] {
  return [...demoCoupons].sort(
    (a, b) => +new Date(b.created_at) - +new Date(a.created_at)
  );
}

export async function listCoupons(): Promise<Coupon[]> {
  if (isDemoMode()) return getDemoCoupons();

  const event = await getActiveEvent();
  if (!event || !isSupabaseConfigured()) return [];

  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("event_id", event.id)
    .order("created_at", { ascending: false });

  if (error) {
    if (error.message.includes("coupons") || error.code === "42P01") {
      return [];
    }
    throw error;
  }
  return (data ?? []) as Coupon[];
}

export async function createCoupon(input: {
  code: string;
  partner_name: string;
  discount_percent: number;
  max_uses: number | null;
  notes?: string;
}): Promise<Coupon> {
  const code = normalizeCode(input.code);
  if (code.length < 3) throw new Error("Código muito curto (mín. 3 caracteres).");
  if (input.discount_percent < 1 || input.discount_percent > 100) {
    throw new Error("Desconto deve ser entre 1% e 100%.");
  }

  if (isDemoMode()) {
    const ev = getDemoEvent();
    if (demoCoupons.some((c) => c.code === code)) {
      throw new Error("Já existe um cupom com este código.");
    }
    const coupon: Coupon = {
      id: crypto.randomUUID(),
      event_id: ev.id,
      code,
      partner_name: input.partner_name.trim() || "Parceiro",
      discount_percent: Math.round(input.discount_percent),
      max_uses: input.max_uses,
      used_count: 0,
      active: true,
      notes: (input.notes || "").trim(),
      created_at: new Date().toISOString(),
    };
    demoCoupons = [coupon, ...demoCoupons];
    return coupon;
  }

  const event = await getActiveEvent();
  if (!event) throw new Error("Evento não encontrado.");

  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from("coupons")
    .insert({
      event_id: event.id,
      code,
      partner_name: input.partner_name.trim() || "Parceiro",
      discount_percent: Math.round(input.discount_percent),
      max_uses: input.max_uses,
      used_count: 0,
      active: true,
      notes: (input.notes || "").trim(),
    })
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") throw new Error("Já existe um cupom com este código.");
    throw new Error(error.message);
  }
  return data as Coupon;
}

export async function setCouponActive(
  id: string,
  active: boolean
): Promise<Coupon> {
  if (isDemoMode()) {
    const idx = demoCoupons.findIndex((c) => c.id === id);
    if (idx < 0) throw new Error("Cupom não encontrado.");
    demoCoupons[idx] = { ...demoCoupons[idx], active };
    return demoCoupons[idx];
  }

  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from("coupons")
    .update({ active })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as Coupon;
}

export function calcDiscount(
  priceCents: number,
  percent: number
): { discount_cents: number; final_cents: number } {
  const discount_cents = Math.min(
    priceCents,
    Math.round((priceCents * percent) / 100)
  );
  return {
    discount_cents,
    final_cents: Math.max(0, priceCents - discount_cents),
  };
}

export async function validateCouponCode(
  rawCode: string,
  priceCents?: number
): Promise<CouponValidation> {
  const code = normalizeCode(rawCode);
  if (!code) return { ok: false, error: "Digite o código do cupom." };

  let coupon: Coupon | undefined;
  let price = priceCents ?? 0;

  if (isDemoMode()) {
    const ev = getDemoEvent();
    price = priceCents ?? ev.price_cents;
    coupon = demoCoupons.find((c) => c.code === code && c.event_id === ev.id);
  } else {
    const event = await getActiveEvent();
    if (!event) return { ok: false, error: "Evento não encontrado." };
    price = priceCents ?? event.price_cents;
    const supabase = getServiceSupabase();
    const { data } = await supabase
      .from("coupons")
      .select("*")
      .eq("event_id", event.id)
      .eq("code", code)
      .maybeSingle();
    coupon = (data as Coupon) || undefined;
  }

  if (!coupon) return { ok: false, error: "Cupom inválido." };
  if (!coupon.active) return { ok: false, error: "Este cupom está desativado." };
  if (coupon.max_uses != null && coupon.used_count >= coupon.max_uses) {
    return { ok: false, error: "Cupom esgotado (limite de usos)." };
  }

  const { discount_cents, final_cents } = calcDiscount(
    price,
    coupon.discount_percent
  );

  return {
    ok: true,
    coupon,
    original_cents: price,
    discount_cents,
    final_cents,
    label: `${coupon.discount_percent}% off · ${coupon.partner_name || coupon.code}`,
  };
}

/** Incrementa uso do cupom (após inscrição com cupom). */
export async function consumeCoupon(couponId: string): Promise<void> {
  if (isDemoMode()) {
    const idx = demoCoupons.findIndex((c) => c.id === couponId);
    if (idx >= 0) {
      demoCoupons[idx] = {
        ...demoCoupons[idx],
        used_count: demoCoupons[idx].used_count + 1,
      };
    }
    return;
  }

  const supabase = getServiceSupabase();
  const { data } = await supabase
    .from("coupons")
    .select("used_count")
    .eq("id", couponId)
    .single();
  if (!data) return;
  await supabase
    .from("coupons")
    .update({ used_count: (data.used_count as number) + 1 })
    .eq("id", couponId);
}

export { normalizeCode };
