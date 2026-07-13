"use client";

import { useEffect, useState } from "react";
import { HomeHeroByLayout } from "@/components/HomeLayouts";
import { SiteHeader } from "@/components/SiteHeader";
import { formatDateLongBR } from "@/lib/format";
import {
  colorVarsStyle,
  resolveColor,
  resolveFont,
  resolveLayout,
} from "@/lib/themes";
import type { EventPublic } from "@/lib/types";

export default function HomePage() {
  const [event, setEvent] = useState<EventPublic | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const layout = resolveLayout(event?.theme_layout);
  const font = resolveFont(event?.theme_font);
  const color = resolveColor(event?.theme_color);

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

  // Teclado no lightbox
  useEffect(() => {
    if (!lightbox || !event?.images?.length) return;
    const urls = event.images.map((i) => i.url);
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightbox(null);
      const idx = urls.indexOf(lightbox!);
      if (idx < 0) return;
      if (e.key === "ArrowRight") setLightbox(urls[(idx + 1) % urls.length]);
      if (e.key === "ArrowLeft")
        setLightbox(urls[(idx - 1 + urls.length) % urls.length]);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, event]);

  const canBuy =
    !!event?.registration_open && (event?.slots_remaining ?? 0) > 0;

  const lightLayouts = layout === "vitrine" || layout === "catalogo";

  return (
    <div
      className="home-theme min-h-full flex flex-col bg-background text-foreground"
      data-layout={layout}
      data-font={font}
      data-color={color}
      style={colorVarsStyle(color)}
    >
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
              <p className="mb-4 text-sm leading-relaxed">{error}</p>
            </div>
          </div>
        </>
      )}

      {event && (
        <>
          <SiteHeader solid={lightLayouts || layout === "revista"} />

          <HomeHeroByLayout
            event={event}
            canBuy={canBuy}
            layout={layout}
            onOpenPhoto={setLightbox}
          />

          {/* Sobre + regulamento (comum a todos) */}
          <section className="mx-auto w-full max-w-6xl px-4 py-10 grid gap-6 md:grid-cols-2">
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
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Local</dt>
                  <dd className="font-medium text-right">
                    {event.location}
                    {event.city ? ` · ${event.city}` : ""}
                  </dd>
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

          {/* Contatos */}
          <section className="mx-auto w-full max-w-6xl px-4 pb-24 md:pb-16">
            <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
              <h2 className="text-xl font-bold mb-1">Contatos</h2>
              <p className="text-xs text-muted mb-6">
                * Demonstração — contatos fictícios
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                <ContactMini label="E-mail" value="contato@corridadacidade.demo" />
                <ContactMini label="WhatsApp" value="(11) 98765-4321" />
                <ContactMini label="Instagram" value="@corridadacidade" />
                <ContactMini label="YouTube" value="Corrida da Cidade" />
              </div>
            </div>
          </section>

          {canBuy && (
            <div className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card/95 backdrop-blur p-3 md:hidden">
              <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
                <div>
                  <p className="text-xs text-muted">Ingresso</p>
                  <p className="font-bold text-lg">
                    {(event.price_cents / 100).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>
                <a
                  href="/inscrever"
                  className="rounded-full bg-brand px-6 py-3 text-sm font-bold text-white"
                >
                  Comprar
                </a>
              </div>
            </div>
          )}

          {lightbox && (
            <div
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
              onClick={() => setLightbox(null)}
              role="dialog"
            >
              <button
                type="button"
                className="absolute top-4 right-4 h-11 w-11 rounded-full bg-white/15 text-white text-2xl"
                onClick={() => setLightbox(null)}
                aria-label="Fechar"
              >
                ×
              </button>
              {event.images.length > 1 && (
                <>
                  <button
                    type="button"
                    className="absolute left-3 h-12 w-12 rounded-full bg-white/15 text-white text-2xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      const urls = event.images.map((i) => i.url);
                      const i = urls.indexOf(lightbox);
                      setLightbox(urls[(i - 1 + urls.length) % urls.length]);
                    }}
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="absolute right-3 h-12 w-12 rounded-full bg-white/15 text-white text-2xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      const urls = event.images.map((i) => i.url);
                      const i = urls.indexOf(lightbox);
                      setLightbox(urls[(i + 1) % urls.length]);
                    }}
                  >
                    ›
                  </button>
                </>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lightbox}
                alt=""
                className="max-h-[90vh] max-w-full rounded-xl object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          <footer className="border-t border-border py-6 text-center text-xs text-muted pb-24 md:pb-8">
            Bilheteria digital · {event.name}
          </footer>
        </>
      )}
    </div>
  );
}

function ContactMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card-2 px-3 py-3">
      <p className="text-[11px] text-muted">{label}</p>
      <p className="font-medium mt-0.5 break-all">{value}</p>
    </div>
  );
}
