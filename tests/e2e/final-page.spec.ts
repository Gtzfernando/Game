import { test, expect } from "@playwright/test";

test.describe("página final", () => {
  test("no se puede acceder antes de completar el juego", async ({ page }) => {
    await page.goto("/final");
    await expect(page).not.toHaveURL("/final");
  });

  test("no existe campo de poema final", async ({ page }) => {
    // Este test requiere una cuenta con juego completado.
    await page.goto("/final");
    await expect(page.locator('input[type="text"]')).not.toBeVisible();
  });
});
