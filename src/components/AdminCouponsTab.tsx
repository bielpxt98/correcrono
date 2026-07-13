"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { formatBRL } from "@/lib/format";
import type { Coupon } from "@/lib/coupons";

type Props = {
  password: string;
  priceCents?: number;
  onMessage: (msg: string | null, err: string | null) => void;
};

export function AdminCouponsTab({ password, priceCents = 8900, onMessage }: Props) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [code, setCode] = useState("");
  const [partner, setPartner] = useState("");
  const [percent, setPercent] = useState("10");
  const [maxUses, setMaxUses] = useState("100");
  const [unlimited, setUnlimited] = useState(false);
  const [notes, setNotes] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/coupons", {
        headers: { "x-admin-password": password },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao carregar");
      setCoupons(data.coupons || []);
    } catch (e) {
      onMessage(null, e instanceof Error ? e.message : "Erro");
    } finally {
      setLoading(false);
    }
  }, [password, onMessage]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    onMessage(null, null);
    try {
      const pct = Number(percent.replace(",", "."));
      if (!pct || pct < 1 || pct > 100) {
        throw new Error("Informe o desconto em % (1 a 100). Ex.: 10");
      }
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({
          code,
          partner_name: partner,
          discount_percent: Math.round(pct),
          max_uses: unlimited ? null : Math.max(1, Number(maxUses) || 1),
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha ao criar");
      setCode("");
      setPartner("");
      setPercent("10");
      setMaxUses("100");
      setNotes("");
      onMessage(
        `Cupom ${data.coupon.code} criado (${data.coupon.discount_percent}% off). Pode mandar para a loja parceira.`,
        null
      );
      await load();
    } catch (err) {
      onMessage(null, err instanceof Error ? err.message : "Erro");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(c: Coupon) {
    const res = await fetch("/api/admin/coupons", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify({ id: c.id, active: !c.active }),
    });
    const data = await res.json();
    if (!res.ok) {
      onMessage(null, data.error || "Erro");
      return;
    }
    await load();
    onMessage(
      c.active ? `Cupom ${c.code} desativado.` : `Cupom ${c.code} reativado.`,
      null
    );
  }

  function copyCode(c: string) {
    void navigator.clipboard.writeText(c);
    onMessage(`Código ${c} copiado!`, null);
  }

  const exampleFinal = (() => {
    const p = Number(percent) || 10;
    const disc = Math.round((priceCents * p) / 100);
    return priceCents - disc;
  })();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 shadow-sm">
        <h2 className="text-lg font-bold text-orange-950">Cupons para lojas parceiras</h2>
        <p className="text-sm text-orange-900/90 mt-2 leading-relaxed">
          Exemplo: Felipe cria o código <strong>MODAPRAIA10</strong> com{" "}
          <strong>10%</strong> de desconto e manda para a loja. No pagamento, o
          atleta digita o código e o valor cai automaticamente.
        </p>
        <ol className="mt-3 list-decimal pl-5 text-sm text-orange-950/90 space-y-1">
          <li>Preencha o formulário abaixo e clique em <strong>Gerar cupom</strong></li>
          <li>Copie o código e envie para a loja parceira</li>
          <li>O atleta usa no checkout / pagamento</li>
        </ol>
      </div>

      <form
        onSubmit={onCreate}
        className="rounded-2xl border border-border bg-card p-5 md:p-8 space-y-4 shadow-sm"
      >
        <h3 className="font-bold text-base">Gerar novo cupom</h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium">Código do cupom *</span>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="field mt-1.5 font-mono"
              placeholder="MODAPRAIA10"
              required
              minLength={3}
            />
            <p className="text-xs text-muted mt-1">Letras e números, sem espaço</p>
          </label>
          <label className="block">
            <span className="text-sm font-medium">Nome da loja / parceiro</span>
            <input
              value={partner}
              onChange={(e) => setPartner(e.target.value)}
              className="field mt-1.5"
              placeholder="Moda Praia"
            />
          </label>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium">Desconto (%) *</span>
            <input
              value={percent}
              onChange={(e) => setPercent(e.target.value)}
              className="field mt-1.5"
              inputMode="numeric"
              placeholder="10"
              required
            />
            <p className="text-xs text-muted mt-1">
              Ex.: ingresso {formatBRL(priceCents)} com {percent || "10"}% →{" "}
              <strong>{formatBRL(exampleFinal)}</strong>
            </p>
          </label>
          <div>
            <label className="block">
              <span className="text-sm font-medium">Limite de usos</span>
              <input
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                className="field mt-1.5"
                type="number"
                min={1}
                disabled={unlimited}
              />
            </label>
            <label className="mt-2 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={unlimited}
                onChange={(e) => setUnlimited(e.target.checked)}
              />
              Sem limite de usos
            </label>
          </div>
        </div>

        <label className="block">
          <span className="text-sm font-medium">Observação (só você vê)</span>
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="field mt-1.5"
            placeholder="Ex.: campanha julho, vitrine da loja…"
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-brand px-8 py-3 font-bold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {saving ? "Gerando…" : "Gerar cupom"}
        </button>
      </form>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold">Cupons criados</h3>
          <button
            type="button"
            onClick={() => void load()}
            className="text-sm text-brand font-medium"
          >
            Atualizar
          </button>
        </div>
        {loading ? (
          <p className="p-6 text-sm text-muted">Carregando…</p>
        ) : coupons.length === 0 ? (
          <p className="p-6 text-sm text-muted">Nenhum cupom ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Código</th>
                  <th className="px-4 py-3 font-medium">Parceiro</th>
                  <th className="px-4 py-3 font-medium">Desconto</th>
                  <th className="px-4 py-3 font-medium">Usos</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c.id} className="border-t border-border">
                    <td className="px-4 py-3 font-mono font-bold">{c.code}</td>
                    <td className="px-4 py-3">{c.partner_name || "—"}</td>
                    <td className="px-4 py-3">{c.discount_percent}%</td>
                    <td className="px-4 py-3 tabular-nums">
                      {c.used_count}
                      {c.max_uses != null ? ` / ${c.max_uses}` : " / ∞"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          c.active
                            ? "text-emerald-700 font-medium"
                            : "text-red-600"
                        }
                      >
                        {c.active ? "Ativo" : "Off"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        <button
                          type="button"
                          onClick={() => copyCode(c.code)}
                          className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium"
                        >
                          Copiar
                        </button>
                        <button
                          type="button"
                          onClick={() => void toggleActive(c)}
                          className="rounded-lg bg-orange-50 text-orange-900 px-2 py-1 text-xs font-medium"
                        >
                          {c.active ? "Desativar" : "Ativar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
