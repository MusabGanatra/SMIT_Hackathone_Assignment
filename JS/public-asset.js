// ============================================================
// MaintainIQ — Public Asset Page (public-asset.html)
// Reachable via QR code scan. No login required.
// ============================================================

const publicParams = new URLSearchParams(window.location.search);
const publicAssetId = publicParams.get("id");

async function loadAsset() {
  const box = document.getElementById("assetData");

  if (!publicAssetId) {
    box.innerHTML = "<p>Asset ID missing from the link.</p>";
    return;
  }

  const { data, error } = await supabaseClient
    .from("assets")
    .select("*")
    .eq("id", publicAssetId)
    .single();

  if (error || !data) {
    box.innerHTML = "<p>Asset not found.</p>";
    return;
  }

  box.innerHTML = `
    <h2>${escapeHtml(data.name)}</h2>
    <div class="detail-row"><span>Asset Code</span><span>${escapeHtml(data.asset_code)}</span></div>
    <div class="detail-row"><span>Category</span><span>${escapeHtml(data.category) || "-"}</span></div>
    <div class="detail-row"><span>Location</span><span>${escapeHtml(data.location) || "-"}</span></div>
    <div class="detail-row"><span>Condition</span><span class="${badgeClass(data.condition)}">${escapeHtml(data.condition)}</span></div>
    <div class="detail-row"><span>Status</span><span class="${badgeClass(data.status)}">${escapeHtml(data.status)}</span></div>
  `;

  document.getElementById("reportBtn").href = "report-issue.html?id=" + publicAssetId;
}

loadAsset();
