// ============================================================
// MaintainIQ — History Timeline (history.html)
// ============================================================

(async function init() {
  await requireAuth();
  await loadHistory();
})();

async function loadHistory() {
  const tbody = document.getElementById("historyTable");
  tbody.innerHTML = `<tr><td class="empty-row" colspan="3">Loading history...</td></tr>`;

  const { data, error } = await supabaseClient
    .from("history")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    tbody.innerHTML = `<tr><td class="empty-row" colspan="3">Failed to load history: ${escapeHtml(error.message)}</td></tr>`;
    return;
  }

  if (!data.length) {
    tbody.innerHTML = `<tr><td class="empty-row" colspan="3">No activity recorded yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = data.map(entry => `
    <tr>
      <td>${escapeHtml(entry.action)}</td>
      <td>${escapeHtml(entry.actor)}</td>
      <td>${formatDateTime(entry.created_at)}</td>
    </tr>
  `).join("");
}
