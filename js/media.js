import { getSuggestions } from "./mediaService.js";
import { getWikiSummary } from "./services/wikiService.js";
import {
  getFavorites,
  addFavorite,
  initFavoritesUI,
  renderFavorites,
} from "./favorites.js";

const aboutEl = document.querySelector("#about");
const resultsContainer = document.querySelector("#results");
const buttonSuggest = document.querySelector("#get-suggestions");
const queryInput = document.querySelector("#query");

// Inicializa UI de favoritos (lista + remove + clear)
initFavoritesUI();

/* =====================UX: Disable button if empty============================= */


function updateSuggestButtonState() {
  const q = queryInput.value.trim();

  buttonSuggest.disabled = q.length === 0;

  // feedback visual
  buttonSuggest.classList.toggle("opacity-60", buttonSuggest.disabled);
  buttonSuggest.classList.toggle("cursor-not-allowed", buttonSuggest.disabled);

  // evita hover azul cuando está disabled
  if (buttonSuggest.disabled) {
    buttonSuggest.classList.remove("hover:bg-blue-400");
  } else {
    buttonSuggest.classList.add("hover:bg-blue-400");
  }
}

queryInput.addEventListener("input", updateSuggestButtonState);
updateSuggestButtonState();

/* ====================Favorites: add from results============================== */


resultsContainer.addEventListener("click", (e) => {
  const btn = e.target.closest(".fav-btn");
  if (!btn) return;

  const title = btn.dataset.title;

  const added = addFavorite(title);

  // UI feedback on the button
  btn.textContent = "Saved";
  btn.disabled = true;

  // Refresh favorites section only if newly added
  if (added) renderFavorites();
});

/* ======================Search + render + Wikipedia============================ */


buttonSuggest.addEventListener("click", async () => {
  const level = document.querySelector('input[name="level"]:checked')?.value;
  const type = document.querySelector('input[name="type"]:checked')?.value;
  const query = queryInput.value.trim();

  if (!query) {
    resultsContainer.innerHTML = `<p class="text-slate-400 text-sm">Type a search term first.</p>`;
    if (aboutEl) aboutEl.textContent = "Search to see a quick summary here.";
    return;
  }

  resultsContainer.innerHTML = `<p class="text-slate-400 text-sm">Loading results...</p>`;
  aboutEl.textContent = "Loading summary...";


  /* ==========================VIDEOS fallback (no YouTube API key)============================================= */
  

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

    // Still load Wikipedia summary (API #2)
    if (aboutEl) aboutEl.textContent = "Loading summary...";
    try {
      const summary = await getWikiSummary(query);

      if (!summary) {
        if (aboutEl) aboutEl.textContent = "No summary found. Try a different term (song or artist).";
      } else {
        if (aboutEl) {
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
      }
    } catch (err) {
      console.error(err);
      if (aboutEl) aboutEl.textContent = "Wikipedia error. Try again with another term.";
    }

    return;
  }

  /* ==========================SONGS: iTunes (API #1)==================================== */
  

  let results = [];
  try {
    results = await getSuggestions({ type, level, query });
  } catch (err) {
    console.error(err);
    resultsContainer.innerHTML = `<p class="text-slate-400 text-sm">Error fetching songs. Try again.</p>`;
    if (aboutEl) aboutEl.textContent = "Could not load summary due to an error.";
    return;
  }

  if (!Array.isArray(results) || results.length === 0) {
    resultsContainer.innerHTML = `
      <p class="text-slate-400 text-sm">
        No results found. Try changing filters.
      </p>
    `;
    if (aboutEl) aboutEl.textContent = "No summary found (no results). Try another term.";
    return;
  }

  // Snapshot favorites for rendering (so buttons show Saved correctly)
  const favoritesList = getFavorites();

  const html = results
    .map((item) => {
      const isFavorite = favoritesList.includes(item.title);

      return `
        <article class="bg-slate-900/40 border border-slate-700 rounded-xl p-4">
          <div class="flex gap-3" aria-live="polite">
            ${item.thumbnail
          ? `<img src="${item.thumbnail}" class="w-16 h-16 rounded-lg object-cover" alt="">`
          : ""
        }
            <div class="min-w-0">
              <h4 class="text-slate-100 font-semibold truncate">${item.title}</h4>
              <p class="mt-1 text-slate-400 text-sm truncate">${item.subtitle ?? ""}</p>
              <p class="text-slate-500 text-xs mt-1">${item.source} · Level: ${item.level ?? level ?? "—"}</p>
            </div>
          </div>

          <div class="mt-3 flex items-center gap-3 flex-wrap" >
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

  /* ============================Wikipedia (API #2)====================================*/
  

  if (aboutEl) aboutEl.textContent = "Loading summary...";
  try {
    const summary = await getWikiSummary(query);

    if (!summary) {
      if (aboutEl) aboutEl.textContent = "No summary found. Try a different term (song or artist).";
      return;
    }

    if (aboutEl) {
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
    if (aboutEl) aboutEl.textContent = "Wikipedia error. Try again with another term.";
  }
});
