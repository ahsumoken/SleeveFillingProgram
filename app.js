const START = new Date(2026, 8, 21); // 21-9-2026
const WEEKS = 13;
const LS_KEY = "sleeve-tracker-log";

const SESSION_TYPES = {
  "arms-thuis-1": {
    name: "Arms Thuis 1 — Biceps",
    type: "gym",
    exercises: [
      { id: "at1-chin", name: "Negatieve chin-up (5s zakken + 2s hold kin boven stang)", sets: 4, reps: "5-6", bodyweight: true },
      { id: "at1-bayes", name: "Incline DB Curl (LANGE kop, arm achter lichaam)", sets: 4, reps: "10-12" },
      { id: "at1-spider", name: "Spider Curl DB (borst tegen stoelleuning, KORTE kop)", sets: 3, reps: "10-12" },
      { id: "at1-hammer", name: "Hammer Curl DB (lange kop + brachialis)", sets: 3, reps: "10-12" },
      { id: "at1-conc", name: "Concentration Curl DB (KORTE kop, piek)", sets: 3, reps: "12-15" },
      { id: "at1-band", name: "DB Curl burnout, licht gewicht (naar falen)", sets: 2, reps: "AMRAP" }
    ]
  },
  "arms-thuis-2": {
    name: "Arms Thuis 2 — Triceps",
    type: "gym",
    exercises: [
      { id: "at2-oh", name: "Overhead DB Ext. (lange kop, stretch)", sets: 4, reps: "10-12" },
      { id: "at2-kick", name: "Parallettes Triceps Extension", sets: 4, reps: "12-15" },
      { id: "at2-skull", name: "DB Skull Crusher / Floor Ext. (stretch)", sets: 4, reps: "10-12" },
      { id: "at2-dip", name: "Dips op dip bar (volledige ROM)", sets: 3, reps: "8-12", bodyweight: true },
      { id: "at2-close", name: "Close-grip Push-ups (parallettes)", sets: 3, reps: "AMRAP", bodyweight: true },
      { id: "at2-curl", name: "DB Curl (biceps, balans)", sets: 3, reps: "10-12" }
    ]
  },
  "arms-thuis-3": {
    name: "Arms Thuis 3 — Pump",
    type: "gym",
    exercises: [
      { id: "at3-s1", name: "Superset: DB Curl + Overhead DB Ext.", sets: 4, reps: "12-15" },
      { id: "at3-s2", name: "Superset: Hammer Curl + DB Kickback", sets: 4, reps: "12-15" },
      { id: "at3-s3", name: "Superset: Drag Curl DB (lange kop) + Dips", sets: 3, reps: "12-15" },
      { id: "at3-21", name: "21s Overhead DB Ext. (7 laag / 7 hoog / 7 vol)", sets: 3, reps: "21" },
      { id: "at3-burn", name: "DB Curl burnout, licht gewicht (naar falen)", sets: 2, reps: "AMRAP" }
    ]
  },
  "arms-thuis-4": {
    name: "Arms Thuis 4 — Schouders & Armen",
    type: "gym",
    exercises: [
      { id: "at4-ohp", name: "DB Shoulder Press (26kg)", sets: 4, reps: "8-10" },
      { id: "at4-lat", name: "DB Lateral Raise (breedte)", sets: 4, reps: "12-15" },
      { id: "at4-rear", name: "Spider Curl DB", sets: 3, reps: "12-15" },
      { id: "at4-curl", name: "Incline DB Curl (LANGE kop, stretch)", sets: 3, reps: "10-12" },
      { id: "at4-tri", name: "Overhead DB Triceps Ext. (lange kop)", sets: 3, reps: "10-12" },
      { id: "at4-hammer", name: "Hammer Curl (onderarm)", sets: 3, reps: "12-15" }
    ]
  },
  kettlebell: {
    name: "Kettlebell Circuit A",
    type: "circuit",
    rounds: 3,
    workSec: 45,
    restSec: 15,
    roundRestSec: 60,
    exercises: [
      { name: "KB Two-Handed Swing", defaultWeight: "20kg" },
      { name: "KB Goblet Squat", defaultWeight: "20kg" },
      { name: "KB Overhead Press (R)", defaultWeight: "16kg" },
      { name: "KB Overhead Press (L)", defaultWeight: "16kg" },
      { name: "Burpees", defaultWeight: "eigen gew." },
      { name: "KB Deadlifts", defaultWeight: "2x20kg" },
      { name: "KB Gorilla Row", defaultWeight: "2x20kg" }
    ],
    finisher: [
      { name: "Negatieve Pull-ups" },
      { name: "Parallettes Knee Raise" }
    ]
  },
  "plyo-box-hiit": {
    name: "Plyo Box HIIT",
    type: "circuit",
    rounds: 3,
    workSec: 40,
    restSec: 20,
    roundRestSec: 90,
    exercises: [
      { name: "Box Jumps", defaultWeight: "eigen gew." },
      { name: "Verhoogde Push-ups (voeten op box)", defaultWeight: "eigen gew." },
      { name: "Box Step-ups (R)", defaultWeight: "2x16kg" },
      { name: "Box Step-ups (L)", defaultWeight: "2x16kg" },
      { name: "Burpees", defaultWeight: "eigen gew." },
      { name: "Box Dips", defaultWeight: "eigen gew." }
    ]
  }
};

const DAYS_NL = ["zo", "ma", "di", "wo", "do", "vr", "za"];
const DAYS_FULL = ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"];

function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function iso(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function fmt(d) {
  return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
}

function runIndexForDate(date) {
  // running days: ma(1), wo(3), vr(5)
  let n = 0;
  for (let i = 0; i < WEEKS * 7; i++) {
    const d = addDays(START, i);
    const dow = d.getDay();
    if (dow === 1 || dow === 3 || dow === 5) {
      n++;
      if (iso(d) === iso(date)) return n;
    }
  }
  return 0;
}

function runKm(date) {
  const idx = runIndexForDate(date);
  if (!idx) return 0;
  return idx % 4 === 0 ? 10 : 5;
}

function dayPlan(date) {
  const dow = date.getDay(); // 0 zo
  const run = runKm(date);
  if (dow === 1) return { title: "Maandag", parts: [{ kind: "run", km: run }, { kind: "gym", key: "arms-thuis-1" }] };
  if (dow === 2) return { title: "Dinsdag", parts: [{ kind: "gym", key: "arms-thuis-2" }] };
  if (dow === 3) return { title: "Woensdag", parts: [{ kind: "run", km: run }, { kind: "circuit", key: "kettlebell" }] };
  if (dow === 4) return { title: "Donderdag", parts: [{ kind: "gym", key: "arms-thuis-3" }] };
  if (dow === 5) return { title: "Vrijdag", parts: [{ kind: "run", km: run }, { kind: "circuit", key: "plyo-box-hiit" }] };
  if (dow === 6) return { title: "Zaterdag", parts: [{ kind: "gym", key: "arms-thuis-4" }] };
  return { title: "Zondag", parts: [{ kind: "walk", km: 0 }] };
}

function loadLog() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}"); }
  catch { return {}; }
}
function saveLog(log) {
  localStorage.setItem(LS_KEY, JSON.stringify(log));
}

let state = {
  tab: "week",
  week: 0,
  selectedDate: iso(START),
  log: loadLog()
};

function inProgram(date) {
  const t = date.getTime();
  const end = addDays(START, WEEKS * 7 - 1);
  return t >= START.getTime() && t <= end.getTime();
}

function weekDates(w) {
  const start = addDays(START, w * 7);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

function plannedKm() {
  let tot = 0;
  for (let i = 0; i < WEEKS * 7; i++) tot += runKm(addDays(START, i));
  return tot;
}

function loggedKm() {
  return Object.values(state.log).reduce((s, e) => s + (Number(e.km) || 0), 0);
}

function renderWeek() {
  const dates = weekDates(state.week);
  const cards = dates.map((d) => {
    const plan = dayPlan(d);
    const key = iso(d);
    const done = !!state.log[key];
    const labels = plan.parts.map((p) => {
      if (p.kind === "run") return `Hardlopen ${p.km} km`;
      if (p.kind === "walk") return "Wandelen";
      return SESSION_TYPES[p.key].name;
    });
    return `<article class="card" data-open="${key}">
      <div class="row">
        <strong>${DAYS_FULL[d.getDay()]} · ${fmt(d)}</strong>
        <span class="badge ${done ? "done" : ""}">${done ? "gelogd" : "open"}</span>
      </div>
      <p class="muted">${labels.join(" + ")}</p>
    </article>`;
  }).join("");

  return `
    <div class="week-nav">
      <button data-w="-1">‹</button>
      <strong>Week ${state.week + 1} / ${WEEKS}</strong>
      <button data-w="1">›</button>
    </div>
    <div class="card">
      <div class="row"><span>Gepland hardlopen</span><strong class="km">${plannedKm()} km</strong></div>
      <div class="row"><span>Gelogde km</span><strong class="km">${loggedKm()} km</strong></div>
      <p class="muted" style="margin:8px 0 0">Materiaal: optrekstang, plyobox, Nike DB tot 26 kg, KB 12/16/20, parallettes. Geen weighted pull-ups; wel negatieven.</p>
    </div>
    ${cards}
  `;
}

function renderSession() {
  const d = new Date(state.selectedDate + "T12:00:00");
  if (!inProgram(d)) {
    return `<div class="card">Kies een dag in het 13-wekenschema.</div>`;
  }
  const plan = dayPlan(d);
  const entry = state.log[state.selectedDate] || { notes: "", km: plan.parts.find(p => p.kind === "run")?.km || 0, done: false };
  const blocks = plan.parts.map((p) => {
    if (p.kind === "run") {
      return `<div class="card"><strong>Hardlopen</strong><p class="muted">${p.km} km (elke 4e loopsessie 10 km)</p></div>`;
    }
    if (p.kind === "walk") {
      return `<div class="card"><strong>Wandelen</strong><p class="muted">Herstelwandeling. Geen km-doel.</p></div>`;
    }
    const s = SESSION_TYPES[p.key];
    if (s.type === "circuit") {
      const ex = s.exercises.map((e) => `<li>${e.name}${e.defaultWeight ? ` — ${e.defaultWeight}` : ""}</li>`).join("");
      const fin = (s.finisher || []).map((e) => `<li>${e.name}</li>`).join("");
      return `<div class="card">
        <strong>${s.name}</strong>
        <p class="muted">${s.rounds} rondes · ${s.workSec}s werk / ${s.restSec}s rust · ${s.roundRestSec}s rusterust</p>
        <ul>${ex}</ul>
        ${fin ? `<p class="muted">Finisher</p><ul>${fin}</ul>` : ""}
      </div>`;
    }
    const ex = s.exercises.map((e) =>
      `<div class="ex"><strong>${e.name}</strong><div class="muted">${e.sets} × ${e.reps}${e.bodyweight ? " · lichaamsgewicht" : ""}</div></div>`
    ).join("");
    return `<div class="card"><strong>${s.name}</strong>${ex}</div>`;
  }).join("");

  return `
    <div class="card">
      <div class="row">
        <strong>${DAYS_FULL[d.getDay()]} ${fmt(d)}</strong>
        <span class="badge run">week ${Math.floor((d - START) / (7 * 86400000)) + 1}</span>
      </div>
    </div>
    ${blocks}
    <div class="card">
      <label>Km (hardlopen / wandelen)
        <input type="number" id="km" min="0" step="0.1" value="${entry.km || 0}" />
      </label>
      <label>Notitie
        <textarea id="notes" rows="3">${entry.notes || ""}</textarea>
      </label>
      <button class="primary" id="save">Sessie opslaan</button>
    </div>
  `;
}

function renderLog() {
  const rows = Object.keys(state.log).sort().reverse().map((k) => {
    const e = state.log[k];
    const d = new Date(k + "T12:00:00");
    return `<article class="card">
      <div class="row"><strong>${fmt(d)}</strong><span class="badge done">${e.km || 0} km</span></div>
      <p class="muted">${e.notes || "geen notitie"}</p>
      <button class="ghost" data-del="${k}">Verwijder</button>
    </article>`;
  }).join("") || `<div class="card muted">Nog geen logs.</div>`;
  return rows;
}

function render() {
  const app = document.getElementById("app");
  document.querySelectorAll("nav button").forEach((b) => {
    b.classList.toggle("active", b.dataset.tab === state.tab);
  });
  if (state.tab === "week") app.innerHTML = renderWeek();
  else if (state.tab === "sessie") app.innerHTML = renderSession();
  else app.innerHTML = renderLog();
}

document.querySelector("nav").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  state.tab = b.dataset.tab;
  render();
});

document.getElementById("app").addEventListener("click", (e) => {
  const w = e.target.closest("[data-w]");
  if (w) {
    state.week = Math.max(0, Math.min(WEEKS - 1, state.week + Number(w.dataset.w)));
    render();
    return;
  }
  const open = e.target.closest("[data-open]");
  if (open) {
    state.selectedDate = open.dataset.open;
    state.tab = "sessie";
    render();
    return;
  }
  const del = e.target.closest("[data-del]");
  if (del) {
    delete state.log[del.dataset.del];
    saveLog(state.log);
    render();
    return;
  }
  if (e.target.id === "save") {
    const km = Number(document.getElementById("km").value || 0);
    const notes = document.getElementById("notes").value;
    state.log[state.selectedDate] = { km, notes, savedAt: new Date().toISOString() };
    saveLog(state.log);
    state.tab = "log";
    render();
  }
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
}

render();
