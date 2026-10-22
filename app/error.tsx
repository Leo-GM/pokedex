"use client";

import { ErrorState } from "@/components/StateMessage";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return <ErrorState description="Ocorreu um erro inesperado nesta página." onRetry={reset} />;
}
