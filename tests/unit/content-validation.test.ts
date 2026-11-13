import { describe, it, expect } from "vitest";
import { validateGameContent } from "@/content/content-validation";

describe("validateGameContent", () => {
  it("valida el contenido del juego", () => {
    const result = validateGameContent();
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
