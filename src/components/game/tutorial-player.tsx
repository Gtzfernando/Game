"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

interface TutorialPlayerProps {
  onComplete: () => void;
}

export function TutorialPlayer({ onComplete }: TutorialPlayerProps) {
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="space-y-4">
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full"
          controls
          onError={() => setVideoError(true)}
          onEnded={onComplete}
        >
          <source src="/media/tutorial.mp4" type="video/mp4" />
          Tu navegador no soporta videos.
        </video>
      </div>
      {videoError && (
        <Alert variant="info">
          Video pendiente de cargar. Añade el archivo en{" "}
          <code>public/media/tutorial.mp4</code>.
        </Alert>
      )}
      <Button onClick={onComplete}>Continuar al juego</Button>
    </div>
  );
}
