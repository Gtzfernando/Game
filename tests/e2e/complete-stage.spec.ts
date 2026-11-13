import { test, expect } from "@playwright/test";

test.describe("completar una etapa", () => {
  test("flujo completo de la etapa 1", async ({ page }) => {
    // Este test requiere un usuario autenticado y contenido sembrado.
    await page.goto("/game/stage/1");

    await expect(page.getByText(/Acertijo/)).toBeVisible();
    await page.getByPlaceholder("Escribe aquí tu respuesta").fill("OJOS");
    await page.getByRole("button", { name: "Enviar respuesta" }).click();

    await expect(page).toHaveURL(/.*\/qr/);
    await expect(page.getByText(/Respuesta correcta/)).toBeVisible();
  });
});
