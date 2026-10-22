import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pokédex",
  description: "Busque, filtre e favorite Pokémon com dados da PokéAPI.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
            <a
              href="#conteudo"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-20 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-zinc-900"
            >
              Ir para o conteúdo
            </a>
            <header className="border-b-4 border-red-700 bg-red-700 text-white">
              <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
                <span aria-hidden="true" className="h-6 w-6 rounded-full border-2 border-white bg-red-500" />
                <Link
                  href="/"
                  className="rounded text-xl font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Pokédex
                </Link>
              </div>
            </header>
            <main id="conteudo" className="mx-auto max-w-6xl px-4 py-8">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
