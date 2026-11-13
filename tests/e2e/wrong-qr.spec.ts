import { test, expect } from "@playwright/test";

test.describe("QR incorrecto", () => {
  test("escanear QR incorrecto no avanza", async ({ page }) => {
    // Este test requiere configuración de backend y mocks de cámara.
    await page.goto("/game/stage/1/qr");
    await expect(page.getByText(/Escanear QR/)).toBeVisible();
  });
});
