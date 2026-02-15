import { generateSession } from "./sessionGenerator.js";

const button = document.querySelector('#generate-session');
const output = document.querySelector('.session-container');
//si la session existe aunque recarge aparece iniciada
const saved = localStorage.getItem("lastSession");
if (saved) {
  const session = JSON.parse(saved)
  outputSession(session)
}

button.addEventListener("click", () => {

  const level = document.querySelector('input[name="level"]:checked').value;
  const focus = document.querySelector('input[name="focus"]:checked').value;

  const session = generateSession(level, focus);
  console.log(session);
  console.log(session.steps.find(s => s.name === "Focus block"));

  //guardar en localstorage
  localStorage.setItem("lastSession", JSON.stringify(session));

  outputSession(session)
});


function outputSession(session) {

  //aqui genera dinamicamente por name, minutes and details of session created
  const stepsHtml = session.steps
    .map(step => {
      const itemsHtml = Array.isArray(step.items) && step.items.length
        ? `
        <ul class="mt-2 grid gap-2">
          ${step.items.map(it => `
            <li class="bg-slate-900/40 border border-slate-700 rounded-xl p-3">
              <p class="text-slate-100 font-semibold">${it.name}</p>
              <p class="text-slate-400 text-sm">
                ${it.reps ? `<span><strong>Reps:</strong> ${it.reps}</span> · ` : ""}
                ${it.tempo ? `<span><strong>Tempo:</strong> ${it.tempo}</span> · ` : ""}
                ${it.pattern ? `<span><strong>Pattern:</strong> ${it.pattern}</span> · ` : ""}
                ${it.list ? `<span><strong>Chords:</strong> ${it.list}</span> · ` : ""}
                ${it.tips ? `<span><strong>Tip:</strong> ${it.tips}</span>` : ""}
              </p>
            </li>
          `).join("")}
        </ul>
      `
        : "";

      return `
      <li class="bg-slate-900/40 border border-slate-700 rounded-xl p-4">
        <p class="text-slate-100 font-semibold">${step.name} — ${step.minutes} min</p>
        <p class="mt-1 text-slate-300 text-sm">${step.details}</p>
        ${itemsHtml}
      </li>
    `;
    })
    .join("");


  //aqui envia al dom con esa estructura para que reemplace el placeholder
  output.innerHTML = `
            <h4>${session.title}</h4>
            <p><strong>Level:</strong> ${session.level} · <strong>Focus:</strong>
             ${session.focus}</p>

            <ol class="mt-4 grid gap-4">
              ${stepsHtml}
              </ol>
            `;

}


// timer
let seconds = 0;
let timerId = null;

const timerDisplay = document.querySelector("#timer-display");
const btnStart = document.querySelector("#timer-start");
const btnPause = document.querySelector("#timer-pause");
const btnReset = document.querySelector("#timer-reset");

function renderTime() {
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  timerDisplay.textContent = `${mm}:${ss}`;
}

btnStart?.addEventListener("click", () => {
  // evita múltiples intervalos
  if (timerId) return; 
  timerId = setInterval(() => {
    seconds++;
    renderTime();
  }, 1000);
});

btnPause?.addEventListener("click", () => {
  if (!timerId) return;
  clearInterval(timerId);
  timerId = null;
});

btnReset?.addEventListener("click", () => {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  seconds = 0;
  renderTime();
});

// inicializa
if (timerDisplay) renderTime();

//progrest
const completeBtn = document.querySelector("#complete-session");
const completedListEl = document.querySelector("#completed-list");

const completedCountEl = document.querySelector("#completed-count");

function getCompletedSessions() {
  return JSON.parse(localStorage.getItem("completedSessions") || "[]");
}

function setCompletedSessions(list) {
  localStorage.setItem("completedSessions", JSON.stringify(list));
}

function renderCompletedCount() {
  const list = getCompletedSessions();

  if (completedCountEl) {
    completedCountEl.textContent = `Completed sessions: ${list.length}`;
  }

  if (completedListEl) {
    const lastThree = list.slice(-3).reverse();

    if (lastThree.length === 0) {
      completedListEl.innerHTML = `<p class="text-slate-400 text-sm">No completed sessions yet.</p>`;
      return;
    }

    completedListEl.innerHTML = lastThree
      .map((s) => `
        <div class="bg-slate-900/40 border border-slate-700 rounded-xl p-3">
          <p class="text-slate-100 font-semibold">${s.focus} · ${s.level}</p>
          <p class="text-slate-400 text-sm">${s.totalMinutes} min</p>
        </div>
      `)
      .join("");
  }
}


completeBtn?.addEventListener("click", () => {
  const msgEl = document.querySelector("#practice-msg");
  if (msgEl) msgEl.textContent = "";

  const last = localStorage.getItem("lastSession");
  if (!last) {
    if (msgEl) msgEl.textContent = "Generate a session first, then complete it.";
    return;
  }


  const session = JSON.parse(last);
  const totalMinutes = (session.steps || []).reduce(
    (sum, s) => sum + (s.minutes || 0),
    0
  );

  const list = getCompletedSessions();
  list.push({
    completedAt: new Date().toISOString(),
    level: session.level,
    focus: session.focus,
    totalMinutes
  });
  if (msgEl) msgEl.textContent = "Session saved ✅";

  setCompletedSessions(list);
  renderCompletedCount();
});

renderCompletedCount();
