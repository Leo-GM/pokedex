"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "pokedex:favorites";
const EMPTY: string[] = [];

const listeners = new Set<() => void>();
let cache: { raw: string | null; value: string[] } = { raw: null, value: EMPTY };

function read(): string[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    // Mantém a mesma referência enquanto o conteúdo não muda (exigência do useSyncExternalStore).
    if (raw === cache.raw) return cache.value;
    const parsed: unknown = raw ? JSON.parse(raw) : EMPTY;
    const value = Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : EMPTY;
    cache = { raw, value };
    return value;
  } catch {
    return EMPTY;
  }
}

function write(next: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage indisponível (modo privado, cota cheia): ignora em silêncio.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener); // sincroniza entre abas
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

/** Favoritos persistidos no localStorage, compartilhados entre componentes e abas. */
export function useFavorites() {
  const favorites = useSyncExternalStore(subscribe, read, () => EMPTY);

  const isFavorite = useCallback((name: string) => favorites.includes(name), [favorites]);

  const toggle = useCallback((name: string) => {
    const current = read();
    write(current.includes(name) ? current.filter((n) => n !== name) : [...current, name]);
  }, []);

  return { favorites, isFavorite, toggle };
}
