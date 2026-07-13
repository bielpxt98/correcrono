"use client";

import { FormEvent, useCallback, useState } from "react";
import * as XLSX from "xlsx";
import { AdminCouponsTab } from "@/components/AdminCouponsTab";
import { AdminPaymentTab } from "@/components/AdminPaymentTab";
import { centsToReaisInput, formatBRL, reaisToCents } from "@/lib/format";
import type { RegistrationStats } from "@/lib/registration-stats";
import {
  sortCategoryKeys,
  sortShirtKeys,
} from "@/lib/registration-stats";
import { FONTS, LAYOUTS, type FontId, type LayoutId } from "@/lib/themes";
import type { EventImage, EventPublic, RegistrationRow } from "@/lib/types";

type Tab =
  | "resumo"
  | "evento"
  | "visual"
  | "fotos"
  | "recebimento"
  | "cupons"
  | "inscritos";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendente",
  paid: "Paga",
  cancelled: "Cancelada",
  refunded: "Reembolsada",
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>("resumo");
  const [event, setEvent] = useState<EventPublic | null>(null);
  const [rows, setRows] = useState<RegistrationRow[]>([]);
  const [stats, setStats] = useState<RegistrationStats | null>(null);
  const [statsFiltered, setStatsFiltered] = useState<RegistrationStats | null>(
    null
  );
  const [q, setQ] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterShirt, setFilterShirt] = useState("all");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Form estado do evento
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [regulations, setRegulations] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("07:00");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [priceInput, setPriceInput] = useState("0");
  const [maxSlots, setMaxSlots] = useState(500);
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [categoriesText, setCategoriesText] = useState("5K\n10K");
  const [sizesText, setSizesText] = useState("PP\nP\nM\nG\nGG\nXG");
  const [themeLayout, setThemeLayout] = useState<LayoutId>("bilheteria");
  const [themeFont, setThemeFont] = useState<FontId>("geist");

  function fillForm(ev: EventPublic) {
    setEvent(ev);
    setName(ev.name);
    setDescription(ev.description);
    setRegulations(ev.regulations || "");
    setEventDate(ev.event_date);
    setStartTime(ev.start_time || "07:00");
    setLocation(ev.location);
    setCity(ev.city || "");
    setPriceInput(centsToReaisInput(ev.price_cents));
    setMaxSlots(ev.max_slots);
    setRegistrationOpen(ev.registration_open);
    setCategoriesText((ev.categories || []).join("\n"));
    setSizesText((ev.shirt_sizes || []).join("\n"));
    setThemeLayout((ev.theme_layout as LayoutId) || "bilheteria");
    setThemeFont((ev.theme_font as FontId) || "geist");
  }

  const loadAll = useCallback(
    async (
      pwd: string,
      opts?: {
        q?: string;
        status?: string;
        category?: string;
        shirt?: string;
      }
    ) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        const qq = opts?.q ?? q;
        const st = opts?.status ?? filterStatus;
        const cat = opts?.category ?? filterCategory;
        const sh = opts?.shirt ?? filterShirt;
        if (qq) params.set("q", qq);
        if (st && st !== "all") params.set("status", st);
        if (cat && cat !== "all") params.set("category", cat);
        if (sh && sh !== "all") params.set("shirt", sh);
        const qs = params.toString();
        const listUrl = qs
          ? `/api/inscricoes/list?${qs}`
          : "/api/inscricoes/list";

        const [evRes, listRes] = await Promise.all([
          fetch("/api/event"),
          fetch(listUrl, { headers: { "x-admin-password": pwd } }),
        ]);

        const evData = await evRes.json();
        if (!evRes.ok) throw new Error(evData.error || "Erro ao carregar evento");

        const listData = await listRes.json();
        if (!listRes.ok) throw new Error(listData.error || "Senha incorreta");

        fillForm(listData.event || evData.event);
        setRows(listData.registrations || []);
        setStats(listData.stats || null);
        setStatsFiltered(listData.stats_filtered || null);
        setAuthed(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erro");
        setAuthed(false);
      } finally {
        setLoading(false);
      }
    },
    [q, filterStatus, filterCategory, filterShirt]
  );

  async function saveEvent(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    setError(null);

    const categories = categoriesText
      .split(/[\n,;]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const shirt_sizes = sizesText
      .split(/[\n,;]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (categories.length === 0) {
      setError("Informe pelo menos 1 categoria.");
      setSaving(false);
      return;
    }
    if (shirt_sizes.length === 0) {
      setError("Informe pelo menos 1 tamanho de camiseta.");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/event", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({
          name,
          description,
          regulations,
          event_date: eventDate,
          start_time: startTime,
          location,
          city,
          price_cents: reaisToCents(priceInput),
          max_slots: Number(maxSlots),
          registration_open: registrationOpen,
          categories,
          shirt_sizes,
          theme_layout: themeLayout,
          theme_font: themeFont,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha ao salvar");
      fillForm(data.event);
      setMsg("Salvo! Layout e fonte da home já atualizados — abra o site para ver.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    setMsg(null);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        if (!event?.images.length) fd.append("set_cover", "1");
        const res = await fetch("/api/images", {
          method: "POST",
          headers: { "x-admin-password": password },
          body: fd,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Falha no upload");
        if (data.event) fillForm(data.event);
      }
      setMsg("Foto(s) enviada(s)! Já aparecem no site.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro no upload");
    } finally {
      setUploading(false);
    }
  }

  async function setCover(img: EventImage) {
    const res = await fetch(`/api/images/${img.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify({ action: "set_cover" }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Erro");
      return;
    }
    if (data.event) fillForm(data.event);
    setMsg("Capa atualizada no site.");
  }

  async function removeImage(img: EventImage) {
    if (!confirm("Remover esta foto do site?")) return;
    const res = await fetch(`/api/images/${img.id}`, {
      method: "DELETE",
      headers: { "x-admin-password": password },
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Erro");
      return;
    }
    if (data.event) fillForm(data.event);
    setMsg("Foto removida.");
  }

  async function updateStatus(id: string, status: RegistrationRow["status"]) {
    const res = await fetch(`/api/inscricoes/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Erro ao atualizar");
      return;
    }
    await loadAll(password, {
      q,
      status: filterStatus,
      category: filterCategory,
      shirt: filterShirt,
    });
  }

  function exportExcel() {
    const data = rows.map((r) => ({
      Nome: r.full_name,
      CPF: r.cpf,
      Email: r.email,
      Telefone: r.phone,
      Nascimento: r.birth_date || "",
      Camiseta: r.shirt_size,
      Categoria: r.category,
      Status: STATUS_LABEL[r.status] || r.status,
      Valor: formatBRL(r.amount_cents),
      Criado_em: r.created_at,
      ID: r.id,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inscricoes");
    XLSX.writeFile(wb, `inscricoes-${event?.name || "corrida"}.xlsx`);
  }

  return (
    <div className="admin-theme min-h-full">
      <header className="border-b border-border bg-card sticky top-0 z-20">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-3">
          <div>
            <p className="font-bold text-lg leading-tight">Painel do organizador</p>
            <p className="text-xs text-muted">
              Edite a corrida, fotos e inscritos — sem código
            </p>
          </div>
          <a href="/" className="text-sm text-brand font-medium hover:underline">
            Ver site →
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {!authed ? (
          <form
            className="max-w-sm mx-auto mt-10 space-y-3 rounded-2xl border border-border bg-card p-6 shadow-sm"
            onSubmit={(e) => {
              e.preventDefault();
              loadAll(password, {
                q: "",
                status: "all",
                category: "all",
                shirt: "all",
              });
            }}
          >
            <h1 className="text-xl font-bold">Entrar</h1>
            <p className="text-sm text-muted">
              Na demonstração a senha é <strong>demo</strong>. Depois, será a do{" "}
              <strong>ADMIN_PASSWORD</strong>.
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="demo"
              className="w-full rounded-xl border border-border px-3 py-2.5"
              autoFocus
            />
            {error && <p className="text-sm text-danger">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
            >
              {loading ? "Entrando…" : "Entrar"}
            </button>
          </form>
        ) : (
          <>
            {/* Abas grandes e claras */}
            <div className="flex flex-wrap gap-2 mb-6">
              {(
                [
                  ["resumo", "0. Resumo"],
                  ["evento", "1. Dados da corrida"],
                  ["visual", "2. Visual ★"],
                  ["fotos", "3. Fotos"],
                  ["recebimento", "4. Recebimento"],
                  ["cupons", "5. Cupons"],
                  ["inscritos", "6. Inscritos"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setTab(id);
                    setMsg(null);
                    setError(null);
                  }}
                  className={
                    tab === id
                      ? "rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white"
                      : "rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-slate-50"
                  }
                >
                  {label}
                </button>
              ))}
            </div>

            {(msg || error) && (
              <div
                className={
                  error
                    ? "mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                    : "mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
                }
              >
                {error || msg}
              </div>
            )}

            {event && tab !== "resumo" && (
              <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <MiniStat label="Vagas restantes" value={String(event.slots_remaining)} />
                <MiniStat label="Máximo" value={String(event.max_slots)} />
                <MiniStat
                  label="Já pagaram"
                  value={String(stats?.paid ?? event.paid_count)}
                />
                <MiniStat
                  label="Faltam pagar"
                  value={String(stats?.pending ?? event.pending_count)}
                />
              </div>
            )}

            {tab === "resumo" && stats && event && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold">Resumo das inscrições</h2>
                  <p className="text-sm text-muted mt-1">
                    Visão geral para o organizador — quantidades, categorias,
                    camisetas e pagamentos.
                  </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <BigStat
                    label="Total de inscritos"
                    value={stats.total}
                    hint="Todas as inscrições (inclui canceladas)"
                    color="slate"
                  />
                  <BigStat
                    label="Ativos"
                    value={stats.active}
                    hint="Pagas + pendentes + reembolsos"
                    color="blue"
                  />
                  <BigStat
                    label="Já pagaram"
                    value={stats.paid}
                    hint="Inscrições confirmadas"
                    color="green"
                  />
                  <BigStat
                    label="Faltam pagar"
                    value={stats.pending}
                    hint="Aguardando pagamento"
                    color="amber"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                    <h3 className="font-bold mb-1">Pagamentos</h3>
                    <p className="text-xs text-muted mb-4">
                      Quantos já quitaram e quantos ainda faltam
                    </p>
                    <PayBar paid={stats.paid} pending={stats.pending} />
                    <ul className="mt-4 space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span className="text-emerald-700 font-medium">Já pagaram</span>
                        <strong>{stats.paid}</strong>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-amber-700 font-medium">Faltam pagar</span>
                        <strong>{stats.pending}</strong>
                      </li>
                      <li className="flex justify-between text-muted">
                        <span>Canceladas</span>
                        <span>{stats.cancelled}</span>
                      </li>
                      <li className="flex justify-between text-muted">
                        <span>Reembolsadas</span>
                        <span>{stats.refunded}</span>
                      </li>
                      <li className="flex justify-between border-t border-border pt-2 mt-2">
                        <span>Vagas restantes no evento</span>
                        <strong>{event.slots_remaining}</strong>
                      </li>
                    </ul>
                    <button
                      type="button"
                      className="mt-4 text-sm font-semibold text-brand hover:underline"
                      onClick={() => {
                        setFilterStatus("pending");
                        setTab("inscritos");
                        void loadAll(password, {
                          status: "pending",
                          category: "all",
                          shirt: "all",
                        });
                      }}
                    >
                      Ver quem falta pagar →
                    </button>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                    <h3 className="font-bold mb-1">Por categoria (km)</h3>
                    <p className="text-xs text-muted mb-4">
                      Ex.: quantos no 5K, 10K, caminhada…
                    </p>
                    <div className="space-y-3">
                      {sortCategoryKeys(Object.keys(stats.by_category)).map(
                        (cat) => (
                          <BreakdownRow
                            key={cat}
                            label={cat}
                            count={stats.by_category[cat]}
                            total={stats.active || 1}
                            onClick={() => {
                              setFilterCategory(cat);
                              setFilterStatus("all");
                              setTab("inscritos");
                              void loadAll(password, {
                                category: cat,
                                status: "all",
                                shirt: "all",
                              });
                            }}
                          />
                        )
                      )}
                      {Object.keys(stats.by_category).length === 0 && (
                        <p className="text-sm text-muted">Nenhum inscrito ainda.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <h3 className="font-bold mb-1">Camisetas (kit)</h3>
                  <p className="text-xs text-muted mb-4">
                    Quantidade por tamanho — útil para pedir o kit
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {sortShirtKeys(Object.keys(stats.by_shirt)).map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          setFilterShirt(size);
                          setFilterStatus("all");
                          setFilterCategory("all");
                          setTab("inscritos");
                          void loadAll(password, {
                            shirt: size,
                            status: "all",
                            category: "all",
                          });
                        }}
                        className="rounded-xl border border-border bg-slate-50 px-3 py-4 text-center hover:border-orange-300 hover:bg-orange-50 transition"
                      >
                        <p className="text-xs text-muted font-medium">Tam. {size}</p>
                        <p className="text-2xl font-black tabular-nums mt-1">
                          {stats.by_shirt[size]}
                        </p>
                        <p className="text-[10px] text-muted mt-1">clique p/ filtrar</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFilterStatus("all");
                      setFilterCategory("all");
                      setFilterShirt("all");
                      setQ("");
                      setTab("inscritos");
                      void loadAll(password, {
                        q: "",
                        status: "all",
                        category: "all",
                        shirt: "all",
                      });
                    }}
                    className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    Ver lista completa de inscritos
                  </button>
                  <button
                    type="button"
                    onClick={exportExcel}
                    className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium"
                  >
                    Exportar Excel (lista filtrada)
                  </button>
                </div>
              </div>
            )}

            {tab === "visual" && (
              <form
                onSubmit={saveEvent}
                className="rounded-2xl border border-border bg-card p-5 md:p-8 space-y-6 shadow-sm"
              >
                <div>
                  <h2 className="text-2xl font-black tracking-tight">
                    Visual da home
                  </h2>
                  <p className="text-sm text-muted mt-1">
                    Aqui o Felipe escolhe o <strong>layout</strong> (cores) e a{" "}
                    <strong>fonte</strong> das letras. Depois salva e abre a
                    home para ver.
                  </p>
                </div>

                <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-950">
                  1) Escolha layout e fonte abaixo → 2) clique{" "}
                  <strong>Salvar visual</strong> → 3) abra{" "}
                  <a href="/" className="font-bold underline" target="_blank" rel="noreferrer">
                    a home do site
                  </a>{" "}
                  (F5 se já estiver aberta).
                </div>

                <div>
                  <p className="text-base font-bold mb-3">1. Layout (cores)</p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {LAYOUTS.map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => setThemeLayout(l.id)}
                        className={
                          themeLayout === l.id
                            ? "rounded-2xl border-2 border-brand p-4 text-left bg-orange-50 shadow-md ring-2 ring-brand/30"
                            : "rounded-2xl border border-border p-4 text-left bg-white hover:border-orange-300"
                        }
                      >
                        <div
                          className="h-14 rounded-xl mb-3 border border-black/5"
                          style={{ background: l.preview }}
                        />
                        <p className="font-bold">{l.name}</p>
                        <p className="text-xs text-muted mt-1 leading-snug">
                          {l.description}
                        </p>
                        {themeLayout === l.id && (
                          <p className="text-[11px] font-bold text-brand mt-2">
                            ✓ Selecionado
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-base font-bold mb-3">2. Fonte das letras</p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {FONTS.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setThemeFont(f.id)}
                        className={
                          themeFont === f.id
                            ? "rounded-2xl border-2 border-brand p-4 text-left bg-orange-50 ring-2 ring-brand/30"
                            : "rounded-2xl border border-border p-4 text-left bg-white hover:border-orange-300"
                        }
                      >
                        <p
                          className="text-2xl font-bold"
                          style={{ fontFamily: f.cssVar }}
                        >
                          Aa Bb Cc
                        </p>
                        <p className="font-semibold mt-2">{f.name}</p>
                        <p className="text-xs text-muted mt-0.5">{f.description}</p>
                        {themeFont === f.id && (
                          <p className="text-[11px] font-bold text-brand mt-2">
                            ✓ Selecionado
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-brand px-8 py-3.5 font-bold text-white hover:bg-brand-dark disabled:opacity-60 text-base"
                  >
                    {saving ? "Salvando…" : "Salvar visual e aplicar na home"}
                  </button>
                  <a
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-xl border border-border bg-white px-6 py-3.5 text-sm font-semibold hover:bg-slate-50"
                  >
                    Abrir home →
                  </a>
                </div>
              </form>
            )}

            {tab === "evento" && (
              <form
                onSubmit={saveEvent}
                className="rounded-2xl border border-border bg-card p-5 md:p-8 space-y-5 shadow-sm"
              >
                <div>
                  <h2 className="text-lg font-bold">Dados da corrida</h2>
                  <p className="text-sm text-muted mt-1">
                    Tudo que você mudar aqui aparece no site público.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setTab("visual")}
                  className="w-full rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50 px-4 py-3 text-left hover:bg-orange-100 transition"
                >
                  <p className="font-bold text-orange-950">
                    🎨 Quer mudar cores e fonte da home?
                  </p>
                  <p className="text-sm text-orange-900/80 mt-0.5">
                    Abra a aba <strong>2. Visual ★</strong> — layout + letras
                  </p>
                </button>

                <Field label="Nome da corrida *">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="field"
                    placeholder="Ex: Corrida Noturna 2026"
                  />
                </Field>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Data *">
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      required
                      className="field"
                    />
                  </Field>
                  <Field label="Horário de largada">
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="field"
                    />
                  </Field>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Local / endereço">
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="field"
                      placeholder="Parque, avenida…"
                    />
                  </Field>
                  <Field label="Cidade">
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="field"
                    />
                  </Field>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Preço do ingresso (R$) *">
                    <input
                      value={priceInput}
                      onChange={(e) => setPriceInput(e.target.value)}
                      className="field"
                      placeholder="80,00"
                      inputMode="decimal"
                    />
                  </Field>
                  <Field label="Quantidade de vagas *">
                    <input
                      type="number"
                      min={1}
                      value={maxSlots}
                      onChange={(e) => setMaxSlots(Number(e.target.value))}
                      className="field"
                    />
                  </Field>
                </div>

                <label className="flex items-center gap-3 rounded-xl border border-border bg-slate-50 px-4 py-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={registrationOpen}
                    onChange={(e) => setRegistrationOpen(e.target.checked)}
                    className="h-5 w-5 accent-orange-600"
                  />
                  <span>
                    <strong>Inscrições abertas</strong>
                    <span className="block text-xs text-muted">
                      Desmarque para fechar as vendas no site
                    </span>
                  </span>
                </label>

                <Field label="Descrição (aparece no site)">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="field"
                    placeholder="Fale sobre a corrida, o kit, o percurso…"
                  />
                </Field>

                <Field label="Regulamento">
                  <textarea
                    value={regulations}
                    onChange={(e) => setRegulations(e.target.value)}
                    rows={5}
                    className="field"
                    placeholder="Regras, idade mínima, o que está incluso…"
                  />
                </Field>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Categorias (uma por linha)">
                    <textarea
                      value={categoriesText}
                      onChange={(e) => setCategoriesText(e.target.value)}
                      rows={5}
                      className="field font-mono text-sm"
                      placeholder={"5K\n10K\nCaminhada"}
                    />
                    <p className="text-xs text-muted mt-1">
                      Ex.: 5K, 10K, Caminhada — o atleta escolhe no checkout
                    </p>
                  </Field>
                  <Field label="Tamanhos de camiseta (um por linha)">
                    <textarea
                      value={sizesText}
                      onChange={(e) => setSizesText(e.target.value)}
                      rows={5}
                      className="field font-mono text-sm"
                      placeholder={"P\nM\nG\nGG"}
                    />
                  </Field>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto rounded-xl bg-brand px-8 py-3 font-bold text-white hover:bg-brand-dark disabled:opacity-60"
                >
                  {saving ? "Salvando…" : "Salvar e atualizar o site"}
                </button>
              </form>
            )}

            {tab === "fotos" && (
              <div className="rounded-2xl border border-border bg-card p-5 md:p-8 space-y-6 shadow-sm">
                <div>
                  <h2 className="text-lg font-bold">Fotos do evento</h2>
                  <p className="text-sm text-muted mt-1">
                    Envie fotos da corrida (cartaz, percurso, edição anterior). Elas
                    aparecem na capa e na galeria do site.
                  </p>
                </div>

                <label className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50/50 px-6 py-12 cursor-pointer hover:bg-orange-50 transition">
                  <span className="text-3xl">📷</span>
                  <span className="font-semibold text-center">
                    {uploading ? "Enviando…" : "Toque ou clique para escolher fotos"}
                  </span>
                  <span className="text-xs text-muted text-center">
                    JPG, PNG ou WEBP · até 5 MB cada · pode selecionar várias
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => {
                      void uploadFiles(e.target.files);
                      e.target.value = "";
                    }}
                  />
                </label>

                {event && event.images.length === 0 && (
                  <p className="text-sm text-muted text-center py-4">
                    Nenhuma foto ainda. Envie a primeira — ela vira a capa do site.
                  </p>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {event?.images.map((img) => (
                    <div
                      key={img.id}
                      className="rounded-2xl border border-border overflow-hidden bg-slate-50"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt=""
                        className="h-40 w-full object-cover"
                      />
                      <div className="p-2 flex flex-wrap gap-1">
                        {img.is_cover || event.cover_image_url === img.url ? (
                          <span className="text-[10px] font-bold uppercase bg-brand text-white px-2 py-1 rounded">
                            Capa do site
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setCover(img)}
                            className="text-[11px] font-medium bg-white border border-border px-2 py-1 rounded hover:bg-slate-100"
                          >
                            Usar como capa
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(img)}
                          className="text-[11px] font-medium text-red-700 bg-red-50 px-2 py-1 rounded"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "recebimento" && (
              <AdminPaymentTab
                password={password}
                onMessage={(m, e) => {
                  setMsg(m);
                  setError(e);
                }}
              />
            )}

            {tab === "cupons" && (
              <AdminCouponsTab
                password={password}
                priceCents={event?.price_cents ?? 8900}
                onMessage={(m, e) => {
                  setMsg(m);
                  setError(e);
                }}
              />
            )}

            {tab === "inscritos" && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold">Inscritos</h2>
                  <p className="text-sm text-muted">
                    Filtre por pagamento, categoria ou camiseta. Totais gerais na
                    aba Resumo.
                  </p>
                </div>

                {/* Filtros */}
                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
                  <p className="text-sm font-semibold">Filtrar informações</p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <label className="block text-xs text-muted">
                      Busca (nome / CPF)
                      <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Ex.: Ana ou 123"
                        className="field mt-1"
                      />
                    </label>
                    <label className="block text-xs text-muted">
                      Pagamento
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="field mt-1"
                      >
                        <option value="all">Todos</option>
                        <option value="paid">Já pagaram</option>
                        <option value="pending">Faltam pagar</option>
                        <option value="cancelled">Canceladas</option>
                        <option value="refunded">Reembolsadas</option>
                      </select>
                    </label>
                    <label className="block text-xs text-muted">
                      Categoria
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="field mt-1"
                      >
                        <option value="all">Todas</option>
                        {(event?.categories || []).map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block text-xs text-muted">
                      Camiseta
                      <select
                        value={filterShirt}
                        onChange={(e) => setFilterShirt(e.target.value)}
                        className="field mt-1"
                      >
                        <option value="all">Todos os tamanhos</option>
                        {(event?.shirt_sizes || []).map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        loadAll(password, {
                          q,
                          status: filterStatus,
                          category: filterCategory,
                          shirt: filterShirt,
                        })
                      }
                      className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white"
                    >
                      Aplicar filtros
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setQ("");
                        setFilterStatus("all");
                        setFilterCategory("all");
                        setFilterShirt("all");
                        void loadAll(password, {
                          q: "",
                          status: "all",
                          category: "all",
                          shirt: "all",
                        });
                      }}
                      className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium"
                    >
                      Limpar
                    </button>
                    <button
                      type="button"
                      onClick={exportExcel}
                      className="rounded-xl bg-slate-900 text-white px-5 py-2.5 text-sm font-medium ml-auto"
                    >
                      Exportar Excel
                    </button>
                  </div>
                </div>

                {statsFiltered && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                    <div className="rounded-xl bg-slate-100 px-3 py-2">
                      <span className="text-muted text-xs">Neste filtro</span>
                      <p className="font-bold text-lg tabular-nums">
                        {statsFiltered.total}
                      </p>
                    </div>
                    <div className="rounded-xl bg-emerald-50 px-3 py-2">
                      <span className="text-muted text-xs">Pagos (filtro)</span>
                      <p className="font-bold text-lg tabular-nums text-emerald-800">
                        {statsFiltered.paid}
                      </p>
                    </div>
                    <div className="rounded-xl bg-amber-50 px-3 py-2">
                      <span className="text-muted text-xs">Pendentes (filtro)</span>
                      <p className="font-bold text-lg tabular-nums text-amber-800">
                        {statsFiltered.pending}
                      </p>
                    </div>
                    <div className="rounded-xl bg-orange-50 px-3 py-2">
                        <span className="text-muted text-xs">Total geral (evento)</span>
                      <p className="font-bold text-lg tabular-nums">
                        {stats?.total ?? "—"}
                      </p>
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
                  <table className="min-w-full text-sm">
                    <thead className="bg-slate-50 text-left text-muted">
                      <tr>
                        <th className="px-3 py-3 font-medium">Nome</th>
                        <th className="px-3 py-3 font-medium">CPF</th>
                        <th className="px-3 py-3 font-medium">Contato</th>
                        <th className="px-3 py-3 font-medium">Kit</th>
                        <th className="px-3 py-3 font-medium">Status</th>
                        <th className="px-3 py-3 font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-3 py-10 text-center text-muted">
                            Nenhuma inscrição ainda.
                          </td>
                        </tr>
                      )}
                      {rows.map((r) => (
                        <tr key={r.id} className="border-t border-border">
                          <td className="px-3 py-3 font-medium">{r.full_name}</td>
                          <td className="px-3 py-3 font-mono text-xs">{r.cpf}</td>
                          <td className="px-3 py-3">
                            <div>{r.email}</div>
                            <div className="text-muted text-xs">{r.phone}</div>
                          </td>
                          <td className="px-3 py-3">
                            {r.shirt_size} · {r.category}
                          </td>
                          <td className="px-3 py-3">
                            <span
                              className={
                                r.status === "paid"
                                  ? "text-emerald-700 font-medium"
                                  : r.status === "cancelled"
                                    ? "text-red-600"
                                    : "text-amber-700"
                              }
                            >
                              {STATUS_LABEL[r.status] || r.status}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex flex-wrap gap-1">
                              {r.status !== "paid" && (
                                <button
                                  type="button"
                                  className="rounded-lg bg-emerald-50 text-emerald-800 px-2 py-1 text-xs"
                                  onClick={() => updateStatus(r.id, "paid")}
                                >
                                  Marcar paga
                                </button>
                              )}
                              {r.status !== "cancelled" && (
                                <button
                                  type="button"
                                  className="rounded-lg bg-red-50 text-red-800 px-2 py-1 text-xs"
                                  onClick={() => updateStatus(r.id, "cancelled")}
                                >
                                  Cancelar
                                </button>
                              )}
                              {r.status === "paid" && (
                                <button
                                  type="button"
                                  className="rounded-lg bg-slate-100 text-slate-700 px-2 py-1 text-xs"
                                  onClick={() => updateStatus(r.id, "refunded")}
                                >
                                  Reembolsar
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>

    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
      <p className="text-[11px] text-muted">{label}</p>
      <p className="text-xl font-bold tabular-nums mt-0.5">{value}</p>
    </div>
  );
}

function BigStat({
  label,
  value,
  hint,
  color,
}: {
  label: string;
  value: number;
  hint: string;
  color: "slate" | "blue" | "green" | "amber";
}) {
  const bg = {
    slate: "bg-slate-900 text-white",
    blue: "bg-sky-700 text-white",
    green: "bg-emerald-700 text-white",
    amber: "bg-amber-600 text-white",
  }[color];
  return (
    <div className={`rounded-2xl p-4 shadow-sm ${bg}`}>
      <p className="text-xs opacity-90">{label}</p>
      <p className="text-3xl font-black tabular-nums mt-1">{value}</p>
      <p className="text-[11px] opacity-80 mt-1">{hint}</p>
    </div>
  );
}

function PayBar({ paid, pending }: { paid: number; pending: number }) {
  const total = paid + pending || 1;
  const pctPaid = Math.round((paid / total) * 100);
  return (
    <div>
      <div className="h-3 rounded-full bg-amber-100 overflow-hidden flex">
        <div
          className="h-full bg-emerald-500 transition-all"
          style={{ width: `${pctPaid}%` }}
        />
      </div>
      <p className="text-xs text-muted mt-2">
        {pctPaid}% pagos · {100 - pctPaid}% aguardando (sobre pagos+pendentes)
      </p>
    </div>
  );
}

function BreakdownRow({
  label,
  count,
  total,
  onClick,
}: {
  label: string;
  count: number;
  total: number;
  onClick: () => void;
}) {
  const pct = Math.round((count / total) * 100);
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left group"
    >
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium group-hover:text-brand">{label}</span>
        <span className="tabular-nums font-bold">
          {count}{" "}
          <span className="text-muted font-normal text-xs">({pct}%)</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full bg-brand/80 rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
    </button>
  );
}
