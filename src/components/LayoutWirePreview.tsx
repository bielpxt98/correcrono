/** Miniatura visual da estrutura do layout. */
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
      {(id === "bilheteria" || id === "vitrine" || id === "catalogo") && (
        <>
          <div className="flex-1 flex gap-1.5 items-end p-1 rounded-lg" style={{ background: soft }}>
            <div className="flex-1 space-y-1">
              <div className="h-2 w-3/4 rounded" style={{ background: accent }} />
              <div className="h-1.5 w-full rounded opacity-50" style={{ background: block }} />
              <div className="h-1.5 w-2/3 rounded opacity-40" style={{ background: block }} />
            </div>
            <div className="w-10 h-14 rounded-md shrink-0" style={{ background: accent, opacity: 0.9 }} />
          </div>
        </>
      )}

      {id === "poster" && (
        <div className="flex-1 flex flex-col justify-end gap-1 p-1 rounded-lg" style={{ background: soft }}>
          <div className="h-2.5 w-3/4 rounded" style={{ background: accent }} />
          <div className="h-1 w-1/2 rounded opacity-40" style={{ background: block }} />
          <div className="flex gap-1 mt-1">
            <div className="h-3 w-8 rounded" style={{ background: block, opacity: 0.6 }} />
            <div className="h-3 w-8 rounded" style={{ background: block, opacity: 0.6 }} />
            <div className="flex-1" />
            <div className="h-3 w-10 rounded border border-white/20" />
          </div>
        </div>
      )}

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

      {id === "neon" && (
        <div className="flex-1 flex flex-col items-center justify-center gap-1.5 rounded-lg" style={{ background: soft }}>
          <div className="h-3 w-2/3 rounded shadow-lg" style={{ background: accent }} />
          <div className="flex gap-1">
            <div className="h-4 w-8 rounded" style={{ background: block }} />
            <div className="h-4 w-8 rounded" style={{ background: block }} />
            <div className="h-4 w-8 rounded" style={{ background: block }} />
          </div>
          <div className="h-3 w-16 rounded-full" style={{ background: accent }} />
        </div>
      )}

      {id === "split" && (
        <div className="flex-1 flex gap-1 rounded-lg overflow-hidden">
          <div className="flex-1" style={{ background: soft }} />
          <div className="flex-1 flex flex-col justify-center gap-1 p-1">
            <div className="h-2 w-full rounded" style={{ background: accent }} />
            <div className="h-1.5 w-3/4 rounded opacity-50" style={{ background: block }} />
            <div className="h-6 w-10 rounded mt-1" style={{ background: accent }} />
          </div>
        </div>
      )}

      {id === "stadium" && (
        <div className="flex-1 flex flex-col items-center justify-end gap-1 p-2 rounded-lg" style={{ background: soft }}>
          <div className="h-2.5 w-2/3 rounded" style={{ background: accent }} />
          <div className="flex gap-1">
            <div className="h-3 w-10 rounded-full" style={{ background: block, opacity: 0.7 }} />
            <div className="h-3 w-10 rounded-full" style={{ background: block, opacity: 0.7 }} />
            <div className="h-3 w-10 rounded-full" style={{ background: block, opacity: 0.7 }} />
          </div>
          <div className="h-3 w-20 rounded-lg mt-1" style={{ background: accent }} />
        </div>
      )}

      {id === "magazine" && (
        <div className="flex-1 flex gap-1 rounded-lg overflow-hidden">
          <div className="flex-[1.2] relative" style={{ background: soft }}>
            <div className="absolute top-1 left-1 h-4 w-8 rounded text-[8px]" style={{ background: accent, opacity: 0.8 }} />
          </div>
          <div className="flex-1 flex flex-col justify-center gap-1 p-1">
            <div className="h-2 w-full rounded" style={{ background: accent }} />
            <div className="h-1 w-full rounded opacity-40" style={{ background: block }} />
            <div className="h-1 w-2/3 rounded opacity-40" style={{ background: block }} />
          </div>
        </div>
      )}
    </div>
  );
}
