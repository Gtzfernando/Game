"use server";

import { redirect } from "next/navigation";
import { getAuthenticatedUserId, markTutorialCompleted, resetPlayerProgress } from "@/lib/game/progress-service";

export async function completeTutorialAction() {
  const userId = await getAuthenticatedUserId();
  await markTutorialCompleted(userId);
}

export async function resetProgressAction() {
  const userId = await getAuthenticatedUserId();
  await resetPlayerProgress(userId);
  redirect("/game");
}
