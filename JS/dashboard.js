// ============================================================
// MaintainIQ — Dashboard (dashboard.html)
// ============================================================

(async function init() {
  await requireAuth();
  await loadDashboard();
})();

async function loadDashboard() {
  const { count: assetCount } = await supabaseClient.from("assets").select("*", { count: "exact", head: true });
  document.getElementById("assetCount").innerText = assetCount || 0;

  const { count: issueCount } = await supabaseClient
    .from("issues")
    .select("*", { count: "exact", head: true })
    .neq("status", "Resolved");
  document.getElementById("issueCount").innerText = issueCount || 0;

  const { count: resolvedCount } = await supabaseClient
    .from("issues")
    .select("*", { count: "exact", head: true })
    .eq("status", "Resolved");
  document.getElementById("resolvedCount").innerText = resolvedCount || 0;

  const { count: maintenanceCount } = await supabaseClient
    .from("maintenance")
    .select("*", { count: "exact", head: true });
  document.getElementById("maintenanceCount").innerText = maintenanceCount || 0;
}
