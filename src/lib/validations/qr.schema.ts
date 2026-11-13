import { z } from "zod";
import { MAX_QR_PAYLOAD_LENGTH } from "@/lib/constants";

export const qrSchema = z.object({
  payload: z
    .string()
    .min(1, "Código QR vacío")
    .max(MAX_QR_PAYLOAD_LENGTH, "Código QR demasiado largo"),
});

export type QrInput = z.infer<typeof qrSchema>;
