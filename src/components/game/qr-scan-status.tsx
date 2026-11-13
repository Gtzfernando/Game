import { QrScannerStatus } from "@/hooks/use-qr-scanner";
import { Alert } from "@/components/ui/alert";

interface QrScanStatusProps {
  status: QrScannerStatus;
  errorMessage: string | null;
}

export function QrScanStatus({ status, errorMessage }: QrScanStatusProps) {
  if (status === "error" && errorMessage) {
    return (
      <Alert variant="error">
        <p className="font-semibold">No se pudo acceder a la cámara</p>
        <p>{errorMessage}</p>
        <p className="mt-2 text-sm text-foreground-alt/70">
          Asegúrate de permitir el acceso a la cámara en la configuración de tu navegador.
        </p>
      </Alert>
    );
  }

  const messages: Record<QrScannerStatus, string> = {
    idle: "Pulsa el botón para activar la cámara.",
    requesting: "Solicitando permiso de cámara...",
    active: "Apunta la cámara al código QR.",
    detected: "Código QR detectado. Validando...",
    error: "Error de cámara.",
  };

  return <Alert variant="info">{messages[status]}</Alert>;
}
