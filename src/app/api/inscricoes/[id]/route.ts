import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkAdminPassword } from "@/lib/admin-auth";
import { getServiceSupabase, isSupabaseConfigured } from "@/lib/supabase";

const patchSchema = z.object({
  status: z.enum(["pending", "paid", "cancelled", "refunded"]),
});

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const password = req.headers.get("x-admin-password");
  if (!checkAdminPassword(password)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  // Demo: só confirma visualmente
  const { isDemoMode } = await import("@/lib/demo-data");
  if (isDemoMode()) {
    const { id } = await ctx.params;
    let json: { status?: string } = {};
    try {
      json = await req.json();
    } catch {
      /* empty */
    }
    return NextResponse.json({
      demo: true,
      registration: {
        id,
        status: json.status || "paid",
      },
      message: "Status atualizado na demonstração (não grava de verdade).",
    });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase não configurado." }, { status: 503 });
  }

  const { id } = await ctx.params;
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Status inválido." }, { status: 400 });
  }

  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("registrations")
      .update({ status: parsed.data.status })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return NextResponse.json({ registration: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao atualizar";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
