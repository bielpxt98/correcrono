/** Miniatura visual da estrutura do layout (como loja de templates). */
export function LayoutWirePreview({
  id,
  accent,
  bg,
}: {
  id: string;
  accent: string;
  bg: string;
}) {
  const isLight = bg.startsWith("#f") || bg === "#fafafa" || bg === "#f8fafc";
  const block = isLight ? "#cbd5e1" : "#334155";
  const soft = isLight ? "#e2e8f0" : "#1e293b";

  return (
    <div
      className="h-28 w-full rounded-xl overflow-hidden border border-black/10 p-2 flex flex-col gap-1"
      style={{ background: bg }}
    >
      {/* Chegada CTA */}
      {id === "bilheteria" && (
        <>
          <div className="flex-1 flex flex-col items-center justify-center gap-1 rounded-lg relative overflow-hidden"
            style={{ background: soft }}
          >
            <div className="h-2 w-1/2 rounded" style={{ background: accent }} />
            <div className="h-1.5 w-1/3 rounded opacity-50" style={{ background: block }} />
            <div className="h-3 w-14 rounded mt-1" style={{ background: accent }} />
          </div>
          <div className="flex gap-1 h-6">
            <div className="flex-1 rounded" style={{ background: soft }} />
            <div className="flex-1 rounded" style={{ background: soft }} />
            <div className="flex-1 rounded" style={{ background: soft }} />
          </div>
        </>
      )}

      {/* Noturno cinematográfico */}
      {id === "poster" && (
        <>
          <div className="flex-1 flex flex-col justify-end gap-1 p-1 rounded-lg" style={{ background: soft }}>
            <div className="h-2.5 w-3/4 rounded" style={{ background: accent }} />
            <div className="h-1 w-1/2 rounded opacity-40" style={{ background: block }} />
            <div className="flex gap-1 mt-1">
              <div className="h-3 w-8 rounded" style={{ background: block, opacity: 0.6 }} />
              <div className="h-3 w-8 rounded" style={{ background: block, opacity: 0.6 }} />
              <div className="h-3 w-8 rounded" style={{ background: block, opacity: 0.6 }} />
              <div className="flex-1" />
              <div className="h-3 w-10 rounded border border-white/20" style={{ background: "transparent" }} />
            </div>
          </div>
        </>
      )}

      {id === "vitrine" && (
        <>
          <div className="flex gap-0.5 h-8">
            <div className="flex-1 rounded-sm" style={{ background: soft }} />
            <div className="flex-1 rounded-sm" style={{ background: soft }} />
            <div className="flex-1 rounded-sm" style={{ background: soft }} />
            <div className="flex-1 rounded-sm" style={{ background: soft }} />
          </div>
          <div className="flex-1 flex gap-1.5 items-center">
            <div className="flex-1 space-y-1">
              <div className="h-2 w-3/4 rounded" style={{ background: accent }} />
              <div className="h-1.5 w-full rounded opacity-40" style={{ background: block }} />
            </div>
            <div className="w-9 h-12 rounded-md" style={{ background: accent }} />
          </div>
        </>
      )}

      {/* Elegante central */}
      {id === "revista" && (
        <>
          <div className="h-3 flex justify-center gap-1.5 items-center">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-1 w-4 rounded opacity-40" style={{ background: block }} />
            ))}
          </div>
          <div className="flex-1 rounded-md flex items-center justify-center" style={{ background: soft }}>
            <div className="h-2 w-1/2 rounded" style={{ background: accent }} />
          </div>
          <div className="flex gap-0.5 h-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-1 rounded-sm" style={{ background: soft }} />
            ))}
          </div>
        </>
      )}

      {id === "catalogo" && (
        <>
          <div className="flex gap-1.5 h-12">
            <div className="flex-1 space-y-1 pt-1">
              <div className="h-2 w-3/4 rounded" style={{ background: accent }} />
              <div className="h-1.5 w-full rounded opacity-40" style={{ background: block }} />
            </div>
            <div className="w-9 h-full rounded-md" style={{ background: accent }} />
          </div>
          <div className="grid grid-cols-2 gap-0.5 flex-1">
            <div className="rounded-sm" style={{ background: soft }} />
            <div className="rounded-sm" style={{ background: soft }} />
          </div>
        </>
      )}
    </div>
  );
}
