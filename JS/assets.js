//============================================
// MaintainIQ — Assets Management (assets.html)
// ===========================================

let allAssets = [];

(async function init() {
  await requireAuth();
  await loadAssets();
})();

async function generateAssetCode() {
  const { count } = await supabaseClient
    .from("assets")
    .select("*", { count: "exact", head: true });

  const next = (count || 0) + 1;
  return "AST-" + String(next).padStart(4, "0");
}

async function loadAssets() {
  const tbody = document.getElementById("assetTable");
  tbody.innerHTML = `<tr><td class="empty-row" colspan="6">Loading assets...</td></tr>`;

  const { data, error } = await supabaseClient
    .from("assets")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    tbody.innerHTML = `<tr><td class="empty-row" colspan="6">Failed to load assets: ${escapeHtml(error.message)}</td></tr>`;
    return;
  }

  allAssets = data || [];
  renderAssets(allAssets);
}

function renderAssets(list) {
  const tbody = document.getElementById("assetTable");

  if (!list.length) {
    tbody.innerHTML = `<tr><td class="empty-row" colspan="6">No assets found. Add your first asset above.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(asset => `
    <tr>
      <td>${escapeHtml(asset.asset_code)}</td>
      <td>${escapeHtml(asset.name)}</td>
      <td>${escapeHtml(asset.category)}</td>
      <td>${escapeHtml(asset.location)}</td>
      <td><span class="${badgeClass(asset.status)}">${escapeHtml(asset.status)}</span></td>
      <td>
        <a href="asset-details.html?id=${asset.id}" class="btn small secondary">View</a>
        <button class="btn small danger" onclick="deleteAsset('${asset.id}')">Delete</button>
      </td>
    </tr>
  `).join("");
}

async function addAsset() {
  const name = document.getElementById("assetName").value.trim();
  const category = document.getElementById("category").value.trim();
  const location = document.getElementById("location").value.trim();
  const condition = document.getElementById("condition").value;

  if (!name) {
    alert("Asset name is required.");
    return;
  }

  const asset_code = await generateAssetCode();

  const { data: { user } } = await supabaseClient.auth.getUser();

  const { data, error } = await supabaseClient
    .from("assets")
    .insert({
      asset_code,
      name,
      category,
      location,
      condition,
      status: "Active",
      created_by: user ? user.id : null
    })
    .select()
    .single();

  if (error) {
    alert("Could not add asset: " + error.message);
    return;
  }

  await logHistory(`Asset "${name}" added`, "asset", data.id);

  document.getElementById("assetName").value = "";
  document.getElementById("category").value = "";
  document.getElementById("location").value = "";
  document.getElementById("condition").value = "Good";

  await loadAssets();
}

async function deleteAsset(id) {
  if (!confirm("Delete this asset? This cannot be undone.")) return;

  const asset = allAssets.find(a => a.id === id);

  const { error } = await supabaseClient.from("assets").delete().eq("id", id);

  if (error) {
    alert("Could not delete asset: " + error.message);
    return;
  }

  await logHistory(`Asset "${asset ? asset.name : id}" deleted`, "asset", id);
  await loadAssets();
}

function searchAsset() {
  const term = document.getElementById("searchBox").value.trim().toLowerCase();

  if (!term) {
    renderAssets(allAssets);
    return;
  }

  const filtered = allAssets.filter(asset =>
    (asset.name || "").toLowerCase().includes(term) ||
    (asset.asset_code || "").toLowerCase().includes(term) ||
    (asset.category || "").toLowerCase().includes(term) ||
    (asset.location || "").toLowerCase().includes(term)
  );

  renderAssets(filtered);
}
