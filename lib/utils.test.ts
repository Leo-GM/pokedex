import { describe, expect, it } from "vitest";
import {
  displayName,
  formatHeight,
  formatId,
  formatWeight,
  idFromUrl,
  isPokemonType,
  typeLabel,
} from "@/lib/utils";

describe("utils", () => {
  it("extrai o id do final da URL da PokéAPI", () => {
    expect(idFromUrl("https://pokeapi.co/api/v2/pokemon/25/")).toBe(25);
    expect(idFromUrl("https://pokeapi.co/api/v2/pokemon/150")).toBe(150);
    expect(idFromUrl("sem-id")).toBeNaN();
  });

  it("formata nome e número", () => {
    expect(displayName("mr-mime")).toBe("Mr Mime");
    expect(formatId(7)).toBe("#0007");
  });

  it("converte altura e peso para unidades legíveis", () => {
    expect(formatHeight(4)).toBe("0,4 m");
    expect(formatWeight(60)).toBe("6,0 kg");
  });

  it("reconhece tipos válidos e traduz o rótulo", () => {
    expect(isPokemonType("fire")).toBe(true);
    expect(isPokemonType("banana")).toBe(false);
    expect(typeLabel("electric")).toBe("Elétrico");
  });
});
