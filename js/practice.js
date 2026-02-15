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

      const itemsHtml = step.items
        ? `
        <ul style="margin-top:8px; padding-left:16px;">
          ${step.items.map(item => `
            <li style="margin-bottom:8px;">
              <strong>${item.name} (${item.key})</strong><br>
              Pattern: ${item.pattern}<br>
              Tempo: ${item.tempo} · Reps: ${item.reps}<br>
              Tip: ${item.tips}
            </li>
          `).join("")}
        </ul>
      `
        : "";

      return `
      <li style="margin-bottom:12px;">
        <strong>${step.name}</strong> - ${step.minutes} min<br>
        <span>${step.details}</span>
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

            <ol>
                ${stepsHtml}
            </ol> `;

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
  if (timerId) return; // evita múltiples intervalos
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
  const last = localStorage.getItem("lastSession");
  if (!last) return;

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

  setCompletedSessions(list);
  renderCompletedCount();
});

renderCompletedCount();
