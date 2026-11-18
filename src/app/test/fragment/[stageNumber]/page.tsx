import { FragmentViewer } from "@/components/game/fragment-viewer";
import { GAME_STAGES } from "@/content/game-content-data";
import { getFragmentImage } from "@/lib/content/fragment-images";

interface TestFragmentPageProps {
  params: Promise<{ stageNumber: string }>;
}

export default async function TestFragmentPage({ params }: TestFragmentPageProps) {
  const { stageNumber } = await params;
  const stageNum = Number.parseInt(stageNumber, 10);

  const stage = GAME_STAGES.find((s) => s.stage_number === stageNum);
  const imageUrl = getFragmentImage(stageNum);

  if (!stage || !imageUrl) {
    return <div>Etapa no encontrada</div>;
  }

  const isFinal = stageNum === 4;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <FragmentViewer
        stageNumber={stageNum}
        fragmentText={stage.fragment_text}
        imageUrl={imageUrl}
        nextRoute={isFinal ? "/final" : `/game/stage/${stageNum + 1}`}
        nextLabel={isFinal ? "Ir al mensaje final" : "Siguiente acertijo"}
      />
    </div>
  );
}
