const SUPABASE_URL = "https://shucwgacwvebvvwbskfb.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_4jdh-uJT07y_vN0ndCK5ZA_6kIORKCq";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);