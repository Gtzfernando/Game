import { redirect } from "next/navigation";
import { unstable_noStore } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
import {
  initializeProgress,
  getProgressSummary,
} from "@/lib/game/progress-service";
import { stageNumberSchema } from "@/lib/validations/stage.schema";
import { getFragmentImage } from "@/lib/content/fragment-images";
import { FragmentViewer } from "@/components/game/fragment-viewer";
import { Card } from "@/components/ui/card";

interface FragmentPageProps {
  params: Promise<{ stageNumber: string }>;
}

export default async function FragmentPage({ params }: FragmentPageProps) {
  unstable_noStore();

  const { stageNumber } = await params;
  const parsedStage = stageNumberSchema.safeParse(stageNumber);

  if (!parsedStage.success) {
    redirect("/game");
  }

  const stageNum = parsedStage.data;

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  await initializeProgress(data.user.id);
  const summary = await getProgressSummary(data.user.id);

  const stage = summary.stages.find((s) => s.stage_number === stageNum);
  const fragment = summary.fragments.find((f) => f.stage_number === stageNum);

  console.log("[FragmentPage] data", {
    userId: data.user.id,
    stageNum,
    stageState: stage?.state,
    currentStage: summary.current_stage,
    fragmentsRaw: summary.fragments.map((f) => ({ stage_number: f.stage_number, stage_id: f.stage_id, hasImage: !!f.image_url })),
    fragmentFound: !!fragment,
  });

  // Si el fragmento existe, mostrarlo siempre (más permisivo)
  if (fragment) {
    const imageUrl = fragment.image_url || getFragmentImage(stageNum) || "";
    const isFinal = stageNum === 4;

    return (
      <div className="max-w-2xl mx-auto">
        <FragmentViewer
          stageNumber={stageNum}
          fragmentText={fragment.fragment_snapshot}
          imageUrl={imageUrl}
          nextRoute={isFinal ? "/final" : `/game/stage/${stageNum + 1}`}
          nextLabel={isFinal ? "Ir al mensaje final" : "Siguiente acertijo"}
        />
      </div>
    );
  }

  // Si no hay fragmento, mostrar información de depuración
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-6">
        <h1 className="font-serif text-2xl font-semibold mb-4 text-red-600">
          Fragmento no encontrado
        </h1>
        <p className="mb-4">
          No se encontró el fragmento {stageNum} en tu progreso.
        </p>
        <div className="bg-cream p-4 rounded-organic text-sm font-mono">
          <p>Etapa buscada: {stageNum}</p>
          <p>Estado de la etapa: {stage?.state || "no encontrada"}</p>
          <p>Etapa actual: {summary.current_stage}</p>
          <p>Fragmentos desbloqueados: {summary.fragments.map((f) => f.stage_number).join(", ")}</p>
        </div>
      </Card>
    </div>
  );
}
