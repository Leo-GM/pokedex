"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/Button";
import { PokemonCard } from "@/components/PokemonCard";
import { GridSkeleton } from "@/components/Skeleton";
import { EmptyState, ErrorState } from "@/components/StateMessage";
import { Toast } from "@/components/Toast";
import { useDebounce } from "@/hooks/useDebounce";
import { useFavorites } from "@/hooks/useFavorites";
import { usePokemonIndex, useTypeMembers } from "@/hooks/usePokemon";
import type { PokemonIndexItem } from "@/lib/api";
import { POKEMON_TYPES, TYPE_LABEL, TYPE_STYLE, displayName, isPokemonType } from "@/lib/utils";

const PAGE_SIZE = 24;

const inputClass =
  "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700";

function buildUrl(pathname: string, params: URLSearchParams) {
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

type TypeChipProps = { label: string; active: boolean; style?: string; onClick: () => void };

function TypeChip({ label, active, style, onClick }: TypeChipProps) {
  const activeClass = style ?? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900";
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 ${
        active
          ? `${activeClass} ring-2 ring-zinc-900 ring-offset-2 dark:ring-zinc-100 dark:ring-offset-zinc-950`
          : "border border-zinc-300 bg-white hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
      }`}
    >
      {label}
    </button>
  );
}

export function PokedexView() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  // Os filtros vivem na URL: dá para recarregar, voltar e compartilhar o link.
  const q = params.get("q") ?? "";
  const typeParam = params.get("tipo");
  const type = typeParam && isPokemonType(typeParam) ? typeParam : null;
  const onlyFavorites = params.get("favoritos") === "1";
  const sort = params.get("ordem") === "nome" ? "nome" : "id";

  const [input, setInput] = useState(q);
  const debouncedInput = useDebounce(input, 300);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [toast, setToast] = useState<string | null>(null);

  const index = usePokemonIndex();
  const typeQuery = useTypeMembers(type);
  const { favorites, isFavorite, toggle } = useFavorites();

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      router.replace(buildUrl(pathname, next), { scroll: false });
    },
    [params, pathname, router],
  );

  // Passa o texto digitado para a URL só depois de a pessoa parar de digitar.
  useEffect(() => {
    const next = new URLSearchParams(window.location.search);
    const term = debouncedInput.trim();
    if ((next.get("q") ?? "") === term) return;
    if (term) next.set("q", term);
    else next.delete("q");
    router.replace(buildUrl(pathname, next), { scroll: false });
  }, [debouncedInput, pathname, router]);

  // Esconde o aviso depois de alguns segundos.
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  // Voltar para a primeira "página" sempre que um filtro mudar.
  const filterKey = [q, type, onlyFavorites, sort].join("|");
  const [previousKey, setPreviousKey] = useState(filterKey);
  if (previousKey !== filterKey) {
    setPreviousKey(filterKey);
    setVisible(PAGE_SIZE);
  }

  const typeNames = useMemo(() => new Set(typeQuery.data ?? []), [typeQuery.data]);

  const filtered = useMemo(() => {
    let list: PokemonIndexItem[] = index.data ?? [];
    const term = q.trim().toLowerCase();
    if (term) list = list.filter((p) => p.name.includes(term) || String(p.id) === term);
    if (type) list = list.filter((p) => typeNames.has(p.name));
    if (onlyFavorites) list = list.filter((p) => favorites.includes(p.name));
    if (sort === "nome") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [index.data, q, type, typeNames, onlyFavorites, favorites, sort]);

  function handleToggle(name: string) {
    const wasFavorite = isFavorite(name);
    toggle(name);
    setToast(
      wasFavorite
        ? `${displayName(name)} removido dos favoritos`
        : `${displayName(name)} adicionado aos favoritos`,
    );
  }

  function clearFilters() {
    setInput("");
    router.replace(pathname, { scroll: false });
  }

  const shown = filtered.slice(0, visible);
  const hasMore = shown.length < filtered.length;

  let content: ReactNode;
  let summary = "";

  if (index.isPending || (type && typeQuery.isPending)) {
    content = <GridSkeleton />;
  } else if (index.isError) {
    content = (
      <ErrorState
        description="Não foi possível carregar a lista de Pokémon. Verifique sua conexão e tente de novo."
        onRetry={() => index.refetch()}
      />
    );
  } else if (typeQuery.isError) {
    content = (
      <ErrorState
        description="Não foi possível carregar os Pokémon desse tipo."
        onRetry={() => typeQuery.refetch()}
      />
    );
  } else if (filtered.length === 0) {
    const noFavoritesYet = onlyFavorites && favorites.length === 0;
    content = (
      <EmptyState
        title={noFavoritesYet ? "Nenhum favorito ainda" : "Nenhum Pokémon encontrado"}
        description={
          noFavoritesYet
            ? "Toque na estrela de um card para salvar o Pokémon aqui."
            : "Nenhum resultado para esses filtros. Tente outro nome ou limpe os filtros."
        }
      >
        <Button variant="secondary" onClick={clearFilters}>
          Limpar filtros
        </Button>
      </EmptyState>
    );
  } else {
    summary = `Mostrando ${shown.length} de ${filtered.length} Pokémon`;
    content = (
      <>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {shown.map((p) => (
            <PokemonCard
              key={p.name}
              name={p.name}
              id={p.id}
              isFavorite={isFavorite(p.name)}
              onToggleFavorite={handleToggle}
            />
          ))}
        </ul>
        {hasMore && (
          <div className="flex justify-center">
            <Button variant="secondary" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
              Carregar mais
            </Button>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="space-y-6">
      <section aria-label="Filtros" className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="busca" className="mb-1 block text-sm font-medium">
              Buscar por nome ou número
            </label>
            <input
              id="busca"
              type="search"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ex.: pikachu ou 25"
              className={`w-full ${inputClass}`}
            />
          </div>
          <div>
            <label htmlFor="ordem" className="mb-1 block text-sm font-medium">
              Ordenar por
            </label>
            <select
              id="ordem"
              value={sort}
              onChange={(e) => setParam("ordem", e.target.value === "nome" ? "nome" : "")}
              className={`w-full sm:w-auto ${inputClass}`}
            >
              <option value="id">Número</option>
              <option value="nome">Nome (A–Z)</option>
            </select>
          </div>
          <Button
            variant={onlyFavorites ? "primary" : "secondary"}
            aria-pressed={onlyFavorites}
            onClick={() => setParam("favoritos", onlyFavorites ? "" : "1")}
          >
            ★ Só favoritos ({favorites.length})
          </Button>
        </div>

        <div role="group" aria-label="Filtrar por tipo" className="flex flex-wrap gap-2">
          <TypeChip label="Todos os tipos" active={type === null} onClick={() => setParam("tipo", "")} />
          {POKEMON_TYPES.map((t) => (
            <TypeChip
              key={t}
              label={TYPE_LABEL[t]}
              style={TYPE_STYLE[t]}
              active={type === t}
              onClick={() => setParam("tipo", type === t ? "" : t)}
            />
          ))}
        </div>
      </section>

      <p aria-live="polite" className="min-h-5 text-sm text-zinc-600 dark:text-zinc-400">
        {summary}
      </p>

      {content}

      {toast && <Toast message={toast} />}
    </div>
  );
}
