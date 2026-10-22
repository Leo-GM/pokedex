"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchPokemonDetail,
  fetchPokemonIndex,
  fetchSpecies,
  fetchTypeMembers,
} from "@/lib/api";
import type { PokemonType } from "@/lib/utils";

export function usePokemonIndex() {
  return useQuery({
    queryKey: ["pokemon-index"],
    queryFn: ({ signal }) => fetchPokemonIndex(signal),
    staleTime: Infinity,
  });
}

export function usePokemonDetail(name: string) {
  return useQuery({
    queryKey: ["pokemon", name],
    queryFn: ({ signal }) => fetchPokemonDetail(name, signal),
  });
}

export function usePokemonSpecies(url: string | undefined) {
  return useQuery({
    queryKey: ["species", url],
    queryFn: ({ signal }) => fetchSpecies(url as string, signal),
    enabled: Boolean(url),
  });
}

export function useTypeMembers(type: PokemonType | null) {
  return useQuery({
    queryKey: ["type", type],
    queryFn: ({ signal }) => fetchTypeMembers(type as PokemonType, signal),
    enabled: type !== null,
    staleTime: Infinity,
  });
}
