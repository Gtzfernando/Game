import { createClient } from "@supabase/supabase-js";
import { createHmac } from "crypto";
import { GAME_STAGES } from "../src/content/game-content-data";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const hashSecret = process.env.GAME_CONTENT_HASH_SECRET;

if (!supabaseUrl || !serviceRoleKey || !hashSecret) {
  console.error("Faltan variables de entorno");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

function hashAnswer(answer: string): string {
  return createHmac("sha256", hashSecret!).update(answer).digest("hex");
}

async function main() {
  for (const stage of GAME_STAGES) {
    const answerHash = hashAnswer(stage.answer_normalized);

    const { error } = await supabase
      .from("game_stages")
      .update({
        answer_hash: answerHash,
        riddle_text: stage.riddle_text,
        qr_payload: stage.qr_payload,
        location_clue: stage.location_clue,
        fragment_text: stage.fragment_text,
      })
      .eq("stage_number", stage.stage_number);

    if (error) {
      console.error(`Error actualizando etapa ${stage.stage_number}:`, error);
      process.exit(1);
    }

    console.log(`Etapa ${stage.stage_number} actualizada. Hash: ${answerHash}`);
  }

  console.log("Contenido del juego actualizado correctamente.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
