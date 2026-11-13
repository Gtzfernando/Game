"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TutorialPlayer } from "@/components/game/tutorial-player";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { completeTutorialAction } from "../actions";

export default function IntroPage() {
  const router = useRouter();
  const [isCompleting, setIsCompleting] = useState(false);

  async function handleComplete() {
    setIsCompleting(true);
    try {
      await completeTutorialAction();
      router.push("/game");
      router.refresh();
    } catch {
      setIsCompleting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <h1 className="font-serif text-3xl font-semibold mb-4">Tutorial</h1>
        <p className="mb-4 text-foreground-alt leading-relaxed">
          Mira este video para aprender cómo navegar y jugar.
        </p>
        <TutorialPlayer onComplete={handleComplete} />
        <div className="mt-6">
          <Button onClick={handleComplete} isLoading={isCompleting}>
            Continuar al juego
          </Button>
        </div>
      </Card>
    </div>
  );
}
