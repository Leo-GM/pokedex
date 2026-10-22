import { idFromUrl, type PokemonType } from "@/lib/utils";

const BASE_URL = "https://pokeapi.co/api/v2";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export type PokemonIndexItem = { id: number; name: string };

export type PokemonDetailData = {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: { slot: number; type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  abilities: { ability: { name: string }; is_hidden: boolean }[];
  species: { name: string; url: string };
};

export type PokemonSpeciesData = {
  flavor_text_entries: { flavor_text: string; language: { name: string } }[];
  genera: { genus: string; language: { name: string } }[];
};

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new ApiError(response.status, `Falha ao buscar dados (${response.status})`);
  }
  return (await response.json()) as T;
}

/** Lista leve (nome + id) de todos os Pokémon base. Ids >= 10000 são formas alternativas. */
export async function fetchPokemonIndex(signal?: AbortSignal): Promise<PokemonIndexItem[]> {
  const data = await fetchJson<{ results: { name: string; url: string }[] }>(
    `${BASE_URL}/pokemon?limit=2000`,
    signal,
  );
  return data.results
    .map((item) => ({ name: item.name, id: idFromUrl(item.url) }))
    .filter((item) => Number.isFinite(item.id) && item.id < 10000);
}

export function fetchPokemonDetail(name: string, signal?: AbortSignal) {
  return fetchJson<PokemonDetailData>(`${BASE_URL}/pokemon/${encodeURIComponent(name)}`, signal);
}

export function fetchSpecies(url: string, signal?: AbortSignal) {
  if (!url.startsWith(`${BASE_URL}/`)) {
    throw new ApiError(400, "URL de espécie inválida");
  }
  return fetchJson<PokemonSpeciesData>(url, signal);
}

/** Nomes de todos os Pokémon de um tipo. */
export async function fetchTypeMembers(type: PokemonType, signal?: AbortSignal): Promise<string[]> {
  const data = await fetchJson<{ pokemon: { pokemon: { name: string } }[] }>(
    `${BASE_URL}/type/${type}`,
    signal,
  );
  return data.pokemon.map((entry) => entry.pokemon.name);
}

export function pickDescription(species: PokemonSpeciesData): string | null {
  const entry = species.flavor_text_entries.find((e) => e.language.name === "en");
  return entry ? entry.flavor_text.replace(/[\f\n\r]+/g, " ") : null;
}

export function pickGenus(species: PokemonSpeciesData): string | null {
  return species.genera.find((g) => g.language.name === "en")?.genus ?? null;
}
