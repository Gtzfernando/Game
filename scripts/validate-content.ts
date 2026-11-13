import { validateGameContent } from "@/content/content-validation";

const result = validateGameContent();

if (!result.valid) {
  console.error("El contenido del juego no es válido:");
  result.errors.forEach((e) => console.error(`- ${e}`));
  process.exit(1);
}

console.log("El contenido del juego es válido.");
