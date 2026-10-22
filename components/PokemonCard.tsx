"use client";

import Image from "next/image";
import Link from "next/link";
import { FavoriteButton } from "@/components/FavoriteButton";
import { Skeleton } from "@/components/Skeleton";
import { TypeBadge } from "@/components/TypeBadge";
import { usePokemonDetail } from "@/hooks/usePokemon";
import { artworkUrl, displayName, formatId } from "@/lib/utils";

type PokemonCardProps = {
  name: string;
  id: number;
  isFavorite: boolean;
  onToggleFavorite: (name: string) => void;
};

export function PokemonCard({ name, id, isFavorite, onToggleFavorite }: PokemonCardProps) {
  // Cada card busca seus próprios tipos: o cache do React Query evita pedidos repetidos.
  const { data, isPending, isError, refetch } = usePokemonDetail(name);

  return (
    <li className="relative rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <Link
        href={`/pokemon/${name}`}
        className="block rounded-t-2xl p-4 pb-2 focus-visible:outline-2 focus-visible:outline-red-700"
      >
        <Image
          src={artworkUrl(id)}
          alt=""
          width={160}
          height={160}
          className="mx-auto h-32 w-32 object-contain"
        />
        <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">{formatId(id)}</p>
        <h2 className="text-lg font-semibold">{displayName(name)}</h2>
      </Link>

      <div className="min-h-10 px-4 pb-4">
        {isPending && (
          <div role="status" aria-label="Carregando tipos" className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        )}
        {isError && (
          <div role="alert" className="flex flex-wrap items-center gap-2 text-sm">
            <span>Falha ao carregar os tipos.</span>
            <button
              type="button"
              onClick={() => refetch()}
              className="font-medium underline focus-visible:outline-2 focus-visible:outline-red-700"
            >
              Tentar novamente
            </button>
          </div>
        )}
        {data && (
          <ul aria-label="Tipos" className="flex flex-wrap gap-2">
            {data.types.map((t) => (
              <li key={t.type.name}>
                <TypeBadge type={t.type.name} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <FavoriteButton
        name={name}
        isFavorite={isFavorite}
        onToggle={onToggleFavorite}
        className="absolute right-2 top-2"
      />
    </li>
  );
}
