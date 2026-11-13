import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env/server";
import { Database } from "./database.types";

export function createServiceClient() {
  return createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
