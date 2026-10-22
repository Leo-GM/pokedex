import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PokemonCard } from "@/components/PokemonCard";
import { renderWithClient } from "@/lib/test-utils";

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ alt, src }: { alt: string; src: string }) => <img alt={alt} src={src} />,
}));

const pikachu = {
  id: 25,
  name: "pikachu",
  height: 4,
  weight: 60,
  types: [{ slot: 1, type: { name: "electric" } }],
  stats: [],
  abilities: [],
  species: { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon-species/25/" },
};

function mockFetchOk(data: unknown) {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => data }));
}

function mockFetchFail() {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) }));
}

function renderCard(props: Partial<Parameters<typeof PokemonCard>[0]> = {}) {
  return renderWithClient(
    <ul>
      <PokemonCard name="pikachu" id={25} isFavorite={false} onToggleFavorite={() => {}} {...props} />
    </ul>,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("PokemonCard", () => {
  it("mostra o carregamento e depois os tipos (sucesso)", async () => {
    mockFetchOk(pikachu);
    renderCard();

    expect(screen.getByRole("heading", { name: "Pikachu" })).toBeInTheDocument();
    expect(screen.getByRole("status", { name: "Carregando tipos" })).toBeInTheDocument();

    expect(await screen.findByText("Elétrico")).toBeInTheDocument();
    expect(screen.queryByRole("status", { name: "Carregando tipos" })).not.toBeInTheDocument();
  });

  it("mostra erro com botão de tentar novamente quando a API falha", async () => {
    mockFetchFail();
    renderCard();

    expect(await screen.findByRole("alert")).toHaveTextContent("Falha ao carregar os tipos.");
    expect(screen.getByRole("button", { name: "Tentar novamente" })).toBeInTheDocument();
  });

  it("chama onToggleFavorite e reflete o estado em aria-pressed", async () => {
    mockFetchOk(pikachu);
    const onToggleFavorite = vi.fn();
    renderCard({ isFavorite: true, onToggleFavorite });

    const button = screen.getByRole("button", { name: "Favoritar Pikachu" });
    expect(button).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(button);
    expect(onToggleFavorite).toHaveBeenCalledWith("pikachu");
  });
});
