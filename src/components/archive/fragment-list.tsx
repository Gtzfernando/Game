"use client";

import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

interface Fragment {
  stage_number: number;
  fragment_text: string;
}

interface FragmentListProps {
  fragments: Fragment[];
}

export function FragmentList({ fragments }: FragmentListProps) {
  if (fragments.length === 0) {
    return <EmptyState message="Aún no has desbloqueado ningún fragmento." />;
  }

  return (
    <div className="space-y-4">
      {fragments.map((fragment) => (
        <Card key={fragment.stage_number}>
          <h3 className="font-serif text-lg font-semibold mb-2 text-moss">
            Fragmento {fragment.stage_number}
          </h3>
          <p className="leading-relaxed whitespace-pre-line text-foreground-alt">
            {fragment.fragment_text}
          </p>
        </Card>
      ))}
    </div>
  );
}
