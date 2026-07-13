"use client";

import { useEffect } from "react";

/** Banner de demo desligado — o site já é usado de verdade. */
export function DemoBanner() {
  useEffect(() => {
    document.documentElement.style.setProperty("--demo-banner-h", "0px");
  }, []);
  return null;
}
