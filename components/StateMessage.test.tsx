import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EmptyState, ErrorState } from "@/components/StateMessage";

describe("ErrorState", () => {
  it("avisa o erro e chama onRetry ao clicar em tentar novamente", async () => {
    const onRetry = vi.fn();
    render(<ErrorState description="Falhou." onRetry={onRetry} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Falhou.");
    await userEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});

describe("EmptyState", () => {
  it("mostra título, descrição e a ação passada como filho", () => {
    render(
      <EmptyState title="Nada por aqui" description="Tente outra busca.">
        <button type="button">Limpar filtros</button>
      </EmptyState>,
    );

    expect(screen.getByRole("heading", { name: "Nada por aqui" })).toBeInTheDocument();
    expect(screen.getByText("Tente outra busca.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Limpar filtros" })).toBeInTheDocument();
  });
});
