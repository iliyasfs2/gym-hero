import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mwwzflyphqlxcvgoaakg.supabase.co";


const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13d3pmbHlwaHFseGN2Z29hYWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMzg0MzgsImV4cCI6MjA5NzgxNDQzOH0.vbzvYapsH0cRqznu2ixrNmNxwten7H1damfQZEHES_A";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
