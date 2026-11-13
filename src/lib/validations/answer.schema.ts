import { z } from "zod";
import { MAX_ANSWER_LENGTH } from "@/lib/constants";

export const answerSchema = z.object({
  answer: z
    .string()
    .min(1, "Escribe una respuesta")
    .max(MAX_ANSWER_LENGTH, "Respuesta demasiado larga"),
});

export type AnswerInput = z.infer<typeof answerSchema>;
