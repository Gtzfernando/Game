import { z } from "zod";
import { TOTAL_STAGES } from "@/lib/constants";

export const stageNumberSchema = z.coerce
  .number()
  .int()
  .min(1)
  .max(TOTAL_STAGES);

export type StageNumberInput = z.infer<typeof stageNumberSchema>;
