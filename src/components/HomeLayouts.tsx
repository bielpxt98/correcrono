"use client";

import Link from "next/link";
import { formatBRL, formatDateLongBR } from "@/lib/format";
import type { LayoutId } from "@/lib/themes";
import type { EventPublic } from "@/lib/types";

type Props = {
  event: EventPublic;
  canBuy: boolean;
  onOpenPhoto: (url: string) => void;
  layout: LayoutId;
};

export function TicketCard({
  event,
  canBuy,
  compact = false,
  light = false,
}: {
  event: EventPublic;
  canBuy: boolean;
  compact?: boolean;
  light?: boolean;
}) {
  return (
    <aside
      className={
        light
          ? "rounded-3xl border border-border bg-card p-6 shadow-xl"
          : "rounded-3xl border border-white/10 bg-card/90 backdrop-blur-xl p-6 shadow-2xl shadow-black/40"
      }
    >
      <p className="text-xs uppercase tracking-wider text-muted font-semibold">
        Ingresso
      </p>
      <p
        className={
          light
            ? "mt-1 text-4xl font-black text-foreground tabular-nums"
            : "mt-1 text-4xl font-black text-white tabular-nums"
        }
      >
        {formatBRL(event.price_cents)}
      </p>
      <p className="mt-1 text-sm text-muted">por atleta</p>

      <div className={`mt-5 grid grid-cols-2 gap-3 ${compact ? "text-sm" : ""}`}>
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
          className="mt-6 flex w-full items-center justify-center rounded-2xl bg-brand py-3.5 text-base font-bold text-white hover:bg-brand-dark transition"
        >
          Comprar ingresso
        </Link>
      ) : (
        <p className="mt-6 rounded-2xl bg-white/5 border border-border py-3 text-center text-sm text-muted">
          Inscrições indisponíveis
        </p>
      )}
    </aside>
  );
}

function MetaLine({ event }: { event: EventPublic }) {
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
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
  );
}

function GalleryStrip({
  event,
  onOpenPhoto,
  tall = false,
}: {
  event: EventPublic;
  onOpenPhoto: (url: string) => void;
  tall?: boolean;
}) {
  if (!event.images.length) return null;
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
      {event.images.map((img) => (
        <button
          key={img.id}
          type="button"
          onClick={() => onOpenPhoto(img.url)}
          className={`relative ${tall ? "h-56 w-80" : "h-44 w-72"} shrink-0 overflow-hidden rounded-2xl border border-border group`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.url}
            alt={img.caption || event.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        </button>
      ))}
    </div>
  );
}

function GalleryGrid({
  event,
  onOpenPhoto,
  cols = 3,
}: {
  event: EventPublic;
  onOpenPhoto: (url: string) => void;
  cols?: 2 | 3 | 4;
}) {
  if (!event.images.length) return null;
  const grid =
    cols === 2
      ? "grid-cols-2"
      : cols === 4
        ? "grid-cols-2 md:grid-cols-4"
        : "grid-cols-2 md:grid-cols-3";
  return (
    <div className={`grid ${grid} gap-3`}>
      {event.images.map((img) => (
        <button
          key={img.id}
          type="button"
          onClick={() => onOpenPhoto(img.url)}
          className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border group"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.url}
            alt=""
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        </button>
      ))}
    </div>
  );
}

/**
 * Layout “Chegada (CTA)” — foto de referência q2XnJ
 * Hero com foto, título + subtítulo, botão laranja, faixa de dados e cards de categorias.
 */
function LayoutBilheteria(p: Props) {
  const { event, canBuy, onOpenPhoto } = p;
  const cover =
    event.cover_image_url ||
    event.images[0]?.url ||
    null;

  return (
    <>
      <section className="relative mx-auto w-full max-w-5xl px-3 pt-6 md:pt-10">
        <div className="relative overflow-hidden rounded-[1.75rem] md:rounded-[2rem] shadow-2xl shadow-black/50 border border-white/10">
          <div className="relative min-h-[52vh] md:min-h-[58vh] flex flex-col items-center justify-center text-center px-6 py-16">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: cover
                  ? `url(${cover})`
                  : "linear-gradient(160deg,#1a0a00 0%,#3d1a0a 40%,#0b0c10 100%)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/25" />
            <div className="relative z-10 max-w-2xl">
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
                {event.name}
              </h1>
              <p className="mt-4 text-base md:text-lg text-white/85 leading-relaxed max-w-lg mx-auto">
                {event.description?.split("\n")[0] ||
                  "Inscreva-se para a corrida mais esperada do ano"}
              </p>
              {canBuy ? (
                <Link
                  href="/inscrever"
                  className="mt-8 inline-flex items-center justify-center rounded-xl bg-brand px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-orange-900/40 hover:bg-brand-dark transition"
                >
                  Inscreva-se Agora
                </Link>
              ) : (
                <span className="mt-8 inline-flex rounded-xl bg-white/10 border border-white/20 px-8 py-3.5 text-base font-semibold text-white/80">
                  Inscrições encerradas
                </span>
              )}
            </div>
          </div>

          {/* Painel inferior escuro com dados + categorias */}
          <div className="bg-[#12141a] px-5 md:px-10 py-8 md:py-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left border-b border-white/10 pb-8">
              <div>
                <p className="text-xs text-muted uppercase tracking-wide">
                  Data do Evento
                </p>
                <p className="mt-1 font-semibold text-white capitalize">
                  {formatDateLongBR(event.event_date)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted uppercase tracking-wide">
                  Distância
                </p>
                <p className="mt-1 font-semibold text-white">
                  {event.categories.length
                    ? event.categories.join(", ")
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted uppercase tracking-wide">Local</p>
                <p className="mt-1 font-semibold text-white">
                  {event.location}
                  {event.city ? `, ${event.city}` : ""}
                </p>
              </div>
            </div>

            {event.categories.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-bold text-white mb-4">Categorias</h2>
                <div className="grid sm:grid-cols-3 gap-3">
                  {event.categories.map((cat, i) => {
                    const icons = ["🏃", "⚡", "🚶"];
                    return (
                      <div
                        key={cat}
                        className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-left hover:border-brand/40 transition"
                      >
                        <p className="text-brand-soft text-lg">
                          {icons[i % icons.length]}
                        </p>
                        <p className="mt-1 font-bold text-white">{cat}</p>
                        <p className="mt-1 text-xs text-muted leading-snug">
                          {i === 0
                            ? "Desafio principal da prova"
                            : i === 1
                              ? "Ritmo forte e competitivo"
                              : "Para todos os níveis"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm text-muted">
                Ingresso a partir de{" "}
                <strong className="text-white">
                  {formatBRL(event.price_cents)}
                </strong>
                {" · "}
                {event.slots_remaining} vagas
              </p>
              {canBuy && (
                <Link
                  href="/inscrever"
                  className="inline-flex justify-center rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white hover:bg-brand-dark"
                >
                  Comprar ingresso
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {event.images.length > 1 && (
        <section className="mx-auto w-full max-w-5xl px-4 py-12">
          <h2 className="text-xl font-bold mb-5">Galeria</h2>
          <GalleryStrip event={event} onOpenPhoto={onOpenPhoto} />
        </section>
      )}
    </>
  );
}

/**
 * Layout “Noturno cinematográfico” — foto de referência H094F
 * Full-bleed noturno, título grande inferior, pílulas e Saiba Mais.
 */
function LayoutPoster(p: Props) {
  const { event, canBuy, onOpenPhoto } = p;
  const cover =
    event.cover_image_url ||
    event.images[0]?.url ||
    null;

  return (
    <>
      <section className="relative min-h-[100svh] flex flex-col">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: cover
              ? `url(${cover})`
              : "linear-gradient(180deg,#0a0a12 0%,#1a1a2e 50%,#050508 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />

        <div className="relative z-10 mt-auto w-full max-w-6xl mx-auto px-5 md:px-10 pb-14 md:pb-20 pt-32">
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[0.95] max-w-4xl">
            {event.name}
          </h1>
          <p className="mt-5 text-sm sm:text-base md:text-lg uppercase tracking-[0.18em] text-white/80 font-medium max-w-2xl">
            {event.description?.split("\n")[0] || event.location}
          </p>
          <p className="mt-3 text-sm md:text-base text-white/70 max-w-xl">
            <span className="capitalize">
              {formatDateLongBR(event.event_date)}
            </span>
            {event.city ? ` · ${event.city}` : ""}
            {event.location ? ` · ${event.location}` : ""}
          </p>
          {event.start_time && (
            <p className="mt-1 text-sm text-white/55">
              Largada às {event.start_time}
              {event.registration_open
                ? " · Inscrições abertas"
                : " · Inscrições encerradas"}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {event.categories.map((c) => (
              <span
                key={c}
                className="rounded-lg border border-white/25 bg-white/5 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white"
              >
                {c}
              </span>
            ))}
            <div className="flex-1 min-w-[1rem]" />
            {canBuy ? (
              <Link
                href="/inscrever"
                className="rounded-lg border border-white/35 bg-transparent px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition"
              >
                Saiba Mais
              </Link>
            ) : (
              <span className="rounded-lg border border-white/20 px-5 py-2.5 text-sm text-white/50">
                Encerrado
              </span>
            )}
          </div>

          <div className="mt-10 max-w-sm">
            <TicketCard event={event} canBuy={canBuy} compact />
          </div>
        </div>
      </section>

      {event.images.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-4 py-14">
          <h2 className="text-2xl font-bold mb-6">Momentos</h2>
          <GalleryGrid event={event} onOpenPhoto={onOpenPhoto} cols={3} />
        </section>
      )}
    </>
  );
}

/**
 * Layout “Elegante central” — foto de referência mhBhr
 * Card flutuante, nav, título serifado, faixas de info, galeria.
 */
function LayoutRevista(p: Props) {
  const { event, canBuy, onOpenPhoto } = p;
  const cover =
    event.cover_image_url ||
    event.images[0]?.url ||
    null;

  return (
    <div className="relative min-h-screen py-6 md:py-10 px-3 md:px-6">
      {/* Fundo ambiente */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center scale-105 blur-sm opacity-40"
        style={{
          backgroundImage: cover
            ? `url(${cover})`
            : "linear-gradient(135deg,#1a1208,#0a0a0f)",
        }}
      />
      <div className="fixed inset-0 -z-10 bg-black/75" />

      <div className="mx-auto max-w-4xl rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-white/10 bg-[#12141a]/95 shadow-2xl shadow-black/60">
        {/* Nav interna */}
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-4 md:py-5 text-sm text-white/70 border-b border-white/5">
          <a href="#topo" className="hover:text-white transition">
            Home
          </a>
          <a href="/inscrever" className="hover:text-white transition">
            Inscrições
          </a>
          <a href="#galeria" className="hover:text-white transition">
            Percursos
          </a>
          <a href="#sobre" className="hover:text-white transition">
            Sobre
          </a>
          <a href="#contato" className="hover:text-white transition">
            Contato
          </a>
        </nav>

        {/* Hero foto + título */}
        <div id="topo" className="relative">
          <div className="relative aspect-[16/9] md:aspect-[2.1/1] overflow-hidden">
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cover}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-amber-900/40 to-slate-900" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-medium tracking-wide text-[#f5f0e8] drop-shadow-xl leading-[1.1]">
                {event.name.includes("\n")
                  ? event.name.split("\n").map((line, i) => (
                      <span key={i} className="block">
                        {line}
                      </span>
                    ))
                  : (() => {
                      // Se o nome terminar com ano, quebra em 2 linhas
                      const m = event.name.match(/^(.*?)(\s+\d{4})$/);
                      if (m) {
                        return (
                          <>
                            <span className="block">{m[1].trim()}</span>
                            <span className="block mt-1 md:mt-2">{m[2].trim()}</span>
                          </>
                        );
                      }
                      return event.name;
                    })()}
              </h1>
            </div>
          </div>
        </div>

        {/* Faixa de info */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-white/10">
          <div className="px-4 py-5 border-b md:border-b-0 md:border-r border-white/10">
            <p className="text-sm font-medium text-white capitalize">
              {formatDateLongBR(event.event_date)}
            </p>
          </div>
          {(event.categories.length
            ? event.categories.slice(0, 3)
            : ["—"]
          ).map((cat, i) => (
            <div
              key={cat + i}
              className="px-4 py-5 border-b md:border-b-0 md:border-r border-white/10 last:border-r-0 flex items-center"
            >
              <p className="text-sm font-semibold text-white/90">{cat}</p>
            </div>
          ))}
        </div>

        <div className="px-5 md:px-8 py-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-white/75">
            {event.location}
            {event.city ? `, ${event.city}` : ""}
            {event.start_time ? ` · ${event.start_time}` : ""}
          </p>
          {canBuy && (
            <Link
              href="/inscrever"
              className="inline-flex justify-center rounded-xl bg-brand px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-dark shrink-0"
            >
              Inscreva-se · {formatBRL(event.price_cents)}
            </Link>
          )}
        </div>

        {/* Galeria horizontal */}
        {event.images.length > 0 && (
          <div
            id="galeria"
            className="px-4 md:px-6 pb-8 pt-2 border-t border-white/5"
          >
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {event.images.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => onOpenPhoto(img.url)}
                  className="relative h-28 w-40 md:h-32 md:w-48 shrink-0 overflow-hidden rounded-xl border border-white/10 group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt=""
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        <div id="sobre" className="px-5 md:px-8 pb-8">
          <p className="text-sm text-muted leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </div>
      </div>
    </div>
  );
}

/** Layout 3 — Vitrine: fotos no topo */
function LayoutVitrine(p: Props) {
  const { event, canBuy, onOpenPhoto } = p;
  return (
    <>
      <div className="pt-20" />
      {event.images.length > 0 ? (
        <section className="border-b border-border bg-card-2/50 py-4">
          <div className="mx-auto max-w-6xl px-4">
            <GalleryStrip event={event} onOpenPhoto={onOpenPhoto} tall />
          </div>
        </section>
      ) : event.cover_image_url ? (
        <div className="h-48 md:h-64 w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.cover_image_url}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}

      <section className="mx-auto w-full max-w-6xl px-4 py-12 grid gap-10 lg:grid-cols-[1.3fr_1fr] items-start">
        <div>
          <Badges canBuy={canBuy} light />
          <h1 className="font-display text-4xl md:text-5xl font-black tracking-tight text-foreground mt-3">
            {event.name}
          </h1>
          <p className="mt-4 text-muted leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
          <div className="mt-6">
            <MetaLine event={event} />
          </div>
        </div>
        <TicketCard event={event} canBuy={canBuy} light />
      </section>
    </>
  );
}

/** Layout 5 — Catálogo */
function LayoutCatalogo(p: Props) {
  const { event, canBuy, onOpenPhoto } = p;
  return (
    <>
      <section className="pt-24 pb-8 px-4 bg-card border-b border-border">
        <div className="mx-auto max-w-6xl grid gap-8 lg:grid-cols-[1fr_340px] items-center">
          <div>
            <Badges canBuy={canBuy} light />
            <h1 className="font-display text-4xl md:text-5xl font-black mt-3">
              {event.name}
            </h1>
            <div className="mt-4">
              <MetaLine event={event} />
            </div>
            <p className="mt-4 text-muted leading-relaxed max-w-xl whitespace-pre-line">
              {event.description}
            </p>
          </div>
          <TicketCard event={event} canBuy={canBuy} light compact />
        </div>
      </section>

      {event.images.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">Fotos do evento</h2>
          <GalleryGrid event={event} onOpenPhoto={onOpenPhoto} cols={2} />
        </section>
      )}
    </>
  );
}

function Badges({
  canBuy,
  center,
  light,
}: {
  canBuy: boolean;
  center?: boolean;
  light?: boolean;
}) {
  return (
    <div
      className={`mb-3 flex flex-wrap gap-2 ${center ? "justify-center" : ""}`}
    >
      <span className="rounded-full bg-brand px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
        Ingresso oficial
      </span>
      {canBuy ? (
        <span
          className={
            light
              ? "rounded-full bg-emerald-100 border border-emerald-200 px-3 py-1 text-xs font-medium text-emerald-800"
              : "rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-medium text-emerald-300"
          }
        >
          Vendas abertas
        </span>
      ) : (
        <span className="rounded-full bg-red-500/15 border border-red-400/30 px-3 py-1 text-xs font-medium text-red-600">
          Encerrado
        </span>
      )}
    </div>
  );
}

export function HomeHeroByLayout(props: Props) {
  switch (props.layout) {
    case "poster":
      return <LayoutPoster {...props} />;
    case "vitrine":
      return <LayoutVitrine {...props} />;
    case "revista":
      return <LayoutRevista {...props} />;
    case "catalogo":
      return <LayoutCatalogo {...props} />;
    case "bilheteria":
    default:
      return <LayoutBilheteria {...props} />;
  }
}
