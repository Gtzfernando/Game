"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ImageLightbox } from "./image-lightbox";

interface Fragment {
  stage_number: number;
  fragment_text: string;
  image_url?: string | null;
}

interface FragmentListProps {
  fragments: Fragment[];
}

export function FragmentList({ fragments }: FragmentListProps) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  if (fragments.length === 0) {
    return <EmptyState message="Aún no has desbloqueado ningún fragmento." />;
  }

  return (
    <div className="space-y-6">
      {fragments.map((fragment) => (
        <Card key={fragment.stage_number}>
          <h3 className="font-serif text-lg font-semibold mb-3 text-moss">
            Fragmento {fragment.stage_number}
          </h3>

          {fragment.image_url && (
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-organic mb-4 cursor-pointer group">
              <Image
                src={fragment.image_url}
                alt={`Ilustración del fragmento ${fragment.stage_number}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 672px"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 text-white font-semibold text-sm bg-black/50 px-3 py-1.5 rounded-full transition-opacity duration-300">
                  🔍 Ver en grande
                </span>
              </div>
              <button
                onClick={() => setLightboxImage(fragment.image_url!)}
                className="absolute inset-0 sr-only"
                aria-label={`Ver ilustración del fragmento ${fragment.stage_number} en grande`}
              />
            </div>
          )}

          <p className="leading-relaxed whitespace-pre-line text-foreground-alt">
            {fragment.fragment_text}
          </p>

          {fragment.image_url && (
            <div className="mt-4">
              <Button
                variant="secondary"
                onClick={() => setLightboxImage(fragment.image_url!)}
                type="button"
              >
                🔍 Ver imagen en grande
              </Button>
            </div>
          )}
        </Card>
      ))}

      <ImageLightbox
        src={lightboxImage ?? ""}
        alt="Ilustración del fragmento"
        isOpen={!!lightboxImage}
        onClose={() => setLightboxImage(null)}
      />
    </div>
  );
}
