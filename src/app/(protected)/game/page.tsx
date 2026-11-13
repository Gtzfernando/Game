import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  initializeProgress,
  getProgressSummary,
} from "@/lib/game/progress-service";

export default async function GamePage() {
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

  if (!summary.tutorial_completed_at) {
    redirect("/game/intro");
  }

  const currentStage = summary.stages.find(
    (s) => s.stage_number === summary.current_stage
  );

  if (!currentStage) {
    redirect("/game/stage/1");
  }

  if (currentStage.state === "answer_correct_qr_pending") {
    redirect(`/game/stage/${currentStage.stage_number}/qr`);
  }

  if (currentStage.state === "completed" && summary.current_stage < 4) {
    redirect(`/game/stage/${summary.current_stage}`);
  }

  redirect(`/game/stage/${summary.current_stage}`);
}
