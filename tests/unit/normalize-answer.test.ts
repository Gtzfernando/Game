import { describe, it, expect } from "vitest";
import { normalizeAnswer } from "@/lib/game/normalize-answer";

describe("normalizeAnswer", () => {
  it("convierte a mayúsculas", () => {
    expect(normalizeAnswer("ojos")).toBe("OJOS");
  });

  it("elimina espacios al inicio y final", () => {
    expect(normalizeAnswer("  nervios  ")).toBe("NERVIOS");
  });

  it("no altera respuesta ya normalizada", () => {
    expect(normalizeAnswer("DIFERENTES")).toBe("DIFERENTES");
  });

  it("conserva espacios internos", () => {
    expect(normalizeAnswer("dos palabras")).toBe("DOS PALABRAS");
  });
});
