window.DR_CONFIG = {
  SUPABASE_URL: "https://pncgbphbcmtlzrmwnhcy.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuY2dicGhiY210bHpybXduaGN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyODEwOTksImV4cCI6MjA5NDg1NzA5OX0.-JS7vYBzMJYybm5QA4RxKUA5rTa5ibR2_40W73PPYso",
  APP_NAME: "DR Screening Portal",
  ORG_NAME_TH: "มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ",
  ORG_NAME_EN: "King Mongkut's University of Technology North Bangkok",
  BUCKET_RETINA: "retina-images"
};
window.getSupabaseClient = function getSupabaseClient() {
  if (!window.supabase) {
    throw new Error("Supabase CDN is not loaded");
  }

  if (!window.__drSupabaseClient) {
    window.__drSupabaseClient = window.supabase.createClient(
      window.DR_CONFIG.SUPABASE_URL,
      window.DR_CONFIG.SUPABASE_ANON_KEY
    );
  }

  return window.__drSupabaseClient;
};