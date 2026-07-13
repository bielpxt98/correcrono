import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { z } from "zod";
import { isDemoMode } from "@/lib/demo-data";
import { getMercadoPagoAccessToken } from "@/lib/payment-settings";
import { getServiceSupabase, isSupabaseConfigured } from "@/lib/supabase";

const bodySchema = z.object({
  registration_id: z.string().uuid(),
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
    return NextResponse.json({ error: "registration_id inválido." }, { status: 400 });
  }

  const method = parsed.data.payment_method || "pix";

  // Demo (sem banco real) → sempre tela /pagar simulada
  if (isDemoMode()) {
    return NextResponse.json({
      demo: true,
      manual: true,
      payment_method: method,
      message: "Use a tela de pagamento da demonstração.",
    });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase não configurado." }, { status: 503 });
  }

  const token = await getMercadoPagoAccessToken();
  if (!token) {
    return NextResponse.json(
      {
        error:
          "Recebimento ainda não configurado. No admin, abra a aba Recebimento e cadastre o Mercado Pago ou o Pix manual.",
        manual: true,
        payment_method: method,
      },
      { status: 503 }
    );
  }

  try {
    const supabase = getServiceSupabase();
    const { data: registration, error } = await supabase
      .from("registrations")
      .select("*, events(name)")
      .eq("id", parsed.data.registration_id)
      .single();

    if (error || !registration) {
      return NextResponse.json({ error: "Inscrição não encontrada." }, { status: 404 });
    }

    if (registration.status === "paid") {
      return NextResponse.json({ error: "Inscrição já está paga." }, { status: 400 });
    }
    if (registration.status === "cancelled") {
      return NextResponse.json({ error: "Inscrição cancelada." }, { status: 400 });
    }

    // Guarda preferência do atleta
    await supabase
      .from("registrations")
      .update({ payment_method: method })
      .eq("id", registration.id);

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
      req.nextUrl.origin;

    const client = new MercadoPagoConfig({ accessToken: token });
    const preference = new Preference(client);

    const eventName =
      (registration.events as { name?: string } | null)?.name ?? "Corrida";

    // Se escolheu Pix, esconde cartão (e vice-versa) no checkout MP
    const payment_methods =
      method === "pix"
        ? {
            excluded_payment_types: [
              { id: "credit_card" },
              { id: "debit_card" },
              { id: "ticket" },
              { id: "atm" },
            ],
          }
        : {
            excluded_payment_types: [
              { id: "bank_transfer" },
              { id: "ticket" },
              { id: "atm" },
            ],
            // bank_transfer costuma incluir Pix no BR; credit_card fica liberado
          };

    const result = await preference.create({
      body: {
        items: [
          {
            id: registration.id,
            title: `Inscrição — ${eventName}`,
            quantity: 1,
            unit_price: registration.amount_cents / 100,
            currency_id: "BRL",
          },
        ],
        payer: {
          name: registration.full_name,
          email: registration.email,
        },
        external_reference: registration.id,
        payment_methods,
        back_urls: {
          success: `${appUrl}/confirmacao?id=${registration.id}&status=success&method=${method}`,
          failure: `${appUrl}/confirmacao?id=${registration.id}&status=failure&method=${method}`,
          pending: `${appUrl}/confirmacao?id=${registration.id}&status=pending&method=${method}`,
        },
        auto_return: "approved",
        notification_url: `${appUrl}/api/webhook/mercadopago`,
      },
    });

    return NextResponse.json({
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
      preference_id: result.id,
      payment_method: method,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro no pagamento";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
