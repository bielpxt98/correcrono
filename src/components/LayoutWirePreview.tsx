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
      {id === "bilheteria" && (
        <>
          <div className="flex-1 flex gap-1.5 items-end p-1">
            <div className="flex-1 space-y-1">
              <div className="h-2 w-3/4 rounded" style={{ background: accent }} />
              <div className="h-1.5 w-full rounded opacity-50" style={{ background: block }} />
              <div className="h-1.5 w-2/3 rounded opacity-40" style={{ background: block }} />
            </div>
            <div
              className="w-10 h-14 rounded-md shrink-0"
              style={{ background: accent, opacity: 0.9 }}
            />
          </div>
          <div className="flex gap-1 h-5">
            <div className="flex-1 rounded" style={{ background: soft }} />
            <div className="flex-1 rounded" style={{ background: soft }} />
            <div className="flex-1 rounded" style={{ background: soft }} />
          </div>
        </>
      )}

      {id === "poster" && (
        <>
          <div className="flex-1 flex flex-col items-center justify-center gap-1">
            <div className="h-2.5 w-2/3 rounded" style={{ background: accent }} />
            <div className="h-1.5 w-1/2 rounded opacity-50" style={{ background: block }} />
            <div className="h-4 w-12 rounded-full mt-1" style={{ background: accent }} />
          </div>
          <div className="grid grid-cols-3 gap-0.5 h-8">
            <div className="rounded-sm" style={{ background: soft }} />
            <div className="rounded-sm" style={{ background: soft }} />
            <div className="rounded-sm" style={{ background: soft }} />
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

      {id === "revista" && (
        <>
          <div className="h-6 flex flex-col items-center justify-center gap-0.5">
            <div className="h-2 w-2/3 rounded" style={{ background: accent }} />
            <div className="h-1 w-1/3 rounded opacity-40" style={{ background: block }} />
          </div>
          <div className="mx-auto w-10 h-8 rounded-md" style={{ background: accent }} />
          <div className="grid grid-cols-4 gap-0.5 flex-1 mt-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-sm" style={{ background: soft }} />
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
