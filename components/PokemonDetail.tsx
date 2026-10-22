"use client";

import Image from "next/image";
import Link from "next/link";
import { FavoriteButton } from "@/components/FavoriteButton";
import { DetailSkeleton, Skeleton } from "@/components/Skeleton";
import { EmptyState, ErrorState } from "@/components/StateMessage";
import { StatBar } from "@/components/StatBar";
import { TypeBadge } from "@/components/TypeBadge";
import { useFavorites } from "@/hooks/useFavorites";
import { usePokemonDetail, usePokemonIndex, usePokemonSpecies } from "@/hooks/usePokemon";
import { ApiError, pickDescription, pickGenus } from "@/lib/api";
import { artworkUrl, displayName, formatHeight, formatId, formatWeight } from "@/lib/utils";

const linkClass =
  "rounded font-medium text-red-800 underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 dark:text-red-300";

export function PokemonDetail({ name }: { name: string }) {
  const detail = usePokemonDetail(name);
  const species = usePokemonSpecies(detail.data?.species.url);
  const index = usePokemonIndex();
  const { isFavorite, toggle } = useFavorites();

  if (detail.isPending) return <DetailSkeleton />;

  if (detail.isError) {
    const notFound = detail.error instanceof ApiError && detail.error.status === 404;
    if (notFound) {
      return (
        <EmptyState
          title="Pokémon não encontrado"
          description={`Não existe nenhum Pokémon com o nome “${name}”.`}
        >
          <Link href="/" className={linkClass}>
            Voltar para a lista
          </Link>
        </EmptyState>
      );
    }
    return <ErrorState onRetry={() => detail.refetch()} />;
  }

  const pokemon = detail.data;
  const description = species.data ? pickDescription(species.data) : null;
  const genus = species.data ? pickGenus(species.data) : null;

  const list = index.data;
  const position = list ? list.findIndex((item) => item.name === pokemon.name) : -1;
  const previous = list && position > 0 ? list[position - 1] : undefined;
  const next = list && position >= 0 ? list[position + 1] : undefined;

  return (
    <article className="space-y-6">
      <nav aria-label="Navegação entre Pokémon" className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <Link href="/" className={linkClass}>
          ← Voltar para a lista
        </Link>
        <div className="flex gap-4">
          {previous && (
            <Link href={`/pokemon/${previous.name}`} className={linkClass}>
              ← {formatId(previous.id)} {displayName(previous.name)}
            </Link>
          )}
          {next && (
            <Link href={`/pokemon/${next.name}`} className={linkClass}>
              {formatId(next.id)} {displayName(next.name)} →
            </Link>
          )}
        </div>
      </nav>

      <div className="grid gap-8 rounded-3xl border border-zinc-200 bg-white p-6 md:grid-cols-2 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="relative flex items-center justify-center">
          <Image
            src={artworkUrl(pokemon.id)}
            alt={`Arte oficial de ${displayName(pokemon.name)}`}
            width={400}
            height={400}
            priority
            className="h-64 w-64 object-contain md:h-80 md:w-80"
          />
          <FavoriteButton
            name={pokemon.name}
            isFavorite={isFavorite(pokemon.name)}
            onToggle={toggle}
            className="absolute right-0 top-0"
          />
        </div>

        <div className="space-y-5">
          <header className="space-y-2">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{formatId(pokemon.id)}</p>
            <h1 className="text-3xl font-bold">{displayName(pokemon.name)}</h1>
            {genus && <p className="text-sm text-zinc-600 dark:text-zinc-400">{genus}</p>}
            <ul aria-label="Tipos" className="flex flex-wrap gap-2 pt-1">
              {pokemon.types.map((t) => (
                <li key={t.type.name}>
                  <TypeBadge type={t.type.name} />
                </li>
              ))}
            </ul>
          </header>

          {species.isPending ? (
            <div className="space-y-2" aria-hidden="true">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ) : (
            description && (
              <p className="max-w-prose text-sm leading-relaxed">
                {description}
                <span className="mt-1 block text-xs text-zinc-600 dark:text-zinc-400">
                  Texto original da PokéAPI, em inglês.
                </span>
              </p>
            )
          )}

          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-zinc-600 dark:text-zinc-400">Altura</dt>
              <dd className="font-semibold">{formatHeight(pokemon.height)}</dd>
            </div>
            <div>
              <dt className="text-zinc-600 dark:text-zinc-400">Peso</dt>
              <dd className="font-semibold">{formatWeight(pokemon.weight)}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-zinc-600 dark:text-zinc-400">Habilidades</dt>
              <dd className="font-semibold">
                {pokemon.abilities
                  .map((a) => displayName(a.ability.name) + (a.is_hidden ? " (oculta)" : ""))
                  .join(", ")}
              </dd>
            </div>
          </dl>

          <section aria-labelledby="status-titulo" className="space-y-2">
            <h2 id="status-titulo" className="text-lg font-semibold">
              Status base
            </h2>
            {pokemon.stats.map((s) => (
              <StatBar key={s.stat.name} name={s.stat.name} value={s.base_stat} />
            ))}
          </section>
        </div>
      </div>
    </article>
  );
}
