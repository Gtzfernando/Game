import { GAME_STAGES } from "./game-content-data";

const EXPECTED_QR_PAYLOADS = ["TXT-1-53", "TXT-2-60", "TXT-3-45", "TXT-4-45"];

export interface ContentValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateGameContent(): ContentValidationResult {
  const errors: string[] = [];

  if (GAME_STAGES.length !== 4) {
    errors.push(`Se requieren exactamente 4 etapas, hay ${GAME_STAGES.length}.`);
  }

  const stageNumbers = GAME_STAGES.map((s) => s.stage_number).sort(
    (a, b) => a - b
  );
  for (let i = 0; i < 4; i++) {
    if (stageNumbers[i] !== i + 1) {
      errors.push(
        `La numeración de etapas debe ser 1, 2, 3, 4 sin huecos. Encontrado: ${stageNumbers.join(", ")}.`
      );
      break;
    }
  }

  const answers = new Set<string>();
  GAME_STAGES.forEach((stage) => {
    if (!stage.answer_normalized || stage.answer_normalized.trim().length === 0) {
      errors.push(`Etapa ${stage.stage_number}: respuesta vacía.`);
    }
    const normalized = stage.answer_normalized.trim().toUpperCase();
    if (answers.has(normalized)) {
      errors.push(`Etapa ${stage.stage_number}: respuesta duplicada "${normalized}".`);
    }
    answers.add(normalized);

    if (!stage.qr_payload || stage.qr_payload.trim().length === 0) {
      errors.push(`Etapa ${stage.stage_number}: payload QR vacío.`);
    }

    if (
      stage.riddle_text.includes("PENDIENTE_TRANSCRIPCION") ||
      stage.fragment_text.includes("PENDIENTE_TRANSCRIPCION") ||
      stage.location_clue.includes("PENDIENTE_TRANSCRIPCION")
    ) {
      errors.push(`Etapa ${stage.stage_number}: contiene marcador de transcripción pendiente.`);
    }

    if (!stage.riddle_text.trim()) {
      errors.push(`Etapa ${stage.stage_number}: acertijo vacío.`);
    }
    if (!stage.fragment_text.trim()) {
      errors.push(`Etapa ${stage.stage_number}: fragmento vacío.`);
    }
  });

  GAME_STAGES.forEach((stage, index) => {
    if (stage.qr_payload !== EXPECTED_QR_PAYLOADS[index]) {
      errors.push(
        `Etapa ${stage.stage_number}: payload QR "${stage.qr_payload}" no coincide con el aprobado "${EXPECTED_QR_PAYLOADS[index]}".`
      );
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

if (require.main === module) {
  const result = validateGameContent();
  if (!result.valid) {
    console.error("Errores de validación de contenido:");
    result.errors.forEach((e) => console.error(`- ${e}`));
    process.exit(1);
  }
  console.log("Contenido validado correctamente.");
}
