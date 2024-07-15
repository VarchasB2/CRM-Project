import { createClient } from "@supabase/supabase-js";
const key = process.env.NEXT_PUBLIC_SUPABASE_KEY
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
export const supabase = createClient(url!,key!)