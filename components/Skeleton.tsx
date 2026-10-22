export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800 ${className}`}
    />
  );
}

function CardSkeleton() {
  return (
    <li
      aria-hidden="true"
      className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <Skeleton className="mx-auto h-32 w-32 rounded-full" />
      <Skeleton className="mt-4 h-3 w-12" />
      <Skeleton className="mt-2 h-5 w-28" />
      <Skeleton className="mt-3 h-6 w-20 rounded-full" />
    </li>
  );
}

export function GridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div role="status" aria-label="Carregando Pokémon">
      <span className="sr-only">Carregando Pokémon…</span>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: count }, (_, i) => (
          <CardSkeleton key={i} />
        ))}
      </ul>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div
      role="status"
      aria-label="Carregando detalhes"
      className="grid gap-6 rounded-3xl border border-zinc-200 bg-white p-6 md:grid-cols-2 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <span className="sr-only">Carregando detalhes…</span>
      <Skeleton className="mx-auto h-64 w-64 rounded-full" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}
