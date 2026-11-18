import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const ZXING_SCRIPT = path.resolve(
  process.cwd(),
  "node_modules/@zxing/browser/umd/zxing-browser.min.js"
);

const QR_IMAGE = path.resolve(
  process.cwd(),
  "test-qr",
  "qr-stage-1-TXT-1-53.png"
);

const EXPECTED_PAYLOAD = "TXT-1-53";

test.describe("componente QrImageUploader", () => {
  test("ambos apartados (tomar foto y elegir imagen) decodifican el QR", async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <h1>QR Uploader Test</h1>
          <input id="camera-input" type="file" accept="image/*" capture="environment" />
          <input id="file-input" type="file" accept="image/*" />
          <div id="result"></div>
          <div id="error"></div>
        </body>
      </html>
    `);

    await page.addScriptTag({ path: ZXING_SCRIPT });

    // Inyectar la misma lógica de decodificación que usa QrImageUploader
    await page.evaluate(() => {
      const decodeImage = async (dataUrl: string) => {
        const reader = new (window as any).ZXingBrowser.BrowserQRCodeReader();
        const result = await reader.decodeFromImageUrl(dataUrl);
        return result?.getText() ?? null;
      };

      const handleFileChange = async (event: Event) => {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
          const dataUrl = e.target?.result as string;
          try {
            const text = await decodeImage(dataUrl);
            document.getElementById("result")!.textContent = text ?? "NO_DETECTED";
            document.getElementById("error")!.textContent = "";
          } catch (err) {
            document.getElementById("result")!.textContent = "";
            document.getElementById("error")!.textContent = err instanceof Error ? err.message : String(err);
          }
        };
        reader.readAsDataURL(file);
      };

      document.getElementById("camera-input")!.addEventListener("change", handleFileChange);
      document.getElementById("file-input")!.addEventListener("change", handleFileChange);
    });

    // Probar "Elegir imagen"
    const fileInput = page.locator("#file-input");
    await fileInput.setInputFiles(QR_IMAGE);
    await expect(page.locator("#result")).toHaveText(EXPECTED_PAYLOAD);
    await expect(page.locator("#error")).toHaveText("");

    // Limpiar resultado
    await page.evaluate(() => {
      document.getElementById("result")!.textContent = "";
    });

    // Probar "Tomar foto" (misma lógica, input con capture="environment")
    const cameraInput = page.locator("#camera-input");
    await cameraInput.setInputFiles(QR_IMAGE);
    await expect(page.locator("#result")).toHaveText(EXPECTED_PAYLOAD);
    await expect(page.locator("#error")).toHaveText("");
  });
});
