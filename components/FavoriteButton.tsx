import { displayName } from "@/lib/utils";

type FavoriteButtonProps = {
  name: string;
  isFavorite: boolean;
  onToggle: (name: string) => void;
  className?: string;
};

export function FavoriteButton({ name, isFavorite, onToggle, className = "" }: FavoriteButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={isFavorite}
      aria-label={`Favoritar ${displayName(name)}`}
      onClick={() => onToggle(name)}
      className={`flex h-10 w-10 items-center justify-center rounded-full text-xl transition-colors hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-red-700 dark:hover:bg-zinc-800 ${
        isFavorite ? "text-amber-500" : "text-zinc-500 dark:text-zinc-400"
      } ${className}`}
    >
      <span aria-hidden="true">{isFavorite ? "★" : "☆"}</span>
    </button>
  );
}
