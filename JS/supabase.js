// ============================================================
// MaintainIQ — Supabase client + shared helpers
// ============================================================
// 1. Create a project at https://supabase.com
// 2. Paste your Project URL and anon public key below
//    (Project Settings -> API)
// 3. Run the SQL in supabase-schema.sql (see README) in the
//    Supabase SQL editor before using this app.
// ------------------------------------------------------------

const SUPABASE_URL = "https://shucwgacwvebvvwbskfb.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_4jdh-uJT07y_vN0ndCK5ZA_6kIORKCq";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// ------------------------------------------------------------
// Auth guard — call on every page that requires a logged in user.
// Redirects to index.html (login) if there is no active session.
// ------------------------------------------------------------
async function requireAuth() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    window.location.href = "index.html";
    return null;
  }
  return session;
}

async function logout() {
  await supabaseClient.auth.signOut();
  window.location.href = "index.html";
}

// ------------------------------------------------------------
// Small shared utilities used across pages
// ------------------------------------------------------------
function formatDateTime(value) {
  if (!value) return "-";
  const d = new Date(value);
  return d.toLocaleString(undefined, {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function badgeClass(value) {
  return "badge badge-" + String(value || "").toLowerCase().replace(/\s+/g, "-");
}

// Writes one row into the history/activity log. Best-effort —
// failures here should never block the main action.
async function logHistory(action, entityType, entityId) {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    await supabaseClient.from("history").insert({
      action,
      actor: user ? user.email : "Public User",
      entity_type: entityType,
      entity_id: entityId || null
    });
  } catch (err) {
    console.warn("History log failed:", err);
  }
}

// Highlights the current page's link in the top navigation.
function markActiveNav() {
  const page = window.location.pathname.split("/").pop();
  document.querySelectorAll(".topbar nav a").forEach(link => {
    if (link.getAttribute("href") === page) {
      link.classList.add("active");
    }
  });
}
document.addEventListener("DOMContentLoaded", markActiveNav);
