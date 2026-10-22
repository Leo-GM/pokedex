import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useFavorites } from "@/hooks/useFavorites";

describe("useFavorites", () => {
  it("começa vazio", () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.favorites).toEqual([]);
  });

  it("adiciona, persiste no localStorage e remove", () => {
    const { result } = renderHook(() => useFavorites());

    act(() => result.current.toggle("pikachu"));
    expect(result.current.isFavorite("pikachu")).toBe(true);
    expect(JSON.parse(window.localStorage.getItem("pokedex:favorites") ?? "[]")).toEqual(["pikachu"]);

    act(() => result.current.toggle("pikachu"));
    expect(result.current.isFavorite("pikachu")).toBe(false);
  });
});
