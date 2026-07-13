import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isDemoMode } from "@/lib/demo-data";
import { getActiveEvent, isValidCpf, onlyDigits } from "@/lib/event";
import { getServiceSupabase, isSupabaseConfigured } from "@/lib/supabase";

const bodySchema = z.object({
  full_name: z.string().min(3).max(120),
  cpf: z.string().min(11).max(14),
  birth_date: z.string().optional().nullable(),
  phone: z.string().min(10).max(20),
  email: z.string().email(),
  shirt_size: z.string().min(1).max(20),
  category: z.string().min(1).max(60),
  payment_method: z.enum(["pix", "card"]).optional(),
});

export async function POST(req: NextRequest) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const cpf = onlyDigits(data.cpf);

  if (isDemoMode()) {
    if (cpf.length !== 11) {
      return NextResponse.json(
        { error: "Na demo, use CPF com 11 dígitos (ex: 529.982.247-25)." },
        { status: 400 }
      );
    }
    const id = crypto.randomUUID();
    const ev = (await import("@/lib/demo-data")).getDemoEvent();
    return NextResponse.json({
      demo: true,
      registration: {
        id,
        event_id: ev.id,
        full_name: data.full_name.trim(),
        cpf,
        birth_date: data.birth_date || null,
        phone: onlyDigits(data.phone),
        email: data.email.trim().toLowerCase(),
        shirt_size: data.shirt_size,
        category: data.category,
        status: "pending",
        payment_id: null,
        payment_method: data.payment_method || "pix",
        amount_cents: ev.price_cents,
        created_at: new Date().toISOString(),
      },
      event: {
        id: ev.id,
        name: ev.name,
        price_cents: ev.price_cents,
      },
    });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase não configurado." },
      { status: 503 }
    );
  }

  if (!isValidCpf(cpf)) {
    return NextResponse.json({ error: "CPF inválido." }, { status: 400 });
  }

  try {
    const event = await getActiveEvent();
    if (!event) {
      return NextResponse.json({ error: "Evento não encontrado." }, { status: 404 });
    }
    if (!event.registration_open) {
      return NextResponse.json({ error: "Inscrições fechadas." }, { status: 403 });
    }
    if (event.slots_remaining <= 0) {
      return NextResponse.json({ error: "Não há mais vagas." }, { status: 409 });
    }

    if (!event.categories.includes(data.category)) {
      return NextResponse.json({ error: "Categoria inválida." }, { status: 400 });
    }
    if (!event.shirt_sizes.includes(data.shirt_size)) {
      return NextResponse.json({ error: "Tamanho de camiseta inválido." }, { status: 400 });
    }

    const supabase = getServiceSupabase();

    const { data: existing } = await supabase
      .from("registrations")
      .select("id, status")
      .eq("event_id", event.id)
      .eq("cpf", cpf)
      .maybeSingle();

    if (existing && existing.status !== "cancelled") {
      return NextResponse.json(
        { error: "Já existe inscrição com este CPF para este evento." },
        { status: 409 }
      );
    }

    const payload = {
      event_id: event.id,
      full_name: data.full_name.trim(),
      cpf,
      birth_date: data.birth_date || null,
      phone: onlyDigits(data.phone),
      email: data.email.trim().toLowerCase(),
      shirt_size: data.shirt_size,
      category: data.category,
      status: "pending" as const,
      amount_cents: event.price_cents,
      payment_id: null,
      payment_method: data.payment_method || null,
    };

    const { data: registration, error } = existing
      ? await supabase
          .from("registrations")
          .update(payload)
          .eq("id", existing.id)
          .select("*")
          .single()
      : await supabase.from("registrations").insert(payload).select("*").single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Já existe inscrição com este CPF." },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      registration,
      event: {
        id: event.id,
        name: event.name,
        price_cents: event.price_cents,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao inscrever";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
