export const FRAGMENT_IMAGES: Record<number, string> = {
  1: "/media/bosque-lluvioso-luna-llena.png",
  2: "/media/autobus-gato-luna.png",
  3: "/media/bosque-magico-lluvia.png",
  4: "/media/casa-japonesa-sol.png",
};

export function getFragmentImage(stageNumber: number): string | null {
  return FRAGMENT_IMAGES[stageNumber] ?? null;
}
