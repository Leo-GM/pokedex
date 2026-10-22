export const POKEMON_TYPES = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
] as const;

export type PokemonType = (typeof POKEMON_TYPES)[number];

export const TYPE_LABEL: Record<PokemonType, string> = {
  normal: "Normal",
  fire: "Fogo",
  water: "Água",
  electric: "Elétrico",
  grass: "Planta",
  ice: "Gelo",
  fighting: "Lutador",
  poison: "Veneno",
  ground: "Terra",
  flying: "Voador",
  psychic: "Psíquico",
  bug: "Inseto",
  rock: "Pedra",
  ghost: "Fantasma",
  dragon: "Dragão",
  dark: "Sombrio",
  steel: "Aço",
  fairy: "Fada",
};

// Classes escritas por extenso para o Tailwind conseguir detectá-las.
// Cores escolhidas para manter contraste de texto legível (WCAG AA).
export const TYPE_STYLE: Record<PokemonType, string> = {
  normal: "bg-zinc-300 text-zinc-900",
  fire: "bg-orange-700 text-white",
  water: "bg-blue-700 text-white",
  electric: "bg-yellow-300 text-zinc-900",
  grass: "bg-green-700 text-white",
  ice: "bg-cyan-300 text-zinc-900",
  fighting: "bg-red-800 text-white",
  poison: "bg-purple-700 text-white",
  ground: "bg-amber-700 text-white",
  flying: "bg-indigo-300 text-zinc-900",
  psychic: "bg-pink-700 text-white",
  bug: "bg-lime-300 text-zinc-900",
  rock: "bg-stone-600 text-white",
  ghost: "bg-violet-800 text-white",
  dragon: "bg-indigo-700 text-white",
  dark: "bg-zinc-800 text-white",
  steel: "bg-slate-300 text-zinc-900",
  fairy: "bg-pink-300 text-zinc-900",
};

export const STAT_LABEL: Record<string, string> = {
  hp: "HP",
  attack: "Ataque",
  defense: "Defesa",
  "special-attack": "Atq. especial",
  "special-defense": "Def. especial",
  speed: "Velocidade",
};

export function isPokemonType(value: string): value is PokemonType {
  return (POKEMON_TYPES as readonly string[]).includes(value);
}

export function typeLabel(name: string): string {
  return isPokemonType(name) ? TYPE_LABEL[name] : displayName(name);
}

export function typeStyle(name: string): string {
  return isPokemonType(name) ? TYPE_STYLE[name] : "bg-zinc-300 text-zinc-900";
}

/** Extrai o id numérico do final de uma URL da PokéAPI. */
export function idFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? Number(match[1]) : NaN;
}

export function artworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

/** "mr-mime" -> "Mr Mime" */
export function displayName(name: string): string {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/** 7 -> "#0007" */
export function formatId(id: number): string {
  return `#${String(id).padStart(4, "0")}`;
}

/** A PokéAPI devolve altura em decímetros. */
export function formatHeight(decimeters: number): string {
  return `${(decimeters / 10).toFixed(1).replace(".", ",")} m`;
}

/** A PokéAPI devolve peso em hectogramas. */
export function formatWeight(hectograms: number): string {
  return `${(hectograms / 10).toFixed(1).replace(".", ",")} kg`;
}
