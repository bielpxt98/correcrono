import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { validateCouponCode } from "@/lib/coupons";

const bodySchema = z.object({
  code: z.string().min(1).max(40),
  price_cents: z.number().int().min(0).optional(),
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
    return NextResponse.json({ error: "Código inválido." }, { status: 400 });
  }

  try {
    const result = await validateCouponCode(
      parsed.data.code,
      parsed.data.price_cents
    );
    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
    }
    return NextResponse.json({
      ok: true,
      code: result.coupon.code,
      partner_name: result.coupon.partner_name,
      discount_percent: result.coupon.discount_percent,
      original_cents: result.original_cents,
      discount_cents: result.discount_cents,
      final_cents: result.final_cents,
      label: result.label,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
