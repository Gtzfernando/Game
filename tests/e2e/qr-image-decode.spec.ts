import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { GAME_STAGES } from "@/content/game-content-data";

function toDataUrl(filePath: string): string {
  const buffer = fs.readFileSync(filePath);
  const base64 = buffer.toString("base64");
  return `data:image/png;base64,${base64}`;
}

test.describe("decodificación de imágenes QR", () => {
  test("los QR generados se pueden leer con @zxing/browser", async ({ page }) => {
    const payloads = GAME_STAGES.map((stage) => ({
      stageNumber: stage.stage_number,
      expectedPayload: stage.qr_payload,
      dataUrl: toDataUrl(path.resolve(process.cwd(), "test-qr", `qr-stage-${stage.stage_number}-${stage.qr_payload}.png`)),
    }));

    // Construir HTML con las imágenes QR
    const imagesHtml = payloads
      .map((p) => `<img id="qr-${p.stageNumber}" src="${p.dataUrl}" alt="QR etapa ${p.stageNumber}" />`)
      .join("\n");

    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <h1>QR Test</h1>
          ${imagesHtml}
        </body>
      </html>
    `);

    // Cargar @zxing/browser desde node_modules locales
    await page.addScriptTag({
      path: path.resolve(process.cwd(), "node_modules/@zxing/browser/umd/zxing-browser.min.js"),
    });

    // Decodificar cada imagen en el contexto del navegador
    const decoded = await page.evaluate(async (stages) => {
      const reader = new (window as any).ZXingBrowser.BrowserQRCodeReader();
      const results: Array<{ stageNumber: number; expected: string; actual: string | null; error: string | null }> = [];

      for (const stage of stages) {
        try {
          const img = document.getElementById(`qr-${stage.stageNumber}`) as HTMLImageElement;
          const result = await reader.decodeFromImageElement(img);
          results.push({
            stageNumber: stage.stageNumber,
            expected: stage.expectedPayload,
            actual: result?.getText() ?? null,
            error: null,
          });
        } catch (err) {
          results.push({
            stageNumber: stage.stageNumber,
            expected: stage.expectedPayload,
            actual: null,
            error: err instanceof Error ? err.message : String(err),
          });
        }
      }

      return results;
    }, payloads.map((p) => ({ stageNumber: p.stageNumber, expectedPayload: p.expectedPayload })));

    for (const item of decoded) {
      expect(item.error, `Error en etapa ${item.stageNumber}: ${item.error}`).toBeNull();
      expect(item.actual, `No se pudo leer el QR de la etapa ${item.stageNumber}`).toBe(item.expected);
    }
  });
});
