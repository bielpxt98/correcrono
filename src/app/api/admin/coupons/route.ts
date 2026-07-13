import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkAdminPassword } from "@/lib/admin-auth";
import { createCoupon, listCoupons, setCouponActive } from "@/lib/coupons";

export async function GET(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  if (!checkAdminPassword(password)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  try {
    const coupons = await listCoupons();
    return NextResponse.json({ coupons });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

const createSchema = z.object({
  code: z.string().min(3).max(40),
  partner_name: z.string().max(120).optional().default(""),
  discount_percent: z.number().int().min(1).max(100),
  max_uses: z.number().int().min(1).nullable().optional(),
  notes: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
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

  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  try {
    const coupon = await createCoupon({
      code: parsed.data.code,
      partner_name: parsed.data.partner_name || "",
      discount_percent: parsed.data.discount_percent,
      max_uses: parsed.data.max_uses ?? null,
      notes: parsed.data.notes,
    });
    return NextResponse.json({ coupon, message: "Cupom criado!" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao criar";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

const patchSchema = z.object({
  id: z.string().min(1),
  active: z.boolean(),
});

export async function PATCH(req: NextRequest) {
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

  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  try {
    const coupon = await setCouponActive(parsed.data.id, parsed.data.active);
    return NextResponse.json({ coupon });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
