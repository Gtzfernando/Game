import { createServiceClient } from "@/lib/supabase/service";
import { GAME_STAGES } from "@/content/game-content";
import { getFragmentImage } from "@/lib/content/fragment-images";
import { hashAnswer } from "@/lib/game/answer-hash";

async function main() {
  const supabase = createServiceClient();

  for (const stage of GAME_STAGES) {
    const answerHash = hashAnswer(stage.answer_normalized);
    const imageUrl = getFragmentImage(stage.stage_number);

    const { error } = await supabase
      .from("game_stages")
      .update({
        answer_hash: answerHash,
        riddle_text: stage.riddle_text,
        qr_payload: stage.qr_payload,
        location_clue: stage.location_clue,
        fragment_text: stage.fragment_text,
        image_url: imageUrl,
      })
      .eq("stage_number", stage.stage_number);

    if (error) {
      console.error(`Error actualizando etapa ${stage.stage_number}:`, error);
      process.exit(1);
    }

    console.log(`Etapa ${stage.stage_number} actualizada. Hash: ${answerHash}`);
  }

  console.log("Contenido del juego sembrado correctamente.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
