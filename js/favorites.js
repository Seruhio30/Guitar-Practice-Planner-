const KEY = "favorites";

export function getFavorites() {
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}

export function addFavorite(title) {
  const favorites = getFavorites();
  if (favorites.includes(title)) return false;
  favorites.push(title);
  localStorage.setItem(KEY, JSON.stringify(favorites));
  return true;
}

export function removeFavorite(title) {
  const favorites = getFavorites().filter((t) => t !== title);
  localStorage.setItem(KEY, JSON.stringify(favorites));
}

export function clearFavorites() {
  localStorage.setItem(KEY, "[]");
}

export function renderFavorites(containerSelector = "#favorites") {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const favorites = getFavorites();

  if (favorites.length === 0) {
    container.innerHTML = `<p class="text-slate-400 text-sm">No favorites yet. Add some songs!</p>`;
    return;
  }

  container.innerHTML = favorites
    .slice()
    .reverse()
    .map(
      (title) => `
        <article class="bg-slate-900/40 border border-slate-700 rounded-xl p-4 flex items-center justify-between gap-3">
          <p class="text-slate-100 font-semibold">${title}</p>
          <button class="remove-fav text-slate-300 hover:text-red-300 transition-colors text-sm"
            data-title="${title}">
            Remove
          </button>
        </article>
      `
    )
    .join("");
}

export function initFavoritesUI({
  containerSelector = "#favorites",
  clearBtnSelector = "#clear-favorites",
} = {}) {
  const container = document.querySelector(containerSelector);
  const clearBtn = document.querySelector(clearBtnSelector);

  container?.addEventListener("click", (e) => {
    const btn = e.target.closest(".remove-fav");
    if (!btn) return;
    removeFavorite(btn.dataset.title);
    renderFavorites(containerSelector);
  });

  clearBtn?.addEventListener("click", () => {
    clearFavorites();
    renderFavorites(containerSelector);
  });

  renderFavorites(containerSelector);
}
