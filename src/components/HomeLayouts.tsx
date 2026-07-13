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

/** Layout 1 — Bilheteria (atual) */
function LayoutBilheteria(p: Props) {
  const { event, canBuy, onOpenPhoto } = p;
  return (
    <>
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
        <div className="relative z-10 mx-auto mt-auto w-full max-w-6xl px-4 pb-10 pt-28 grid gap-8 lg:grid-cols-[1.4fr_1fr] items-end">
          <div>
            <Badges canBuy={canBuy} />
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-white drop-shadow-lg">
              {event.name}
            </h1>
            <p className="mt-4 max-w-xl text-base md:text-lg text-slate-200/90 leading-relaxed">
              {event.description}
            </p>
            <div className="mt-6 text-slate-300">
              <MetaLine event={event} />
            </div>
          </div>
          <TicketCard event={event} canBuy={canBuy} />
        </div>
      </section>
      {event.images.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-4 py-12">
          <h2 className="text-2xl font-bold mb-5">Galeria</h2>
          <GalleryStrip event={event} onOpenPhoto={onOpenPhoto} />
        </section>
      )}
    </>
  );
}

/** Layout 2 — Cartaz central */
function LayoutPoster(p: Props) {
  const { event, canBuy, onOpenPhoto } = p;
  return (
    <>
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: event.cover_image_url
              ? `url(${event.cover_image_url})`
              : "linear-gradient(135deg,#0f172a,#1e3a5f)",
          }}
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 max-w-3xl pt-24 pb-16">
          <Badges canBuy={canBuy} center />
          <h1 className="font-display text-5xl md:text-7xl font-black text-white tracking-tight drop-shadow-xl">
            {event.name}
          </h1>
          <p className="mt-6 text-lg text-white/85 leading-relaxed">
            {event.description}
          </p>
          <div className="mt-6 flex justify-center text-white/80">
            <MetaLine event={event} />
          </div>
          <p className="mt-8 text-4xl font-black text-brand-soft">
            {formatBRL(event.price_cents)}
          </p>
          {canBuy && (
            <Link
              href="/inscrever"
              className="mt-6 inline-flex rounded-full bg-brand px-10 py-4 text-lg font-bold text-white shadow-xl hover:bg-brand-dark"
            >
              Comprar ingresso
            </Link>
          )}
        </div>
      </section>
      {event.images.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-4 py-14">
          <h2 className="text-2xl font-bold mb-6 text-center">Momentos</h2>
          <GalleryGrid event={event} onOpenPhoto={onOpenPhoto} cols={3} />
        </section>
      )}
    </>
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

/** Layout 4 — Revista: letreiro top, depois ingresso, mosaico */
function LayoutRevista(p: Props) {
  const { event, canBuy, onOpenPhoto } = p;
  return (
    <>
      <section className="pt-28 pb-10 px-4 border-b border-border">
        <div className="mx-auto max-w-4xl text-center">
          <Badges canBuy={canBuy} center light />
          <h1 className="font-display mt-4 text-5xl md:text-7xl font-black tracking-tight leading-[1.05]">
            {event.name}
          </h1>
          <div className="mt-6 flex justify-center">
            <MetaLine event={event} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-md px-4 py-10">
        <TicketCard event={event} canBuy={canBuy} light />
      </section>

      {event.images.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-4 pb-8">
          <h2 className="text-xl font-bold mb-4">Galeria</h2>
          <GalleryGrid event={event} onOpenPhoto={onOpenPhoto} cols={4} />
        </section>
      )}

      <section className="mx-auto max-w-3xl px-4 py-8">
        <p className="text-muted leading-relaxed whitespace-pre-line text-center text-lg">
          {event.description}
        </p>
      </section>
    </>
  );
}

/** Layout 5 — Catálogo: ingresso top, fotos 2 colunas */
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
