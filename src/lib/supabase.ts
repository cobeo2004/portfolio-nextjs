import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import { ok, err, Result } from "neverthrow";
import { errors } from "./errors";

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

type SupabaseClients = {
  public: typeof supabase;
  admin: typeof supabaseAdmin;
};

export const getSupabaseClients = (): Result<SupabaseClients, Error> => {
  try {
    return ok({ public: supabase, admin: supabaseAdmin });
  } catch (e) {
    const error = e instanceof Error ? e : errors.supabaseInit();
    return err(error);
  }
};
