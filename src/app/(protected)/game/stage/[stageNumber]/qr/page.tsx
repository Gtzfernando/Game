import { redirect } from "next/navigation";
import { unstable_noStore } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
import {
  initializeProgress,
  getProgressSummary,
} from "@/lib/game/progress-service";
import { stageNumberSchema } from "@/lib/validations/stage.schema";
import { QrScannerClient } from "@/components/game/qr-scanner-client";

interface QrPageProps {
  params: Promise<{ stageNumber: string }>;
}

export default async function QrPage({ params }: QrPageProps) {
  unstable_noStore();

  const { stageNumber } = await params;
  const parsedStage = stageNumberSchema.safeParse(stageNumber);

  if (!parsedStage.success) {
    console.log("[QrPage] redirect: stageNumber invalid", stageNumber);
    redirect("/game");
  }

  const stageNum = parsedStage.data;

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    console.log("[QrPage] redirect: no user");
    redirect("/login");
  }

  await initializeProgress(data.user.id);
  const summary = await getProgressSummary(data.user.id);

  const stage = summary.stages.find((s) => s.stage_number === stageNum);

  console.log("[QrPage]", {
    stageNum,
    stageState: stage?.state,
  });

  if (!stage || stage.state !== "answer_correct_qr_pending") {
    console.log("[QrPage] redirect: state not qr_pending", { stageNum, state: stage?.state });
    redirect("/game");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <QrScannerClient
        stageNumber={stageNum}
        locationClue={stage.location_clue}
      />
    </div>
  );
}
