import Link from "next/link";

export function SiteHeader({ solid = false }: { solid?: boolean }) {
  return (
    <header
      className={
        solid
          ? "border-b border-border bg-background/95 backdrop-blur sticky top-0 z-30"
          : "absolute top-0 left-0 right-0 z-30 border-b border-white/10 bg-black/30 backdrop-blur-md"
      }
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">
            IC
          </span>
          <span className={solid ? "text-foreground" : "text-white"}>
            Ingresso Corrida
          </span>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link
            href="/inscrever"
            className="rounded-full bg-brand px-4 py-2 font-semibold text-white shadow-lg shadow-orange-900/30 hover:bg-brand-dark transition"
          >
            Comprar ingresso
          </Link>
        </nav>
      </div>
    </header>
  );
}
