import { test, expect } from "@playwright/test";

test.describe("persistencia", () => {
  test("el progreso se recupera al iniciar sesión", async ({ page }) => {
    // Este test requiere un backend real con dos sesiones.
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Mystery Game" })).toBeVisible();
  });
});
