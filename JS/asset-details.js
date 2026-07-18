// ============================================================
// MaintainIQ — Asset Details (asset-details.html)
// ============================================================

const assetParams = new URLSearchParams(window.location.search);
const assetId = assetParams.get("id");

(async function init() {
  await requireAuth();
  await loadAssetDetails();
})();

async function loadAssetDetails() {
  const infoBox = document.getElementById("assetInfo");

  if (!assetId) {
    infoBox.innerHTML = "<p>No asset ID was provided.</p>";
    return;
  }

  const { data, error } = await supabaseClient
    .from("assets")
    .select("*")
    .eq("id", assetId)
    .single();

  if (error || !data) {
    infoBox.innerHTML = "<p>Asset not found.</p>";
    return;
  }

  infoBox.innerHTML = `
    <h2>${escapeHtml(data.name)}</h2>
    <div class="detail-row"><span>Asset Code</span><span>${escapeHtml(data.asset_code)}</span></div>
    <div class="detail-row"><span>Category</span><span>${escapeHtml(data.category) || "-"}</span></div>
    <div class="detail-row"><span>Location</span><span>${escapeHtml(data.location) || "-"}</span></div>
    <div class="detail-row"><span>Condition</span><span class="${badgeClass(data.condition)}">${escapeHtml(data.condition)}</span></div>
    <div class="detail-row"><span>Status</span><span class="${badgeClass(data.status)}">${escapeHtml(data.status)}</span></div>
    <div class="detail-row"><span>Added</span><span>${formatDateTime(data.created_at)}</span></div>
  `;

  const publicUrl = window.location.origin + window.location.pathname.replace("asset-details.html", "public-asset.html") + "?id=" + data.id;

  document.getElementById("publicLink").href = publicUrl;

  QRCode.toCanvas(document.getElementById("qrcode"), publicUrl, { width: 220 }, function (err) {
    if (err) console.error("QR generation failed:", err);
  });
}
