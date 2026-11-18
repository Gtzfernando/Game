export const FRAGMENT_IMAGES: Record<number, string> = {
  1: "/media/Bosque lluvioso bajo la luna llena (1).png",
  2: "/media/Autobús Gato Bajo la Luna (2).png",
  3: "/media/Bosque mágico bajo la lluvia (3).png",
  4: "/media/Casa japonesa bañada por el sol (4).png",
};

export function getFragmentImage(stageNumber: number): string | null {
  return FRAGMENT_IMAGES[stageNumber] ?? null;
}
