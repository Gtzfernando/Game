import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  initializeProgress,
  getProgressSummary,
} from "@/lib/game/progress-service";
import { stageNumberSchema } from "@/lib/validations/stage.schema";
import { GAME_STAGES } from "@/content/game-content-data";
import { RiddleCard } from "@/components/game/riddle-card";
import { AnswerForm } from "@/components/game/answer-form";
import { LocationClue } from "@/components/game/location-clue";
import { ProgressIndicator } from "@/components/game/progress-indicator";
import { ResetProgressButton } from "@/components/game/reset-progress-button";
import { Card } from "@/components/ui/card";

interface StagePageProps {
  params: Promise<{ stageNumber: string }>;
}

export default async function StagePage({ params }: StagePageProps) {
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

  if (summary.game_completed) {
    redirect("/final");
  }

  const stage = summary.stages.find((s) => s.stage_number === stageNum);
  const stageContent = GAME_STAGES.find((s) => s.stage_number === stageNum);

  if (!stage || stage.state === "locked" || !stageContent) {
    redirect("/game");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <ProgressIndicator stages={summary.stages} />
      <RiddleCard
        riddleText={stage.riddle_text}
        hint={stageContent.riddle_hint}
        hintsUsed={summary.hints_used}
      />
      {stage.state === "answer_pending" && <AnswerForm stageNumber={stageNum} />}
      {stage.state === "answer_correct_qr_pending" && (
        <LocationClue clue={stage.location_clue} stageNumber={stageNum} />
      )}
      {stage.state === "completed" && (
        <Card>
          <p className="font-medium text-moss">
            Esta etapa ya fue completada.
          </p>
        </Card>
      )}
      <div className="pt-4">
        <ResetProgressButton />
      </div>
    </div>
  );
}
