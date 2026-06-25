import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mwwzflyphqlxcvgoaakg.supabase.co";

const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13d3pmbHlwaHFseGN2Z29hYWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgzMTE2NTUsImV4cCI6MjAzMzg4NzY1NX0.sb_publishable_q9CK3Fj0Y18ueR7UarczHw_mZ3v4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
