
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

// ---------- Help request ----------
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

// Load saved profile
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

    localStorage.setItem("reminders", JSON.stringify(reminders));

    document.getElementById("reminderText").value = "";
    document.getElementById("reminderDate").value = "";

    loadReminders();
  });
}

document.addEventListener("click", event => {
  const deleteButton = event.target.closest(".delete-reminder");

  if (!deleteButton) return;

  const reminders = JSON.parse(
    localStorage.getItem("reminders") || "[]"
  );

  reminders.splice(Number(deleteButton.dataset.index), 1);

  localStorage.setItem("reminders", JSON.stringify(reminders));

  loadReminders();
});

loadReminders();

// ---------- Resources ----------
const resources = [
  {
    title: "School Support",
    category: "school",
    description: "Information and support for families navigating school services."
  },
  {
    title: "Caregiver Support",
    category: "care",
    description: "Support and information for parents and caregivers."
  },
  {
    title: "Financial Assistance",
    category: "financial",
    description: "Programs that may help families with everyday expenses."
  }
];

function renderResources(filter = "all", search = "") {
  const list = document.getElementById("resourceList");
  if (!list) return;

  const term = search.toLowerCase();

  const filtered = resources.filter(resource => {
    const categoryMatch =
      filter === "all" || resource.category === filter;

    const searchMatch =
      !term ||
      resource.title.toLowerCase().includes(term) ||
      resource.description.toLowerCase().includes(term);

    return categoryMatch && searchMatch;
  });

  list.innerHTML = filtered
    .map(
      resource => `
        <div class="panel">
          <h3>${escapeHtml(resource.title)}</h3>
          <p>${escapeHtml(resource.description)}</p>
        </div>
      `
    )
    .join("");
}

document.querySelectorAll("[data-filter]").forEach(button => {
  button.addEventListener("click", () => {
    renderResources(
      button.dataset.filter,
      document.getElementById("resourceSearch").value
    );
  });
});

const resourceSearch = document.getElementById("resourceSearch");

if (resourceSearch) {
  resourceSearch.addEventListener("input", () => {
    renderResources("all", resourceSearch.value);
  });
}

renderResources();

// ---------- Family Support ----------
const saveSupport = document.getElementById("saveSupport");

if (saveSupport) {
  saveSupport.addEventListener("click", () => {
    const note = document.getElementById("supportNote").value;

    localStorage.setItem("supportNote", note);

    saveSupport.textContent = "Saved!";
    setTimeout(() => {
      saveSupport.textContent = "Save Note";
    }, 1500);
  });
}

const savedSupportNote = localStorage.getItem("supportNote");

if (savedSupportNote !== null) {
  document.getElementById("supportNote").value = savedSupportNote;
}

// ---------- Emergency Card ----------
const saveEmergency = document.getElementById("saveEmergency");

function updateEmergencyCard() {
  const data = JSON.parse(
    localStorage.getItem("emergencyCard") || "null"
  );

  if (!data) return;

  document.getElementById("cardName").textContent =
    data.name || "Not entered";

  document.getElementById("cardNotes").textContent =
    data.notes || "Not entered";

  document.getElementById("cardContact").textContent =
    data.contact || "Not entered";

  document.getElementById("emName").value = data.name || "";
  document.getElementById("emNotes").value = data.notes || "";
  document.getElementById("emContact").value = data.contact || "";
}

if (saveEmergency) {
  saveEmergency.addEventListener("click", () => {
    const data = {
      name: document.getElementById("emName").value,
      notes: document.getElementById("emNotes").value,
      contact: document.getElementById("emContact").value
    };

    localStorage.setItem("emergencyCard", JSON.stringify(data));

    updateEmergencyCard();

    saveEmergency.textContent = "Saved!";
    setTimeout(() => {
      saveEmergency.textContent = "Save Emergency Card";
    }, 1500);
  });
}

updateEmergencyCard();

// ---------- Account / Supabase ----------
const authForm = document.getElementById("authForm");
const signUpBtn = document.getElementById("signUpBtn");
const resetPasswordBtn = document.getElementById("resetPasswordBtn");
const signOutBtn = document.getElementById("signOutBtn");

function showAuthMessage(message, success = true) {
  const box = document.getElementById("authMessage");

  if (!box) return;

  box.textContent = message;
  box.classList.remove("hidden");

  if (!success) {
    box.style.color = "crimson";
  } else {
    box.style.color = "";
  }
}

function updateAuthUI(session) {
  const status = document.getElementById("authStatus");
  const accountBtn =
