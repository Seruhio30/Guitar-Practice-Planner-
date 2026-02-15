import { getSuggestions } from "./mediaService.js";

import { getWikiSummary } from "./services/wikiService.js";

const aboutEl = document.querySelector("#about");

let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

const resultsContainer = document.querySelector("#results");
const buttonSuggest = document.querySelector("#get-suggestions");

const queryInput = document.querySelector("#query");

function updateSuggestButtonState() {
  const q = queryInput.value.trim();

  buttonSuggest.disabled = q.length === 0;

  // feedback visual
  buttonSuggest.classList.toggle("opacity-60", buttonSuggest.disabled);
  buttonSuggest.classList.toggle("cursor-not-allowed", buttonSuggest.disabled);

  // evita hover azul cuando está disabled (opcional)
  if (buttonSuggest.disabled) {
    buttonSuggest.classList.remove("hover:bg-blue-400");
  } else {
    buttonSuggest.classList.add("hover:bg-blue-400");
  }
}

queryInput.addEventListener("input", updateSuggestButtonState);
updateSuggestButtonState();

// Favoritos (event delegation)
resultsContainer.addEventListener("click", (e) => {
  const btn = e.target.closest(".fav-btn");
  if (!btn) return;

  const title = btn.dataset.title;

  // refrescar favoritos desde localStorage (por si cambió)
  favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

  if (favorites.includes(title)) {
    btn.textContent = "Saved";
    btn.disabled = true;
    return;
  }

  favorites.push(title);
  localStorage.setItem("favorites", JSON.stringify(favorites));

  btn.textContent = "Saved";
  btn.disabled = true;
});

// Buscar sugerencias + render + Wikipedia
buttonSuggest.addEventListener("click", async () => {
  const level = document.querySelector('input[name="level"]:checked').value;
  const type = document.querySelector('input[name="type"]:checked').value;
  const query = document.querySelector("#query").value.trim();

  if (!query) {
    resultsContainer.innerHTML =
      `<p class="text-slate-400 text-sm">Type a search term first.</p>`;
    aboutEl.textContent = "Search to see a quick summary here.";
    return;
  }

  // If videos selected, provide a functional fallback (no YouTube API key)
  if (type === "videos") {
    const yt = `https://www.youtube.com/results?search_query=${encodeURIComponent(
      query + " guitar tutorial"
    )}`;

    resultsContainer.innerHTML = `
    <article class="bg-slate-900/40 border border-slate-700 rounded-xl p-4">
      <h4 class="text-slate-100 font-semibold">Videos (coming soon)</h4>
      <p class="mt-1 text-slate-400 text-sm">
        YouTube Data API requires billing verification. For now, you can search tutorials directly on YouTube.
      </p>
      <a href="${yt}" target="_blank" rel="noopener"
         class="mt-3 inline-flex text-blue-400 hover:text-blue-300 transition-colors">
        Search "${query}" guitar tutorial on YouTube
      </a>
    </article>
  `;

    // Still load Wikipedia summary for the query (API #2)
    aboutEl.textContent = "Loading summary...";
    try {
      const summary = await getWikiSummary(query);
      if (!summary) {
        aboutEl.textContent = "No summary found. Try a different term (song or artist).";
      } else {
        aboutEl.innerHTML = `
        <p class="font-semibold text-slate-100">${summary.title}</p>
        <p class="mt-2 text-slate-300 text-sm">${summary.extract}</p>
        ${summary.url
            ? `<a href="${summary.url}" target="_blank" rel="noopener"
                 class="mt-3 inline-flex text-blue-400 hover:text-blue-300 transition-colors">
                 Read more
               </a>`
            : ""
          }
      `;
      }
    } catch (err) {
      console.error(err);
      aboutEl.textContent = "Wikipedia error. Try again with another term.";
    }

    return; // IMPORTANT: stop here so it doesn't run iTunes branch
  }


  // 1) API #1
  const results = await getSuggestions({ type, level, query });


  if (!Array.isArray(results) || results.length === 0) {
    resultsContainer.innerHTML = `
      <p class="text-slate-400 text-sm">
        No results found. Try changing filters.
      </p>
    `;
    aboutEl.textContent = "No summary found (no results). Try another term.";
    return;
  }

  // Render results
  const html = results
    .map((item) => {
      const isFavorite = favorites.includes(item.title);

      return `
      <article class="bg-slate-900/40 border border-slate-700 rounded-xl p-4">
        <div class="flex gap-3">
          ${item.thumbnail
          ? `<img src="${item.thumbnail}" class="w-16 h-16 rounded-lg object-cover" alt="">`
          : ""
        }
          <div class="min-w-0">
            <h4 class="text-slate-100 font-semibold truncate">${item.title}</h4>
            <p class="mt-1 text-slate-400 text-sm truncate">${item.subtitle ?? ""}</p>
            <p class="text-slate-500 text-xs mt-1">${item.source} · Level: ${item.level}</p>
          </div>
        </div>

        <div class="mt-3 flex items-center gap-3 flex-wrap">
          <a href="${item.url}" target="_blank" rel="noopener"
             class="inline-flex text-blue-400 hover:text-blue-300 transition-colors">
            Open
          </a>

          <button
            class="fav-btn px-3 py-2 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 transition-colors
              disabled:opacity-60 disabled:cursor-not-allowed"
            data-title="${item.title}"
            ${isFavorite ? "disabled" : ""}
          >
            ${isFavorite ? "Saved" : "Add to favorites"}
          </button>
        </div>
      </article>
    `;
    })
    .join("");


  resultsContainer.innerHTML = html;

  // 2) API #2 (Wikipedia) 
  aboutEl.textContent = "Loading summary...";

  try {
    const summary = await getWikiSummary(query);

    if (!summary) {
      aboutEl.textContent =
        "No summary found. Try a different term (song or artist).";
      return;
    }

    aboutEl.innerHTML = `
      <p class="font-semibold text-slate-100">${summary.title}</p>
      <p class="mt-2 text-slate-300 text-sm">${summary.extract}</p>
      ${summary.url
        ? `<a href="${summary.url}" target="_blank" rel="noopener"
               class="mt-3 inline-flex text-blue-400 hover:text-blue-300 transition-colors">
               Read more
             </a>`
        : ""
      }
    `;

    // prueba de las apis usadas
    console.log("API used: Wikipedia");
    console.log("Wikipedia sample:", summary);
  } catch (err) {
    console.error(err);
    aboutEl.textContent = "Wikipedia error. Try again with another term.";
  }
});
