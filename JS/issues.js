// ============================================================
// MaintainIQ — Report Issue (report-issue.html)
// This page is reachable by the public via the QR code, so it
// does not require a login.
// ============================================================

const issueParams = new URLSearchParams(window.location.search);
const issueAssetId = issueParams.get("id");

async function submitIssue() {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const priority = document.getElementById("priority").value;

  if (!issueAssetId) {
    alert("No asset was specified. Please scan the asset's QR code again.");
    return;
  }

  if (!title) {
    alert("Please enter an issue title.");
    return;
  }

  const { data, error } = await supabaseClient
    .from("issues")
    .insert({
      asset_id: issueAssetId,
      title,
      description,
      priority,
      status: "Reported",
      reported_by: "Public User"
    })
    .select()
    .single();

  if (error) {
    alert("Could not submit issue: " + error.message);
    return;
  }

  await supabaseClient
    .from("assets")
    .update({ status: "Under Maintenance" })
    .eq("id", issueAssetId);

  await logHistory(`Issue "${title}" reported`, "issue", data.id);

  alert("Issue submitted. Thank you for the report.");
  window.location.href = "public-asset.html?id=" + issueAssetId;
}
