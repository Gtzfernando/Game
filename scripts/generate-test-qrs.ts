import fs from "node:fs";
import path from "node:path";
import QRCode from "qrcode";
import { GAME_STAGES } from "../src/content/game-content-data";

const OUTPUT_DIR = path.resolve(process.cwd(), "test-qr");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function main() {
  for (const stage of GAME_STAGES) {
    const filename = path.join(OUTPUT_DIR, `qr-stage-${stage.stage_number}-${stage.qr_payload}.png`);
    await QRCode.toFile(filename, stage.qr_payload, {
      width: 400,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
    console.log(`Generated: ${filename} -> ${stage.qr_payload}`);
  }
  console.log(`\nAll QR codes saved to ${OUTPUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
