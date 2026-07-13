import { getServiceSupabase } from "./supabase";
import { asStringArray, type EventImage, type EventPublic, type EventRow } from "./types";

function normalizeEvent(row: Record<string, unknown>): EventRow {
  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    description: String(row.description ?? ""),
    regulations: String(row.regulations ?? ""),
    event_date: String(row.event_date ?? ""),
    start_time: String(row.start_time ?? "07:00"),
    location: String(row.location ?? ""),
    city: String(row.city ?? ""),
    price_cents: Number(row.price_cents ?? 0),
    max_slots: Number(row.max_slots ?? 0),
    registration_open: Boolean(row.registration_open),
    cover_image_url: (row.cover_image_url as string | null) ?? null,
    categories: asStringArray(row.categories, ["Geral"]),
    shirt_sizes: asStringArray(row.shirt_sizes, ["P", "M", "G"]),
    created_at: String(row.created_at ?? ""),
    updated_at: row.updated_at ? String(row.updated_at) : undefined,
  };
}

export async function getActiveEvent(): Promise<EventPublic | null> {
  const supabase = getServiceSupabase();
  const eventId = process.env.EVENT_ID;

  let query = supabase.from("events").select("*").order("created_at", {
    ascending: true,
  });

  if (eventId) {
    query = query.eq("id", eventId);
  }

  const { data: events, error } = await query.limit(1);
  if (error) throw error;
  const raw = events?.[0] as Record<string, unknown> | undefined;
  if (!raw) return null;

  const event = normalizeEvent(raw);

  const [{ count: paidCount }, { count: pendingCount }, imagesRes] =
    await Promise.all([
      supabase
        .from("registrations")
        .select("*", { count: "exact", head: true })
        .eq("event_id", event.id)
        .eq("status", "paid"),
      supabase
        .from("registrations")
        .select("*", { count: "exact", head: true })
        .eq("event_id", event.id)
        .eq("status", "pending"),
      supabase
        .from("event_images")
        .select("*")
        .eq("event_id", event.id)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
    ]);

  if (imagesRes.error) throw imagesRes.error;

  const images = (imagesRes.data ?? []) as EventImage[];
  const occupied = (paidCount ?? 0) + (pendingCount ?? 0);
  const slots_remaining = Math.max(0, event.max_slots - occupied);

  // Capa: cover_image_url do evento ou primeira marcada is_cover ou primeira foto
  let cover = event.cover_image_url;
  if (!cover) {
    const coverImg = images.find((i) => i.is_cover) ?? images[0];
    cover = coverImg?.url ?? null;
  }

  return {
    ...event,
    cover_image_url: cover,
    slots_remaining,
    paid_count: paidCount ?? 0,
    pending_count: pendingCount ?? 0,
    images,
  };
}

export function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatDateBR(isoDate: string): string {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-");
  if (!y || !m || !d) return isoDate;
  return `${d}/${m}/${y}`;
}

export function formatDateLongBR(isoDate: string): string {
  if (!isoDate) return "";
  const date = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(date.getTime())) return formatDateBR(isoDate);
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function isValidCpf(cpf: string): boolean {
  const digits = onlyDigits(cpf);
  if (digits.length !== 11) return false;
  if (/^(\d)\1+$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(digits[i]) * (10 - i);
  let rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  if (rest !== Number(digits[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(digits[i]) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  return rest === Number(digits[10]);
}

export function priceFromReaisInput(value: string): number {
  const normalized = value.replace(/\./g, "").replace(",", ".").replace(/[^\d.]/g, "");
  const num = Number(normalized);
  if (Number.isNaN(num) || num < 0) return 0;
  return Math.round(num * 100);
}
