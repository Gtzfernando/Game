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

interface FragmentPageProps {
  params: Promise<{ stageNumber: string }>;
}

export default async function FragmentPage({ params }: FragmentPageProps) {
  unstable_noStore();

  const { stageNumber } = await params;
  const parsedStage = stageNumberSchema.safeParse(stageNumber);

  if (!parsedStage.success) {
    console.log("[FragmentPage] redirect: stageNumber invalid", stageNumber);
    redirect("/game");
  }

  const stageNum = parsedStage.data;

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    console.log("[FragmentPage] redirect: no user");
    redirect("/login");
  }

  await initializeProgress(data.user.id);
  const summary = await getProgressSummary(data.user.id);

  const stage = summary.stages.find((s) => s.stage_number === stageNum);

  console.log("[FragmentPage]", {
    stageNum,
    stageState: stage?.state,
    hasFragment: summary.fragments.some((f) => f.stage_number === stageNum),
    fragmentImageUrl: summary.fragments.find((f) => f.stage_number === stageNum)?.image_url,
    fallbackImageUrl: getFragmentImage(stageNum),
  });

  if (!stage || stage.state !== "completed") {
    console.log("[FragmentPage] redirect: stage not completed", { stageNum, state: stage?.state });
    redirect("/game");
  }

  const fragment = summary.fragments.find((f) => f.stage_number === stageNum);

  if (!fragment) {
    console.log("[FragmentPage] redirect: fragment not found", stageNum);
    redirect("/game");
  }

  const imageUrl = fragment.image_url || getFragmentImage(stageNum);

  if (!imageUrl) {
    console.log("[FragmentPage] redirect: no imageUrl", stageNum);
    redirect("/game");
  }

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
