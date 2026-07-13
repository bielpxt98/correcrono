"use client";

import { FormEvent, useEffect, useState } from "react";
import type { EventPublic } from "@/lib/types";

type Props = {
  event: EventPublic | null;
  password: string;
  saving: boolean;
  onSave: (contacts: ContactForm) => void;
};

export type ContactForm = {
  contact_email: string;
  contact_whatsapp: string;
  contact_phone: string;
  contact_instagram: string;
  contact_facebook: string;
  contact_youtube: string;
  contact_tiktok: string;
  contact_timing_url: string;
  contact_timing_label: string;
  contact_kit_email: string;
  contact_extra: string;
};

export function AdminContactsTab({ event, password, saving, onSave }: Props) {
  const [form, setForm] = useState<ContactForm>({
    contact_email: "",
    contact_whatsapp: "",
    contact_phone: "",
    contact_instagram: "",
    contact_facebook: "",
    contact_youtube: "",
    contact_tiktok: "",
    contact_timing_url: "",
    contact_timing_label: "Cronometragem e percursos",
    contact_kit_email: "",
    contact_extra: "",
  });

  useEffect(() => {
    if (!event) return;
    setForm({
      contact_email: event.contact_email || "",
      contact_whatsapp: event.contact_whatsapp || "",
      contact_phone: event.contact_phone || "",
      contact_instagram: event.contact_instagram || "",
      contact_facebook: event.contact_facebook || "",
      contact_youtube: event.contact_youtube || "",
      contact_tiktok: event.contact_tiktok || "",
      contact_timing_url: event.contact_timing_url || "",
      contact_timing_label:
        event.contact_timing_label || "Cronometragem e percursos",
      contact_kit_email: event.contact_kit_email || "",
      contact_extra: event.contact_extra || "",
    });
  }, [event]);

  function set<K extends keyof ContactForm>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-border bg-card p-5 md:p-8 space-y-5 shadow-sm"
    >
      <div>
        <h2 className="text-2xl font-black tracking-tight">Contatos do evento</h2>
        <p className="text-sm text-muted mt-1">
          Esses dados aparecem na home para o atleta. Preencha o que quiser —
          campos vazios não são mostrados.
        </p>
      </div>

      <div className="rounded-xl bg-sky-50 border border-sky-200 px-4 py-3 text-sm text-sky-950">
        <strong>Site de cronometragem / percursos:</strong> coloque o link da
        tabela ou site do cliente (resultados, tempos, mapa do percurso).
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field
          label="E-mail principal"
          value={form.contact_email}
          onChange={(v) => set("contact_email", v)}
          placeholder="contato@seuevento.com.br"
        />
        <Field
          label="E-mail do kit / retirada"
          value={form.contact_kit_email}
          onChange={(v) => set("contact_kit_email", v)}
          placeholder="kit@seuevento.com.br"
        />
        <Field
          label="WhatsApp (só números com DDD)"
          value={form.contact_whatsapp}
          onChange={(v) => set("contact_whatsapp", v)}
          placeholder="11999998888"
        />
        <Field
          label="Telefone fixo"
          value={form.contact_phone}
          onChange={(v) => set("contact_phone", v)}
          placeholder="1133334444"
        />
      </div>

      <div className="border-t border-border pt-4">
        <h3 className="font-bold mb-3">Redes sociais</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            label="Instagram"
            value={form.contact_instagram}
            onChange={(v) => set("contact_instagram", v)}
            placeholder="@seuevento ou URL"
          />
          <Field
            label="Facebook"
            value={form.contact_facebook}
            onChange={(v) => set("contact_facebook", v)}
            placeholder="URL ou nome da página"
          />
          <Field
            label="YouTube"
            value={form.contact_youtube}
            onChange={(v) => set("contact_youtube", v)}
            placeholder="URL do canal"
          />
          <Field
            label="TikTok"
            value={form.contact_tiktok}
            onChange={(v) => set("contact_tiktok", v)}
            placeholder="@seuevento"
          />
        </div>
      </div>

      <div className="border-t border-border pt-4 space-y-4">
        <h3 className="font-bold">Cronometragem / percursos / resultados</h3>
        <Field
          label="Texto do botão / link"
          value={form.contact_timing_label}
          onChange={(v) => set("contact_timing_label", v)}
          placeholder="Cronometragem, resultados e percursos"
        />
        <Field
          label="Link do site (tabela do cliente)"
          value={form.contact_timing_url}
          onChange={(v) => set("contact_timing_url", v)}
          placeholder="https://..."
        />
        <p className="text-xs text-muted -mt-2">
          Ex.: site da empresa de cronometragem, planilha pública, página de
          percursos.
        </p>
      </div>

      <label className="block">
        <span className="text-sm font-medium">Observação pública (opcional)</span>
        <textarea
          value={form.contact_extra}
          onChange={(e) => set("contact_extra", e.target.value)}
          rows={2}
          className="field mt-1.5"
          placeholder="Horário de atendimento, endereço da retirada do kit…"
        />
      </label>

      <button
        type="submit"
        disabled={saving || !password}
        className="rounded-xl bg-brand px-8 py-3.5 font-bold text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {saving ? "Salvando…" : "Salvar contatos"}
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field mt-1.5"
        placeholder={placeholder}
      />
    </label>
  );
}
