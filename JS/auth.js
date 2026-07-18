// ============================================================
// MaintainIQ — Login / Register (index.html)
// ============================================================

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const messageEl = document.getElementById("message");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

function showMessage(text, type) {
  messageEl.textContent = text;
  messageEl.className = "message " + (type || "");
}

function setLoading(isLoading) {
  loginBtn.disabled = isLoading;
  registerBtn.disabled = isLoading;
}

// If already logged in, skip straight to the dashboard.
(async function checkExistingSession() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session) window.location.href = "dashboard.html";
})();

loginBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    showMessage("Please enter both email and password.", "error");
    return;
  }

  setLoading(true);
  showMessage("Signing in...");

  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

  setLoading(false);

  if (error) {
    showMessage(error.message, "error");
    return;
  }

  window.location.href = "dashboard.html";
});

registerBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    showMessage("Please enter both email and password.", "error");
    return;
  }

  if (password.length < 6) {
    showMessage("Password must be at least 6 characters.", "error");
    return;
  }

  setLoading(true);
  showMessage("Creating account...");

  const { error } = await supabaseClient.auth.signUp({ email, password });

  setLoading(false);

  if (error) {
    showMessage(error.message, "error");
    return;
  }

  showMessage("Account created. You can now log in.", "success");
});

// Let Enter submit the login form
passwordInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") loginBtn.click();
});
