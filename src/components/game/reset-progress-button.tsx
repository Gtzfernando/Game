"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { resetProgressAction } from "@/app/(protected)/game/actions";

export function ResetProgressButton() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleReset() {
    if (
      !confirm(
        "¿Estás seguro de que quieres reiniciar el juego? Se borrará todo tu progreso."
      )
    ) {
      return;
    }

    setIsLoading(true);
    await resetProgressAction();
    setIsLoading(false);
  }

  return (
    <Button onClick={handleReset} isLoading={isLoading} variant="danger">
      Reiniciar juego
    </Button>
  );
}
