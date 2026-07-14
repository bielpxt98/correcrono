import type { Metadata } from "next";
import {
  Barlow_Condensed,
  Bebas_Neue,
  Geist,
  Geist_Mono,
  Inter,
  Lora,
  Montserrat,
  Oswald,
  Playfair_Display,
  Poppins,
  Raleway,
  Roboto,
  Space_Grotesk,
} from "next/font/google";
import { DemoBanner } from "@/components/DemoBanner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const space = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: ["400"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Ingresso Corrida — Bilheteria digital",
  description: "Compre seu ingresso e garanta sua vaga na corrida",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={[
        geistSans.variable,
        geistMono.variable,
        montserrat.variable,
        oswald.variable,
        playfair.variable,
        space.variable,
        roboto.variable,
        poppins.variable,
        bebas.variable,
        raleway.variable,
        lora.variable,
        barlow.variable,
        inter.variable,
        "h-full antialiased",
      ].join(" ")}
    >
      <body
        className={["min-h-full flex flex-col", geistSans.className].join(" ")}
      >
        <span className={`${montserrat.className} hidden`} aria-hidden />
        <span className={`${oswald.className} hidden`} aria-hidden />
        <span className={`${playfair.className} hidden`} aria-hidden />
        <span className={`${space.className} hidden`} aria-hidden />
        <span className={`${roboto.className} hidden`} aria-hidden />
        <span className={`${poppins.className} hidden`} aria-hidden />
        <span className={`${bebas.className} hidden`} aria-hidden />
        <span className={`${raleway.className} hidden`} aria-hidden />
        <span className={`${lora.className} hidden`} aria-hidden />
        <span className={`${barlow.className} hidden`} aria-hidden />
        <span className={`${inter.className} hidden`} aria-hidden />
        <DemoBanner />
        {children}
      </body>
    </html>
  );
}
