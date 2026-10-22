import type { ReactNode } from "react";
import { Button } from "@/components/Button";

type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
};

/** Estado de erro: diz o que houve e oferece uma saída. */
export function ErrorState({
  title = "Algo deu errado",
  description = "Não foi possível carregar os dados. Verifique sua conexão e tente de novo.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950"
    >
      <h2 className="text-lg font-semibold text-red-900 dark:text-red-100">{title}</h2>
      <p className="text-sm text-red-900 dark:text-red-100">{description}</p>
      {onRetry && <Button onClick={onRetry}>Tentar novamente</Button>}
    </div>
  );
}

type EmptyStateProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

/** Estado vazio: deu certo, mas não há nada para mostrar. */
export function EmptyState({ title, description, children }: EmptyStateProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && <p className="text-sm text-zinc-600 dark:text-zinc-400">{description}</p>}
      {children}
    </div>
  );
}
