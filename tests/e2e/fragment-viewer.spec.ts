import { test, expect } from "@playwright/test";
import { GAME_STAGES } from "@/content/game-content-data";
import { getFragmentImage } from "@/lib/content/fragment-images";

test.describe("Fragment Viewer", () => {
  for (const stage of GAME_STAGES) {
    test(`etapa ${stage.stage_number}: muestra imagen, fragmento y botones`, async ({ page }) => {
      await page.goto(`/test/fragment/${stage.stage_number}`);

      const imageUrl = getFragmentImage(stage.stage_number);
      expect(imageUrl).not.toBeNull();

      // Verificar que la imagen se carga
      const image = page.locator(`img[alt="Ilustración del fragmento ${stage.stage_number}"]`);
      await expect(image).toBeVisible();
      await expect(image).toHaveAttribute("src", /\/_next\/image/);
      const src = await image.getAttribute("src");
      expect(src).toContain(encodeURIComponent(imageUrl!));

      // Verificar que el fragmento se muestra
      await expect(page.getByText(stage.fragment_text)).toBeVisible();

      // Verificar botón de guardar
      const saveButton = page.getByRole("button", { name: /Guardar imagen/i });
      await expect(saveButton).toBeVisible();

      // Verificar botón de continuar
      const expectedNextRoute =
        stage.stage_number === 4 ? "/final" : `/game/stage/${stage.stage_number + 1}`;
      const continueLink = page.locator(`a[href="${expectedNextRoute}"]`);
      await expect(continueLink).toBeVisible();
      await expect(continueLink).toHaveText(
        stage.stage_number === 4 ? "Ir al mensaje final" : "Siguiente acertijo"
      );
    });
  }
});
