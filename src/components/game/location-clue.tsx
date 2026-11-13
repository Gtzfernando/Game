import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface LocationClueProps {
  clue: string;
  stageNumber: number;
}

export function LocationClue({ clue, stageNumber }: LocationClueProps) {
  return (
    <div className="space-y-4">
      <Alert variant="success">
        <p className="font-semibold mb-2">¡Respuesta correcta!</p>
        {clue ? (
          <p>{clue}</p>
        ) : (
          <p className="text-foreground-alt/70">
            Pista para encontrar el QR: (pendiente)
          </p>
        )}
      </Alert>
      <p className="text-foreground-alt">
        Escanea el QR correcto para poder seguir al siguiente nivel.
      </p>
      <Link href={`/game/stage/${stageNumber}/qr`}>
        <Button>Escanear QR</Button>
      </Link>
    </div>
  );
}
