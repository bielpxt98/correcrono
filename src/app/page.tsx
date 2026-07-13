"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { formatBRL, formatDateLongBR } from "@/lib/format";
import type { EventPublic } from "@/lib/types";

export default function HomePage() {
  const [event, setEvent] = useState<EventPublic | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/event")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "Erro ao carregar");
        setEvent(data.event);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const canBuy =
    event?.registration_open && (event?.slots_remaining ?? 0) > 0;

  return (
    <div className="min-h-full flex flex-col bg-background text-foreground">
      {loading && (
        <>
          <SiteHeader solid />
          <p className="text-muted text-center py-32">Carregando evento…</p>
        </>
      )}

      {error && (
        <>
          <SiteHeader solid />
          <div className="mx-auto max-w-xl px-4 py-16">
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6">
              <h1 className="text-xl font-semibold mb-2">Quase lá</h1>
              <p className="mb-4 text-sm text-amber-100/90 leading-relaxed">{error}</p>
              <ol className="list-decimal pl-5 text-sm space-y-2 text-muted">
                <li>
                  Rode <code className="text-brand-soft">supabase/schema.sql</code> no Supabase
                </li>
                <li>
                  Preencha o <code className="text-brand-soft">.env.local</code>
                </li>
                <li>
                  Reinicie com <code className="text-brand-soft">npm run dev</code>
                </li>
              </ol>
            </div>
          </div>
        </>
      )}

      {event && (
        <>
          {/* HERO estilo bilheteria */}
          <section className="relative min-h-[72vh] flex flex-col">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: event.cover_image_url
                  ? `url(${event.cover_image_url})`
                  : "linear-gradient(135deg,#1e293b,#0f172a 50%,#7c2d12)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-black/40" />
            <SiteHeader />

            <div className="relative z-10 mx-auto mt-auto w-full max-w-6xl px-4 pb-10 pt-28 grid gap-8 lg:grid-cols-[1.4fr_1fr] items-end">
              <div>
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-brand/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    Ingresso oficial
                  </span>
                  {canBuy ? (
                    <span className="rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-medium text-emerald-300">
                      Vendas abertas
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-500/20 border border-red-400/30 px-3 py-1 text-xs font-medium text-red-300">
                      Encerrado
                    </span>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] drop-shadow-lg">
                  {event.name}
                </h1>
                <p className="mt-4 max-w-xl text-base md:text-lg text-slate-200/90 leading-relaxed">
                  {event.description}
                </p>
                <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="text-brand-soft">📅</span>
                    <span className="capitalize">{formatDateLongBR(event.event_date)}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-soft">🕖</span>
                    {event.start_time}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-soft">📍</span>
                    {event.location}
                    {event.city ? ` · ${event.city}` : ""}
                  </li>
                </ul>
              </div>

              {/* Card ingresso */}
              <aside className="rounded-3xl border border-white/10 bg-card/90 backdrop-blur-xl p-6 shadow-2xl shadow-black/40">
                <p className="text-xs uppercase tracking-wider text-muted font-semibold">
                  Ingresso
                </p>
                <p className="mt-1 text-4xl font-black text-white tabular-nums">
                  {formatBRL(event.price_cents)}
                </p>
                <p className="mt-1 text-sm text-muted">por atleta</p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-card-2 border border-border px-3 py-3">
                    <p className="text-[11px] text-muted uppercase">Vagas</p>
                    <p className="text-xl font-bold tabular-nums">
                      {event.slots_remaining}
                      <span className="text-sm font-normal text-muted">
                        {" "}
                        / {event.max_slots}
                      </span>
                    </p>
                  </div>
                  <div className="rounded-2xl bg-card-2 border border-border px-3 py-3">
                    <p className="text-[11px] text-muted uppercase">Confirmados</p>
                    <p className="text-xl font-bold tabular-nums">{event.paid_count}</p>
                  </div>
                </div>

                {event.categories.length > 0 && (
                  <div className="mt-4">
                    <p className="text-[11px] text-muted uppercase mb-2">Categorias</p>
                    <div className="flex flex-wrap gap-1.5">
                      {event.categories.map((c) => (
                        <span
                          key={c}
                          className="rounded-lg bg-white/5 border border-border px-2.5 py-1 text-xs font-medium"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {canBuy ? (
                  <Link
                    href="/inscrever"
                    className="mt-6 flex w-full items-center justify-center rounded-2xl bg-brand py-3.5 text-base font-bold text-white shadow-lg shadow-orange-900/40 hover:bg-brand-dark transition"
                  >
                    Comprar ingresso
                  </Link>
                ) : (
                  <p className="mt-6 rounded-2xl bg-white/5 border border-border py-3 text-center text-sm text-muted">
                    Inscrições indisponíveis no momento
                  </p>
                )}
                <p className="mt-3 text-center text-[11px] text-muted">
                  Pagamento seguro · confirmação na hora*
                </p>
              </aside>
            </div>
          </section>

          {/* Galeria */}
          {event.images.length > 0 && (
            <section className="mx-auto w-full max-w-6xl px-4 py-12">
              <div className="flex items-end justify-between mb-5">
                <h2 className="text-2xl font-bold tracking-tight">Galeria</h2>
                <p className="text-sm text-muted">{event.images.length} foto(s)</p>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {event.images.map((img) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setLightbox(img.url)}
                    className="relative h-44 w-72 shrink-0 overflow-hidden rounded-2xl border border-border group"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={img.caption || event.name}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                    {img.is_cover && (
                      <span className="absolute left-2 top-2 rounded-md bg-brand px-2 py-0.5 text-[10px] font-bold uppercase">
                        Capa
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Sobre + regulamento */}
          <section className="mx-auto w-full max-w-6xl px-4 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
              <h2 className="text-xl font-bold mb-3">Sobre o evento</h2>
              <p className="text-muted leading-relaxed whitespace-pre-line text-sm md:text-base">
                {event.description || "Informações em breve."}
              </p>
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between gap-4 border-b border-border pb-2">
                  <dt className="text-muted">Data</dt>
                  <dd className="font-medium capitalize text-right">
                    {formatDateLongBR(event.event_date)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-border pb-2">
                  <dt className="text-muted">Horário</dt>
                  <dd className="font-medium">{event.start_time}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-border pb-2">
                  <dt className="text-muted">Local</dt>
                  <dd className="font-medium text-right">{event.location}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Cidade</dt>
                  <dd className="font-medium">{event.city || "—"}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
              <h2 className="text-xl font-bold mb-3">Regulamento</h2>
              <p className="text-muted leading-relaxed whitespace-pre-line text-sm md:text-base">
                {event.regulations || "Regulamento será publicado em breve."}
              </p>
            </div>
          </section>

          {/* Contatos (demo / organizador) */}
          <section className="mx-auto w-full max-w-6xl px-4 py-12 pb-24 md:pb-16">
            <div className="rounded-3xl border border-border bg-gradient-to-br from-card to-card-2 p-6 md:p-10">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-soft">
                    Fale com a organização
                  </p>
                  <h2 className="text-2xl font-black tracking-tight mt-1">
                    Contatos
                  </h2>
                  <p className="text-sm text-muted mt-2 max-w-lg">
                    Dúvidas sobre inscrição, kit ou retirada de número? Chame a
                    gente pelos canais abaixo.
                    <span className="block text-amber-400/90 text-xs mt-1">
                      * Contatos de demonstração (fictícios) — na versão real o
                      organizador coloca os dele.
                    </span>
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <ContactCard
                  icon="📧"
                  label="E-mail"
                  value="contato@corridadacidade.demo"
                  href="mailto:contato@corridadacidade.demo"
                  hint="Resposta em até 24h úteis"
                />
                <ContactCard
                  icon="📱"
                  label="WhatsApp / Telefone"
                  value="(11) 98765-4321"
                  href="https://wa.me/5511987654321"
                  hint="Seg a sex · 9h às 18h"
                />
                <ContactCard
                  icon="📸"
                  label="Instagram"
                  value="@corridadacidade"
                  href="https://instagram.com/"
                  hint="Fotos e avisos do evento"
                />
                <ContactCard
                  icon="▶️"
                  label="YouTube"
                  value="Corrida da Cidade"
                  href="https://youtube.com/"
                  hint="Vídeos e edições anteriores"
                />
              </div>

              <div className="mt-8 flex flex-wrap gap-3 items-center border-t border-border pt-6">
                <span className="text-xs text-muted mr-1">Redes sociais:</span>
                <SocialPill href="https://instagram.com/" label="Instagram" />
                <SocialPill href="https://facebook.com/" label="Facebook" />
                <SocialPill href="https://www.tiktok.com/" label="TikTok" />
                <SocialPill href="https://youtube.com/" label="YouTube" />
                <SocialPill
                  href="mailto:imprensa@corridadacidade.demo"
                  label="Imprensa"
                />
              </div>

              <div className="mt-6 grid sm:grid-cols-3 gap-3 text-sm">
                <div className="rounded-2xl bg-black/20 border border-border px-4 py-3">
                  <p className="text-xs text-muted">E-mail financeiro</p>
                  <p className="font-medium mt-0.5">financeiro@corridadacidade.demo</p>
                </div>
                <div className="rounded-2xl bg-black/20 border border-border px-4 py-3">
                  <p className="text-xs text-muted">Retirada de kit</p>
                  <p className="font-medium mt-0.5">kit@corridadacidade.demo</p>
                </div>
                <div className="rounded-2xl bg-black/20 border border-border px-4 py-3">
                  <p className="text-xs text-muted">Telefone fixo (demo)</p>
                  <p className="font-medium mt-0.5">(11) 3456-7890</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA sticky mobile */}
          {canBuy && (
            <div className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card/95 backdrop-blur p-3 md:hidden">
              <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
                <div>
                  <p className="text-xs text-muted">A partir de</p>
                  <p className="font-bold text-lg">{formatBRL(event.price_cents)}</p>
                </div>
                <Link
                  href="/inscrever"
                  className="rounded-full bg-brand px-6 py-3 text-sm font-bold text-white"
                >
                  Comprar
                </Link>
              </div>
            </div>
          )}

          {lightbox && (
            <button
              type="button"
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
              onClick={() => setLightbox(null)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lightbox}
                alt="Foto ampliada"
                className="max-h-[90vh] max-w-full rounded-xl object-contain"
              />
            </button>
          )}

          <footer className="border-t border-border py-8 text-center text-xs text-muted pb-24 md:pb-8 space-y-2">
            <p className="font-medium text-slate-300">
              Bilheteria digital · {event.name}
            </p>
            <p>
              contato@corridadacidade.demo · (11) 98765-4321 · @corridadacidade
            </p>
            <p className="text-[10px] opacity-70">
              Contatos fictícios para demonstração · organização de exemplo
            </p>
          </footer>
        </>
      )}
    </div>
  );
}

function ContactCard({
  icon,
  label,
  value,
  href,
  hint,
}: {
  icon: string;
  label: string;
  value: string;
  href: string;
  hint: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-2xl border border-border bg-black/25 p-4 hover:border-brand/50 hover:bg-black/40 transition group"
    >
      <span className="text-2xl" aria-hidden>
        {icon}
      </span>
      <p className="text-xs text-muted mt-2 uppercase tracking-wide">{label}</p>
      <p className="font-semibold mt-0.5 group-hover:text-brand-soft break-all">
        {value}
      </p>
      <p className="text-[11px] text-muted mt-2">{hint}</p>
    </a>
  );
}

function SocialPill({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-full border border-border bg-white/5 px-3 py-1.5 text-xs font-medium hover:border-brand hover:text-brand-soft transition"
    >
      {label}
    </a>
  );
}
