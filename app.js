import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const supabase = createClient(
  window.SUPABASE_URL,
  window.SUPABASE_PUBLISHABLE_KEY
);

// ---------- Security helper ----------
function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

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

// ---------- Help ----------
const saveHelp = document.getElementById("saveHelp");

if (saveHelp) {
  saveHelp.addEventListener("click", () => {
    const typeElement = document.getElementById("helpType");
    const messageElement = document.getElementById("helpMessage");

    const type = typeElement ? typeElement.value : "";
    const message = messageElement ? messageElement.value : "";

    localStorage.setItem(
      "supportRequest",
      JSON.stringify({
        type,
        message,
        savedAt: new Date().toISOString()
      })
    );

    const saved = document.getElementById("helpSaved");

    if (saved) {
      saved.classList.remove("hidden");
    }
  });
}

// ---------- Family Profile ----------
const saveProfile = document.getElementById("saveProfile");

if (saveProfile) {
  saveProfile.addEventListener("click", () => {
    const parent = document.getElementById("parentName");
    const member = document.getElementById("memberName");
    const notes = document.getElementById("profileNotes");

    const profile = {
      parentName: parent ? parent.value : "",
      memberName: member ? member.value : "",
      notes: notes ? notes.value : ""
    };

    localStorage.setItem("familyProfile", JSON.stringify(profile));

    const saved = document.getElementById("profileSaved");

    if (saved) {
      saved.classList.remove("hidden");
    }
  });
}

const savedProfile = JSON.parse(
  localStorage.getItem("familyProfile") || "null"
);

if (savedProfile) {
  const parent = document.getElementById("parentName");
  const member = document.getElementById("memberName");
  const notes = document.getElementById("profileNotes");

  if (parent) parent.value = savedProfile.parentName || "";
  if (member) member.value = savedProfile.memberName || "";
  if (notes) notes.value = savedProfile.notes || "";
}

// ---------- Reminders ----------
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

const addReminder = document.getElementById("addReminder");

if (addReminder) {
  addReminder.addEventListener("click", () => {
    const textElement = document.getElementById("reminderText");
    const dateElement = document.getElementById("reminderDate");

    const text = textElement ? textElement.value.trim() : "";
    const date = dateElement ? dateElement.value : "";

    if (!text) {
      alert("Please enter a reminder.");
      return;
    }

    const reminders = JSON.parse(
      localStorage.getItem("reminders") || "[]"
    );

    reminders.push({
      text,
      date
    });

    localStorage.setItem(
      "reminders",
      JSON.stringify(reminders)
    );

    if (textElement) textElement.value = "";
    if (dateElement) dateElement.value = "";

    loadReminders();
  });
}

document.addEventListener("click", event => {
  const deleteButton = event.target.closest(".delete-reminder");

  if (!deleteButton) return;

  const reminders = JSON.parse(
    localStorage.getItem("reminders") || "[]"
  );

  const index = Number(deleteButton.dataset.index);

  reminders.splice(index, 1);

  localStorage.setItem(
    "reminders",
    JSON.stringify(reminders)
  );

  loadReminders();
});

loadReminders();

// ---------- Resources ----------
const resources = [
  {
    title: "School Support",
    category: "school",
    description:
      "Information and support for families navigating school services."
  },
  {
    title: "Caregiver Support",
    category: "care",
    description:
      "Support and information for parents and caregivers."
  },
  {
    title: "Financial Assistance",
    category: "financial",
    description:
      "Programs that may help families with everyday expenses."
  }
];

function renderResources(filter = "all", search = "") {
  const list = document.getElementById("resourceList");

  if (!list) return;

  const term = search.toLowerCase();

  const filtered = resources.filter(resource => {
    const categoryMatch =
      filter === "all" ||
      resource.category === filter;

    const searchMatch =
      !term ||
      resource.title.toLowerCase().includes(term) ||
      resource.description.toLowerCase().includes(term);

    return categoryMatch && searchMatch;
  });

  list.innerHTML = filtered
    .map(resource => `
      <div class="panel">
        <h3>${escapeHtml(resource.title)}</h3>
        <p>${escapeHtml(resource.description)}</p>
      </div>
    `)
    .join("");
}

document.querySelectorAll("[data-filter]").forEach(button => {
  button.addEventListener("click", () => {
    const searchElement =
      document.getElementById("resourceSearch");

    renderResources(
      button.dataset.filter,
      searchElement ? searchElement.value : ""
    );
  });
});

const resourceSearch =
  document.getElementById("resourceSearch");

if (resourceSearch) {
  resourceSearch.addEventListener("input", () => {
    renderResources("all", resourceSearch.value);
  });
}

renderResources();

// ---------- Family Support ----------
const saveSupport =
  document.getElementById("saveSupport");

if (saveSupport) {
  saveSupport.addEventListener("click", () => {
    const noteElement =
      document.getElementById("supportNote");

    const note = noteElement ? noteElement.value : "";

    localStorage.setItem("supportNote", note);

    saveSupport.textContent = "Saved!";

    setTimeout(() => {
      saveSupport.textContent = "Save Note";
    }, 1500);
  });
}

const savedSupportNote =
  localStorage.getItem("supportNote");

if (savedSupportNote !== null) {
  const noteElement =
    document.getElementById("supportNote");

  if (noteElement) {
    noteElement.value = savedSupportNote;
  }
}

// ---------- Emergency Card ----------
function updateEmergencyCard() {
  const data = JSON.parse(
    localStorage.getItem("emergencyCard") || "null"
  );

  if (!data) return;

  const cardName =
    document.getElementById("cardName");

  const cardNotes =
    document.getElementById("cardNotes");

  const cardContact =
    document.getElementById("cardContact");

  const emName =
    document.getElementById("emName");

  const emNotes =
    document.getElementById("emNotes");

  const emContact =
    document.getElementById("emContact");

  if (cardName)
    cardName.textContent = data.name || "Not entered";

  if (cardNotes)
    cardNotes.textContent = data.notes || "Not entered";

  if (cardContact)
    cardContact.textContent =
      data.contact || "Not entered";

  if (emName)
    emName.value = data.name || "";

  if (emNotes)
    emNotes.value = data.notes || "";

  if (emContact)
    emContact.value = data.contact || "";
}

const saveEmergency =
  document.getElementById("saveEmergency");

if (saveEmergency) {
  saveEmergency.addEventListener("click", () => {
    const nameElement =
      document.getElementById("emName");

    const notesElement =
      document.getElementById("emNotes");

    const contactElement =
      document.getElementById("emContact");

    const data = {
      name: nameElement ? nameElement.value : "",
      notes: notesElement ? notesElement.value : "",
      contact: contactElement ? contactElement.value : ""
    };

    localStorage.setItem(
      "emergencyCard",
      JSON.stringify(data)
    );

    updateEmergencyCard();

    saveEmergency.textContent = "Saved!";

    setTimeout(() => {
      saveEmergency.textContent =
        "Save Emergency Card";
    }, 1500);
  });
}

updateEmergencyCard();

// ---------- Account ----------
const authForm =
  document.getElementById("authForm");

const signUpBtn =
  document.getElementById("signUpBtn");

const resetPasswordBtn =
  document.getElementById("resetPasswordBtn");

const signOutBtn =
  document.getElementById("signOutBtn");

const accountBtn =
  document.getElementById("accountBtn");

function showAuthMessage(message, success = true) {
  const box =
    document.getElementById("authMessage");

  if (!box) return;

  box.textContent = message;
  box.classList.remove("hidden");

  box.style.color =
    success ? "" : "crimson";
}

function updateAuthUI(session) {
  const status =
    document.getElementById("authStatus");

  if (session && session.user) {
    if (status) {
      status.textContent =
        `Signed in as ${session.user.email}`;
    }

    if (signOutBtn) {
      signOutBtn.classList.remove("hidden");
    }

    if (accountBtn) {
      accountBtn.textContent = "Account";
    }
  } else {
    if (status) {
      status.textContent =
        "Create an account or sign in to sync your family information securely with the app.";
    }

    if (signOutBtn) {
      signOutBtn.classList.add("hidden");
    }

    if (accountBtn) {
      accountBtn.textContent = "Sign in";
    }
  }
}

if (accountBtn) {
  accountBtn.addEventListener("click", () => {
    showScreen("account");
  });
}

if (authForm) {
  authForm.addEventListener("submit", async event => {
    event.preventDefault();

    const emailElement =
      document.getElementById("authEmail");

    const passwordElement =
      document.getElementById("authPassword");

    const email =
      emailElement ? emailElement.value.trim() : "";

    const password =
      passwordElement ? passwordElement.value : "";

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password
      });

    if (error) {
      showAuthMessage(error.message, false);
      return;
    }

    updateAuthUI(data.session);

    showAuthMessage("You are signed in.");
  });
}

if (signUpBtn) {
  signUpBtn.addEventListener("click", async () => {
    const emailElement =
      document.getElementById("authEmail");

    const passwordElement =
      document.getElementById("authPassword");

    const email =
      emailElement ? emailElement.value.trim() : "";

    const password =
      passwordElement ? passwordElement.value : "";

    if (!email || !password) {
      showAuthMessage(
        "Please enter your email and password.",
        false
      );
      return;
    }

    const { error } =
      await supabase.auth.signUp({
        email,
        password
      });

    if (error) {
      showAuthMessage(error.message, false);
      return;
    }

    showAuthMessage(
      "Account created. Check your email if confirmation is required."
    );
  });
}

if (resetPasswordBtn) {
  resetPasswordBtn.addEventListener("click", async () => {
    const emailElement =
      document.getElementById("authEmail");

    const email =
      emailElement ? emailElement.value.trim() : "";

    if (!email) {
      showAuthMessage(
        "Enter your email address first.",
        false
      );
      return;
    }

    const { error } =
      await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      showAuthMessage(error.message, false);
      return;
    }

    showAuthMessage(
      "Password reset instructions have been sent to your email."
    );
  });
}

if (signOutBtn) {
  signOutBtn.addEventListener("click", async () => {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      showAuthMessage(error.message, false);
      return;
    }

    updateAuthUI(null);

    showAuthMessage("You have been signed out.");
  });
}

supabase.auth.getSession().then(({ data }) => {
  updateAuthUI(data.session);
});

supabase.auth.onAuthStateChange(
  (_event, session) => {
    updateAuthUI(session);
  }
);

// ---------- Install button ----------
let deferredPrompt = null;

window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();

  deferredPrompt = event;

  const installBtn =
    document.getElementById("installBtn");

  if (installBtn) {
    installBtn.classList.remove("hidden");
  }
});

const installBtn =
  document.getElementById("installBtn");

if (installBtn) {
  installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    await deferredPrompt.userChoice;

    deferredPrompt = null;

    installBtn.classList.add("hidden");
  });
}// ---------- Family Profile ----------
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
                         import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const supabase = createClient(
  window.SUPABASE_URL,
  window.SUPABASE_PUBLISHABLE_KEY
);

// ---------- Security helper ----------
function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

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

// ---------- Help ----------
const saveHelp = document.getElementById("saveHelp");

if (saveHelp) {
  saveHelp.addEventListener("click", () => {
    const typeElement = document.getElementById("helpType");
    const messageElement = document.getElementById("helpMessage");

    const type = typeElement ? typeElement.value : "";
    const message = messageElement ? messageElement.value : "";

    localStorage.setItem(
      "supportRequest",
      JSON.stringify({
        type,
        message,
        savedAt: new Date().toISOString()
      })
    );

    const saved = document.getElementById("helpSaved");

    if (saved) {
      saved.classList.remove("hidden");
    }
  });
}

// ---------- Family Profile ----------
const saveProfile = document.getElementById("saveProfile");

if (saveProfile) {
  saveProfile.addEventListener("click", () => {
    const parent = document.getElementById("parentName");
    const member = document.getElementById("memberName");
    const notes = document.getElementById("profileNotes");

    const profile = {
      parentName: parent ? parent.value : "",
      memberName: member ? member.value : "",
      notes: notes ? notes.value : ""
    };

    localStorage.setItem("familyProfile", JSON.stringify(profile));

    const saved = document.getElementById("profileSaved");

    if (saved) {
      saved.classList.remove("hidden");
    }
  });
}

const savedProfile = JSON.parse(
  localStorage.getItem("familyProfile") || "null"
);

if (savedProfile) {
  const parent = document.getElementById("parentName");
  const member = document.getElementById("memberName");
  const notes = document.getElementById("profileNotes");

  if (parent) parent.value = savedProfile.parentName || "";
  if (member) member.value = savedProfile.memberName || "";
  if (notes) notes.value = savedProfile.notes || "";
}

// ---------- Reminders ----------
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

const addReminder = document.getElementById("addReminder");

if (addReminder) {
  addReminder.addEventListener("click", () => {
    const textElement = document.getElementById("reminderText");
    const dateElement = document.getElementById("reminderDate");

    const text = textElement ? textElement.value.trim() : "";
    const date = dateElement ? dateElement.value : "";

    if (!text) {
      alert("Please enter a reminder.");
      return;
    }

    const reminders = JSON.parse(
      localStorage.getItem("reminders") || "[]"
    );

    reminders.push({
      text,
      date
    });

    localStorage.setItem(
      "reminders",
      JSON.stringify(reminders)
    );

    if (textElement) textElement.value = "";
    if (dateElement) dateElement.value = "";

    loadReminders();
  });
}

document.addEventListener("click", event => {
  const deleteButton = event.target.closest(".delete-reminder");

  if (!deleteButton) return;

  const reminders = JSON.parse(
    localStorage.getItem("reminders") || "[]"
  );

  const index = Number(deleteButton.dataset.index);

  reminders.splice(index, 1);

  localStorage.setItem(
    "reminders",
    JSON.stringify(reminders)
  );

  loadReminders();
});

loadReminders();

// ---------- Resources ----------
const resources = [
  {
    title: "School Support",
    category: "school",
    description:
      "Information and support for families navigating school services."
  },
  {
    title: "Caregiver Support",
    category: "care",
    description:
      "Support and information for parents and caregivers."
  },
  {
    title: "Financial Assistance",
    category: "financial",
    description:
      "Programs that may help families with everyday expenses."
  }
];

function renderResources(filter = "all", search = "") {
  const list = document.getElementById("resourceList");

  if (!list) return;

  const term = search.toLowerCase();

  const filtered = resources.filter(resource => {
    const categoryMatch =
      filter === "all" ||
      resource.category === filter;

    const searchMatch =
      !term ||
      resource.title.toLowerCase().includes(term) ||
      resource.description.toLowerCase().includes(term);

    return categoryMatch && searchMatch;
  });

  list.innerHTML = filtered
    .map(resource => `
      <div class="panel">
        <h3>${escapeHtml(resource.title)}</h3>
        <p>${escapeHtml(resource.description)}</p>
      </div>
    `)
    .join("");
}

document.querySelectorAll("[data-filter]").forEach(button => {
  button.addEventListener("click", () => {
    const searchElement =
      document.getElementById("resourceSearch");

    renderResources(
      button.dataset.filter,
      searchElement ? searchElement.value : ""
    );
  });
});

const resourceSearch =
  document.getElementById("resourceSearch");

if (resourceSearch) {
  resourceSearch.addEventListener("input", () => {
    renderResources("all", resourceSearch.value);
  });
}

renderResources();

// ---------- Family Support ----------
const saveSupport =
  document.getElementById("saveSupport");

if (saveSupport) {
  saveSupport.addEventListener("click", () => {
    const noteElement =
      document.getElementById("supportNote");

    const note = noteElement ? noteElement.value : "";

    localStorage.setItem("supportNote", note);

    saveSupport.textContent = "Saved!";

    setTimeout(() => {
      saveSupport.textContent = "Save Note";
    }, 1500);
  });
}

const savedSupportNote =
  localStorage.getItem("supportNote");

if (savedSupportNote !== null) {
  const noteElement =
    document.getElementById("supportNote");

  if (noteElement) {
    noteElement.value = savedSupportNote;
  }
}

// ---------- Emergency Card ----------
function updateEmergencyCard() {
  const data = JSON.parse(
    localStorage.getItem("emergencyCard") || "null"
  );

  if (!data) return;

  const cardName =
    document.getElementById("cardName");

  const cardNotes =
    document.getElementById("cardNotes");

  const cardContact =
    document.getElementById("cardContact");

  const emName =
    document.getElementById("emName");

  const emNotes =
    document.getElementById("emNotes");

  const emContact =
    document.getElementById("emContact");

  if (cardName)
    cardName.textContent = data.name || "Not entered";

  if (cardNotes)
    cardNotes.textContent = data.notes || "Not entered";

  if (cardContact)
    cardContact.textContent =
      data.contact || "Not entered";

  if (emName)
    emName.value = data.name || "";

  if (emNotes)
    emNotes.value = data.notes || "";

  if (emContact)
    emContact.value = data.contact || "";
}

const saveEmergency =
  document.getElementById("saveEmergency");

if (saveEmergency) {
  saveEmergency.addEventListener("click", () => {
    const nameElement =
      document.getElementById("emName");

    const notesElement =
      document.getElementById("emNotes");

    const contactElement =
      document.getElementById("emContact");

    const data = {
      name: nameElement ? nameElement.value : "",
      notes: notesElement ? notesElement.value : "",
      contact: contactElement ? contactElement.value : ""
    };

    localStorage.setItem(
      "emergencyCard",
      JSON.stringify(data)
    );

    updateEmergencyCard();

    saveEmergency.textContent = "Saved!";

    setTimeout(() => {
      saveEmergency.textContent =
        "Save Emergency Card";
    }, 1500);
  });
}

updateEmergencyCard();

// ---------- Account ----------
const authForm =
  document.getElementById("authForm");

const signUpBtn =
  document.getElementById("signUpBtn");

const resetPasswordBtn =
  document.getElementById("resetPasswordBtn");

const signOutBtn =
  document.getElementById("signOutBtn");

const accountBtn =
  document.getElementById("accountBtn");

function showAuthMessage(message, success = true) {
  const box =
    document.getElementById("authMessage");

  if (!box) return;

  box.textContent = message;
  box.classList.remove("hidden");

  box.style.color =
    success ? "" : "crimson";
}

function updateAuthUI(session) {
  const status =
    document.getElementById("authStatus");

  if (session && session.user) {
    if (status) {
      status.textContent =
        `Signed in as ${session.user.email}`;
    }

    if (signOutBtn) {
      signOutBtn.classList.remove("hidden");
    }

    if (accountBtn) {
      accountBtn.textContent = "Account";
    }
  } else {
    if (status) {
      status.textContent =
        "Create an account or sign in to sync your family information securely with the app.";
    }

    if (signOutBtn) {
      signOutBtn.classList.add("hidden");
    }

    if (accountBtn) {
      accountBtn.textContent = "Sign in";
    }
  }
}

if (accountBtn) {
  accountBtn.addEventListener("click", () => {
    showScreen("account");
  });
}

if (authForm) {
  authForm.addEventListener("submit", async event => {
    event.preventDefault();

    const emailElement =
      document.getElementById("authEmail");

    const passwordElement =
      document.getElementById("authPassword");

    const email =
      emailElement ? emailElement.value.trim() : "";

    const password =
      passwordElement ? passwordElement.value : "";

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password
      });

    if (error) {
      showAuthMessage(error.message, false);
      return;
    }

    updateAuthUI(data.session);

    showAuthMessage("You are signed in.");
  });
}

if (signUpBtn) {
  signUpBtn.addEventListener("click", async () => {
    const emailElement =
      document.getElementById("authEmail");

    const passwordElement =
      document.getElementById("authPassword");

    const email =
      emailElement ? emailElement.value.trim() : "";

    const password =
      passwordElement ? passwordElement.value : "";

    if (!email || !password) {
      showAuthMessage(
        "Please enter your email and password.",
        false
      );
      return;
    }

    const { error } =
      await supabase.auth.signUp({
        email,
        password
      });

    if (error) {
      showAuthMessage(error.message, false);
      return;
    }

    showAuthMessage(
      "Account created. Check your email if confirmation is required."
    );
  });
}

if (resetPasswordBtn) {
  resetPasswordBtn.addEventListener("click", async () => {
    const emailElement =
      document.getElementById("authEmail");

    const email =
      emailElement ? emailElement.value.trim() : "";

    if (!email) {
      showAuthMessage(
        "Enter your email address first.",
        false
      );
      return;
    }

    const { error } =
      await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      showAuthMessage(error.message, false);
      return;
    }

    showAuthMessage(
      "Password reset instructions have been sent to your email."
    );
  });
}

if (signOutBtn) {
  signOutBtn.addEventListener("click", async () => {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      showAuthMessage(error.message, false);
      return;
    }

    updateAuthUI(null);

    showAuthMessage("You have been signed out.");
  });
}

supabase.auth.getSession().then(({ data }) => {
  updateAuthUI(data.session);
});

supabase.auth.onAuthStateChange(
  (_event, session) => {
    updateAuthUI(session);
  }
);

// ---------- Install button ----------
let deferredPrompt = null;

window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();

  deferredPrompt = event;

  const installBtn =
    document.getElementById("installBtn");

  if (installBtn) {
    installBtn.classList.remove("hidden");
  }
});

const installBtn =
  document.getElementById("installBtn");

if (installBtn) {
  installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    await deferredPrompt.userChoice;

    deferredPrompt = null;

    installBtn.classList.add("hidden");
  });
  }
