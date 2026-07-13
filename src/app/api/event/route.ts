import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkAdminPassword } from "@/lib/admin-auth";
import { getDemoEvent, isDemoMode, setDemoEvent } from "@/lib/demo-data";
import { getActiveEvent } from "@/lib/event";
import { getPaymentSettingsPublic } from "@/lib/payment-settings";
import { getServiceSupabase, isSupabaseConfigured } from "@/lib/supabase";

export async function GET() {
  if (isDemoMode()) {
    const payment = await getPaymentSettingsPublic();
    return NextResponse.json({
      configured: true,
      demo: true,
      event: getDemoEvent(),
      payment,
    });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        configured: false,
        error:
          "Supabase ainda não configurado. Siga o README e preencha o .env.local",
      },
      { status: 503 }
    );
  }

  try {
    const event = await getActiveEvent();
    if (!event) {
      return NextResponse.json(
        {
          configured: true,
          error: "Nenhum evento cadastrado. Rode o schema.sql no Supabase.",
        },
        { status: 404 }
      );
    }
    const payment = await getPaymentSettingsPublic();
    return NextResponse.json({ configured: true, demo: false, event, payment });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao buscar evento";
    return NextResponse.json({ configured: true, error: message }, { status: 500 });
  }
}

const updateSchema = z.object({
  name: z.string().min(2).max(160),
  description: z.string().max(8000),
  regulations: z.string().max(12000),
  event_date: z.string().min(8),
  start_time: z.string().min(1).max(10),
  location: z.string().max(300),
  city: z.string().max(120),
  price_cents: z.number().int().min(0).max(10_000_000),
  max_slots: z.number().int().min(1).max(100_000),
  registration_open: z.boolean(),
  categories: z.array(z.string().min(1).max(60)).min(1).max(40),
  shirt_sizes: z.array(z.string().min(1).max(20)).min(1).max(20),
  cover_image_url: z.string().url().nullable().optional(),
  theme_layout: z
    .enum(["bilheteria", "light", "neon", "classic", "minimal"])
    .optional(),
  theme_font: z
    .enum(["geist", "montserrat", "oswald", "playfair", "space", "roboto"])
    .optional(),
});

export async function PUT(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  if (!checkAdminPassword(password)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const body = parsed.data;

  if (isDemoMode()) {
    const current = getDemoEvent();
    const next = {
      ...current,
      name: body.name.trim(),
      description: body.description.trim(),
      regulations: body.regulations.trim(),
      event_date: body.event_date,
      start_time: body.start_time.trim(),
      location: body.location.trim(),
      city: body.city.trim(),
      price_cents: body.price_cents,
      max_slots: body.max_slots,
      registration_open: body.registration_open,
      categories: body.categories.map((c) => c.trim()).filter(Boolean),
      shirt_sizes: body.shirt_sizes.map((s) => s.trim()).filter(Boolean),
      theme_layout: body.theme_layout ?? current.theme_layout ?? "bilheteria",
      theme_font: body.theme_font ?? current.theme_font ?? "geist",
      cover_image_url:
        body.cover_image_url === undefined
          ? current.cover_image_url
          : body.cover_image_url,
      slots_remaining: Math.max(
        0,
        body.max_slots - current.paid_count - current.pending_count
      ),
    };
    setDemoEvent(next);
    return NextResponse.json({
      ok: true,
      demo: true,
      event: next,
      message: "Salvo na demonstração (some ao reiniciar o servidor).",
    });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase não configurado." }, { status: 503 });
  }

  try {
    const current = await getActiveEvent();
    if (!current) {
      return NextResponse.json({ error: "Evento não encontrado." }, { status: 404 });
    }

    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("events")
      .update({
        name: body.name.trim(),
        description: body.description.trim(),
        regulations: body.regulations.trim(),
        event_date: body.event_date,
        start_time: body.start_time.trim(),
        location: body.location.trim(),
        city: body.city.trim(),
        price_cents: body.price_cents,
        max_slots: body.max_slots,
        registration_open: body.registration_open,
        categories: body.categories.map((c) => c.trim()).filter(Boolean),
        shirt_sizes: body.shirt_sizes.map((s) => s.trim()).filter(Boolean),
        theme_layout: body.theme_layout ?? current.theme_layout ?? "bilheteria",
        theme_font: body.theme_font ?? current.theme_font ?? "geist",
        cover_image_url:
          body.cover_image_url === undefined
            ? current.cover_image_url
            : body.cover_image_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", current.id)
      .select("*")
      .single();

    if (error) throw error;

    const event = await getActiveEvent();
    return NextResponse.json({ ok: true, demo: false, event, raw: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao salvar evento";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
