import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  changeAdminPassword,
  checkAdminPassword,
} from "@/lib/admin-auth";
import { isDemoMode } from "@/lib/demo-data";
import { getActiveEvent } from "@/lib/event";
import { getServiceSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { hashPassword } from "@/lib/admin-auth";

const bodySchema = z.object({
  current_password: z.string().min(1),
  new_password: z.string().min(6).max(80),
  confirm_password: z.string().min(6).max(80),
});

export async function POST(req: NextRequest) {
  const headerPw = req.headers.get("x-admin-password");
  if (!checkAdminPassword(headerPw)) {
    return NextResponse.json({ error: "Não autorizado. Faça login de novo." }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          "Preencha senha atual, nova senha e confirmação (mínimo 6 caracteres).",
      },
      { status: 400 }
    );
  }

  const { current_password, new_password, confirm_password } = parsed.data;

  if (new_password !== confirm_password) {
    return NextResponse.json(
      { error: "A confirmação não confere com a nova senha." },
      { status: 400 }
    );
  }

  const result = changeAdminPassword(current_password, new_password);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  // Tenta gravar no banco para sobreviver a restart (quando houver Supabase)
  let persisted = false;
  if (!isDemoMode() && isSupabaseConfigured()) {
    try {
      const event = await getActiveEvent();
      if (event) {
        const supabase = getServiceSupabase();
        const { error } = await supabase
          .from("events")
          .update({
            admin_password_hash: hashPassword(new_password),
            updated_at: new Date().toISOString(),
          })
          .eq("id", event.id);
        if (!error) persisted = true;
      }
    } catch {
      /* ignora */
    }
  }

  return NextResponse.json({
    ok: true,
    message: persisted
      ? "Senha alterada e salva. Use a nova senha no próximo acesso."
      : "Senha alterada. Use a nova senha daqui pra frente. Se o servidor reiniciar (Render free), defina ADMIN_PASSWORD no painel do Render com a nova senha para ela não voltar.",
  });
}
