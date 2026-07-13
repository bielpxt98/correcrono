"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { formatBRL, formatDateBR } from "@/lib/format";
import type { EventPublic } from "@/lib/types";

type PayMethod = "pix" | "card";

export default function InscreverPage() {
  const router = useRouter();
  const [event, setEvent] = useState<EventPublic | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [payMethod, setPayMethod] = useState<PayMethod>("pix");
  const [acceptPix, setAcceptPix] = useState(true);
  const [acceptCard, setAcceptCard] = useState(true);

  useEffect(() => {
    fetch("/api/event")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "Erro");
        setEvent(data.event);
        const pixOk = data.payment?.accept_pix !== false;
        const cardOk = data.payment?.accept_card !== false;
        setAcceptPix(pixOk);
        setAcceptCard(cardOk);
        if (!pixOk && cardOk) setPayMethod("card");
        else if (pixOk) setPayMethod("pix");
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    const fd = new FormData(e.currentTarget);
    const payload = {
      full_name: String(fd.get("full_name") || ""),
      cpf: String(fd.get("cpf") || ""),
      birth_date: String(fd.get("birth_date") || "") || null,
      phone: String(fd.get("phone") || ""),
      email: String(fd.get("email") || ""),
      shirt_size: String(fd.get("shirt_size") || ""),
      category: String(fd.get("category") || ""),
      payment_method: payMethod,
    };

    try {
      const res = await fetch("/api/inscricoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha na inscrição");

      const regId = data.registration.id as string;

      // Tenta Mercado Pago real (quando configurado)
      const payRes = await fetch("/api/pagamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registration_id: regId,
          payment_method: payMethod,
        }),
      });
      const payData = await payRes.json();

      if (payRes.ok && (payData.init_point || payData.sandbox_init_point)) {
        const url = payData.init_point || payData.sandbox_init_point;
        window.location.href = url;
        return;
      }

      // Demo / sem MP: tela de pagamento simulada
      if (payData.demo || payData.manual || !payRes.ok) {
        router.push(`/pagar?id=${regId}&method=${payMethod}`);
        return;
      }

      router.push(`/confirmacao?id=${regId}&status=pending&method=${payMethod}`);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Erro ao inscrever");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-full flex flex-col bg-background">
      <SiteHeader solid />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-8 pb-16">
        <Link href="/" className="text-sm text-muted hover:text-foreground">
          ← Voltar ao evento
        </Link>
        <h1 className="mt-3 text-2xl font-black tracking-tight">Checkout</h1>
        <p className="text-sm text-muted mt-1">
          Dados do atleta e forma de pagamento
        </p>

        {loading && <p className="mt-8 text-muted">Carregando…</p>}
        {error && (
          <p className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
            {error}
          </p>
        )}

        {event && (
          <>
            <div className="mt-6 rounded-2xl border border-border bg-card p-4 flex gap-4">
              {event.cover_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={event.cover_image_url}
                  alt=""
                  className="h-20 w-20 rounded-xl object-cover shrink-0"
                />
              ) : (
                <div className="h-20 w-20 rounded-xl bg-card-2 shrink-0" />
              )}
              <div className="min-w-0">
                <p className="font-semibold truncate">{event.name}</p>
                <p className="text-xs text-muted mt-0.5">
                  {formatDateBR(event.event_date)} · {event.start_time}
                </p>
                <p className="text-brand-soft font-bold mt-1">
                  {formatBRL(event.price_cents)}
                </p>
                <p className="text-xs text-muted">
                  {event.slots_remaining} vagas restantes
                </p>
              </div>
            </div>

            {!event.registration_open || event.slots_remaining <= 0 ? (
              <p className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm">
                Não é possível se inscrever no momento.
              </p>
            ) : (
              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <Field label="Nome completo" name="full_name" required />
                <Field label="CPF" name="cpf" required placeholder="000.000.000-00" />
                <Field label="Data de nascimento" name="birth_date" type="date" />
                <Field
                  label="WhatsApp"
                  name="phone"
                  required
                  placeholder="(00) 00000-0000"
                />
                <Field label="E-mail" name="email" type="email" required />

                <div>
                  <label className="block text-sm font-medium mb-1.5">Categoria</label>
                  <select
                    name="category"
                    required
                    defaultValue={event.categories[0] || ""}
                    className="w-full rounded-xl border border-border bg-card px-3 py-3 outline-none focus:ring-2 focus:ring-brand/40"
                  >
                    {event.categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Tamanho da camiseta
                  </label>
                  <select
                    name="shirt_size"
                    required
                    defaultValue={
                      event.shirt_sizes.includes("M") ? "M" : event.shirt_sizes[0]
                    }
                    className="w-full rounded-xl border border-border bg-card px-3 py-3 outline-none focus:ring-2 focus:ring-brand/40"
                  >
                    {event.shirt_sizes.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Forma de pagamento (conforme o organizador liberou no admin) */}
                <div>
                  <p className="block text-sm font-medium mb-2">
                    Forma de pagamento *
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {acceptPix && (
                      <PayCard
                        selected={payMethod === "pix"}
                        onClick={() => setPayMethod("pix")}
                        title="Pix"
                        subtitle="Aprovação na hora"
                        icon="⚡"
                      />
                    )}
                    {acceptCard && (
                      <PayCard
                        selected={payMethod === "card"}
                        onClick={() => setPayMethod("card")}
                        title="Cartão"
                        subtitle="Crédito"
                        icon="💳"
                      />
                    )}
                  </div>
                  {!acceptPix && !acceptCard && (
                    <p className="mt-2 text-sm text-red-400">
                      Formas de pagamento indisponíveis. Fale com o organizador.
                    </p>
                  )}
                  {(acceptPix || acceptCard) && (
                    <p className="mt-2 text-xs text-muted">
                      {payMethod === "pix"
                        ? "Você verá o QR Code / código Pix na próxima tela."
                        : "Você preenche os dados do cartão na próxima tela."}
                    </p>
                  )}
                </div>

                {formError && (
                  <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm">
                    {formError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-2xl bg-brand py-3.5 font-bold text-white hover:bg-brand-dark disabled:opacity-60 transition"
                >
                  {submitting
                    ? "Processando…"
                    : payMethod === "pix"
                      ? `Pagar com Pix · ${formatBRL(event.price_cents)}`
                      : `Pagar com cartão · ${formatBRL(event.price_cents)}`}
                </button>
              </form>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function PayCard({
  selected,
  onClick,
  title,
  subtitle,
  icon,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
  icon: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        selected
          ? "rounded-2xl border-2 border-brand bg-brand/10 p-4 text-left transition"
          : "rounded-2xl border border-border bg-card p-4 text-left hover:border-slate-500 transition"
      }
    >
      <span className="text-2xl">{icon}</span>
      <p className="mt-2 font-bold">{title}</p>
      <p className="text-xs text-muted">{subtitle}</p>
      {selected && (
        <p className="mt-2 text-[11px] font-semibold text-brand-soft">Selecionado</p>
      )}
    </button>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-card px-3 py-3 outline-none focus:ring-2 focus:ring-brand/40"
      />
    </div>
  );
}
