// ============================================================
// MaintainIQ — Maintenance Management (maintenance.html)
// ============================================================

(async function init() {
  await requireAuth();
  await loadIssues();
})();

async function loadIssues() {
  const tbody = document.getElementById("maintenanceTable");
  tbody.innerHTML = `<tr><td class="empty-row" colspan="4">Loading issues...</td></tr>`;

  const { data, error } = await supabaseClient
    .from("issues")
    .select("*, assets(name, asset_code)")
    .neq("status", "Resolved")
    .order("reported_at", { ascending: false });

  if (error) {
    tbody.innerHTML = `<tr><td class="empty-row" colspan="4">Failed to load issues: ${escapeHtml(error.message)}</td></tr>`;
    return;
  }

  if (!data.length) {
    tbody.innerHTML = `<tr><td class="empty-row" colspan="4">No open issues. Everything is up and running.</td></tr>`;
    return;
  }

  tbody.innerHTML = data.map(issue => `
    <tr>
      <td>
        ${escapeHtml(issue.title)}
        <br><span style="color:var(--text-400);font-size:0.78rem;">${issue.assets ? escapeHtml(issue.assets.asset_code) + " · " + escapeHtml(issue.assets.name) : "Unknown asset"}</span>
      </td>
      <td><span class="${badgeClass(issue.priority)}">${escapeHtml(issue.priority)}</span></td>
      <td><span class="${badgeClass(issue.status)}">${escapeHtml(issue.status)}</span></td>
      <td>
        ${issue.status === "Reported" ? `<button class="btn small secondary" onclick="markInProgress('${issue.id}')">Start Work</button>` : ""}
        <button class="btn small" onclick="resolveIssue('${issue.id}', '${issue.asset_id}')">Resolve</button>
      </td>
    </tr>
  `).join("");
}

async function markInProgress(issueId) {
  const { error } = await supabaseClient
    .from("issues")
    .update({ status: "In Progress" })
    .eq("id", issueId);

  if (error) {
    alert("Could not update issue: " + error.message);
    return;
  }

  await logHistory("Issue moved to In Progress", "issue", issueId);
  await loadIssues();
}

async function resolveIssue(issueId, assetId) {
  const actionTaken = prompt("Describe the maintenance action taken:");
  if (actionTaken === null) return;

  const costInput = prompt("Cost of maintenance (optional, numbers only):", "0");
  const cost = costInput && !isNaN(parseFloat(costInput)) ? parseFloat(costInput) : 0;

  const { data: { user } } = await supabaseClient.auth.getUser();

  const { error: updateError } = await supabaseClient
    .from("issues")
    .update({ status: "Resolved", resolved_at: new Date().toISOString() })
    .eq("id", issueId);

  if (updateError) {
    alert("Could not resolve issue: " + updateError.message);
    return;
  }

  const { error: maintError } = await supabaseClient
    .from("maintenance")
    .insert({
      issue_id: issueId,
      asset_id: assetId,
      action_taken: actionTaken || "Resolved",
      performed_by: user ? user.id : null,
      cost
    });

  if (maintError) {
    alert("Issue resolved, but maintenance record failed: " + maintError.message);
  }

  await supabaseClient
    .from("assets")
    .update({ status: "Active" })
    .eq("id", assetId);

  await logHistory("Issue resolved", "issue", issueId);
  await loadIssues();
}
