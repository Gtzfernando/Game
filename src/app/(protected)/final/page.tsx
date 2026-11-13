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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <h1 className="font-serif text-3xl font-semibold mb-4">Mensaje final</h1>
        <div className="space-y-4 leading-relaxed text-foreground-alt">
          <p>
            Lograste completar este reto pero el verdadero significado es como
            descubriste cada una de las pistas los lugares que recorriste y más
            importante la persona con quien pasaste esta gran aventura así que
            ese es el verdadero premio.
          </p>
          <p className="font-semibold uppercase tracking-wide text-moss">
            PASAR BUENOS MOMENTOS CON ESA PERSONA ESPECIAL
          </p>
          <p className="font-semibold uppercase tracking-wide text-moss">
            ESTO SOLO FUE UN PRETEXTO MÁS PARA TENER UN RATITO JUNTOS DE UNA
            MANERA DIFERENTE
          </p>
        </div>
      </Card>

      <Card>
        <h2 className="font-serif text-xl font-semibold mb-4">
          Sorpresa si quieres descubrir el último acertijo
        </h2>
        <div className="space-y-4 leading-relaxed text-foreground-alt">
          <p>
            Instrucciones: Cada QR que descubriste tiene un código; ese código
            deberás relacionarlo con los textos que también están guardados en
            las respuestas encontradas.
          </p>
          <p>
            ¿Cómo relacionarlos? Averígualo 😉 porque ni nosotros sabemos qué
            hay oculto allí. Esa sorpresa es para los dos jugadores de este
            juego.
          </p>
          <p className="font-semibold">Suerte, Bay ¡¡</p>
        </div>
      </Card>

      <div className="flex flex-wrap gap-4">
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
