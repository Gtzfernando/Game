import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
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

  if (!stage || stage.state !== "answer_correct_qr_pending") {
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
