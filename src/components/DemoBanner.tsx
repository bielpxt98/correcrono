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

  useEffect(() => {
    // Reserva espaço no topo para o banner (header absoluto não cobre)
    document.documentElement.style.setProperty(
      "--demo-banner-h",
      show ? "40px" : "0px"
    );
    return () => {
      document.documentElement.style.setProperty("--demo-banner-h", "0px");
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className="sticky top-0 z-[60] w-full bg-amber-400 text-amber-950 text-center text-xs sm:text-sm font-semibold px-3 py-2.5 shadow-sm">
      👀 MODO DEMONSTRAÇÃO — dados fictícios · admin senha:{" "}
      <code className="bg-amber-300/80 px-1 rounded">demo</code>
    </div>
  );
}
