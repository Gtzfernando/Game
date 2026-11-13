import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  initializeProgress,
  getProgressSummary,
} from "@/lib/game/progress-service";
import { stageNumberSchema } from "@/lib/validations/stage.schema";
import { FragmentViewer } from "@/components/game/fragment-viewer";

interface FragmentPageProps {
  params: Promise<{ stageNumber: string }>;
}

export default async function FragmentPage({ params }: FragmentPageProps) {
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

  if (!stage || stage.state !== "completed") {
    redirect("/game");
  }

  const fragment = summary.fragments.find((f) => f.stage_number === stageNum);

  if (!fragment) {
    redirect("/game");
  }

  const isFinal = stageNum === 4;

  return (
    <div className="max-w-2xl mx-auto">
      <FragmentViewer
        fragmentText={fragment.fragment_snapshot}
        nextRoute={isFinal ? "/final" : `/game/stage/${stageNum + 1}`}
        nextLabel={isFinal ? "Ir al mensaje final" : "Siguiente acertijo"}
      />
    </div>
  );
}
