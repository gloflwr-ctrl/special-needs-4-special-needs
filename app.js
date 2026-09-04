import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const supabase = createClient(
  window.SUPABASE_URL,
  window.SUPABASE_PUBLISHABLE_KEY
);

// ---------- Screen navigation ----------
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  const screen = document.getElementById(screenId);

  if (screen) {
    screen.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

document.addEventListener("click", event => {
  const button = event.target.closest("[data-screen]");
  if (!button) return;

  showScreen(button.dataset.screen);
});

// ---------- Security helper ----------
function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ---------- Help ----------
const saveHelp = document.getElementById("saveHelp");

if (saveHelp) {
  saveHelp.addEventListener("click", () => {
    const type = document.getElementById("helpType").value;
    const message = document.getElementById("helpMessage").value;

    localStorage.setItem(
      "supportRequest",
      JSON.stringify({
        type,
        message,
        savedAt: new Date().toISOString()
      })
    );

    document.getElementById("helpSaved").classList.remove("hidden");
  });
}

// ---------- Family Profile ----------
const saveProfile = document.getElementById("saveProfile");

if (saveProfile) {
  saveProfile.addEventListener("click", () => {
    const profile = {
      parentName: document.getElementById("parentName").value,
      memberName: document.getElementById("memberName").value,
      notes: document.getElementById("profileNotes").value
    };

    localStorage.setItem("familyProfile", JSON.stringify(profile));
    document.getElementById("profileSaved").classList.remove("hidden");
  });
}

const savedProfile = JSON.parse(
  localStorage.getItem("familyProfile") || "null"
);

if (savedProfile) {
  document.getElementById("parentName").value =
    savedProfile.parentName || "";

  document.getElementById("memberName").value =
    savedProfile.memberName || "";

  document.getElementById("profileNotes").value =
    savedProfile.notes || "";
}

// ---------- Reminders ----------
const addReminder = document.getElementById("addReminder");

function loadReminders() {
  const reminders = JSON.parse(
    localStorage.getItem("reminders") || "[]"
  );

  const list = document.getElementById("reminderList");

  if (!list) return;

  list.innerHTML = "";

  reminders.forEach((reminder, index) => {
    const item = document.createElement("div");
    item.className = "panel";

    item.innerHTML = `
      <b>${escapeHtml(reminder.text)}</b>
      <p class="muted">${escapeHtml(reminder.date || "")}</p>
      <button class="ghost delete-reminder" data-index="${index}">
        Delete
      </button>
    `;

    list.appendChild(item);
  });
}

if (addReminder) {
  addReminder.addEventListener("click", () => {
    const text = document.getElementById("reminderText").value.trim();
    const date = document.getElementById("reminderDate").value;

    if (!text) {
      alert("Please enter a reminder.");
      return;
    }

    const reminders = JSON.parse(
      localStorage.getItem("reminders") || "[]"
    );

    reminders.push({ text, date });

    localStorage.setItem("reminders", JSON
