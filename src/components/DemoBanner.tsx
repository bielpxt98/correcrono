"use client";

import { useEffect, useState } from "react";

export function DemoBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    fetch("/api/event")
      .then((r) => r.json())
      .then((d) => {
        if (d.demo) setShow(true);
      })
      .catch(() => {});
  }, []);

  if (!show) return null;

  return (
    <div className="relative z-50 bg-amber-400 text-amber-950 text-center text-xs sm:text-sm font-semibold px-3 py-2">
      👀 MODO DEMONSTRAÇÃO — prévia visual para aprovação · dados fictícios · admin senha:{" "}
      <code className="bg-amber-300/80 px-1 rounded">demo</code>
    </div>
  );
}
