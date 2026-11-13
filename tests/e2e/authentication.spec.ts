import { test, expect } from "@playwright/test";

test.describe("autenticación", () => {
  test("usuario no autenticado es redirigido a login", async ({ page }) => {
    await page.goto("/game");
    await expect(page).toHaveURL(/.*login.*/);
  });

  test("no existe enlace de recuperación de contraseña", async ({ page }) => {
    await page.goto("/login");
    await expect(
      page.getByText(/olvidaste|recuperar|reset/i)
    ).not.toBeVisible();
  });
});
