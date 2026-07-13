"use client";

import { FormEvent, useState } from "react";

type Props = {
  password: string;
  onPasswordChanged: (newPassword: string) => void;
  onMessage: (msg: string | null, err: string | null) => void;
};

export function AdminPasswordTab({
  password,
  onPasswordChanged,
  onMessage,
}: Props) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    onMessage(null, null);
    try {
      if (next !== confirm) {
        throw new Error("A confirmação não confere com a nova senha.");
      }
      if (next.length < 6) {
        throw new Error("A nova senha precisa ter no mínimo 6 caracteres.");
      }

      const res = await fetch("/api/admin/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({
          current_password: current || password,
          new_password: next,
          confirm_password: confirm,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha ao alterar senha");

      onPasswordChanged(next);
      setCurrent("");
      setNext("");
      setConfirm("");
      onMessage(data.message || "Senha alterada!", null);
    } catch (err) {
      onMessage(null, err instanceof Error ? err.message : "Erro");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-border bg-card p-5 md:p-8 space-y-5 shadow-sm max-w-lg"
    >
      <div>
        <h2 className="text-2xl font-black tracking-tight">Senha do painel</h2>
        <p className="text-sm text-muted mt-1">
          Altere a senha de acesso do organizador. A senha padrão inicial é{" "}
          <strong>admin123</strong>.
        </p>
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-950">
        Depois de mudar, use a <strong>nova senha</strong> para entrar. No
        Render, se o site “dormir” e reiniciar, a senha em memória pode voltar —
        para fixar, coloque a mesma senha em{" "}
        <code className="bg-amber-100 px-1 rounded">ADMIN_PASSWORD</code> nas
        variáveis de ambiente do Render.
      </div>

      <label className="block">
        <span className="text-sm font-medium">Senha atual</span>
        <input
          type="password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          className="field mt-1.5"
          placeholder="Senha que você usa agora"
          autoComplete="current-password"
          required
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Nova senha</span>
        <input
          type="password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          className="field mt-1.5"
          placeholder="Mínimo 6 caracteres"
          autoComplete="new-password"
          required
          minLength={6}
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Confirmar nova senha</span>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="field mt-1.5"
          placeholder="Repita a nova senha"
          autoComplete="new-password"
          required
          minLength={6}
        />
      </label>

      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-brand px-8 py-3 font-bold text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {saving ? "Salvando…" : "Alterar senha"}
      </button>
    </form>
  );
}
