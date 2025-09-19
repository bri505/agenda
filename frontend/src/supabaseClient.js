import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qhzhajwqdxwqdpxjxjzi.supabase.co"; // OJO: https://
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoemhhandxZHh3cWRweGp4anppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMzc2ODEsImV4cCI6MjA3MzgxMzY4MX0.VkorcoRtjjtV1G1jskewuyZ38lYMMCovgRJMfC5n-3c";

export const supabase = createClient(supabaseUrl, supabaseKey);
