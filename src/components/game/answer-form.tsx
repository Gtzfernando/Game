"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";

interface AnswerFormProps {
  stageNumber: number;
}

export function AnswerForm({ stageNumber }: AnswerFormProps) {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/stages/${stageNumber}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Error al validar respuesta");
        setIsLoading(false);
        return;
      }

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/game/stage/${stageNumber}/qr`);
          router.refresh();
        }, 600);
      } else {
        setError("Respuesta incorrecta. Inténtalo de nuevo.");
      }
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Tu respuesta"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Una palabra, ej: Limón"
        required
      />
      {error && <Alert variant="error">{error}</Alert>}
      {success && (
        <Alert variant="success">
          <span className="font-semibold">¡Respuesta correcta!</span> Prepara el código QR.
        </Alert>
      )}
      <Button type="submit" isLoading={isLoading}>
        Enviar respuesta
      </Button>
    </form>
  );
}
