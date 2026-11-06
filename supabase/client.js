(function () {
  const config = window.LIMITLESS_SUPABASE_CONFIG;
  if (!config || !window.supabase || typeof window.supabase.createClient !== "function") {
    console.error("Limitless: Supabase SDK or configuration is unavailable."); return;
  }
  if (!window.limitlessSupabase) window.limitlessSupabase = window.supabase.createClient(config.url, config.publishableKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
})();
