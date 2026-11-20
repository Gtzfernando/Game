import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  initializeProgress,
  getProgressSummary,
} from "@/lib/game/progress-service";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResetProgressButton } from "@/components/game/reset-progress-button";
import { FinalLetter } from "@/components/game/final-letter";

export default async function FinalPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  await initializeProgress(data.user.id);
  const summary = await getProgressSummary(data.user.id);

  if (!summary.game_completed) {
    redirect("/game");
  }

  const fragments = summary.fragments.map((f) => ({
    stage_number: f.stage_number,
    fragment_text: f.fragment_snapshot,
    image_url: f.image_url,
  }));

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <FinalLetter fragments={fragments} />

      <Card className="relative z-10">
        <h2 className="font-serif text-xl font-semibold mb-4">
          Sorpresa: el último acertijo
        </h2>
        <div className="space-y-4 leading-relaxed text-foreground-alt">
          <p>
            Cada QR que descubriste tiene un código; ese código deberás
            relacionarlo con los textos guardados en las respuestas encontradas.
          </p>
          <p>
            ¿Cómo relacionarlos? Averígualo 😉 porque ni nosotros sabemos qué hay
            oculto allí. Esa sorpresa es para los dos jugadores de este juego.
          </p>
          <p className="font-semibold">Suerte, Bay ¡¡</p>
        </div>
      </Card>

      <div className="relative z-10 flex flex-wrap gap-4">
        <Link href="/archive">
          <Button variant="secondary">Ver archivo</Button>
        </Link>
        <Link href="/game">
          <Button variant="secondary">Volver al juego</Button>
        </Link>
        <ResetProgressButton />
      </div>
    </div>
  );
}
