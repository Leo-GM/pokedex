import { Suspense } from "react";
import { PokedexView } from "@/components/PokedexView";
import { GridSkeleton } from "@/components/Skeleton";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pokédex</h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          Busque, filtre e favorite Pokémon com dados da PokéAPI.
        </p>
      </div>
      {/* useSearchParams exige um Suspense por volta do componente que o usa */}
      <Suspense fallback={<GridSkeleton />}>
        <PokedexView />
      </Suspense>
    </div>
  );
}
