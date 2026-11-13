import "server-only";

import { createHmac } from "crypto";
import { env } from "@/lib/env/server";

export function hashAnswer(answer: string): string {
  return createHmac("sha256", env.GAME_CONTENT_HASH_SECRET)
    .update(answer)
    .digest("hex");
}

export function verifyAnswer(answer: string, hash: string): boolean {
  return hashAnswer(answer) === hash;
}
