import { Suspense } from "react";
import { PokemonDetail } from "@/components/PokemonDetail";
import { DetailSkeleton } from "@/components/Skeleton";

type PageProps = { params: Promise<{ name: string }> };

async function PokemonContent({ params }: PageProps) {
  const { name } = await params;
  return <PokemonDetail name={decodeURIComponent(name)} />;
}

export default function PokemonPage({ params }: PageProps) {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <PokemonContent params={params} />
    </Suspense>
  );
}
